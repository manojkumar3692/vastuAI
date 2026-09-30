import pc from 'polygon-clipping';
import * as robustClip from 'polyclip-ts';
// Retry numeric degeneracies with arbitrary-precision arithmetic, never with guessed geometry.
function robustOperation(kind:'union'|'intersection'|'difference',args:Parameters<typeof pc.union>):pc.MultiPolygon{
 let failure:unknown;
 for(const tolerance of [1e-8,1e-7,1e-6,1e-5]){try{robustClip.setPrecision(tolerance);return robustClip[kind](...args);}catch(error){failure=error;}finally{robustClip.setPrecision();}}
 throw failure;
}
const booleanGeometry={
 union:(...args:Parameters<typeof pc.union>):pc.MultiPolygon=>{try{return pc.union(...args);}catch{return robustOperation('union',args);}},
 intersection:(...args:Parameters<typeof pc.intersection>):pc.MultiPolygon=>{try{return pc.intersection(...args);}catch{return robustOperation('intersection',args);}},
 difference:(...args:Parameters<typeof pc.difference>):pc.MultiPolygon=>{try{return pc.difference(...args);}catch{return robustOperation('difference',args);}},
};
import {CMDA_BASELINE,isTamilNadu,baselineStreetWidth,baselineReservations} from './regulations';
/** Local concept planner. Survey coordinates are metres; prices are INR. */
export type XY = { x: number; y: number };
export type Box = { x: number; y: number; w: number; h: number };
export type Use = 'residential' | 'ews' | 'commercial' | 'park' | 'utility' | 'clubhouse' | 'amenity' | 'infrastructure';
export type Lot = Box & { id: string; use: Use; area: number; premium: number; facing: string; corner: boolean; locked?: boolean; exitAccess?:boolean; allocationId?:string; holes?:XY[][]; polygon?:XY[]; shape?:'regular'|'irregular'; label?:string; discount?:number; frontage?:number; rowId?:string; rowWidth?:number; rowDepth?:number; rowEnd?:boolean };
export type Exclusion = Box & { id: string; label: string; type: 'water' | 'no-build' | 'structure' };
export type PlotSize = {width:number;depth:number;minCount:number;targetPercent:number};
export type RoadSchedule = {name:string;length:number;width:number;required:number;requested:number;reason:string};
export type Brief = {
  plotMix?:PlotSize[]; allowExtraSizes?:boolean; objective?:'area'|'mix'|'infrastructure'|'profit'; extendableRoads?:boolean;
  name: string; locality: string; authority: 'CMDA'|'DTCP'|'Karnataka LPA';
  roadStyle:'straight'|'roundabout'|'auto'; roundaboutDiameter:number; affordablePlots:boolean; road: number; roadMax:number; mixedRows:boolean; allowOdd:boolean; maxOddPercent:number; oddDiscount:number; clubhouseCount:number; clubhouseArea:number; amenityArea:number; amenityType:'playground'|'sports'|'parking'; amenityLocation:'beside-park'|'near-entrance'; landBasis:'total'|'acre'|'sqft'; frontage: number; depth: number; park: 'auto'|'north'|'central'|'south';
  parkPercent: number; commercial: boolean; ewsPercent: number; land: number; price: number;
  roadRate: number; fees: number; marketing: number; targetMargin: number; minPlots: number;
  revenueTarget: number; infraCap: number; slope: number; earthRate: number;
};
export type Check = { name: string; state: 'pass'|'review'|'fail'; actual: string; requirement: string; source: string };
export type Concept = {
  roadSchedule?:RoadSchedule[]; searchCount?:number; parkDecision?:string;
  reachableRoadPolygons?:XY[][][]; accessRoads?:number; geometryKey?:string; roadPolygons?:XY[][][]; roadStyleApplied?:string; id: string; name: string; strategy: string; brief: Brief; boundary: XY[]; roads: Box[];
  lots: Lot[]; area: number; residential: number; commercialArea: number; parkArea: number;
  roadsArea: number; publicArea: number; unallocated: number; revenue: number; infra: number;
  cost: number; profit: number; margin: number; roadLength: number; earthwork: number;
  secondaryRoadWidth?:number; regularCount?:number; irregularCount?:number; landTotal?:number; protectedArea?:number; residualPolygons?:XY[][][]; entries?:XY[]; networkConnected?:boolean; efficiency: number; maxLand: number; access?:SiteAccess; checks: Check[]; spine: number; entry: XY;
};
export type Revision = { number: number; date: string; concept: Concept; exclusions: Exclusion[] };
export type Entrance={id:string;edge:number;t:number;width:number|null;entranceWidth?:number};
export type SiteAccess={northAngle?:number|null;entrances?:Entrance[];frontages:{edge:number;width:number|null}[];entrance:{edge:number;t:number}|null;roads:{id:string;points:XY[];width:number}[]};
export const emptyAccess=():SiteAccess=>({northAngle:null,entrances:[],frontages:[],entrance:null,roads:[]});
export const siteEntrances=(a?:SiteAccess):Entrance[]=>a?.entrances??(a?.entrance?[{...a.entrance,id:'entrance-1',width:a.frontages.find(f=>f.edge===a.entrance!.edge)?.width??null}]:[]);
export function withEntrances(a:SiteAccess,entrances:Entrance[]):SiteAccess{return {...a,entrances,entrance:entrances[0]?{edge:entrances[0].edge,t:entrances[0].t}:null,frontages:entrances.filter((e,i)=>entrances.findIndex(q=>q.edge===e.edge)===i).map(e=>({edge:e.edge,width:e.width}))};}
export type AreaAllocation={id:string;conceptId:string;geometryKey:string;rings:XY[][];use:'residential'|'commercial'|'infrastructure';label:string};
export type Project = { customAreas?:AreaAllocation[]; access?:SiteAccess; schema: 2; brief: Brief; boundary: XY[]; exclusions: Exclusion[]; locks: Lot[]; approved: Revision|null; inventory: Record<string,'Available'|'Held'|'Sold'>; selected: number; referenceNames: string[] };
export const PLOT_TEMPLATES=[[20,30],[20,40],[25,40],[30,40],[30,50],[30,60],[40,60]];
export const FT = .3048, SQFT = 10.76391041671;
export const defaultBrief: Brief = {
  objective:'area',allowExtraSizes:true,extendableRoads:false,roadStyle:'straight',roundaboutDiameter:26,affordablePlots:false,name:'Northfield Estate',locality:'Chennai metropolitan area',authority:'CMDA',road:9,roadMax:12,mixedRows:true,allowOdd:true,maxOddPercent:15,oddDiscount:10,clubhouseCount:1,clubhouseArea:1200,amenityArea:0,amenityType:'playground',amenityLocation:'beside-park',landBasis:'total',
  frontage:30,depth:40,park:'auto',parkPercent:10,commercial:true,ewsPercent:10,
  land:85000000,price:3400,roadRate:2600,fees:4000000,marketing:3,targetMargin:25,
  minPlots:50,revenueTarget:200000000,infraCap:30000000,slope:2,earthRate:350,
};
export const selectedPlotSizes=(b:Brief):PlotSize[]=>b.plotMix?.length?b.plotMix:[{width:b.frontage,depth:b.depth,minCount:1,targetPercent:0}];
export const matchesPlotSize=(lot:Lot,size:PlotSize)=>lot.shape!=='irregular'&&Math.abs(lot.w-size.width*FT)<.025&&Math.abs(lot.h-size.depth*FT)<.025;
export function plotMixReport(c:Concept){
 const lots=c.lots.filter(p=>['residential','ews'].includes(p.use)),sizes=selectedPlotSizes(c.brief);
 const rows=sizes.map(size=>{const actual=lots.filter(l=>matchesPlotSize(l,size)).length;return {...size,actual,shortfall:Math.max(0,size.minCount-actual),share:lots.length?actual/lots.length*100:0};});
 return {rows,extras:lots.filter(l=>!sizes.some(s=>matchesPlotSize(l,s))),shortfall:rows.reduce((n,r)=>n+r.shortfall,0),deviation:rows.reduce((n,r)=>n+(r.targetPercent?Math.abs(r.share-r.targetPercent):0),0)};
}
export const objectiveLabels={area:'Maximum saleable area',mix:'Closest to my plot mix',infrastructure:'Lowest infrastructure cost',profit:'Highest estimated profit'};
// Demonstration parcel; independently constructed, not traced from the supplied approval drawing.
export const demoBoundary: XY[] = [{x:0,y:8.75},{x:168,y:0},{x:230.4,y:15},{x:230.4,y:67.5},{x:201.6,y:67.5},{x:201.6,y:102.5},{x:28.8,y:102.5},{x:0,y:78.75}];
export function freshProject(): Project { return {schema:2,brief:{...defaultBrief},boundary:demoBoundary.map(p=>({...p})),exclusions:[],locks:[],approved:null,inventory:{},selected:0,referenceNames:[]}; }
export function blankProject(): Project { return {...freshProject(),access:emptyAccess(),boundary:[],brief:{...defaultBrief,name:'Untitled project',locality:'',land:0,price:0,fees:0}}; }
export function emptyConcept(brief:Brief):Concept { return {id:'',name:'Your land',strategy:'',brief,boundary:[],roads:[],lots:[],area:0,residential:0,commercialArea:0,parkArea:0,roadsArea:0,publicArea:0,unallocated:0,revenue:0,infra:0,cost:0,profit:0,margin:0,roadLength:0,earthwork:0,efficiency:0,maxLand:0,checks:[],spine:0,entry:{x:0,y:0}}; }
export const currency=(n:number)=>Math.abs(n)>=1e7?`₹${(n/1e7).toFixed(2)} Cr`:`₹${(n/1e5).toFixed(1)} L`;
export const signedArea=(p:XY[])=>p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a.x*b.y-b.x*a.y;},0)/2;
export const polygonArea=(p:XY[])=>Math.abs(signedArea(p));
export const extent=(p:XY[])=>({w:Math.max(...p.map(q=>q.x)),h:Math.max(...p.map(q=>q.y))});
export const corners=(r:Box):XY[]=>[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
export const intersects=(a:Box,b:Box)=>a.x<b.x+b.w-1e-6&&a.x+a.w>b.x+1e-6&&a.y<b.y+b.h-1e-6&&a.y+a.h>b.y+1e-6;
const cross=(a:XY,b:XY,c:XY)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function inTriangle(p:XY,a:XY,b:XY,c:XY) {return cross(a,b,p)>=-1e-8&&cross(b,c,p)>=-1e-8&&cross(c,a,p)>=-1e-8;}
export function triangulate(input:XY[]):XY[][] {
  const p=(signedArea(input)<0?[...input].reverse():[...input]);const triangles:XY[][]=[];
  let budget=p.length*p.length;
  while(p.length>3&&budget-->0){let cut=false;for(let i=0;i<p.length;i++){
    const prev=(i+p.length-1)%p.length,next=(i+1)%p.length,a=p[prev],b=p[i],c=p[next];
    if(cross(a,b,c)<=1e-8)continue;
    if(p.some((q,j)=>j!==prev&&j!==i&&j!==next&&inTriangle(q,a,b,c)))continue;
    triangles.push([a,b,c]);p.splice(i,1);cut=true;break;
  }if(!cut)throw Error('Boundary has intersecting or redundant edges. Simplify the surveyed polygon.');}
  if(p.length===3)triangles.push(p);return triangles;
}
export function validateBoundary(points:XY[]):XY[] {
  if(!Array.isArray(points)||points.length<3||points.length>80||points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))throw Error('Use 3–80 valid boundary coordinates in metres.');
  let p=points.map(q=>({...q}));if(p.length>3&&p[0].x===p.at(-1)!.x&&p[0].y===p.at(-1)!.y)p.pop();
  const minX=Math.min(...p.map(q=>q.x)),minY=Math.min(...p.map(q=>q.y));p=p.map(q=>({x:q.x-minX,y:q.y-minY}));
  const area=polygonArea(p),b=extent(p);if(area<1600||area>200000||b.w<35||b.h<35)throw Error('Concept planning supports parcels from 1,600 to 200,000 m², at least 35 m across.');
  for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
    if(j===i+1||(i===0&&j===p.length-1))continue;
    const a=p[i],b=p[(i+1)%p.length],c=p[j],d=p[(j+1)%p.length];
    if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)throw Error('Boundary edges cross. Enter vertices in perimeter order.');
  }
  if(new Set(p.map(q=>`${q.x},${q.y}`)).size!==p.length)throw Error('Remove repeated boundary vertices.');
  const triangles=triangulate(p);if(Math.abs(triangles.reduce((a,t)=>a+polygonArea(t),0)-area)>.01)throw Error('Boundary cannot be triangulated reliably.');
  return p;
}
/** Clip a convex triangle against four rectangle half-planes; arbitrary sites are triangulated first. */
export function clipToBox(input:XY[],r:Box):XY[] {
  let out=input;
  for(const [axis,value,dir] of [['x',r.x,1],['x',r.x+r.w,-1],['y',r.y,1],['y',r.y+r.h,-1]] as const){
    const current=out;out=[];if(!current.length)break;
    const inside=(p:XY)=>(p[axis]-value)*dir>=-1e-8;
    for(let i=0;i<current.length;i++){const a=current[i],b=current[(i+1)%current.length],ai=inside(a),bi=inside(b);
      if(ai)out.push(a);if(ai!==bi){const t=(value-a[axis])/(b[axis]-a[axis]);out.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}
    }
  }return out;
}
export const clippedArea=(triangles:XY[][],r:Box)=>triangles.reduce((n,t)=>n+polygonArea(clipToBox(t,r)),0);
export function subtractBox(r:Box,b:Box):Box[] {
  if(!intersects(r,b))return[r];const l=Math.max(r.x,b.x),right=Math.min(r.x+r.w,b.x+b.w),top=Math.max(r.y,b.y),bottom=Math.min(r.y+r.h,b.y+b.h);
  return [{x:r.x,y:r.y,w:r.w,h:top-r.y},{x:r.x,y:bottom,w:r.w,h:r.y+r.h-bottom},{x:r.x,y:top,w:l-r.x,h:bottom-top},{x:right,y:top,w:r.x+r.w-right,h:bottom-top}].filter(q=>q.w>1e-5&&q.h>1e-5);
}
export function unionBoxes(rects:Box[]):Box[]{const done:Box[]=[];for(const r of rects){let pieces=[r];for(const q of done)pieces=pieces.flatMap(p=>subtractBox(p,q));done.push(...pieces);}return done;}
export const lotPoints=(p:Lot)=>p.polygon||corners(p);
export const plotValue=(p:Lot,brief:Brief)=>p.area*SQFT*brief.price*(p.use==='commercial'?1.2:p.use==='ews'?.8:1)*(1+p.premium/100)*(1-(p.discount||0)/100);
export const landCost=(brief:Brief,area:number)=>brief.land*(brief.landBasis==='acre'?area/4046.8564224:brief.landBasis==='sqft'?area*SQFT:1);
const geom=(p:XY[]):pc.Polygon=>[p.map(q=>[Math.round(q.x*1e6)/1e6,Math.round(q.y*1e6)/1e6] as pc.Pair)];
export const lotGeometry=(p:Lot):pc.Polygon=>[...geom(lotPoints(p)),...(p.holes||[]).map(r=>geom(r)[0])];
const boxGeom=(r:Box)=>geom(corners(r));
const ringPoints=(r:pc.Ring)=>{
 const points=r.slice(0,-1).map(([x,y])=>({x:Math.round(x*1e6)/1e6,y:Math.round(y*1e6)/1e6}));
 for(let pass=0;pass<3;pass++)for(let i=points.length-1;i>=0&&points.length>3;i--){const a=points[(i+points.length-1)%points.length],b=points[i],c=points[(i+1)%points.length],length=Math.hypot(c.x-a.x,c.y-a.y);if(length>0&&Math.abs(cross(a,b,c))/length<.00001&&(b.x-a.x)*(b.x-c.x)+(b.y-a.y)*(b.y-c.y)<=.00001)points.splice(i,1);}
 return points;
};
export const geometryArea=(g:pc.MultiPolygon)=>g.reduce((a,p)=>a+p.reduce((s,r,i)=>s+(i?-1:1)*polygonArea(r.map(([x,y])=>({x,y}))),0),0);
const bounds=(p:XY[]):Box=>{const x=Math.min(...p.map(q=>q.x)),y=Math.min(...p.map(q=>q.y));return {x,y,w:Math.max(...p.map(q=>q.x))-x,h:Math.max(...p.map(q=>q.y))-y};};
const makeLot=(p:XY[],use:Use,label?:string):Lot=>({...bounds(p),polygon:p,id:'',use,area:polygonArea(p),premium:0,corner:false,facing:'Unknown',label});
export function lotOverlap(a:Lot,b:Lot){if(!intersects(a,b))return false;return geometryArea(booleanGeometry.intersection(lotGeometry(a),lotGeometry(b)))>.001;}
export function facingLabel(screenBearing:number,north:number|null|undefined){if(north==null)return 'Unknown';return ['North','North-east','East','South-east','South','South-west','West','North-west'][Math.round(((screenBearing-north+720)%360)/45)%8];}
/** Pack actual road-served blocks, then reclaim residual strips without creating landlocked slivers. */
function fitBlocks(free:pc.MultiPolygon,roadGeometry:pc.MultiPolygon,bands:Box[],fw:number,depth:number,brief:Brief,north:number|null|undefined):Lot[]{
 const target=fw*depth,selected=selectedPlotSizes(brief),explicit=!!brief.plotMix?.length;
 const roadEdges=roadGeometry.flatMap(p=>p.flatMap(r=>r.slice(0,-1).flatMap(([x,y],i)=>{
  const [qx,qy]=r[i+1];if(Math.abs(y-qy)<1e-7)return [{horizontal:true,coordinate:y,lo:Math.min(x,qx),hi:Math.max(x,qx)}];
  if(Math.abs(x-qx)<1e-7)return [{horizontal:false,coordinate:x,lo:Math.min(y,qy),hi:Math.max(y,qy)}];return [];
 })));
 const assess=(poly:pc.Polygon):Lot|null=>{
  if(poly.length!==1)return null;
  const points=ringPoints(poly[0]),r=bounds(points),area=polygonArea(points),regular=Math.abs(area-r.w*r.h)<.01;
  if(area<(brief.affordablePlots?600/SQFT:72)-.001||area<(brief.mixedRows?Math.min(target*.6,brief.affordablePlots?600/SQFT:72):target*.6)||area>(brief.mixedRows?Math.max(target*1.85,40*60*FT*FT):target*1.85)||r.w<6||r.h<6||r.w/r.h>3||r.h/r.w>3||(!regular&&!brief.allowOdd))return null;
  if(explicit&&brief.allowExtraSizes===false&&!selected.some(s=>regular&&Math.abs(r.w-s.width*FT)<.025&&Math.abs(r.h-s.depth*FT)<.025))return null;
  const perimeter=points.reduce((sum,a,i)=>{const b=points[(i+1)%points.length];return sum+Math.hypot(a.x-b.x,a.y-b.y);},0);
  if(!regular&&(4*Math.PI*area/(perimeter*perimeter)<.50||area/(r.w*r.h)<.72))return null;
  // An explicit rectangular building envelope excludes thin tips and badly pinched polygons.
  if(!regular&&!([0,.5,1].some(x=>[0,.5,1].some(y=>geometryArea(booleanGeometry.intersection(poly,boxGeom({x:r.x+(r.w-6)*x,y:r.y+(r.h-8)*y,w:6,h:8})))>=48-.001))))return null;
  let frontage=0,bearing=0;
  for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length],horizontal=Math.abs(a.y-b.y)<1e-5,vertical=Math.abs(a.x-b.x)<1e-5;
   if(!horizontal&&!vertical)continue;
   // Shared road-boundary segments provide exact linear frontage; disjoint contacts do not add up.
   const coordinate=horizontal?a.y:a.x,lo=horizontal?Math.min(a.x,b.x):Math.min(a.y,b.y),hi=horizontal?Math.max(a.x,b.x):Math.max(a.y,b.y);
   const intervals=roadEdges.filter(e=>e.horizontal===horizontal&&Math.abs(e.coordinate-coordinate)<.00002&&e.hi>lo&&e.lo<hi).map(e=>[Math.max(lo,e.lo),Math.min(hi,e.hi)]).sort((a,b)=>a[0]-b[0]);
   let served=0,start=0,end=-Infinity;
   for(const [a,b] of intervals){if(a>end+.00002){start=a;end=b;}else end=Math.max(end,b);served=Math.max(served,end-start);}
   served=Math.round(served*1e6)/1e6;
   if(served>frontage){frontage=served;bearing=horizontal?(a.y<r.y+r.h/2?0:180):(a.x<r.x+r.w/2?270:90);}
  }
  if(frontage<6-.01)return null;
  return {...r,id:'',use:area<72?'ews':'residential',area,premium:0,corner:false,facing:facingLabel(bearing,north),frontage,shape:regular?'regular':'irregular',discount:regular?0:brief.oddDiscount,...(!regular?{polygon:points}:{})};
 };
 const chosen:Lot[]=[];
 const rowScore=(lots:Lot[])=>lots.reduce((sum,l)=>sum+l.area*(explicit&&selected.some(s=>matchesPlotSize(l,s))?(brief.objective==='mix'?1.5:1.15):l.shape==='regular'?1.05:.9),0)+ (explicit?selected.reduce((bonus,size)=>{
  const existing=chosen.filter(l=>matchesPlotSize(l,size)).length,added=lots.filter(l=>matchesPlotSize(l,size)).length;
  const desired=Math.max(size.minCount,Math.ceil((chosen.length+lots.length)*size.targetPercent/100));
  return bonus+Math.min(added,Math.max(0,desired-existing))*size.width*size.depth*FT*FT*(brief.objective==='mix'?3:1.3);
 },0):0);
 const packBand=(band:Box,rowId:string):Lot[]=>{
  const blocks=booleanGeometry.intersection(free,boxGeom(band)),result:Lot[]=[];
  for(const [blockIndex,block] of blocks.entries()){
   const r=bounds(ringPoints(block[0]));if(r.w<6||r.h<6)continue;
   let winner:Lot[]=[],best=-Infinity;
   const profiles:{widths:number[];nominal:number;standard?:boolean;height?:number;bottom?:boolean}[]=[];
   if(explicit)for(const size of selected){const nominal=size.width*FT,height=size.depth*FT;if(height>r.h+.001)continue;const n=Math.floor((r.w+.001)/nominal);if(!n)continue;for(const bottom of [false,true])profiles.push({widths:Array(n).fill(nominal),nominal,standard:true,height,bottom});}
   if(brief.mixedRows&&(!explicit||brief.allowExtraSizes!==false)){
    // Each row has one repeated standard frontage. Only the ends absorb its remainder.
    for(const nominal of [...new Set([fw,...selected.map(s=>s.width*FT),20*FT,25*FT,30*FT,40*FT])]){
     const n=Math.floor(r.w/nominal),remainder=r.w-n*nominal;if(!n){profiles.push({widths:[r.w],nominal,standard:true});continue;}
     const core=Array(Math.max(0,n-1)).fill(nominal) as number[];
     profiles.push({widths:[...core,nominal+remainder],nominal,standard:true},{widths:[nominal+remainder,...core],nominal,standard:true});
     if(n>=2)profiles.push({widths:[nominal+remainder/2,...Array(n-2).fill(nominal),nominal+remainder/2],nominal,standard:true});
     if(remainder>=6)profiles.push({widths:[...Array(n).fill(nominal),remainder],nominal,standard:true});
    }
   }
   if(!explicit||brief.allowExtraSizes!==false){
    // A uniform adjusted row is a fallback when fixed standard sizes leave excessive land.
    const counts=[...new Set([Math.floor(r.w/fw),Math.round(r.w/fw),Math.ceil(r.w/fw)])].filter(n=>n>0&&r.w/n>=6&&r.w/n<=fw*1.5);
    for(const n of counts)profiles.push({widths:Array(n).fill(r.w/n),nominal:r.w/n});
   }
   const seen=new Set<string>(),cache=new Map<string,Lot[]>();
   for(const profile of profiles){const key=profile.widths.map(w=>w.toFixed(5)).join(',')+':'+profile.height+':'+profile.bottom;if(seen.has(key))continue;seen.add(key);
    const candidate:Lot[]=[];let x=r.x;
    for(const width of profile.widths){
     const height=profile.height??r.h,y=profile.bottom?r.y+r.h-height:r.y;const key=`${x.toFixed(6)}:${width.toFixed(6)}:${y}:${height}`;let assessed=cache.get(key);
     if(!assessed){assessed=booleanGeometry.intersection([block],boxGeom({x,y,w:width,h:height})).map(assess).filter((l):l is Lot=>l!==null);cache.set(key,assessed);}
     candidate.push(...assessed.map(l=>({...l,rowId:`${rowId}-${blockIndex}`,rowWidth:profile.nominal,rowDepth:profile.height??r.h,rowEnd:false})));x+=width;
    }
    candidate.sort((a,b)=>a.x-b.x);if(candidate[0])candidate[0].rowEnd=true;if(candidate.length)candidate[candidate.length-1].rowEnd=true;
    if(brief.mixedRows){
     const core=candidate.filter(l=>!l.rowEnd&&l.shape==='regular');
     if(core.some(l=>Math.abs(l.w-profile.nominal)>.01))continue;
     if(!profile.height&&core.length&&core.some(l=>Math.abs(l.h-r.h)>.01)){
      // A facility can nibble the rear of one interior plot. Keep the whole row's
      // interior depth consistent rather than silently creating a random short plot.
      const top=Math.max(...core.map(l=>l.y)),bottom=Math.min(...core.map(l=>l.y+l.h));let valid=true;
      for(const lot of core){const aligned=assess(boxGeom({x:lot.x,y:top,w:lot.w,h:bottom-top}));if(!aligned){valid=false;break;}delete lot.polygon;Object.assign(lot,aligned);}
      if(!valid)continue;for(const lot of candidate)lot.rowDepth=bottom-top;
     }
    }
    const repeated=candidate.filter(l=>l.shape==='regular'&&Math.abs(l.w-profile.nominal)<.001).reduce((sum,l)=>sum+l.area,0);
    const score=rowScore(candidate)+(brief.mixedRows&&profile.standard?repeated*.025:0);
    if(score>best){winner=candidate;best=score;}
   }
   result.push(...winner);
  }
  return result;
 };
 // Opposite rows share a block. Try a different standard depth on either side,
 // retaining the same road network and a straight, shared rear boundary.
 for(let i=0;i<bands.length;i++){
  const first=bands[i],second=bands[i+1],paired=second&&Math.abs(first.y+first.h-second.y)<.001;
  if(!brief.mixedRows||!paired){chosen.push(...packBand(first,`row-${i}`));continue;}
  const height=first.h+second.h,alternative=Math.abs(first.h-40*FT)<.1?50*FT:40*FT;
  const splits=[...new Set([first.h,alternative,height-alternative,...(explicit?selected.map(s=>s.depth):[30,40,50,60]).flatMap(d=>[d*FT,height-d*FT])])].filter(h=>h>=8&&height-h>=8);
  let winner:Lot[]=[],best=-Infinity;
  for(const h of splits){const candidate=[...packBand({...first,h},`row-${i}`),...packBand({...second,y:first.y+h,h:height-h},`row-${i+1}`)];
   const score=rowScore(candidate);if(score>best){winner=candidate;best=score;}}
  chosen.push(...winner);i++;
 }
 const regular=chosen.filter(l=>l.shape==='regular'),odd=chosen.filter(l=>l.shape==='irregular').sort((a,b)=>b.area-a.area);
 const maxOdd=Math.floor(regular.length*brief.maxOddPercent/Math.max(1,100-brief.maxOddPercent));
 const lots=[...regular,...odd.slice(0,maxOdd)];
 let remaining=lots.length?booleanGeometry.difference(free,...lots.map(l=>lotGeometry(l))):free;
 // Grow neighbours into recoverable strips. Preserve genuine road frontage and the irregular cap.
 for(const lot of [...lots].filter(l=>(!brief.mixedRows||l.rowEnd||l.shape==='irregular')&&(!explicit||brief.objective!=='mix'||!selected.some(s=>matchesPlotSize(l,s)))).sort((a,b)=>a.area-b.area)){
  const selectedSize=selected.find(s=>matchesPlotSize(lot,s));if(selectedSize&&lots.filter(l=>matchesPlotSize(l,selectedSize)).length<=selectedSize.minCount)continue;
  const padX=fw*.45,padY=depth*.45,windows=[{x:lot.x-padX,y:lot.y,w:lot.w+padX,h:lot.h},{x:lot.x,y:lot.y,w:lot.w+padX,h:lot.h},{x:lot.x,y:lot.y-padY,w:lot.w,h:lot.h+padY},{x:lot.x,y:lot.y,w:lot.w,h:lot.h+padY}];
  let best:Lot|null=null;
  for(const window of windows){const extra=booleanGeometry.intersection(remaining,boxGeom(window));if(geometryArea(extra)<.25)continue;
   const union=booleanGeometry.union(lotGeometry(lot),extra);if(union.length!==1)continue;const candidate=assess(union[0]);
   if(!candidate||candidate.area<=lot.area+.25)continue;
   if(candidate.shape==='irregular'&&lot.shape!=='irregular'&&lots.filter(l=>l.shape==='irregular').length>=Math.floor(lots.length*brief.maxOddPercent/100))continue;
   if(!best||candidate.area>best.area)best=candidate;
  }
  if(best){delete lot.polygon;Object.assign(lot,best);remaining=booleanGeometry.difference(remaining,lotGeometry(lot));}
 }
 // Recover standalone end pockets only after applying the same area, shape,
 // frontage and selected-size checks as every other plot. No grey-area relabeling.
 const pockets=remaining.map(assess).filter((l):l is Lot=>l!==null).sort((a,b)=>Number(a.shape==='irregular')-Number(b.shape==='irregular')||b.area-a.area);
 for(const [i,lot] of pockets.entries()){
  if(lot.shape==='irregular'&&lots.filter(l=>l.shape==='irregular').length+1>Math.floor((lots.length+1)*brief.maxOddPercent/100))continue;
  lots.push({...lot,rowId:`edge-pocket-${i}`,rowWidth:lot.w,rowDepth:lot.h,rowEnd:true});
 }
 return lots;
}

