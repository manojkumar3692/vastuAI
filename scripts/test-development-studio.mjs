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
const project=P.freshProject();
const conceptFor=p=>P.createConcepts(p)[0];
for(const c of P.createConcepts(project))console.log(c.id,P.saleLots(c).length,c.efficiency,c.roadsArea,c.unallocated,c.checks.filter(x=>x.state==='fail'));
let runs=0;
for(const boundary of [P.demoBoundary,[{x:0,y:0},{x:110,y:0},{x:110,y:130},{x:0,y:130}],[{x:0,y:0},{x:140,y:0},{x:140,y:70},{x:90,y:70},{x:90,y:150},{x:0,y:150}],[{x:0,y:0},{x:50,y:0},{x:50,y:60},{x:0,y:60}]])for(const road of [6,9,12,18])for(const park of ['north','central','south']){
 const p={...project,boundary,brief:{...project.brief,road,park}};
 for(const c of P.createConcepts(p)){
   
   for(const lot of c.lots){assert.ok(Math.abs(P.geometryArea(clip.intersection([P.lotPoints(lot).map(p=>[p.x,p.y])],[c.boundary.map(p=>[p.x,p.y])]))-lot.area)<.01,'plot containment');assert.ok(P.geometryArea(clip.intersection(P.lotGeometry(lot),c.roadPolygons.map(p=>p.map(r=>r.map(q=>[q.x,q.y])))))<.01,'plot/actual-road overlap');}
   for(let i=0;i<c.lots.length;i++)for(let j=i+1;j<c.lots.length;j++)assert.equal(P.lotOverlap(c.lots[i],c.lots[j]),false,'lot overlap');
   assert.ok(c.unallocated>=-.01,'negative leftover');
   const sum=c.residential+c.commercialArea+c.parkArea+c.publicArea+c.roadsArea+c.unallocated+(c.protectedArea||0);
   assert.ok(Math.abs(sum-c.area)<.01,'area conservation');
   assert.ok(Number.isFinite(c.margin));runs++;
 }
}
console.log('PASS',runs,'geometry and area cases');
assert.throws(()=>P.validateBoundary([{x:0,y:0},{x:100,y:100},{x:0,y:100},{x:100,y:0}]));
assert.deepEqual(P.parseProject(JSON.stringify(project)),project);
console.log('PASS project roundtrip and crossing boundary rejection');

