import {createConcepts,solveTargetsV2,type Project} from './planning';
self.onmessage=(event:MessageEvent<{project:Project;mode:'layouts'|'targets'}>)=>{
 try{self.postMessage({result:event.data.mode==='targets'?solveTargetsV2(event.data.project):createConcepts(event.data.project)});}
 catch(error){self.postMessage({error:error instanceof Error?error.message:'Layout calculation failed.'});}
};