type StreetSegment=Box & {axis:'x'|'y';width:number};
/** Retain only complete-width strips, so clipped tips and point contacts cannot serve as junctions. */
function streetSegments(raw:Box[],surface:pc.MultiPolygon):StreetSegment[]{
 const result:StreetSegment[]=[];
 for(const r of raw){
  const axis=r.w>=r.h?'x':'y',lateral=axis==='x'?'y':'x',width=axis==='x'?r.h:r.w,lo=r[axis],hi=lo+(axis==='x'?r.w:r.h),side=r[lateral];
  const cuts=[lo,hi];
  for(const p of surface)for(const ring of p)for(let i=1;i<ring.length;i++){
   const a={x:ring[i-1][0],y:ring[i-1][1]},b={x:ring[i][0],y:ring[i][1]};cuts.push(a[axis]);
   for(const edge of [side,side+width])if(Math.abs(b[lateral]-a[lateral])>1e-8){const t=(edge-a[lateral])/(b[lateral]-a[lateral]);if(t>=0&&t<=1)cuts.push(a[axis]+t*(b[axis]-a[axis]));}
  }
  const sorted=[...new Set(cuts.filter(v=>v>=lo&&v<=hi).map(v=>Math.round(v*1e6)/1e6))].sort((a,b)=>a-b);
  let last:StreetSegment|undefined;
  for(let i=1;i<sorted.length;i++){
   const a=sorted[i-1],length=sorted[i]-a;if(length<.00001)continue;
   const piece={...r,[axis]:a,[axis==='x'?'w':'h']:length};
   if(geometryArea(booleanGeometry.intersection(surface,boxGeom(piece)))<length*width-.001){last=undefined;continue;}
   if(last&&Math.abs(last[axis]+(axis==='x'?last.w:last.h)-a)<.00001){if(axis==='x')last.w+=length;else last.h+=length;}
   else{last={...piece,axis,width};result.push(last);}
  }
 }
 return result;
}
function streetJoin(a:StreetSegment,b:StreetSegment){
 const x=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),y=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y),width=Math.min(a.width,b.width)-.001;
 if(a.axis===b.axis)return a.axis==='x'?x>=-.001&&y>=width:y>=-.001&&x>=width;
 return x>=width&&y>=width;
}
function roadReachability(raw:Box[],surface:pc.MultiPolygon,entries:XY[],site:pc.Polygon,roundabout?:pc.MultiPolygon){
 const segments=streetSegments(raw,surface),adj=segments.map(()=>[] as number[]);
 for(let i=0;i<segments.length;i++)for(let j=i+1;j<segments.length;j++)if(streetJoin(segments[i],segments[j])){adj[i].push(j);adj[j].push(i);}
 if(roundabout){const joining=segments.flatMap((r,i)=>geometryArea(booleanGeometry.intersection(roundabout,boxGeom(r)))>=r.width*r.width*.5?[i]:[]);for(const i of joining)for(const j of joining)if(i!==j)adj[i].push(j);}
 const nearest=(r:Box,p:XY)=>({x:Math.max(r.x,Math.min(r.x+r.w,p.x)),y:Math.max(r.y,Math.min(r.y+r.h,p.y))});
 const seedSets=entries.map(entry=>segments.flatMap((r,i)=>{
  const q=nearest(r,entry),distance=Math.hypot(q.x-entry.x,q.y-entry.y);if(distance>r.width*1.5)return [];
  const approach={x:Math.min(q.x,entry.x)-r.width/2,y:Math.min(q.y,entry.y)-r.width/2,w:Math.abs(q.x-entry.x)+r.width,h:Math.abs(q.y-entry.y)+r.width};
  const inside=booleanGeometry.intersection(site,boxGeom(approach));
  return geometryArea(booleanGeometry.difference(inside,surface))<.01?[i]:[];
 }));
 const reached=new Set<number>(),queue=seedSets.flat();for(const i of queue)reached.add(i);
 for(let k=0;k<queue.length;k++)for(const j of adj[queue[k]])if(!reached.has(j)){reached.add(j);queue.push(j);}
 let served=queue.length?booleanGeometry.union(...queue.map(i=>boxGeom(segments[i])) as [pc.Polygon,...pc.Polygon[]]):[];
 if(roundabout&&geometryArea(booleanGeometry.intersection(served,roundabout))>.01)served=booleanGeometry.union(served,roundabout);
 return {segments,reached,served,seedSets};
}
/** Reserve short full-width connections BEFORE allocating the park or saleable blocks. */
function connectStreetNetwork(raw:Box[],site:pc.Polygon,obstacles:pc.Polygon[],entries:XY[],width:number){
 const available=obstacles.length?booleanGeometry.difference(site,...obstacles):[site];
 let surface=booleanGeometry.intersection(site,booleanGeometry.union(...raw.map(boxGeom) as [pc.Polygon,...pc.Polygon[]]));
 const drivable=(g:pc.MultiPolygon)=>obstacles.length?booleanGeometry.difference(g,...obstacles):g;
 let graph=roadReachability(raw,drivable(surface),entries,site),added=0;
 const center=(r:Box)=>({x:r.x+r.w/2,y:r.y+r.h/2});
 const corridor=(a:XY,b:XY):Box=>({x:Math.min(a.x,b.x)-width/2,y:Math.min(a.y,b.y)-width/2,w:Math.abs(a.x-b.x)+width,h:Math.abs(a.y-b.y)+width});
 for(let pass=0;pass<8;pass++){
  if(graph.reached.size===graph.segments.length||!graph.reached.size)break;
  const pairs=graph.segments.flatMap((a,i)=>graph.reached.has(i)?[]:graph.segments.flatMap((b,j)=>graph.reached.has(j)?[{a,b,d:Math.hypot(center(a).x-center(b).x,center(a).y-center(b).y)}]:[])).sort((a,b)=>a.d-b.d).slice(0,32);
  let best:Box[]|undefined,bestCost=Infinity;
  for(const {a,b} of pairs){
   const ca=center(a),cb=center(b);
   // Choose junctions within the full-width portions, not the clipped road tips.
   const point=(s:StreetSegment,p:XY)=>s.axis==='x'?{x:Math.max(s.x+width/2,Math.min(s.x+s.w-width/2,p.x)),y:s.y+s.h/2}:{x:s.x+s.w/2,y:Math.max(s.y+width/2,Math.min(s.y+s.h-width/2,p.y))};
   if((a.axis==='x'?a.w:a.h)<width||(b.axis==='x'?b.w:b.h)<width)continue;
   const p=point(a,cb),q=point(b,p),routes:XY[][]=[[p,{x:p.x,y:q.y},q],[p,{x:q.x,y:p.y},q]];
   if(a.axis==='x'&&b.axis==='x'){
    const lo=Math.max(a.x,b.x)+width/2,hi=Math.min(a.x+a.w,b.x+b.w)-width/2;
    if(hi>=lo)for(const x of [lo,(lo+hi)/2,hi])routes.push([{x,y:ca.y},{x,y:cb.y}]);
   }
   if(a.axis==='y'&&b.axis==='y'){
    const lo=Math.max(a.y,b.y)+width/2,hi=Math.min(a.y+a.h,b.y+b.h)-width/2;
    if(hi>=lo)for(const y of [lo,(lo+hi)/2,hi])routes.push([{x:ca.x,y},{x:cb.x,y}]);
   }
   for(const points of routes){
    const boxes=points.slice(1).map((p,i)=>corridor(points[i],p));
    if(boxes.some(r=>geometryArea(booleanGeometry.intersection(available,boxGeom(r)))<r.w*r.h-.001))continue;
    const shape=booleanGeometry.union(...boxes.map(boxGeom) as [pc.Polygon,...pc.Polygon[]]),cost=geometryArea(booleanGeometry.difference(shape,surface));
    if(cost<.01||cost>=bestCost)continue;
    // A bridge must actually connect complete-width street strips on both ends.
    const next=roadReachability([...raw,...boxes],drivable(booleanGeometry.union(surface,shape)),entries,site);
    if(next.served.length&&geometryArea(next.served)>geometryArea(graph.served)+cost+.01){best=boxes;bestCost=cost;}
   }
  }
  if(!best)break;raw.push(...best);added++;surface=booleanGeometry.union(surface,...best.map(boxGeom));graph=roadReachability(raw,drivable(surface),entries,site);
 }
 return {surface,graph,added};
}

