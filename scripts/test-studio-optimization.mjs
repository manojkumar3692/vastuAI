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


const rectangle=[{x:0,y:0},{x:100,y:0},{x:100,y:90},{x:0,y:90}];
const sizes=[{width:30,depth:40,minCount:2,targetPercent:70},{width:30,depth:50,minCount:1,targetPercent:30}];
const project={...P.freshProject(),boundary:rectangle,brief:{...P.defaultBrief,park:'auto',plotMix:sizes,allowExtraSizes:false,road:7.2,roadMax:12,commercial:false,clubhouseCount:0}};
const concepts=P.createConcepts(project);
for(const c of concepts){
 assert.ok(P.saleLots(c).length,'strict pool still fits plots');
 assert.ok(P.saleLots(c).every(l=>sizes.some(s=>P.matchesPlotSize(l,s))),'strict pool excludes adjusted sizes');
 assert.ok(P.saleLots(c).every(l=>l.exitAccess),'all strict-size plots have an exit');
 assert.equal(P.plotMixReport(c).extras.length,0);
 assert.ok(c.searchCount>4,'automatic parks compare additional arrangements');
 assert.ok(c.roadSchedule.length>0);
 assert.ok(c.roadSchedule.some(r=>Math.abs(r.width-7.2)<.001),'short street can use requested 7.2 m');
 assert.ok(Math.abs(c.area-c.residential-c.commercialArea-c.parkArea-c.publicArea-c.roadsArea-c.unallocated-(c.protectedArea||0))<.01);
 console.log('PASS strict selected mix + automatic park',c.id,P.plotMixReport(c).rows.map(r=>r.actual));
}
assert.ok(concepts.some(c=>P.plotMixReport(c).shortfall===0),'at least one solution satisfies mixed minima');
const restored=P.parseProject(JSON.stringify(project));assert.deepEqual(restored.brief.plotMix,sizes);assert.equal(restored.brief.park,'auto');
assert.throws(()=>P.parseProject(JSON.stringify({...project,brief:{...project.brief,plotMix:[{...sizes[0],targetPercent:101}]}})),/plot sizes/);
const impossible={...concepts[0],brief:{...concepts[0].brief,plotMix:[{...sizes[0],minCount:2000}]}};
assert.ok(P.plotMixReport(impossible).shortfall>1900);assert.equal(P.explainMix(impossible).checks.find(c=>c.name==='Selected plot mix').state,'fail');
const a={...concepts[0],id:'cheap',infra:100,profit:50},b={...concepts[0],id:'profit',infra:200,profit:500};
assert.equal(P.rankConcepts([a,b],{...project.brief,objective:'infrastructure'})[0].id,'cheap');
assert.equal(P.rankConcepts([a,b],{...project.brief,objective:'profit'})[0].id,'profit');
assert.deepEqual(P.applyInstruction('Use 30x50 plots',project.brief).patch.plotMix,[{width:30,depth:50,minCount:1,targetPercent:0}]);
console.log('PASS targets, objective ranking, saved settings, invalid percentages and conversational sizes');

for(const c of concepts)assert.ok(Math.abs(P.residualReview(c).reduce((n,r)=>n+r.area,0)-c.unallocated)<.01,'residual explanations account for remaining land');
console.log('PASS residual diagnostic area accounting');
