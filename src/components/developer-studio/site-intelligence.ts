import pc from 'polygon-clipping';
import {corners,polygonArea,siteEntrances,type XY,type Project,type Exclusion} from './planning';
export type LandClass='buildable'|'restricted'|'reserved'|'uncertain';
export const landClasses:Record<LandClass,{label:string;color:string}>={buildable:{label:'Potentially buildable',color:'#cfdfc9'},restricted:{label:'Restricted',color:'#d8a8a0'},reserved:{label:'Reserved',color:'#bfcde0'},uncertain:{label:'Uncertain',color:'#eed5a0'}};
export const constraintTypes:Record<Exclusion['type'],string>={water:'Water body / channel','no-build':'No-build / easement',structure:'Existing structure','ht-line':'HT line corridor',setback:'Setback / buffer',reserved:'Reserved land',uncertain:'Unverified condition'};
const geom=(points:XY[]):pc.Polygon=>[points.map(p=>[p.x,p.y] as pc.Pair)];
const area=(g:pc.MultiPolygon)=>g.reduce((n,p)=>n+p.reduce((s,r,i)=>s+(i?-1:1)*polygonArea(r.map(([x,y])=>({x,y}))),0),0);
export const classifyConstraint=(z:Exclusion):Exclude<LandClass,'buildable'>=>z.type==='uncertain'||z.confirmed!==true?'uncertain':z.type==='reserved'?'reserved':'restricted';
/** Mutually exclusive classes clipped to the parcel. Uncertainty takes precedence. */
export function analyzeSite(project:Project){
 const empty=()=>({buildable:[] as pc.MultiPolygon,restricted:[] as pc.MultiPolygon,reserved:[] as pc.MultiPolygon,uncertain:[] as pc.MultiPolygon});
 const geometry=empty();if(project.boundary.length<3)return {geometry,areas:{buildable:0,restricted:0,reserved:0,uncertain:0},gross:0,frontages:[]};
 const parcel=geom(project.boundary);let free:pc.MultiPolygon=[parcel];
 for(const key of ['uncertain','restricted','reserved'] as const){const zones=project.exclusions.filter(z=>classifyConstraint(z)===key).map(z=>geom(corners(z)));if(!zones.length)continue;const merged=pc.union(zones[0],...zones.slice(1));geometry[key]=pc.intersection(free,merged);free=pc.difference(free,merged);}
 geometry.buildable=free;
 const entrances=siteEntrances(project.access);
 return {geometry,areas:Object.fromEntries(Object.entries(geometry).map(([k,g])=>[k,area(g)])) as Record<LandClass,number>,gross:polygonArea(project.boundary),frontages:project.boundary.map((a,i)=>{const b=project.boundary[(i+1)%project.boundary.length],entries=entrances.filter(e=>e.edge===i);return {edge:i,length:Math.hypot(b.x-a.x,b.y-a.y),entries,classification:entries.length?'Road-facing (from entrance)':'Road frontage unconfirmed'};})};
}
export type SiteIntelligenceProvider={id:string;analyze:(project:Project,signal:AbortSignal)=>Promise<{constraints:Exclusion[];source:string;requiresReview:true}>};