function makeConcept(project:Project,index:number,trial=0,parkTrial=0,mainWidth=0):Concept {
 const boundary=project.boundary,b=extent(boundary),area=polygonArea(boundary),triangles=triangulate(boundary),site=geom(boundary),brief={...defaultBrief,...project.brief};
 const names=['Balanced neighbourhood','Higher plot yield','Premium addresses','Lower road cost','Green neighbourhood'];
 const strategies=['Regular plots first, with useful edge plots','Smaller plots, more inventory','Larger plots and wider streets','Fewer streets, deeper plots','A larger connected park'];
 brief.plotMix=selectedPlotSizes(project.brief).map(size=>({...size}));
 const pool=selectedPlotSizes(brief).slice().sort((a,b)=>a.width*a.depth-b.width*b.depth);
 if(brief.plotMix?.length){const size=pool[index===1?0:index===2?pool.length-1:index%pool.length];brief.frontage=size.width;brief.depth=size.depth;}
 else {if(index===1){brief.frontage=25;brief.depth=40;}if(index===2){brief.frontage=40;brief.depth=60;}if(index===3){brief.frontage=30;brief.depth=50;}}
 if(index===4)brief.parkPercent=Math.max(15,brief.parkPercent);
 const maximum=Math.max(brief.road,brief.roadMax),requested=index===2?maximum:Math.max(brief.road,mainWidth);
 const baseline=(length:number)=>isTamilNadu(brief.authority)?Math.max(brief.extendableRoads?9:0,baselineStreetWidth(length)):project.brief.road;
 let required=project.brief.road,secondaryRequired=project.brief.road,rw=requested,sw=project.brief.road;
 const fw=brief.frontage*FT,depth=Math.max(brief.depth,(Math.min(...pool.map(s=>s.depth))+Math.max(...pool.map(s=>s.depth)))/2)*FT;
 let spine=b.w*.5,offset=depth;const placements:{spine:number;offset:number;score:number}[]=[];
 for(const fraction of [.35,.45,.55,.65])for(const phase of [depth*.5,depth,depth+3,depth*1.5]){let score=0;const x=b.w*fraction;
  for(let y=phase;y+sw<=b.h;y+=depth*2+sw)for(const above of [true,false])for(const side of [-1,1])for(let k=0;k<Math.ceil(b.w/fw);k++){
   const r={x:side<0?x-rw/2-(k+1)*fw:x+rw/2+k*fw,y:above?y-depth:y+sw,w:fw,h:depth};
   if(r.x<0||r.y<0||r.x+r.w>b.w||r.y+r.h>b.h)continue;
   if(clippedArea(triangles,r)>=fw*depth-.01&&clippedArea(triangles,{x:r.x,y,w:fw,h:sw})>=fw*sw-.01&&!project.exclusions.some(z=>intersects(r,z)))score+=fw*depth;
  }placements.push({score,spine:x,offset:phase});
 }
 placements.sort((a,c)=>c.score-a.score);const diverse=placements.filter((p,i)=>placements.findIndex(q=>Math.abs(q.offset-p.offset)<.01)===i);const placement=diverse[trial%diverse.length];spine=placement.spine;offset=placement.offset;
 // Measure the actual clipped street runs; same-width junctions do not reset length.
 const runLengths=(r:Box,splitAtSpine=false)=>streetSegments([r],booleanGeometry.intersection(site,boxGeom(r))).flatMap(s=>{
  if(s.axis==='x'&&splitAtSpine&&s.x<spine&&s.x+s.w>spine)return [Math.max(0,spine-rw/2-s.x),Math.max(0,s.x+s.w-spine-rw/2)];
  return [s.axis==='x'?s.w:s.h];
 });
 for(let pass=0;pass<4;pass++){
  required=baseline(Math.max(0,...runLengths({x:spine-rw/2,y:0,w:rw,h:b.h})));
  rw=Math.min(maximum,Math.max(requested,required));
  const lengths:number[]=[];for(let y=offset;y+sw<=b.h;y+=depth*2+sw)lengths.push(...runLengths({x:0,y,w:b.w,h:sw},rw>sw+.001));
  secondaryRequired=baseline(Math.max(0,...lengths));const next=Math.min(maximum,Math.max(project.brief.road,secondaryRequired));if(Math.abs(next-sw)<.001)break;sw=next;
 }
 brief.road=rw;
 const ys:number[]=[],rawRoads:Box[]=[{x:spine-rw/2,y:0,w:rw,h:b.h}];
 for(let y=offset;y+sw<=b.h;y+=depth*2+sw){ys.push(y);rawRoads.push({x:0,y,w:b.w,h:sw});}
 const entrances=siteEntrances(project.access),entries=entrances.map(e=>{const a=boundary[e.edge],z=boundary[(e.edge+1)%boundary.length];return{x:a.x+(z.x-a.x)*e.t,y:a.y+(z.y-a.y)*e.t};});
 // Route each entrance to the spine; prefer a short contained orthogonal connection.
 for(const [entryIndex,entry] of entries.entries()){const ew=Math.min(maximum,Math.max(project.brief.road,entrances[entryIndex].entranceWidth??9));let route:Box[]=[];let score=-Infinity;
  for(const y of [entry.y,...ys.map(y=>y+sw/2)]){const candidate=[{x:entry.x-ew/2,y:Math.min(entry.y,y)-ew/2,w:ew,h:Math.abs(y-entry.y)+ew},{x:Math.min(entry.x,spine)-ew/2,y:y-ew/2,w:Math.abs(entry.x-spine)+ew,h:ew}];const outside=candidate.reduce((s,r)=>s+r.w*r.h-clippedArea(triangles,r),0),length=Math.abs(y-entry.y)+Math.abs(entry.x-spine);const value=-outside*20-length;if(value>score){score=value;route=candidate;}}
  rawRoads.push(...route);
 }
 for(const road of project.access?.roads||[])for(let i=1;i<road.points.length;i++){const a=road.points[i-1],z=road.points[i];rawRoads.push({x:Math.min(a.x,z.x)-road.width/2,y:Math.min(a.y,z.y)-road.width/2,w:Math.abs(a.x-z.x)+road.width,h:Math.abs(a.y-z.y)+road.width});}
 const routingEntries=entries.length?entries:(!project.access?[{x:spine,y:b.h}]:[]);
 const routed=connectStreetNetwork(rawRoads,site,[...project.exclusions.map(boxGeom),...project.locks.map(lotGeometry)],routingEntries,sw);
 const roads=unionBoxes(rawRoads);
 let roadGeom=routed.surface;
 let island:Lot|undefined,roundaboutSurface:pc.MultiPolygon|undefined;
 if(brief.roadStyle==='roundabout'){
  const radius=brief.roundaboutDiameter/2,inner=radius-Math.max(rw,sw);
  const circle=(x:number,y:number,r:number)=>Array.from({length:48},(_,i)=>({x:x+Math.cos(i*Math.PI/24)*r,y:y+Math.sin(i*Math.PI/24)*r}));
  for(const y of [...ys].sort((a,z)=>Math.abs(a-b.h/2)-Math.abs(z-b.h/2))){
   if(inner<2)break;
   const outer=geom(circle(spine,y+sw/2,radius)),center=circle(spine,y+sw/2,inner);
   if(geometryArea(booleanGeometry.difference(outer,site))>.001||project.exclusions.some(z=>geometryArea(booleanGeometry.intersection(outer,boxGeom(z)))>.001)||project.locks.some(l=>geometryArea(booleanGeometry.intersection(outer,lotGeometry(l)))>.001))continue;
   roundaboutSurface=booleanGeometry.difference(outer,geom(center));roadGeom=booleanGeometry.difference(booleanGeometry.union(roadGeom,outer),geom(center));island=makeLot(center,'infrastructure','Traffic island');break;
  }
 }
 const exitGraph=island?roadReachability(rawRoads,booleanGeometry.difference(roadGeom,...project.exclusions.map(boxGeom),...project.locks.map(lotGeometry)),routingEntries,site,roundaboutSurface):routed.graph;
 const servedRoadGeom=exitGraph.served,servedRoadPolygons=servedRoadGeom.map(p=>p.map(ringPoints));
 // Remove clipped road fragments that contain no reachable full-width street.
 roadGeom=roadGeom.filter(p=>geometryArea(booleanGeometry.intersection([p],servedRoadGeom))>.01);
 const roadsArea=geometryArea(roadGeom);
 const zones=project.exclusions.map(boxGeom),protectedGeom=zones.length?booleanGeometry.difference(booleanGeometry.intersection(site,booleanGeometry.union(...zones as [pc.Polygon,...pc.Polygon[]])),roadGeom):[];
 const protectedArea=geometryArea(protectedGeom),reserved=booleanGeometry.union(roadGeom,...zones,...project.locks.map(p=>lotGeometry(p)));
 let free=booleanGeometry.difference(site,reserved);const lots:Lot[]=project.locks.map(p=>({...p,locked:true}));if(island){lots.push(island);free=booleanGeometry.difference(free,lotGeometry(island));}
 const reservation=baselineReservations(area,roadsArea,brief.authority),parkTarget=Math.max(area*brief.parkPercent/100,reservation.osr),targetY=brief.park==='north'?b.h*.2:brief.park==='south'?b.h*.8:b.h*.5;
 const parkCandidates=free.filter(p=>p.length===1&&geometryArea([p])>=100).sort((a,c)=>{const ba=bounds(ringPoints(a[0])),bc=bounds(ringPoints(c[0]));const score=(r:Box,p:pc.Polygon)=>Math.min(geometryArea([p]),parkTarget)*5+(brief.park==='auto'?10*geometryArea([p])/(r.w*r.h):-Math.abs(r.y+r.h/2-targetY));return score(bc,c)-score(ba,a);});
 if(parkCandidates[0]){const p=parkCandidates[brief.park==='auto'?Math.floor(parkTrial/2)%parkCandidates.length:0],r=bounds(ringPoints(p[0]));let park:pc.MultiPolygon=[p];if(geometryArea(park)>parkTarget){const horizontal=brief.park==='auto'&&parkTrial%2===1;const window=(size:number)=>horizontal?{...r,h:size}:{...r,w:size};let low=0,high=horizontal?r.h:r.w;for(let i=0;i<32;i++){const mid=(low+high)/2,cut=booleanGeometry.intersection([p],boxGeom(window(mid)));if(geometryArea(cut)<parkTarget)low=mid;else high=mid;}park=booleanGeometry.intersection([p],boxGeom(window(high)));}for(const polygon of park)if(polygon.length===1&&geometryArea([polygon])>1)lots.push(makeLot(ringPoints(polygon[0]),'park','Park / OSR'));free=booleanGeometry.difference(free,park);}
 const grid:Box[]=[];for(const y of ys)for(const above of [true,false])for(const side of [-1,1])for(let k=0;k<Math.ceil(b.w/fw);k++){const r={x:side<0?spine-rw/2-(k+1)*fw:spine+rw/2+k*fw,y:above?y-depth:y+sw,w:fw,h:depth};if(r.x+r.w>0&&r.x<b.w&&r.y>=0&&r.y+r.h<=b.h)grid.push(r);}
 const park=lots.find(p=>p.use==='park');
 const reserveFacility=(size:number,use:Use,label:string,nearPark:boolean)=>{if(size<=0)return false;const w=Math.max(6,Math.sqrt(size*1.3)),h=size/w;
  const candidates=grid.flatMap(r=>[{x:r.x,y:r.y,w,h},{x:r.x,y:r.y+r.h-h,w,h}]).sort((a,c)=>{const target=nearPark&&park?{x:park.x+park.w/2,y:park.y+park.h/2}:entries[0]||{x:spine,y:b.h};return Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(c.x-target.x,c.y-target.y);});
  const box=candidates.find(r=>geometryArea(booleanGeometry.intersection(free,boxGeom(r)))>=size-.01&&sharedRoadFrontage(corners(r),servedRoadPolygons)>=3-.001);
  if(!box)return false;lots.push({...box,id:'',use,label,area:size,premium:0,corner:false,facing:'Unknown'});free=booleanGeometry.difference(free,boxGeom(box));return true;};
 reserveFacility(Math.max(reservation.public,(area-roadsArea)*.01),'utility','Public-purpose reserve',false);
 for(let i=0;i<brief.clubhouseCount;i++)reserveFacility(brief.clubhouseArea/SQFT,'clubhouse',`Clubhouse ${i+1}`,true);
 reserveFacility(brief.amenityArea/SQFT,'amenity',brief.amenityType==='sports'?'Sports court':brief.amenityType==='parking'?'Visitor parking':'Playground',brief.amenityLocation==='beside-park');
 const bands:Box[]=[];
 for(let i=0;i<ys.length;i++){
  const top=i===0?0:(ys[i-1]+sw+ys[i])/2,bottom=i===ys.length-1?b.h:(ys[i]+sw+ys[i+1])/2;
  bands.push({x:0,y:top,w:b.w,h:ys[i]-top},{x:0,y:ys[i]+sw,w:b.w,h:bottom-ys[i]-sw});
 }
 const packed=fitBlocks(free,servedRoadGeom,bands,fw,depth,brief,project.access?.northAngle);
 for(const lot of packed){lot.corner=Math.abs(lot.x+lot.w-(spine-rw/2))<.01||Math.abs(lot.x-(spine+rw/2))<.01;lot.premium=lot.corner?8:0;}
 lots.push(...packed);
 const residential=lots.filter(p=>p.use==='residential'&&!p.locked).sort((a,c)=>Math.hypot(a.x-(entries[0]?.x||spine),a.y-(entries[0]?.y||b.h))-Math.hypot(c.x-(entries[0]?.x||spine),c.y-(entries[0]?.y||b.h)));
 if(brief.commercial){let assigned=0;for(const p of [...residential].sort((a,b)=>Number(pool.some(s=>matchesPlotSize(a,s)))-Number(pool.some(s=>matchesPlotSize(b,s))))){if(assigned>=2)break;const size=pool.find(s=>matchesPlotSize(p,s));if(size&&residential.filter(l=>l.use==='residential'&&matchesPlotSize(l,size)).length<=size.minCount)continue;p.use='commercial';assigned++;}}
 const ewsTarget=Math.max(reservation.ews,residential.reduce((s,p)=>s+p.area,0)*brief.ewsPercent/100);let ews=lots.filter(p=>p.use==='ews').reduce((sum,p)=>sum+p.area,0);for(const p of [...residential].reverse()){if(ews>=ewsTarget)break;if(p.use==='residential'){p.use='ews';ews+=p.area;}}
 for(const p of lots.filter(p=>!p.locked&&['residential','commercial','ews'].includes(p.use)))if(park&&Math.hypot(p.x+p.w/2-park.x-park.w/2,p.y+p.h/2-park.y-park.h/2)<depth*1.7)p.premium+=5;
 lots.sort((a,c)=>a.y-c.y||a.x-c.x);const used=new Set(project.locks.map(p=>p.id));let n=1;const counts:Record<string,number>={};for(const p of lots){if(p.locked)continue;if(['residential','ews','commercial'].includes(p.use)){while(used.has(String(n).padStart(3,'0')))n++;p.id=String(n++).padStart(3,'0');used.add(p.id);}else{counts[p.use]=(counts[p.use]||0)+1;p.id=`${p.use}-${counts[p.use]}`;}}
 const sum=(use:Use)=>lots.filter(p=>p.use===use).reduce((s,p)=>s+p.area,0),numbered=lots.filter(p=>['residential','ews','commercial'].includes(p.use)),saleable=sum('residential')+sum('ews')+sum('commercial'),parkArea=sum('park'),publicArea=sum('utility')+sum('clubhouse')+sum('amenity')+sum('infrastructure');
 const occupied=booleanGeometry.union(roadGeom,protectedGeom,...lots.map(p=>lotGeometry(p))),residual=booleanGeometry.difference(site,occupied),unallocated=geometryArea(residual);
 const roadLength=roads.reduce((sum,r)=>{const owner=rawRoads.filter(q=>r.x+r.w/2>=q.x-.001&&r.x+r.w/2<=q.x+q.w+.001&&r.y+r.h/2>=q.y-.001&&r.y+r.h/2<=q.y+q.h+.001).sort((a,b)=>Math.min(b.w,b.h)-Math.min(a.w,a.h))[0];return sum+geometryArea(booleanGeometry.intersection(roadGeom,boxGeom(r)))/Math.max(1,Math.min(owner?.w||rw,owner?.h||rw));},0),earthwork=area*brief.slope/100*.35,infra=roadsArea*brief.roadRate+roadLength*5800+Math.ceil(roadLength/30)*35000+parkArea*650+publicArea*10000+earthwork*brief.earthRate;
 const revenue=numbered.reduce((s,p)=>s+plotValue(p,brief),0),landTotal=landCost(brief,area),cost=landTotal+infra+brief.fees+revenue*brief.marketing/100;
 const entry=entries[0]||{x:spine,y:b.h};const networkConnected=exitGraph.segments.length>0&&exitGraph.reached.size===exitGraph.segments.length&&exitGraph.seedSets.every(s=>s.length>0);
 for(const p of numbered)p.exitAccess=sharedRoadFrontage(lotPoints(p),servedRoadPolygons)>=5.99;
 const unreachable=numbered.filter(p=>!p.exitAccess);
 const conflict=project.exclusions.some(z=>geometryArea(booleanGeometry.intersection(roadGeom,boxGeom(z)))>.01)||project.locks.some(l=>geometryArea(booleanGeometry.intersection(roadGeom,lotGeometry(l)))>.01);
 const roadSchedule:RoadSchedule[]=rawRoads.flatMap((r,i)=>streetSegments([r],roadGeom).flatMap(s=>{
  const lengths=s.axis==='x'&&rw>s.width+.001&&s.x<spine-rw/2&&s.x+s.w>spine+rw/2?[spine-rw/2-s.x,s.x+s.w-spine-rw/2]:[s.axis==='x'?s.w:s.h];
  return lengths.filter(length=>length>.1).map((length,j)=>({name:i===0?'Main street':i<=ys.length?`Street ${i}${lengths.length>1?String.fromCharCode(97+j):''}`:`Access / link ${i-ys.length}`,length,width:s.width,requested:project.brief.road,required:baseline(length),reason:isTamilNadu(brief.authority)?`${brief.extendableRoads?'Extendable-road floor and ':''}length baseline; only a wider main street splits the run`:'Developer range; local classification pending'}));
 }));
 const ruleSource=`TNCDBR 2019 Rule 47 · baseline + G.O.16/2020; later amendments pending review`;
 const checks:Check[]=[
 {name:'Entrance opening',state:entrances.some(e=>{const a=boundary[e.edge],z=boundary[(e.edge+1)%boundary.length];return (e.entranceWidth??9)>2*Math.min(e.t,1-e.t)*Math.hypot(z.x-a.x,z.y-a.y)+.01;})?'fail':'review',actual:entrances.map(e=>`${e.entranceWidth??9} m`).join(', ')||'No opening mapped',requirement:'Opening must fit on its boundary edge; gate, splay and approach geometry need review',source:'Opening width is separate from external road width'},
 {name:'Junction design',state:brief.roadStyle==='roundabout'&&!island?'fail':'review',actual:island?`${brief.roundaboutDiameter} m roundabout concept`:'Straight streets',requirement:brief.roadStyle==='roundabout'?'Roundabout must fit with a minimum 2 m central island radius; turning paths need engineering review':'Junctions and dead-end turning need engineering review',source:'Concept geometry; not a traffic design certification'},
 {name:'Affordable plot sizes',state:lots.some(p=>p.area<72&&p.use==='ews')?'review':'pass',actual:`${lots.filter(p=>p.area<72&&p.use==='ews').length} plots below 72 m²`,requirement:'Small plots are EWS concepts only; eligibility and local dimensions need verification',source:'TNCDBR Rule 47: 32 m² EWS / 72 m² other plots baseline'},
 {name:'Mapped entrances',state:!project.access||entries.length?'pass':'fail',actual:`${entries.length} entrance(s); road sides inferred`,requirement:'At least one road-access entrance',source:'Developer input; legal access unverified'},
 {name:'Road network connectivity',state:networkConnected?'pass':'fail',actual:`${exitGraph.reached.size}/${exitGraph.segments.length} full-width street sections reach an entrance; ${routed.added} connecting road(s) added`,requirement:'Continuous full-width route to a mapped entrance; point contacts do not count',source:'Street-strip graph and entrance traversal; turning paths still require engineering review'},
 {name:'Plot route to exit',state:unreachable.length?'fail':'pass',actual:unreachable.length?`No verified route for plot(s): ${unreachable.map(p=>p.id).join(', ')}`:`${numbered.length}/${numbered.length} plots have road frontage connected to an entrance`,requirement:'At least 6 m frontage on an entrance-reachable street',source:'Per-plot reachability; newly generated unreachable plots excluded'},
 {name:'Facility access',state:lots.some(p=>['park','clubhouse','amenity','utility'].includes(p.use)&&sharedRoadFrontage(lotPoints(p),servedRoadPolygons)<2.99)?'fail':'pass',actual:'Park, clubhouse and public facilities checked against reachable streets',requirement:'At least 3 m contact with an entrance-reachable street',source:'Concept access check; actual pedestrian gates and vehicle turning need design'},
 {name:'Boundary containment',state:lots.every(p=>Math.abs(geometryArea(booleanGeometry.intersection(lotGeometry(p),site))-p.area)<.01)?'pass':'fail',actual:'Actual plot polygons checked',requirement:'Inside parcel',source:'Geometric calculation'},
 {name:'Internal road range',state:roadSchedule.every(r=>r.width+.001>=Math.max(r.required,r.requested)&&r.width<=maximum+.001)?'pass':'fail',actual:`${rw} m main / ${sw} m secondary; requested ${project.brief.road}–${maximum} m`,requirement:`Main ${required} m; secondary ${secondaryRequired} m length-based baseline`,source:isTamilNadu(brief.authority)?ruleSource:'Developer range; local authority verification'},
 {name:'Park shape',state:lots.filter(p=>p.use==='park').every(p=>{const points=lotPoints(p),perimeter=points.reduce((n,a,i)=>{const b=points[(i+1)%points.length];return n+Math.hypot(a.x-b.x,a.y-b.y);},0);return Math.min(p.w,p.h)>=6&&4*Math.PI*p.area/(perimeter*perimeter)>=.2;})?'pass':'fail',actual:'Park width and compactness checked',requirement:'Concept quality filter: at least 6 m bounding width and compactness 0.2; statutory dimensions require separate review',source:'Product usability heuristic, not a CMDA dimensional rule'},
 {name:'Park / OSR',state:parkArea+0.1>=parkTarget?'pass':'fail',actual:`${parkArea.toFixed(0)} m²; ${lots.filter(p=>p.use==='park').length} park(s)`,requirement:`${parkTarget.toFixed(0)} m²; separate from clubhouse`,source:isTamilNadu(brief.authority)?'Rule 47(6) baseline: net-of-road reservation; land-reservation route selected':'Developer brief'},
 {name:'Clubhouses & amenities',state:lots.filter(p=>p.use==='clubhouse').length===brief.clubhouseCount&&sum('amenity')+.01>=brief.amenityArea/SQFT?'pass':'fail',actual:`${lots.filter(p=>p.use==='clubhouse').length}/${brief.clubhouseCount} clubhouses; ${(sum('amenity')*SQFT).toFixed(0)} sq ft amenities`,requirement:`Each clubhouse ${brief.clubhouseArea} sq ft; amenities ${brief.amenityArea} sq ft`,source:'Developer brief; facilities outside OSR'},
 {name:'Public-purpose reserve',state:sum('utility')+.01>=reservation.public?'pass':'fail',actual:`${sum('utility').toFixed(0)} m²`,requirement:`${reservation.public.toFixed(0)} m² baseline`,source:'Rule 47(8); authority allocation/gifting review'},
 {name:'EWS allocation',state:sum('ews')+.01>=reservation.ews?'pass':'fail',actual:`${sum('ews').toFixed(0)} m²`,requirement:`${reservation.ews.toFixed(0)} m² baseline`,source:'Rule 47(9); area-based allocation, eligibility and restrictions need review'},
 {name:'Constraint & lock conflicts',state:conflict?'fail':'pass',actual:conflict?'Protected geometry intersects roads':'No road conflicts',requirement:'Respect locked and protected areas',source:'Geometric calculation'},
 {name:'Plot capacity',state:numbered.length?'pass':'fail',actual:`${numbered.length} plots; ${numbered.filter(p=>p.shape==='irregular').length} irregular`,requirement:'Usable frontage and area; regular plots prioritised',source:'Local quality filters; buildable envelope not certified'},
 {name:'External road access',state:entrances.some(e=>e.width!==null&&e.width<(isTamilNadu(brief.authority)?7:0))?'fail':'review',actual:entrances.some(e=>e.width===null)?'Some external road widths unknown':'Developer-entered widths',requirement:isTamilNadu(brief.authority)?'7.0 m baseline for residential layout access':'Verify local access rules',source:'Rule 47(1)(a), G.O.16/2020; highway/link-road conditions need review'},
 {name:'Direction',state:project.access?.northAngle==null?'review':'pass',actual:project.access?.northAngle==null?'North unknown; plot facing withheld':`North ${project.access.northAngle}° clockwise from screen up`,requirement:'Confirm survey north before directional sales claims',source:'User-specified orientation'},
 {name:'Authority review',state:'review',actual:'Source baseline; not approval-ready',requirement:'Later amendments, splays, dead ends, OSR dimensions, EWS use, highway access and zoning',source:CMDA_BASELINE.caveat},
 ];
 return {roadSchedule,parkDecision:brief.park==='auto'?`Automatic candidate ${parkTrial+1}: park and amenities evaluated together with plots and entrance access.`:`Developer preference: ${brief.park}.`,...(project.access?{access:project.access}:{}),id:String.fromCharCode(65+index),name:names[index],strategy:strategies[index],brief,boundary,roads,reachableRoadPolygons:servedRoadPolygons,accessRoads:routed.added,roadPolygons:roadGeom.map(p=>p.map(r=>ringPoints(r))),roadStyleApplied:island?'Roundabout':'Straight streets',lots,area,residential:sum('residential')+sum('ews'),commercialArea:sum('commercial'),parkArea,roadsArea,publicArea,unallocated,protectedArea,residualPolygons:residual.map(p=>p.map(r=>ringPoints(r))),secondaryRoadWidth:sw,regularCount:numbered.filter(p=>p.shape!=='irregular').length,irregularCount:numbered.filter(p=>p.shape==='irregular').length,landTotal,revenue,infra,cost,profit:revenue-cost,margin:revenue?(revenue-cost)/revenue*100:0,roadLength,earthwork,efficiency:saleable/area*100,maxLand:revenue*(1-(brief.targetMargin+brief.marketing)/100)-infra-brief.fees,checks,spine,entry,entries,networkConnected};
}
export const saleLots=(c:Concept)=>c.lots.filter(p=>['residential','ews','commercial'].includes(p.use));
export function rankConcepts(choices:Concept[],brief:Brief):Concept[]{
 const failures=(c:Concept)=>c.checks.filter(v=>v.state==='fail'&&v.name!=='Selected plot mix').length;
 const quality=(c:Concept)=>saleLots(c).reduce((sum,p)=>sum+p.area*(p.shape==='irregular'?.9:1),0);
 const score=(c:Concept)=>brief.objective==='profit'?c.profit:brief.objective==='infrastructure'?-c.infra:brief.objective==='mix'?-plotMixReport(c).deviation:quality(c);
 return choices.sort((a,b)=>failures(a)-failures(b)||plotMixReport(a).shortfall-plotMixReport(b).shortfall||score(b)-score(a)||quality(b)-quality(a)||a.unallocated-b.unallocated);
}
function bestConcept(project:Project,index:number):Concept{
 const straight=project.brief.roadStyle==='auto'?{...project,brief:{...project.brief,roadStyle:'straight' as const}}:project;
 const seeds=[0,1,2,3].map(trial=>({trial,width:0,concept:makeConcept(straight,index,trial)}));
 const widerMain=Math.min(project.brief.roadMax,Math.max(10,project.brief.road+.5));
 if(index!==2)for(const width of [...new Set([widerMain,project.brief.roadMax])].filter(w=>w>project.brief.road+.001))for(const trial of [0,1])seeds.push({trial,width,concept:makeConcept(straight,index,trial,0,width)});
 const choices=seeds.map(s=>s.concept);
 if(project.brief.park==='auto'){
  // Bounded joint search across park shapes and promising street arrangements,
  // including a wider main street that can unlock narrower secondary streets.
  const finalists=rankConcepts([...choices],project.brief).slice(0,2);
  for(const c of finalists){const seed=seeds.find(s=>s.concept===c)!;for(const parkTrial of [1,2,3])choices.push(makeConcept(straight,index,seed.trial,parkTrial,seed.width));}
 }
 if(project.brief.roadStyle==='auto')choices.push(makeConcept({...project,brief:{...project.brief,roadStyle:'roundabout'}},index,0));
 const result=rankConcepts(choices,project.brief)[0];result.searchCount=choices.length;
 result.strategy=`${objectiveLabels[project.brief.objective||'area']} · best of ${choices.length} tested arrangements; design checks and minimum plot counts take priority.`;
 return result;
}
export function explainMix(c:Concept):Concept{
 const report=plotMixReport(c);return {...c,checks:[...c.checks.filter(v=>v.name!=='Selected plot mix'),{name:'Selected plot mix',state:report.shortfall?'fail':'pass',actual:`${report.shortfall} requested plots missing; ${report.extras.length} adjusted / additional sizes`,requirement:'Minimum counts apply to residential and EWS plots; percentage targets are preferences',source:'Developer brief; full dimensions used, not area alone'}]};
}
export function createConcepts(project:Project):Concept[]{validateBoundary(project.boundary);return [0,1,2,3,4].map(i=>explainMix(applyAreaAllocations(bestConcept(project,i),project.customAreas||[])));}
export function rowSchedule(c:Concept){
 const rows=new Map<string,{id:string;width:number;depth:number;plots:number;repeated:number;adjusted:number}>();
 for(const lot of saleLots(c)){
  if(!lot.rowId||!lot.rowWidth||!lot.rowDepth)continue;
  const key=lot.locked?`locked-${lot.id}`:`${lot.rowId}:${lot.rowWidth}:${lot.rowDepth}`;
  const row=rows.get(key)||{id:key,width:lot.rowWidth/FT,depth:lot.rowDepth/FT,plots:0,repeated:0,adjusted:0};
  row.plots++;if(lot.shape!=='irregular'&&Math.abs(lot.w-lot.rowWidth)<.01&&Math.abs(lot.h-lot.rowDepth)<.01)row.repeated++;else row.adjusted++;
  rows.set(key,row);
 }
 return [...rows.values()];
}
export function parseCoordinates(text:string,kml=false):XY[]{
  if(!kml)return validateBoundary(JSON.parse(text));
  const raw=text.match(/<coordinates[^>]*>([\s\S]*?)<\/coordinates>/i)?.[1];if(!raw)throw Error('No polygon coordinates found in this KML.');
  const coords=raw.trim().split(/\s+/).map(x=>x.split(',').map(Number)),[lon,lat]=coords[0];
  return validateBoundary(coords.map(([x,y])=>({x:(x-lon)*111320*Math.cos(lat*Math.PI/180),y:(lat-y)*111320})));
}
export function applyInstruction(text:string,brief:Brief):{patch:Partial<Brief>;explanation:string}{
  const q=text.toLowerCase(),patch:Partial<Brief>={};
  if(/park/.test(q)){if(/north|northeast/.test(q))patch.park='north';else if(/south/.test(q))patch.park='south';else if(/centr|middle/.test(q))patch.park='central';}
  const size=q.match(/(\d+)\s*[x×]\s*(\d+)/);if(size){patch.frontage=Math.min(60,Math.max(20,Number(size[1])));patch.depth=Math.min(80,Math.max(30,Number(size[2])));patch.plotMix=[{width:patch.frontage,depth:patch.depth,minCount:1,targetPercent:0}];}
  const road=q.match(/(?:road|street).*?(\d+)\s*(m|metre|meter|ft|feet|foot)/)||q.match(/(\d+)\s*(m|metre|meter|ft|feet|foot).*?(?:road|street)/);
  if(road)patch.road=Math.max(6,Math.min(24,Number(road[1])*(/ft|feet|foot/.test(road[2])?FT:1)));
  if(patch.road)patch.roadMax=Math.max(brief.roadMax,patch.road);
  if(/more plots|increase.*plots/.test(q)){patch.frontage=25;patch.depth=40;patch.plotMix=[{width:25,depth:40,minCount:1,targetPercent:0}];}
  if(/commercial|shop/.test(q))patch.commercial=!/remove|no commercial/.test(q);
  const osr=q.match(/(\d+)\s*%.*?(?:park|open space)/);if(osr)patch.parkPercent=Math.min(25,Math.max(5,Number(osr[1])));
  return {patch,explanation:Object.keys(patch).length?'Updated the development brief and regenerated five concepts. Review the geometry and checks before approving.':`Try “move park north”, “use 30x50 plots”, “12 m road”, “add commercial plots”, or “15% open space”. Current road width is ${brief.road} m. Free-form engineering instructions need a planner.`};
}
function validateSavedLot(l:Lot){
 if(typeof l.id!=='string'||!['residential','ews','commercial','park','utility','clubhouse','amenity','infrastructure'].includes(l.use)||!Number.isFinite(l.area)||l.area<=0||!Number.isFinite(l.premium)||!Number.isFinite(l.x)||!Number.isFinite(l.y)||!Number.isFinite(l.w)||!Number.isFinite(l.h)||l.w<=0||l.h<=0)throw Error('Invalid saved plot.');
 if(l.rowId!==undefined&&(typeof l.rowId!=='string'||l.rowId.length>100||!Number.isFinite(l.rowWidth)||!Number.isFinite(l.rowDepth)||l.rowWidth!<=0||l.rowDepth!<=0||typeof l.rowEnd!=='boolean'))throw Error('Invalid row metadata.');
 if(l.discount!==undefined&&(!Number.isFinite(l.discount)||l.discount<0||l.discount>50))throw Error('Invalid plot discount.');
 if(l.holes&&(!Array.isArray(l.holes)||l.holes.some(r=>!Array.isArray(r)||r.length<3||r.length>200||r.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))))throw Error('Invalid allocation holes.');
 if(l.polygon){if(!Array.isArray(l.polygon)||l.polygon.length<3||l.polygon.length>(l.allocationId?500:80)||l.polygon.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<l.x-.001||p.y<l.y-.001||p.x>l.x+l.w+.001||p.y>l.y+l.h+.001))throw Error('Invalid plot polygon.');const merged=booleanGeometry.union(lotGeometry(l));if(merged.length!==1||Math.abs(geometryArea(merged)-l.area)>.01)throw Error('Invalid plot polygon area.');}
 else if(Math.abs(l.w*l.h-l.area)>.01)throw Error('Invalid rectangular plot area.');
}
export function parseProject(text:string):Project{
  const v=JSON.parse(text) as Project;if(v.schema!==2||!v.brief||!Array.isArray(v.exclusions)||!Array.isArray(v.locks)||!Array.isArray(v.referenceNames)||!v.inventory)throw Error('Use a Development Studio v2 backup. Your earlier workspace is preserved separately.');
  if(!Array.isArray(v.boundary))throw Error('Invalid boundary.');
  if(v.boundary.length)v.boundary=validateBoundary(v.boundary);
  else if(v.approved||v.locks.length||v.exclusions.length)throw Error('A saved design needs a boundary.');
  v.brief={...defaultBrief,...v.brief,roadMax:v.brief.roadMax??Math.max(defaultBrief.roadMax,v.brief.road)};const b=v.brief;
  for(const [key,value] of Object.entries(defaultBrief))if(typeof value==='number'&&(!Number.isFinite(b[key as keyof Brief])||Number(b[key as keyof Brief])<0))throw Error('Invalid numeric assumptions.');
  if(!['straight','roundabout','auto'].includes(b.roadStyle)||b.roundaboutDiameter<22||b.roundaboutDiameter>60||typeof b.affordablePlots!=='boolean')throw Error('Invalid street or affordable-plot settings.');
  if(!['area','mix','infrastructure','profit'].includes(b.objective||'area')||typeof b.allowExtraSizes!=='boolean'||typeof b.extendableRoads!=='boolean')throw Error('Invalid optimization settings.');
  if(b.plotMix){if(!Array.isArray(b.plotMix)||!b.plotMix.length||b.plotMix.length>12||b.plotMix.some(s=>!s||![s.width,s.depth,s.minCount,s.targetPercent].every(Number.isFinite)||s.width<20||s.width>60||s.depth<30||s.depth>80||!Number.isInteger(s.minCount)||s.minCount<0||s.minCount>2000||s.targetPercent<0||s.targetPercent>100)||new Set(b.plotMix.map(s=>`${s.width}x${s.depth}`)).size!==b.plotMix.length||b.plotMix.reduce((n,s)=>n+s.targetPercent,0)>100.001)throw Error('Invalid selected plot sizes or targets.');}
  if(v.customAreas){if(!Array.isArray(v.customAreas)||v.customAreas.length>200)throw Error('Invalid area allocations.');for(const a of v.customAreas){if(!a||typeof a.id!=='string'||typeof a.geometryKey!=='string'||!['A','B','C','D','E'].includes(a.conceptId)||!['residential','commercial','infrastructure'].includes(a.use)||typeof a.label!=='string'||!Array.isArray(a.rings)||!a.rings.length||a.rings.length>100||a.rings.some(r=>!Array.isArray(r)||r.length<3||r.length>500||r.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))))throw Error('Invalid area allocation.');const g=ringsGeometry(a.rings),clean=booleanGeometry.union(g);if(clean.length!==1||residualArea(a.rings)<=0||Math.abs(geometryArea(clean)-residualArea(a.rings))>.01)throw Error('Invalid allocation polygon.');}if(new Set(v.customAreas.map(a=>a.id)).size!==v.customAreas.length)throw Error('Duplicate area allocation.');}
  if(b.road<6||b.road>24||b.frontage<20||b.frontage>60||b.depth<30||b.depth>80||b.parkPercent<0||b.parkPercent>25||b.ewsPercent>30||b.marketing>30||b.targetMargin>90||b.slope>30||typeof b.name!=='string'||typeof b.locality!=='string'||!['CMDA','DTCP','Karnataka LPA'].includes(b.authority)||!['auto','north','central','south'].includes(b.park)||b.roadMax<b.road||b.roadMax>24||b.maxOddPercent>30||b.oddDiscount>50||!Number.isInteger(b.clubhouseCount)||b.clubhouseCount>5||b.clubhouseArea>50000||b.amenityArea>100000||!['total','acre','sqft'].includes(b.landBasis)||!['playground','sports','parking'].includes(b.amenityType)||!['beside-park','near-entrance'].includes(b.amenityLocation)||typeof b.allowOdd!=='boolean'||typeof b.mixedRows!=='boolean')throw Error('Unsupported project settings.');
  if(v.exclusions.length>50||v.locks.length>2000||v.referenceNames.length>100||v.referenceNames.some(n=>typeof n!=='string'))throw Error('Project exceeds local planning limits.');
  for(const r of [...v.exclusions,...v.locks])if(['x','y','w','h'].some(k=>!Number.isFinite(r[k as keyof Box]))||r.w<=0||r.h<=0)throw Error('Invalid saved geometry.');
  v.locks.forEach(validateSavedLot);
  if(!v.inventory||typeof v.inventory!=='object'||Object.values(v.inventory).some(status=>!['Available','Held','Sold'].includes(status)))throw Error('Invalid inventory status.');
  if(v.access){const a=v.access;if(!Array.isArray(a.frontages)||!Array.isArray(a.roads)||a.frontages.length>v.boundary.length||a.roads.length>30)throw Error('Invalid road access.');
    if(a.northAngle!=null&&(!Number.isFinite(a.northAngle)||a.northAngle<0||a.northAngle>=360))throw Error('Invalid north direction.');
    const edge=(n:number)=>Number.isInteger(n)&&n>=0&&n<v.boundary.length;
    if(a.frontages.some(f=>!edge(f.edge)||(f.width!==null&&(!Number.isFinite(f.width)||f.width<=0||f.width>100))))throw Error('Invalid frontage.');
    if(a.entrances&&(!Array.isArray(a.entrances)||a.entrances.length>12||new Set(a.entrances.map(e=>e.id)).size!==a.entrances.length||a.entrances.some(e=>typeof e.id!=='string'||!edge(e.edge)||!Number.isFinite(e.t)||e.t<0||e.t>1||(e.width!==null&&(!Number.isFinite(e.width)||e.width<1||e.width>100)))))throw Error('Invalid entrances.');
    if(a.entrances?.some(e=>e.entranceWidth!==undefined&&(!Number.isFinite(e.entranceWidth)||e.entranceWidth<3||e.entranceWidth>30)))throw Error('Invalid entrance opening.');
    if(a.entrance&&(!edge(a.entrance.edge)||!Number.isFinite(a.entrance.t)||a.entrance.t<0||a.entrance.t>1||!a.frontages.some(f=>f.edge===a.entrance!.edge)))throw Error('Invalid entrance.');
    if(a.roads.some(r=>!Array.isArray(r.points)||r.points.length<2||r.points.length>100||!Number.isFinite(r.width)||r.width<=0||r.width>100||r.points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y))))throw Error('Invalid existing road.');
  }
  if(v.approved){
    const a=v.approved,c=a.concept;
    if(!c||!Array.isArray(c.lots)||!Array.isArray(c.roads)||!Array.isArray(c.checks)||!Array.isArray(a.exclusions)||!c.brief||!Array.isArray(c.boundary)||!Number.isFinite(a.number)||!Number.isFinite(Date.parse(a.date)))throw Error('Invalid concept snapshot.');
    validateBoundary(c.boundary);c.lots.forEach(validateSavedLot);
    if(c.lots.length>5000||c.roads.length>1000||c.checks.some(check=>!check||!['pass','review','fail'].includes(check.state)||typeof check.name!=='string'))throw Error('Invalid snapshot schedule.');
    for(const r of [...c.lots,...c.roads,...a.exclusions])if(!r||['x','y','w','h'].some(k=>!Number.isFinite(r[k as keyof Box]))||r.w<=0||r.h<=0)throw Error('Invalid snapshot geometry.');
    for(const key of ['area','efficiency','revenue','cost','profit','margin','infra','residential','commercialArea','parkArea','publicArea','unallocated','roadsArea','roadLength','earthwork','maxLand','spine'] as const)if(!Number.isFinite(c[key]))throw Error('Invalid snapshot metrics.');
    if(c.lots.some(l=>typeof l.id!=='string'||!['residential','ews','commercial','park','utility','clubhouse','amenity','infrastructure'].includes(l.use)||!Number.isFinite(l.area)||!Number.isFinite(l.premium))||!Number.isFinite(c.brief.price))throw Error('Invalid frozen inventory.');
  }
  return {...v,selected:Math.max(0,Math.min(4,v.selected||0))};
}

