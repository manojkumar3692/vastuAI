import {useEffect,useState} from 'react';
import {defaultBrief,landCost,plotValue,saleLots,type Brief,type Concept,type Project,type TargetSolution} from './planning';
// These settings change labels or arithmetic, not subdivision geometry.
const financialKeys=['name','locality','landBasis','land','price','roadRate','fees','marketing','targetMargin','minPlots','revenueTarget','infraCap','slope','earthRate'] as const;
export function geometryInput(project:Project):Project{
 const brief={...project.brief};for(const key of financialKeys){const influencesRanking=(brief.objective==='profit'||brief.objective==='infrastructure')&&['landBasis','land','price','roadRate','fees','marketing','slope','earthRate'].includes(key);if(!influencesRanking)Object.assign(brief,{[key]:defaultBrief[key]});}
 return {schema:2,boundary:project.boundary,brief,access:project.access,exclusions:project.exclusions,locks:project.locks,customAreas:project.customAreas,approved:null,inventory:{},selected:0,referenceNames:[]};
}
export function repriceConcept(c:Concept,input:Brief):Concept{
 const brief={...c.brief};for(const key of financialKeys)Object.assign(brief,{[key]:input[key]});
 const earthwork=c.area*brief.slope/100*.35,infra=c.roadsArea*brief.roadRate+c.roadLength*5800+Math.ceil(c.roadLength/30)*35000+c.parkArea*650+c.publicArea*10000+earthwork*brief.earthRate;
 const revenue=saleLots(c).reduce((sum,p)=>sum+plotValue(p,brief),0),landTotal=landCost(brief,c.area),cost=landTotal+infra+brief.fees+revenue*brief.marketing/100;
 return {...c,brief,earthwork,infra,revenue,landTotal,cost,profit:revenue-cost,margin:revenue?(revenue-cost)/revenue*100:0,maxLand:revenue*(1-(brief.targetMargin+brief.marketing)/100)-infra-brief.fees};
}
export function planningJob<T extends Concept[]|TargetSolution[]>(project:Project,mode:'layouts'|'targets',signal:AbortSignal):Promise<T>{
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./planning.worker.ts',import.meta.url),{type:'module'});
  const finish=()=>{worker.terminate();signal.removeEventListener('abort',abort);};
  const abort=()=>{finish();reject(new DOMException('Calculation superseded','AbortError'));};
  signal.addEventListener('abort',abort,{once:true});if(signal.aborted){abort();return;}
  worker.onmessage=event=>{finish();if(event.data.error)reject(new Error(event.data.error));else resolve(event.data.result as T);};
  worker.onerror=()=>{finish();reject(new Error('The background planner could not start. Reload the page and try again.'));};
  worker.postMessage({project,mode});
 });
}
export function useLayoutCalculation(project:Project){
 const [revision,setRevision]=useState(0);
 const key=JSON.stringify({version:4,revision,input:geometryInput(project)}),hasBoundary=project.boundary.length>0;
 const [completed,setCompleted]=useState<{key:string;concepts:Concept[];error:string}>({key:'',concepts:[],error:''});
 useEffect(()=>{
  if(!hasBoundary)return;
  const controller=new AbortController();
  const timer=setTimeout(()=>{void planningJob<Concept[]>(JSON.parse(key).input,'layouts',controller.signal).then(concepts=>{if(!controller.signal.aborted)setCompleted({key,concepts,error:''});}).catch(error=>{if(!controller.signal.aborted)setCompleted({key,concepts:[],error:error.message});});},300);
  return()=>{clearTimeout(timer);controller.abort();};
 },[key,hasBoundary]);
 return {regenerate:()=>setRevision(v=>v+1),concepts:hasBoundary?completed.concepts:[],error:completed.key===key?completed.error:'',pending:hasBoundary&&completed.key!==key};
}
