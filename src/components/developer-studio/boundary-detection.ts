import type {XY} from './planning';
export type BoundarySuggestion={points:XY[];coverage:number;note:string};
// Raster outline extraction, not an LLM: close small scan gaps, fill enclosed
// regions, then trace component perimeters. Coordinates remain image pixels.
export function detectOutlines(ink:Uint8Array,w:number,h:number):BoundarySuggestion[]{
 const wall=new Uint8Array(w*h);
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(ink[y*w+x])for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)wall[(y+dy)*w+x+dx]=1;
 const exterior=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
 const add=(i:number)=>{if(!wall[i]&&!exterior[i]){exterior[i]=1;queue[tail++]=i;}};
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x)add(i-1);if(x<w-1)add(i+1);if(y)add(i-w);if(y<h-1)add(i+w);}
 const seen=new Uint8Array(w*h),results:BoundarySuggestion[]=[];
 for(let start=0;start<w*h;start++){
  if(exterior[start]||seen[start])continue;head=0;tail=0;queue[tail++]=start;seen[start]=1;const cells:number[]=[];let filled=0;
  while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);cells.push(i);if(!wall[i])filled++;for(const j of [x?i-1:-1,x<w-1?i+1:-1,y?i-w:-1,y<h-1?i+w:-1])if(j>=0&&!exterior[j]&&!seen[j]){seen[j]=1;queue[tail++]=j;}}
  const coverage=cells.length/(w*h);if(coverage<.012||coverage>.94||filled<cells.length*.2)continue;
  const membership=new Set(cells),edges=new Map<number,number[]>(),key=(x:number,y:number)=>y*(w+1)+x;
  const edge=(a:number,b:number)=>edges.set(a,[...(edges.get(a)||[]),b]);
  for(const i of cells){const x=i%w,y=Math.floor(i/w);if(!y||!membership.has(i-w))edge(key(x,y),key(x+1,y));if(x===w-1||!membership.has(i+1))edge(key(x+1,y),key(x+1,y+1));if(y===h-1||!membership.has(i+w))edge(key(x+1,y+1),key(x,y+1));if(!x||!membership.has(i-1))edge(key(x,y+1),key(x,y));}
  let best:XY[]=[];
  while(edges.size){const first=edges.keys().next().value as number;let current=first;const loop:XY[]=[];let budget=cells.length*4+4;do{loop.push({x:current%(w+1),y:Math.floor(current/(w+1))});const next=edges.get(current);if(!next?.length)break;const n=next.pop()!;if(!next.length)edges.delete(current);current=n;}while(current!==first&&budget-->0);if(loop.length>best.length)best=loop;}
  if(best.length<4)continue;
  let tolerance=1.5,points=simplifyClosed(best,tolerance);while(points.length>70){tolerance*=1.35;points=simplifyClosed(best,tolerance);}
  if(points.length>=3)results.push({points,coverage,note:'Suggested outline — check corners, internal cut-outs and ownership limits before confirming.'});
 }
 return results.sort((a,b)=>b.coverage-a.coverage).slice(0,6);
}
function simplifyLine(p:XY[],epsilon:number):XY[]{if(p.length<3)return p;const a=p[0],b=p[p.length-1],dx=b.x-a.x,dy=b.y-a.y;let maximum=0,index=0;for(let i=1;i<p.length-1;i++){const t=Math.max(0,Math.min(1,((p[i].x-a.x)*dx+(p[i].y-a.y)*dy)/(dx*dx+dy*dy||1))),d=Math.hypot(p[i].x-a.x-t*dx,p[i].y-a.y-t*dy);if(d>maximum){maximum=d;index=i;}}return maximum>epsilon?[...simplifyLine(p.slice(0,index+1),epsilon).slice(0,-1),...simplifyLine(p.slice(index),epsilon)]:[a,b];}
function simplifyClosed(p:XY[],epsilon:number){const mid=Math.floor(p.length/2);return [...simplifyLine(p.slice(0,mid+1),epsilon).slice(0,-1),...simplifyLine([...p.slice(mid),p[0]],epsilon).slice(0,-1)];}
