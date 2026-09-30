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

const polygon=points=>[points.map(p=>[p.x,p.y])];
const site=polygon([{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}]);
const roads=[{x:0,y:10,w:40,h:9},{x:50,y:60,w:40,h:9}],entries=[{x:0,y:14.5}];
const surface=clip.union(...roads.map(r=>polygon(P.corners(r))));
const disconnected=P.roadReachability(roads,surface,entries,site);assert.equal(disconnected.reached.size,1);assert.equal(disconnected.segments.length,2);
const repaired=P.connectStreetNetwork([...roads],site,[],entries,9);assert.equal(repaired.graph.reached.size,repaired.graph.segments.length);assert.ok(repaired.added>0);
const blocked=P.connectStreetNetwork([...roads],site,[polygon(P.corners({x:44,y:0,w:12,h:100}))],entries,9);assert.ok(blocked.graph.reached.size<blocked.graph.segments.length);
const pinched=[{x:0,y:10,w:40,h:9},{x:39,y:18,w:30,h:9}];
const pinch=P.roadReachability(pinched,clip.union(...pinched.map(r=>polygon(P.corners(r)))),entries,site);assert.equal(pinch.reached.size,1,'1 m corner overlap is not a full-width junction');
console.log('PASS graph rejects disconnected roads and narrow corner contacts; repairs usable links and respects protected barriers');
const boundary=P.validateBoundary([{x:119.5,y:0},{x:144,y:49},{x:160.25,y:81.75},{x:142,y:115},{x:102.5,y:80.25},{x:69.75,y:91.75},{x:96,y:111.5},{x:92,y:130.25},{x:23.25,y:127},{x:0,y:56.75},{x:44.25,y:21}]);
const project={...P.freshProject(),boundary,access:P.withEntrances(P.emptyAccess(),[{id:'entry',edge:8,t:.8,width:9,entranceWidth:9}])};
for(const c of P.createConcepts(project)){
 assert.ok(P.saleLots(c).length);assert.ok(P.saleLots(c).every(p=>p.exitAccess));assert.equal(c.checks.find(c=>c.name==='Plot route to exit').state,'pass');assert.ok(c.networkConnected);assert.ok(c.accessRoads>0);
 const roadGeometry=c.roadPolygons.map(p=>p.map(r=>r.map(q=>[q.x,q.y])));
 for(const lot of c.lots){assert.ok(P.geometryArea(clip.intersection(P.lotGeometry(lot),roadGeometry))<.01);assert.ok(Math.abs(P.geometryArea(clip.intersection(P.lotGeometry(lot),polygon(c.boundary)))-lot.area)<.01);}
 assert.ok(Math.abs(c.area-c.residential-c.commercialArea-c.parkArea-c.publicArea-c.roadsArea-c.unallocated-(c.protectedArea||0))<.01);
 const detached={...c,reachableRoadPolygons:[]};const cell=P.saleLots(c).find(p=>p.shape==='regular'&&p.area>=72&&p.area<=2400/P.SQFT);
 if(cell){const rings=[P.lotPoints(cell)],vacant={...detached,residualPolygons:[rings]};assert.match(P.allocationEligibility(vacant,rings,'residential'),/entrance/);}
 console.log('PASS screenshot-shaped concept',c.id,P.saleLots(c).length,'reachable plots;',c.accessRoads,'connections');
}
