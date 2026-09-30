import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/components/developer-studio/engine.ts',import.meta.url),'utf8');
const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const E = await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
let count=0; const test=(name,fn)=>{fn();count++;console.log('PASS',name);};
test('area and geometry reconcile across dimensions, mixes and access configurations',()=>{
 for(const w of [40,70,112,180]) for(const h of [40,80,116,220]) for(const mix of [0,1,2,3]) for(const park of ['north','south']) for(const secondEntry of [false,true]) {
 const b=[{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
 for(const a of E.generate({...E.defaults,mix,park,secondEntry},b,[])){
 assert.ok(a.residual>=-.01,`negative residual ${w} ${h}`);
 assert.ok(Math.abs(a.saleable+a.roadArea+a.parkArea+a.amenity.w*a.amenity.h+a.utility.w*a.utility.h+a.residual-a.area)<.01);
 for(const p of a.plots){ assert.ok(p.x>=0&&p.y>=0&&p.x+p.w<=w+.01&&p.y+p.h<=h+.01); for(const r of [...a.roads,a.park,a.amenity,a.utility])assert.equal(E.overlaps(p,r),false); for(const q of a.plots)if(p.id!==q.id)assert.equal(E.overlaps(p,q),false); }
 for(let j=0;j<a.roads.length;j++)for(let k=j+1;k<a.roads.length;k++)assert.equal(E.overlaps(a.roads[j],a.roads[k]),false,'roads overlap');
 assert.ok(Number.isFinite(a.margin));
 }
 }
});
test('scenario mixes are distinct',()=>{const a=E.generate(E.defaults,E.sampleBoundary,[]);assert.equal(new Set(a.map(x=>x.plots[0]?.area)).size,3);});
test('exclusions remove plots and flag road conflicts',()=>{const z=[{id:'1',x:50,y:40,w:15,h:15,kind:'constraint',locked:true}];for(const a of E.generate(E.defaults,E.sampleBoundary,z)){assert.ok(a.plots.every(p=>!E.overlaps(p,z[0])));assert.equal(a.checks.find(c=>c.label==='Constraint conflicts').status,'fail');}});
test('irregular parcel never generates a misleading rectangular subdivision',()=>{assert.equal(E.generate(E.defaults,[{x:0,y:0},{x:100,y:0},{x:40,y:100}],[]).length,0);});
test('financial identities and target land budget',()=>{for(const a of E.generate(E.defaults,E.sampleBoundary,[])){assert.ok(Math.abs(a.profit-(a.revenue-a.cost))<.001);const c=E.generate({...E.defaults,land:a.maxLand},E.sampleBoundary,[]).find(x=>x.id===a.id);assert.ok(Math.abs(c.margin-E.defaults.targetMargin)<.001);}});
test('zero price has finite metrics',()=>{for(const a of E.generate({...E.defaults,price:0},E.sampleBoundary,[]))assert.equal(a.margin,0);});
test('command parser handles supported commands and unknown prompts honestly',()=>{assert.deepEqual(E.demoPromptProvider.edit('move park south and widen road to 12 m',E.defaults).patch,{park:'south',road:12});assert.deepEqual(E.demoPromptProvider.edit('build a bridge',E.defaults).patch,{});});
test('boundary import validates and normalizes',()=>{assert.throws(()=>E.parseBoundary('[]','json'));assert.throws(()=>E.parseBoundary('[{"x":null,"y":0}]','json'));assert.equal(E.areaOf(E.parseBoundary(JSON.stringify(E.sampleBoundary),'json')),12992);});
test('solver results obey target ranking and regenerate identically',()=>{const results=E.solveTargets({...E.defaults,minPlots:20,targetRevenue:0,targetMargin:0,land:0},E.sampleBoundary,[]);assert.ok(results.length>0);assert.ok(results[0].feasible);for(const r of results){assert.deepEqual(E.generate(r.settings,E.sampleBoundary,[]).find(a=>a.id===r.scheme.id),r.scheme);}});
test('mixed target produces multiple actual plot sizes',()=>{const a=E.generate({...E.defaults,mix:3},E.sampleBoundary,[])[0];assert.ok(new Set(a.plots.map(p=>p.area)).size>1);});
test('oversize parcels are retained for review but not rendered as excessive local geometry',()=>assert.equal(E.generate(E.defaults,[{x:0,y:0},{x:1000,y:0},{x:1000,y:1000},{x:0,y:1000}],[]).length,0));
const dxfsrc=readFileSync(new URL('../src/components/developer-studio/exports.ts',import.meta.url),'utf8');
const dxfjs=ts.transpileModule(dxfsrc,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {toDXF}=await import('data:text/javascript;base64,'+Buffer.from(dxfjs).toString('base64'));
test('DXF contains boundary, roads, facilities and numbered plot layers in metres',()=>{const output=toDXF(E.generate(E.defaults,E.sampleBoundary,[])[0],E.sampleBoundary,[]);for(const layer of ['BOUNDARY','ROADS','PARK','AMENITY','UTILITIES','PLOT_NUMBERS','P001'])assert.ok(output.includes(layer));assert.ok(output.includes('$INSUNITS\n70\n6'));assert.ok(output.endsWith('0\nEOF\n'));});
const storageSrc=readFileSync(new URL('../src/components/developer-studio/storage.ts',import.meta.url),'utf8');
const engineUrl='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
const storageJs=ts.transpileModule(storageSrc,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText.replace(/from ['"]\.\/engine['"]/, 'from '+JSON.stringify(engineUrl));
const {readProject}=await import('data:text/javascript;base64,'+Buffer.from(storageJs).toString('base64'));
test('backup restore round-trips and rejects invalid assumptions',()=>{const project={settings:E.defaults,boundary:E.sampleBoundary,zones:[],selected:0,locks:[],inventory:{},approval:null,files:[]};assert.deepEqual(readProject(JSON.stringify(project)),project);assert.throws(()=>readProject(JSON.stringify({...project,settings:{...E.defaults,mix:99}})));assert.throws(()=>readProject(JSON.stringify({...project,inventory:{P001:'arbitrary'}})));});
console.log(`${count} test groups passed`);