export type TargetSolution={project:Project;concept:Concept;unmet:string[]};
export function targetGaps(c:Concept,target:Brief):string[]{return [saleLots(c).length<target.minPlots?'Plot count':'',c.revenue<target.revenueTarget?'Revenue':'',c.infra>target.infraCap?'Infrastructure budget':'',c.margin<target.targetMargin?'Margin':'',c.checks.some(v=>v.state==='fail')?'Design checks':''].filter(Boolean);}
export function solveTargetsV2(project:Project):TargetSolution[]{
 const candidates:TargetSolution[]=[];
 for(const {width:frontage,depth} of selectedPlotSizes(project.brief))for(const road of [...new Set([project.brief.road,(project.brief.road+project.brief.roadMax)/2,project.brief.roadMax])])for(const park of [project.brief.park]){
  const candidate={...project,selected:0,brief:{...project.brief,frontage,depth,road,park}};
  const concept=explainMix(applyAreaAllocations(bestConcept(candidate,0),candidate.customAreas||[]));candidates.push({project:candidate,concept,unmet:targetGaps(concept,project.brief)});
 }
 const seen=new Set<string>();
 return candidates.sort((a,b)=>a.unmet.length-b.unmet.length||b.concept.profit-a.concept.profit).filter(c=>{const key=JSON.stringify(c.concept.lots);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,6);
}

/** Uniform scaling preserves the traced shape while matching the declared gross parcel area. */
export function boundaryFromArea(points:XY[],area:number,unit:'sqft'|'acres'|'sqm'):XY[]{
 const factors={sqft:1/SQFT,acres:4046.8564224,sqm:1};
 const target=area*factors[unit],source=polygonArea(points);
 if(!Number.isFinite(target)||target<1600||target>200000)throw Error('Enter a total land area between 17,223 sq ft (0.40 acres) and 49.42 acres.');
 if(points.length<3||!Number.isFinite(source)||source<.01)throw Error('Mark at least three corners around your land.');
 const scale=Math.sqrt(target/source),x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y));
 return validateBoundary(points.map(p=>({x:(p.x-x)*scale,y:(p.y-y)*scale})));
}

