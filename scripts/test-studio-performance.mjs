import ts from 'typescript';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const regulationsSource=readFileSync(new URL('../src/components/developer-studio/regulations.ts',import.meta.url),'utf8');
const regulationsJS=ts.transpileModule(regulationsSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const regulationsURL='data:text/javascript;base64,'+Buffer.from(regulationsJS).toString('base64');
const source=readFileSync(new URL('../src/components/developer-studio/planning.ts',import.meta.url),'utf8').replace('import * as pc','import pc').replace("'polygon-clipping'",JSON.stringify(pathToFileURL(require.resolve('polygon-clipping')).href)).replace("'./regulations'",JSON.stringify(regulationsURL)).replace("'polyclip-ts'",JSON.stringify(pathToFileURL(require.resolve('polyclip-ts')).href));
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const P=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const clip=require('polyclip-ts');clip.setPrecision(1e-8);

const planningURL='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
const clientSource=readFileSync(new URL('../src/components/developer-studio/planning-client.ts',import.meta.url),'utf8').replace("'./planning'",JSON.stringify(planningURL)).replace("'react'",JSON.stringify(pathToFileURL(require.resolve('react')).href)).replace("new URL('./planning.worker.ts',import.meta.url)","'worker-test'");
const clientJS=ts.transpileModule(clientSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const C=await import('data:text/javascript;base64,'+Buffer.from(clientJS).toString('base64'));
const project=P.freshProject();
const changed={...project,brief:{...project.brief,name:'Typing test',locality:'Local',price:4200,landBasis:'acre',land:5000000,fees:2000000,marketing:4,roadRate:3100,slope:3,earthRate:450,targetMargin:30,minPlots:10,revenueTarget:100000,infraCap:80000000}};
assert.deepEqual(C.geometryInput(project),C.geometryInput(changed),'financial and identity edits must not start geometry work');
assert.notDeepEqual(C.geometryInput(project),C.geometryInput({...project,brief:{...project.brief,frontage:25}}));
for(const objective of ['profit','infrastructure']){
 const input={...project,brief:{...project.brief,objective}};
 assert.notDeepEqual(C.geometryInput(input),C.geometryInput({...input,brief:{...input.brief,roadRate:9999}}),'cost objective must re-optimize when costs change');
 assert.deepEqual(C.geometryInput(input),C.geometryInput({...input,brief:{...input.brief,name:'New label'}}),'identity must remain cheap');
}
console.log('PASS cost objectives invalidate geometry decisions; names remain cheap');
const baseline=P.createConcepts(C.geometryInput(project)),expected=P.createConcepts(changed);
assert.deepEqual(baseline.map(c=>C.repriceConcept(c,changed.brief)),expected,'cheap financial path must match full generation');
console.log('PASS no geometry work for name, price, costs or targets; exact financial parity across all five concepts');
const pocket=baseline[0].residualPolygons.find(r=>P.residualArea(r)>.1);
const allocation={id:'perf',conceptId:'A',geometryKey:baseline[0].geometryKey,rings:pocket,use:'infrastructure',label:'Utility area'};
const assigned=P.applyAreaAllocations(baseline[0],[allocation]);
const repriced=C.repriceConcept(assigned,changed.brief),direct=P.applyAreaAllocations(expected[0],[allocation]);for(const key of ['infra','cost','profit','margin','maxLand','revenue'])assert.ok(Math.abs(repriced[key]-direct[key])<.000001,`financial parity: ${key}`);
assert.deepEqual({...repriced,infra:direct.infra,cost:direct.cost,profit:direct.profit,margin:direct.margin,maxLand:direct.maxLand,revenue:direct.revenue},direct);
console.log('PASS manual area cost parity');
const originalWorker=globalThis.Worker,workers=[];
class FakeWorker {constructor(){workers.push(this);}postMessage(message){this.message=message;}terminate(){this.terminated=true;}}
globalThis.Worker=FakeWorker;
try{
 const a=new AbortController(),b=new AbortController();
 const old=C.planningJob(project,'layouts',a.signal);const rejected=assert.rejects(old,{name:'AbortError'});a.abort();await rejected;assert.equal(workers[0].terminated,true);
 const latest=C.planningJob(changed,'layouts',b.signal);workers[1].onmessage({data:{result:expected}});assert.deepEqual(await latest,expected);assert.equal(workers[1].terminated,true);
 const fail=C.planningJob(project,'layouts',new AbortController().signal);const failure=assert.rejects(fail,/background planner/);workers[2].onerror();await failure;assert.equal(workers[2].terminated,true);
 console.log('PASS superseded worker cancellation, latest result delivery and worker failure cleanup');
}finally{globalThis.Worker=originalWorker;}
