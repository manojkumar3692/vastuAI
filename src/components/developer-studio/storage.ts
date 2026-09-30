import { defaults, parseBoundary, type Point, type Scheme, type Settings, type Zone } from './engine';
export type Approval = { scheme: Scheme; settings: Settings; boundary: Point[]; zones: Zone[]; date: string; version: number };
export type Saved = { settings: Settings; boundary: Point[]; zones: Zone[]; selected: number; locks: string[]; inventory: Record<string,string>; approval: Approval | null; files: string[] };
function record(v: unknown): v is Record<string, unknown> { return !!v && typeof v === 'object' && !Array.isArray(v); }
export function readProject(text: string): Saved {
  const d: unknown = JSON.parse(text);
  if (!record(d) || !record(d.settings)) throw Error('This is not a Plot Studio backup.');
  const input = d.settings;
  const numeric = Object.keys(defaults).filter(k => typeof defaults[k as keyof Settings] === 'number');
  if (numeric.some(k=>typeof input[k] !== 'number' || !Number.isFinite(input[k]) || (input[k] as number)<0 || (input[k] as number)>1e12)) throw Error('Project assumptions contain invalid numbers.');
  const settings = { ...defaults, ...input } as Settings;
  if (settings.road<6 || settings.road>18 || ![0,1,2,3].includes(settings.mix) || !['north','south'].includes(settings.park) || typeof settings.name !== 'string' || settings.name.length>200 || !['CMDA','DTCP','Local Planning Authority'].includes(settings.authority) || !['Tamil Nadu','Karnataka'].includes(settings.state) || typeof settings.secondEntry!=='boolean') throw Error('Unsupported project settings.');
  const boundary = parseBoundary(JSON.stringify(d.boundary), 'json');
  if (!Array.isArray(d.zones) || d.zones.length>100 || d.zones.some(z=>!record(z)||typeof z.id!=='string'||!['constraint','structure','water','easement'].includes(String(z.kind))||['x','y','w','h'].some(k=>typeof z[k]!=='number'||!Number.isFinite(z[k])||(z[k] as number)<0))) throw Error('Invalid exclusion zones.');
  if (!Array.isArray(d.locks) || d.locks.some(x=>typeof x!=='string') || !record(d.inventory) || Object.values(d.inventory).some(x=>!['Available','Held','Sold'].includes(String(x))) || !Array.isArray(d.files) || d.files.some(x=>typeof x!=='string')) throw Error('Invalid project inventory or references.');
  if (d.approval != null) {
    const a=d.approval;
    if (!record(a) || !record(a.scheme) || !Array.isArray(a.scheme.plots) || a.scheme.plots.length>10000 || !Array.isArray(a.scheme.roads) || !Array.isArray(a.scheme.checks) || !record(a.settings) || !Array.isArray(a.boundary) || !Array.isArray(a.zones) || typeof a.date!=='string' || !Number.isFinite(Date.parse(a.date)) || typeof a.version!=='number') throw Error('Invalid approved concept snapshot.');
    const scheme=a.scheme;
    if (['area','saleable','roadArea','parkArea','residual','roadLength','infra','revenue','cost','profit','margin','efficiency','earthwork','maxLand'].some(k=>typeof scheme[k]!=='number'||!Number.isFinite(scheme[k]))) throw Error('Invalid snapshot metrics.');
    const geometries=[...a.scheme.plots,...a.scheme.roads,a.scheme.park,a.scheme.amenity,a.scheme.utility];
    if(geometries.some(r=>!record(r)||['x','y','w','h'].some(k=>typeof r[k]!=='number'||!Number.isFinite(r[k]))))throw Error('Invalid snapshot geometry.');
  }
  return {settings,boundary,zones:d.zones as Zone[],selected:typeof d.selected==='number'&&[0,1,2].includes(d.selected)?d.selected:0,locks:d.locks as string[],inventory:d.inventory as Record<string,string>,approval:(d.approval || null) as Approval|null,files:d.files as string[]};
}
