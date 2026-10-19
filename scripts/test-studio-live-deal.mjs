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
const js=ts.transpileModule(source+"\nexport {roadReachability,connectStreetNetwork};",{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const P=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const clip=require('polyclip-ts');clip.setPrecision(1e-8);


const planningURL='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
async function moduleAt(name){const source=readFileSync(new URL('../src/components/developer-studio/'+name,import.meta.url),'utf8').replace("'./planning'",JSON.stringify(planningURL)).replace("'polygon-clipping'",JSON.stringify(pathToFileURL(require.resolve('polygon-clipping')).href));return import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));}
const S=await moduleAt('site-intelligence.ts'),D=await moduleAt('deal-model.ts');
const p={...P.freshProject(),boundary:[{x:0,y:0},{x:120,y:0},{x:120,y:100},{x:0,y:100}],exclusions:[{id:'water',label:'Channel',type:'water',x:20,y:20,w:30,h:30,confirmed:true},{id:'reserved',label:'Reserve',type:'reserved',x:30,y:30,w:30,h:30,confirmed:true},{id:'unknown',label:'Verify',type:'uncertain',x:0,y:0,w:25,h:25,confirmed:false}]};
const a=S.analyzeSite(p);assert.equal(a.gross,12000);assert.deepEqual(a.areas,{buildable:10000,restricted:875,reserved:500,uncertain:625});
const keys=Object.keys(a.geometry);for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)assert.ok(P.geometryArea(clip.intersection(a.geometry[keys[i]],a.geometry[keys[j]]))<.001,'land classes must not overlap');
assert.equal(S.analyzeSite({...p,exclusions:[{id:'edge',label:'Edge',type:'water',x:115,y:90,w:10,h:20,confirmed:true}]}).areas.restricted,50,'clip constraints to the parcel');
assert.equal(S.classifyConstraint({...p.exclusions[0],confirmed:false}),'uncertain');
assert.equal(S.classifyConstraint({...p.exclusions[0],confirmed:undefined}),'uncertain');
const roadSite={...p,access:P.withEntrances(P.emptyAccess(),[{id:'one',edge:3,t:.5,width:null,entranceWidth:9}])};assert.equal(S.analyzeSite(roadSite).frontages[3].classification,'Road-facing (from entrance)');assert.equal(S.analyzeSite(roadSite).frontages[1].classification,'Road frontage unconfirmed');
console.log('PASS classification precedence, overlap accounting, parcel clipping, evidence and entrance-derived frontage');
assert.equal(D.parseAssumptionsCSV(D.assumptionsTemplate).price,3500);
for(const csv of ['assumption,value\nconstructor,1','assumption,value\nprice,=SUM(A1)','assumption,value\nprice,3\nprice,5','assumption,value\nmarketing,31','assumption,value\nlandBasis,hectare'])assert.throws(()=>D.parseAssumptionsCSV(csv));
console.log('PASS Excel-compatible CSV assumptions and malformed/formula/duplicate input rejection');
const project={...p,brief:{...p.brief,park:'central',spinePosition:.3}};
const first=P.createConcepts(project)[0];assert.ok(Math.abs(first.spine-36)<.0001);for(const lot of P.saleLots(first))for(const zone of p.exclusions)assert.ok(P.geometryArea(clip.intersection(P.lotGeometry(lot),[P.corners(zone).map(q=>[q.x,q.y])]))<.01,'constraints exclude plots');
const moved=P.createConcepts({...project,brief:{...project.brief,spinePosition:.65}})[0];assert.ok(Math.abs(moved.spine-78)<.0001);assert.notDeepEqual(first.lots,moved.lots,'road move repacks geometry');
for(const c of [first,moved]){const metrics=D.dealMetrics(c);assert.equal(metrics.plots,P.saleLots(c).length);assert.ok(Math.abs(metrics.revenue-P.saleLots(c).reduce((n,l)=>n+P.plotValue(l,c.brief),0))<.001);assert.ok(Math.abs(metrics.profit-(c.revenue-c.cost))<.001);assert.ok(Math.abs(metrics.maxLand-(c.revenue*(1-(c.brief.targetMargin+c.brief.marketing)/100)-c.infra-c.brief.fees))<.001);assert.ok(Math.abs(c.area-c.residential-c.commercialArea-c.parkArea-c.publicArea-c.roadsArea-c.unallocated-(c.protectedArea||0))<.01);}
const saved={...project,dealBaseline:{date:new Date().toISOString(),conceptId:first.id,metrics:D.dealMetrics(first)}};assert.deepEqual(P.parseProject(JSON.stringify(saved)).dealBaseline,saved.dealBaseline);assert.throws(()=>P.parseProject(JSON.stringify({...project,brief:{...project.brief,spinePosition:2}})));assert.throws(()=>P.parseProject(JSON.stringify({...project,exclusions:[{...p.exclusions[0],type:'invalid'}]})));
console.log('PASS road repositioning, excluded plots, synchronized deal identities, pinned comparisons and backup validation');