const original=conceptFor(project),locked=P.saleLots(original)[0];
const lockedProject={...project,locks:[locked],brief:{...project.brief,park:'north'}};
assert.deepEqual(conceptFor(lockedProject).lots.find(l=>l.id===locked.id),{...locked,locked:true});
const zone={id:'zone',label:'Water',type:'water',x:locked.x,y:locked.y,w:locked.w,h:locked.h};
assert.ok(conceptFor({...project,exclusions:[zone]}).lots.every(l=>P.geometryArea(clip.intersection([P.lotPoints(l).map(p=>[p.x,p.y])],[P.corners(zone).map(p=>[p.x,p.y])]))<.01));
assert.equal(P.applyInstruction('40 ft road',project.brief).patch.road,12.192);
assert.deepEqual(P.applyInstruction('build a bridge',project.brief).patch,{});
const zero=conceptFor({...project,brief:{...project.brief,price:0}});assert.equal(zero.margin,0);
const solutions=P.solveTargetsV2(project);assert.ok(solutions.length>0&&solutions.length<=6);
for(const solution of solutions){assert.deepEqual(conceptFor(solution.project),solution.concept);assert.deepEqual(P.targetGaps(solution.concept,project.brief),solution.unmet);}
assert.throws(()=>P.parseProject(JSON.stringify({...project,inventory:{'001':'invalid'}})));
assert.throws(()=>P.parseProject(JSON.stringify({...project,brief:{...project.brief,road:100}})));
const snap={...project,approved:{number:1,date:new Date().toISOString(),concept:original,exclusions:[]}};
assert.deepEqual(P.parseProject(JSON.stringify(snap)),snap);
const planningURL='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
const exportSource=readFileSync(new URL('../src/components/developer-studio/deliverables.ts',import.meta.url),'utf8').replace("'./planning'",JSON.stringify(planningURL));
const exportJS=ts.transpileModule(exportSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const D=await import('data:text/javascript;base64,'+Buffer.from(exportJS).toString('base64'));
assert.equal(D.inventoryCSV(original,{}).split('\r\n').length,P.saleLots(original).length+1);
assert.ok(D.cadDXF(original,[]).endsWith('0\nEOF\n'));
assert.ok(D.cadDXF(original,[]).includes('ROAD_SURFACE'));
console.log('PASS locks, exclusions, commands, target solver, snapshot validation and exports');
const sketch=[{x:10,y:20},{x:90,y:20},{x:90,y:70},{x:60,y:70},{x:60,y:100},{x:10,y:100}];
for(const [area,unit,expected] of [[3,'acres',3*4046.8564224],[43560,'sqft',43560/P.SQFT],[10000,'sqm',10000]]){
 const scaled=P.boundaryFromArea(sketch,area,unit);assert.ok(Math.abs(P.polygonArea(scaled)-expected)<.0001,'declared area matches scaled geometry');
 const ratio=Math.hypot(scaled[1].x-scaled[0].x,scaled[1].y-scaled[0].y)/80;
 assert.ok(Math.abs(Math.hypot(scaled[2].x-scaled[1].x,scaled[2].y-scaled[1].y)-50*ratio)<.0001,'shape proportions preserved');
}
assert.throws(()=>P.boundaryFromArea(sketch,0,'acres'));
assert.throws(()=>P.boundaryFromArea([{x:0,y:0},{x:50,y:50},{x:0,y:50},{x:50,y:0}],3,'acres'));
assert.deepEqual(P.parseProject(JSON.stringify(P.blankProject())),P.blankProject());
console.log('PASS total-area scaling in three units, preserved shape, invalid outlines and blank project persistence');
const roadProject={...project,boundary:[{x:0,y:0},{x:150,y:0},{x:150,y:150},{x:0,y:150}],access:{frontages:[{edge:1,width:12}],entrance:{edge:1,t:.4},roads:[]}};
for(const c of P.createConcepts(roadProject)){assert.equal(c.entry.x,150);assert.equal(c.entry.y,60);assert.equal(c.checks.find(x=>x.name==='Mapped entrances').state,'pass');for(const lot of c.lots)assert.ok(P.geometryArea(clip.intersection(P.lotGeometry(lot),c.roadPolygons.map(p=>p.map(r=>r.map(q=>[q.x,q.y])))))<.01);}
assert.equal(P.createConcepts({...roadProject,access:P.emptyAccess()})[0].checks.find(x=>x.name==='Mapped entrances').state,'fail');
assert.throws(()=>P.parseProject(JSON.stringify({...roadProject,access:{...roadProject.access,entrance:{edge:2,t:.5}}})));
const detectionSource=readFileSync(new URL('../src/components/developer-studio/boundary-detection.ts',import.meta.url),'utf8');
const detectionJS=ts.transpileModule(detectionSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const B=await import('data:text/javascript;base64,'+Buffer.from(detectionJS).toString('base64'));
const w=150,h=150,ink=new Uint8Array(w*h);
for(let x=20;x<=120;x++){ink[20*w+x]=1;ink[120*w+x]=1;}for(let y=20;y<=120;y++){ink[y*w+20]=1;ink[y*w+120]=1;}
const outlines=B.detectOutlines(ink,w,h);assert.ok(outlines.length>0);assert.ok(outlines[0].points.length<=8);assert.ok(outlines[0].coverage>.4);
assert.equal(B.detectOutlines(new Uint8Array(w*h),w,h).length,0);
// Concave, closed boundary must retain its inward bend.
const concave=new Uint8Array(w*h),vertices=[[20,20],[120,20],[120,70],[70,70],[70,120],[20,120]];
for(let j=0;j<vertices.length;j++){const a=vertices[j],b=vertices[(j+1)%vertices.length],steps=Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]));for(let k=0;k<=steps;k++)concave[Math.round(a[1]+(b[1]-a[1])*k/steps)*w+Math.round(a[0]+(b[0]-a[0])*k/steps)]=1;}
const concaveResult=B.detectOutlines(concave,w,h);assert.ok(concaveResult[0].points.length>=6);assert.ok(P.polygonArea(concaveResult[0].points)<9500);
console.log('PASS contour extraction, concavity, empty scans, mapped entrances and access validation');
const R=await import(regulationsURL);
assert.equal(R.baselineStreetWidth(120),7.2);assert.equal(R.baselineStreetWidth(121),10);assert.equal(R.baselineStreetWidth(240),12);
assert.equal(R.baselineReservations(12000,2000,'CMDA').ews,1000);
assert.equal(R.baselineReservations(12000,2000,'CMDA').osr,1000);
assert.equal(R.baselineReservations(2500,500,'CMDA').osr,0);
const multi=P.withEntrances(P.emptyAccess(),[{id:'a',edge:0,t:.4,width:9},{id:'b',edge:2,t:.6,width:null}]);
assert.equal(multi.frontages.length,2);
const program={...roadProject,access:multi,brief:{...project.brief,road:9,roadMax:12,clubhouseCount:2,clubhouseArea:600,amenityArea:900,amenityType:'sports'}};
const programmed=conceptFor(program);
assert.equal(programmed.entries.length,2);assert.equal(programmed.networkConnected,true);
assert.equal(programmed.lots.filter(p=>p.use==='clubhouse').length,2);
for(const club of programmed.lots.filter(p=>p.use==='clubhouse'))assert.ok(Math.abs(club.area*P.SQFT-600)<.01);
assert.ok(Math.abs(programmed.lots.filter(p=>p.use==='amenity').reduce((s,p)=>s+p.area,0)*P.SQFT-900)<.01);
assert.ok(P.saleLots(programmed).every(p=>p.facing==='Unknown'));
assert.equal(P.facingLabel(0,90),'West');assert.equal(P.facingLabel(180,90),'East');assert.equal(P.facingLabel(0,null),'Unknown');
assert.equal(P.landCost({...project.brief,land:1000000,landBasis:'acre'},4046.8564224),1000000);
assert.ok(Math.abs(P.landCost({...project.brief,land:100,landBasis:'sqft'},1000/P.SQFT)-100000)<.001);
const priced=P.saleLots(programmed)[0];assert.ok(Math.abs(P.plotValue({...priced,discount:25},programmed.brief)-P.plotValue({...priced,discount:0},programmed.brief)*.75)<.01);
const onlyRegular=conceptFor({...program,brief:{...program.brief,allowOdd:false}});assert.equal(onlyRegular.irregularCount,0);
for(const c of P.createConcepts(project)){assert.ok(c.irregularCount<=Math.floor(P.saleLots(c).length*project.brief.maxOddPercent/100));for(const p of P.saleLots(c).filter(p=>p.shape==='irregular'))assert.ok(p.polygon.length>=3&&p.frontage>=6);}
assert.deepEqual(P.parseProject(JSON.stringify(program)),program);
assert.throws(()=>P.parseProject(JSON.stringify({...program,access:{...multi,northAngle:400}})));
assert.throws(()=>P.parseProject(JSON.stringify({...program,brief:{...program.brief,roadMax:7}})));
const exported=D.cadDXF(programmed,[]);assert.ok(exported.includes('ENTRANCE 1'));assert.ok(exported.includes('ENTRANCE 2'));assert.ok(exported.includes('RESIDUAL_LAND'));
console.log('PASS multiple entrances, unknown/rotated north, road ranges, amenities, irregular pricing, land units and sourced baseline thresholds');
// Synthetic sloping parcel: adaptive divisions must reclaim the fixed grid's edge strips.
const sloping={...project,boundary:[{x:63,y:127},{x:0,y:38},{x:101,y:0},{x:150,y:25},{x:137,y:105}],access:P.withEntrances(P.emptyAccess(),[{id:'entry',edge:4,t:.5,width:9}])};
const improved=P.createConcepts(sloping);
assert.ok(improved[0].efficiency>43,'balanced scheme must recover usable edge land');
// A wider-road alternative may allocate more land but sell less. Compare productive
// area rather than rewarding extra road surface as recovered land.
assert.ok(improved[0].efficiency>=improved[2].efficiency,'saleable-area objective must outperform the wider-road option on this fixture');
assert.ok(improved[1].efficiency>43,'higher-yield scheme must improve area as well as count');
assert.ok(improved[0].secondaryRoadWidth<improved[0].brief.road,'short secondary roads should use less width');
for(const c of improved){
 assert.ok(c.secondaryRoadWidth>=sloping.brief.road&&c.secondaryRoadWidth<=sloping.brief.roadMax);
 assert.ok(c.irregularCount<=Math.floor(P.saleLots(c).length*sloping.brief.maxOddPercent/100));
 for(const lot of P.saleLots(c))assert.ok(lot.frontage>=5.99,'every saleable plot needs actual road frontage');
}
const uniform=conceptFor({...sloping,brief:{...sloping.brief,road:12,roadMax:12}});
assert.equal(uniform.brief.road,12);assert.equal(uniform.secondaryRoadWidth,12);
const fixed=P.saleLots(improved[0])[0];
const lockedAdaptive=conceptFor({...sloping,locks:[fixed]});
assert.deepEqual(lockedAdaptive.lots.find(l=>l.id===fixed.id),{...fixed,locked:true},'edge growth must preserve locked footprints');
console.log('PASS adaptive sloping-block utilization, mixed/uniform road widths, road frontage and immutable locks');
const rowMixed=conceptFor({...sloping,brief:{...sloping.brief,mixedRows:true,maxOddPercent:25}});
const schedule=P.rowSchedule(rowMixed);
assert.equal(schedule.reduce((sum,row)=>sum+row.plots,0),P.saleLots(rowMixed).length);
assert.ok(schedule.some(row=>row.repeated>=3),'mixed planning should preserve repeated sizes along a row');
assert.ok(new Set(schedule.map(row=>`${row.width.toFixed(2)}x${row.depth.toFixed(2)}`)).size>1,'mix sizes between rows');
for(const row of schedule)assert.equal(row.plots,row.repeated+row.adjusted);
const rectangularRows=conceptFor({...program,brief:{...program.brief,mixedRows:true}});
for(const lot of P.saleLots(rectangularRows).filter(p=>!p.rowEnd&&p.shape==='regular')){
 assert.ok(Math.abs(lot.w-lot.rowWidth)<.01,'interior plots keep row width');
 assert.ok(Math.abs(lot.h-lot.rowDepth)<.01,'interior plots keep row depth');
}
const widerMixed=P.createConcepts({...sloping,brief:{...sloping.brief,mixedRows:true,maxOddPercent:25}})[2];
assert.ok(rowMixed.efficiency>=widerMixed.efficiency,'mixed-row objective prioritizes sellable land over allocating more roads');
assert.ok(rowMixed.unallocated<improved[0].unallocated,'allowing more usable edge plots reduces remaining land');
assert.ok(D.inventoryCSV(rowMixed,{}).includes('Row frontage ft'));
const legacySettings={...project,brief:{...project.brief}};delete legacySettings.brief.mixedRows;
assert.equal(P.parseProject(JSON.stringify(legacySettings)).brief.mixedRows,true);
assert.throws(()=>P.parseProject(JSON.stringify({...project,brief:{...project.brief,mixedRows:'yes'}})));
assert.deepEqual(P.parseProject(JSON.stringify({...sloping,approved:{number:1,date:new Date().toISOString(),concept:rowMixed,exclusions:[]}})).approved.concept,rowMixed);
console.log('PASS consistent mixed rows, end-only growth, row schedule/export, legacy settings and frozen row metadata');