/** A geometry signature keeps manual allocations attached to the layout they were reviewed on. */
export function conceptGeometryKey(c:Concept):string{
 const raw=JSON.stringify([c.boundary,c.roadPolygons||c.roads,c.lots.filter(l=>!l.allocationId).map(l=>[l.id,l.use,lotPoints(l),l.holes])]);
 let hash=2166136261;for(let i=0;i<raw.length;i++)hash=Math.imul(hash^raw.charCodeAt(i),16777619);
 return `${raw.length}-${hash>>>0}`;
}
const ringsGeometry=(rings:XY[][]):pc.Polygon=>rings.map(r=>geom(r)[0]);
export const residualArea=(rings:XY[][])=>geometryArea([ringsGeometry(rings)]);
function sharedRoadFrontage(points:XY[],roads:XY[][][]):number{
 let longest=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],length=Math.hypot(b.x-a.x,b.y-a.y);if(length<.001)continue;
  const dx=(b.x-a.x)/length,dy=(b.y-a.y)/length,intervals:number[][]=[];
  for(const polygon of roads)for(const ring of polygon)for(let j=0;j<ring.length;j++){
   const p=ring[j],q=ring[(j+1)%ring.length];
   if(Math.abs((p.x-a.x)*dy-(p.y-a.y)*dx)>.00003||Math.abs((q.x-a.x)*dy-(q.y-a.y)*dx)>.00003)continue;
   const u=(p.x-a.x)*dx+(p.y-a.y)*dy,v=(q.x-a.x)*dx+(q.y-a.y)*dy,lo=Math.max(0,Math.min(u,v)),hi=Math.min(length,Math.max(u,v));if(hi>lo)intervals.push([lo,hi]);
  }
  intervals.sort((a,b)=>a[0]-b[0]);let start=0,end=-Infinity;
  for(const [lo,hi] of intervals){if(lo>end+.00003){start=lo;end=hi;}else end=Math.max(end,hi);longest=Math.max(longest,end-start);}
 }
 return longest;
}
/** Cheap diagnostic bounds, not a claim that every remaining pocket is unbuildable. */
export function residualReview(c:Concept){
 const groups=new Map<string,{reason:string;area:number;pockets:number}>(),sizes=selectedPlotSizes(c.brief);
 for(const rings of c.residualPolygons||[]){if(!rings[0]?.length)continue;const area=residualArea(rings),r=bounds(rings[0]);
  const reason=area<(c.brief.affordablePlots?600/SQFT:72)-.001?'Below the minimum plot area':Math.min(r.w,r.h)<6?'Too narrow for the plot-width filter':sharedRoadFrontage(rings[0],c.reachableRoadPolygons||[])<5.99?'Less than 6 m of entrance-connected road frontage':rings.length>1?'Contains an enclosed reserved area':c.brief.allowExtraSizes===false&&!sizes.some(s=>s.width*FT<=r.w+.025&&s.depth*FT<=r.h+.025)?'Selected dimensions exceed the available bounds':'Unresolved by the packing search — review shape, alignment or another size';
  const group=groups.get(reason)||{reason,area:0,pockets:0};group.area+=area;group.pockets++;groups.set(reason,group);
 }
 return [...groups.values()];
}
export function allocationEligibility(c:Concept,rings:XY[][],use:AreaAllocation['use']):string|null{
 if(!rings.length||residualArea(rings)<.1)return 'This pocket is too small to allocate.';
 const polygon=ringsGeometry(rings),remaining=(c.residualPolygons||[]).map(ringsGeometry);
 if(!remaining.length||geometryArea(booleanGeometry.difference(polygon,remaining))>.01)return 'This area is no longer free. Select a current grey pocket.';
 if(use==='infrastructure')return null;
 if(rings.length!==1)return 'This pocket surrounds another use. It needs subdivision before it can become a saleable plot.';
 const area=residualArea(rings),r=bounds(rings[0]),regular=Math.abs(r.w*r.h-area)<.01;
 if(area<72)return 'Below the 72 m² general-plot baseline. Keep it as a service area or redesign the row.';
 if(area>2400/SQFT+1)return 'Larger than 2,400 sq ft. This pocket needs subdivision into road-served plots.';
 if(sharedRoadFrontage(rings[0],c.reachableRoadPolygons||c.roadPolygons||c.roads.map(r=>[corners(r)]))<5.99)return 'Needs at least 6 m frontage on a road with a continuous route to an entrance.';
 if(r.w<6||r.h<6||Math.max(r.w/r.h,r.h/r.w)>3||area/(r.w*r.h)<.72)return 'Too narrow or irregular for the current plot-quality limits.';
 const perimeter=rings[0].reduce((sum,a,i)=>{const b=rings[0][(i+1)%rings[0].length];return sum+Math.hypot(a.x-b.x,a.y-b.y);},0);
 if(!regular&&(4*Math.PI*area/(perimeter*perimeter)<.5||![0,.5,1].some(x=>[0,.5,1].some(y=>geometryArea(booleanGeometry.intersection(polygon,boxGeom({x:r.x+(r.w-6)*x,y:r.y+(r.h-8)*y,w:6,h:8})))>=47.999))))return 'The shape does not contain a usable building envelope.';
 const sales=saleLots(c),odd=sales.filter(l=>l.shape==='irregular').length;
 if(!regular&&(!c.brief.allowOdd||(odd+1)/(sales.length+1)*100>c.brief.maxOddPercent+.001))return 'This would exceed your irregular-plot allowance. Change the brief first.';
 return null;
}
export function applyAreaAllocations(base:Concept,allocations:AreaAllocation[]):Concept{
 const c:Concept={...base,geometryKey:conceptGeometryKey(base),lots:[...base.lots],checks:[...base.checks]};
 const relevant=allocations.filter(a=>a.conceptId===c.id);let skipped=0,added=0;
 for(const a of relevant){
  if(a.geometryKey!==c.geometryKey||allocationEligibility(c,a.rings,a.use)){skipped++;continue;}
  const lot=makeLot(a.rings[0],a.use,a.label);lot.holes=a.rings.slice(1);lot.area=residualArea(a.rings);lot.id=`M-${a.id}`;lot.allocationId=a.id;if(a.use!=='infrastructure')lot.exitAccess=true;
  lot.shape=Math.abs(lot.w*lot.h-lot.area)<.01?'regular':'irregular';lot.discount=lot.shape==='irregular'?c.brief.oddDiscount:0;lot.frontage=sharedRoadFrontage(a.rings[0],c.roadPolygons||[]);
  c.lots.push(lot);added++;
  const remaining=booleanGeometry.difference((c.residualPolygons||[]).map(ringsGeometry),ringsGeometry(a.rings));c.residualPolygons=remaining.map(p=>p.map(ringPoints));c.unallocated=geometryArea(remaining);
  if(a.use==='infrastructure'){c.publicArea+=lot.area;c.infra+=lot.area*10000;}
  else if(a.use==='commercial')c.commercialArea+=lot.area;else c.residential+=lot.area;
 }
 const sales=saleLots(c);c.regularCount=sales.filter(l=>l.shape!=='irregular').length;c.irregularCount=sales.length-c.regularCount;
 c.efficiency=(c.residential+c.commercialArea)/c.area*100;c.revenue=sales.reduce((sum,l)=>sum+plotValue(l,c.brief),0);c.cost=(c.landTotal??landCost(c.brief,c.area))+c.infra+c.brief.fees+c.revenue*c.brief.marketing/100;c.profit=c.revenue-c.cost;c.margin=c.revenue?c.profit/c.revenue*100:0;c.maxLand=c.revenue*(1-(c.brief.targetMargin+c.brief.marketing)/100)-c.infra-c.brief.fees;
 if(added)c.checks.push({name:'Manually assigned areas',state:'review',actual:`${added} area(s) assigned; service areas carry a ₹10,000/m² placeholder allowance`,requirement:'Verify land use, access, electrical clearances and actual facility cost. Service areas do not count as statutory OSR.',source:'Developer allocation; not a sanctioned utility or transformer design'});
 if(skipped)c.checks.push({name:'Assignments need reconfirmation',state:'review',actual:`${skipped} saved assignment(s) inactive after layout changes`,requirement:'Select a new grey pocket or remove the old assignment. Inactive assignments have no area or revenue.',source:'Geometry changed or current plot-quality limits reject assignment'});
 c.checks=c.checks.map(check=>check.name==='Plot route to exit'?{...check,actual:`${sales.filter(p=>p.exitAccess).length}/${sales.length} plots connected to an entrance`}:check.name==='Plot capacity'?{...check,actual:`${sales.length} plots; ${c.irregularCount} irregular`}:check);
 return c;
}
