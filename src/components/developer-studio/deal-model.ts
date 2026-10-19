import {saleLots,type Concept,type Brief,type DealMetrics} from './planning';
export function dealMetrics(c:Concept):DealMetrics{return {plots:saleLots(c).length,revenue:c.revenue,infra:c.infra,cost:c.cost,profit:c.profit,margin:c.margin,efficiency:c.efficiency,maxLand:c.maxLand};}
export const importFields={land:{label:'Land purchase price',max:1e12},price:{label:'Selling price / sq ft',max:1e7},roadRate:{label:'Road construction / m²',max:1e7},fees:{label:'Consultants & approvals',max:1e10},marketing:{label:'Marketing %',max:30},targetMargin:{label:'Target margin %',max:90},slope:{label:'Assumed slope %',max:30},earthRate:{label:'Earthwork / m³',max:1e6}} as const;
export function parseAssumptionsCSV(text:string):Partial<Brief>{
 if(text.length>100000)throw Error('Use a CSV smaller than 100 KB.');
 const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);const patch:Partial<Brief>={};const seen=new Set<string>();
 if(lines.shift()?.trim().toLowerCase()!=='assumption,value')throw Error('Use the assumption,value template. Export these two columns as CSV from Excel.');
 for(const line of lines){if(!line.trim())continue;const cells=line.split(',').map(c=>c.trim().replace(/^"|"$/g,''));if(cells.length!==2)throw Error('Use two columns, with numbers without thousands separators.');const [key,value]=cells;if(seen.has(key))throw Error(`Duplicate assumption: ${key}`);seen.add(key);
  if(key==='landBasis'){if(!['total','acre','sqft'].includes(value))throw Error('landBasis must be total, acre or sqft.');patch.landBasis=value as Brief['landBasis'];continue;}
  if(!Object.hasOwn(importFields,key))throw Error(`Unsupported assumption: ${key}`);const n=Number(value),field=importFields[key as keyof typeof importFields];if(!value||!Number.isFinite(n)||n<0||n>field.max)throw Error(`Invalid value for ${field.label}.`);Object.assign(patch,{[key]:n});
 }
 if(!seen.size)throw Error('The file contains no assumptions.');return patch;
}
export const assumptionsTemplate='assumption,value\nlandBasis,acre\nland,25000000\nprice,3500\nroadRate,2600\nfees,4000000\nmarketing,3\ntargetMargin,25\n';
