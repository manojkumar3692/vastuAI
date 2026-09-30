import type { Point, Scheme, Zone } from './engine';
/** ASCII DXF R12 linework. Coordinates in metres, survey north up. Native DWG requires CAD conversion. */
export function toDXF(a: Scheme, boundary: Point[], zones: Zone[]): string {
  let body = '0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n6\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';
  function line(p: Point, q: Point, layer: string) { body += `0\nLINE\n8\n${layer}\n10\n${p.x}\n20\n${-p.y}\n11\n${q.x}\n21\n${-q.y}\n`; }
  for (let j=0;j<boundary.length;j++) line(boundary[j],boundary[(j+1)%boundary.length],'BOUNDARY');
  const rects = [...a.plots.map(p=>({...p,layer:'PLOTS'})),...a.roads.map(r=>({...r,layer:'ROADS'})),{...a.park,layer:'PARK'},{...a.amenity,layer:'AMENITY'},{...a.utility,layer:'UTILITIES'},...zones.map(z=>({...z,layer:'EXCLUSIONS'}))];
  for (const r of rects) { const ps=[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];for(let j=0;j<4;j++)line(ps[j],ps[(j+1)%4],r.layer); }
  for (const p of a.plots) body += `0\nTEXT\n8\nPLOT_NUMBERS\n10\n${p.x+1}\n20\n${-(p.y+p.h/2)}\n40\n1\n1\n${p.id}\n`;
  return body+'0\nENDSEC\n0\nEOF\n';
}
