export type Point = { x: number; y: number };
export type Zone = { id: string; x: number; y: number; w: number; h: number; kind: 'constraint' | 'structure' | 'water' | 'easement'; locked: boolean };
export type Settings = { name: string; state: string; authority: string; road: number; price: number; land: number; infraRate: number; fees: number; marketing: number; targetMargin: number; mix: number; park: 'north' | 'south'; secondEntry: boolean; slope: number; earthRate: number; minPlots: number; targetRevenue: number; maxInfra: number; targetEfficiency: number };
export type Plot = { id: string; x: number; y: number; w: number; h: number; area: number; facing: string; corner: boolean; premium: number; parkDistance: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Scheme = { id: string; name: string; plots: Plot[]; roads: Rect[]; park: Rect; amenity: Rect; utility: Rect; area: number; saleable: number; roadArea: number; parkArea: number; residual: number; roadLength: number; infra: number; revenue: number; cost: number; profit: number; margin: number; efficiency: number; earthwork: number; maxLand: number; checks: Check[] };
export type Check = { label: string; status: 'pass' | 'warn' | 'fail'; detail: string; source: string };
export const SQFT = 10.7639;
export const defaults: Settings = { name: 'The Grove · Phase 01', state: 'Tamil Nadu', authority: 'CMDA', road: 9, price: 3200, land: 180000000, infraRate: 2600, fees: 6000000, marketing: 3, targetMargin: 25, mix: 1, park: 'north', secondEntry: false, slope: 2, earthRate: 350, minPlots: 40, targetRevenue: 250000000, maxInfra: 30000000, targetEfficiency: 55 };
export const sampleBoundary: Point[] = [{ x: 0, y: 0 }, { x: 112, y: 0 }, { x: 112, y: 116 }, { x: 0, y: 116 }];
export const rules = [
  { state: 'Tamil Nadu', authority: 'CMDA', type: 'Residential plotted layout', version: 'demo-2026.1', minRoad: 9, openSpace: 10 },
  { state: 'Tamil Nadu', authority: 'DTCP', type: 'Residential plotted layout', version: 'demo-2026.1', minRoad: 9, openSpace: 10 },
  { state: 'Karnataka', authority: 'Local Planning Authority', type: 'Residential plotted layout', version: 'demo-2026.1', minRoad: 12, openSpace: 10 },
];
export const entitlement = { plan: 'free', canGenerate: true, canExport: true, maxProjects: Infinity };
export const money = (n: number) => Math.abs(n) >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(1)} L`;
export const areaOf = (p: Point[]) => Math.abs(p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q.x * r.y - r.x * q.y; }, 0)) / 2;
export const bounds = (p: Point[]) => ({ w: Math.max(...p.map(q => q.x)), h: Math.max(...p.map(q => q.y)) });
export const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w - .001 && a.x + a.w > b.x + .001 && a.y < b.y + b.h - .001 && a.y + a.h > b.y + .001;
// Conservative support: axis-aligned rectangular parcels only. Other boundaries are retained for survey review.
export function supportedBoundary(p: Point[]) { const b = bounds(p); return p.length === 4 && b.w >= 40 && b.h >= 40 && b.w * b.h <= 200000 && Math.abs(areaOf(p) - b.w * b.h) < .01 && p.every(q => (q.x === 0 || q.x === b.w) && (q.y === 0 || q.y === b.h)) && new Set(p.map(q => `${q.x},${q.y}`)).size === 4; }
export function generate(s: Settings, boundary: Point[], zones: Zone[]): Scheme[] {
  if (!supportedBoundary(boundary)) return [];
  const { w, h } = bounds(boundary), area = areaOf(boundary);
  return ['Balanced neighbourhood', 'Premium parkfront', 'Compact collection'].map((name, i) => {
    const rw = s.road + (i === 1 ? 1 : 0), parkH = h * (i === 1 ? .15 : .105), south = s.park === 'south';
    const park = { x: 0, y: south ? h - parkH : 0, w, h: parkH };
    const amenity = { x: 0, y: south ? 0 : h - 9, w: w * .23, h: 9 };
    const utility = { x: w * .82, y: south ? 0 : h - 9, w: w * .18, h: 9 };
    const start = south ? 9 : parkH, end = south ? h - parkH : h - 9;
    let roads: Rect[] = [{ x: w / 2 - rw / 2, y: start, w: rw, h: end - start + 9 }];
    if (south) roads[0] = { ...roads[0], y: 0 };
    const plots: Plot[] = [];
    const sizes = [[9.144, 12.192], [9.144, 15.24], [12.192, 18.288]];
    const sizeIndex = i === 1 ? 2 : i === 2 ? 0 : s.mix;
    const depth = sizes[Math.min(sizeIndex, 2)][1];
    const streets: number[] = [];
    for (let street = start + depth; street + rw <= end; street += 2 * depth + rw) {
      streets.push(street);
      roads.push({ x: 0, y: street, w: w / 2 - rw / 2, h: rw }, { x: w / 2 + rw / 2, y: street, w: w / 2 - rw / 2, h: rw });
    }
    if (s.secondEntry) roads.push({ x: 0, y: south ? end - rw : start, w: w / 2 - rw / 2, h: rw });
    // Split intersections so road quantities are a union, never double-counted.
    const disjoint: Rect[] = [];
    for (const road of roads) {
      let pieces = [road];
      for (const prior of disjoint) pieces = pieces.flatMap(r => {
        if (!overlaps(r, prior)) return [r];
        const left = Math.max(r.x, prior.x), right = Math.min(r.x+r.w, prior.x+prior.w);
        const top = Math.max(r.y, prior.y), bottom = Math.min(r.y+r.h, prior.y+prior.h);
        return [{x:r.x,y:r.y,w:r.w,h:top-r.y},{x:r.x,y:bottom,w:r.w,h:r.y+r.h-bottom},{x:r.x,y:top,w:left-r.x,h:bottom-top},{x:right,y:top,w:r.x+r.w-right,h:bottom-top}].filter(q=>q.w>.001&&q.h>.001);
      });
      disjoint.push(...pieces);
    }
    roads = disjoint;
    let sequence = 0;
    for (const street of streets) for (const above of [true, false]) for (const side of [0, 1]) {
      const x0 = side === 0 ? 0 : w / 2 + rw / 2, xEnd = side === 0 ? w / 2 - rw / 2 : w;
      for (let x = x0; x < xEnd;) {
        const bucket = (sequence++ * 37) % 100;
        const chosen = sizeIndex === 3 ? (bucket < 60 ? 0 : bucket < 80 ? 1 : 2) : sizeIndex;
        const [frontage, lotDepth] = sizes[chosen];
        if (x + frontage > xEnd + .001) break;
        const r = { x, y: above ? street - lotDepth : street + rw, w: frontage, h: lotDepth };
        x += frontage;
        if (r.y < start || r.y + r.h > end || [...roads, park, amenity, utility, ...zones].some(z => overlaps(r, z))) continue;
        const corner = side === 0 ? Math.abs(x - xEnd) < .01 : r.x === x0;
        const parkDistance = Math.abs((south ? park.y : park.h) - (r.y + lotDepth / 2));
        const premium = (corner ? 8 : 0) + (parkDistance < 25 ? 5 : 0);
        plots.push({ ...r, id: `P${String(plots.length + 1).padStart(3, '0')}`, area: frontage * lotDepth, facing: above ? 'South' : 'North', corner, premium, parkDistance });
      }
    }

    const saleable = plots.reduce((a, p) => a + p.area, 0), roadArea = roads.reduce((a, r) => a + r.w * r.h, 0), roadLength = roadArea / rw;
    const earthwork = area * s.slope / 100 * .35;
    const infra = roadArea * s.infraRate + roadLength * (1800 + 2400 + 1600) + Math.ceil(roadLength / 30) * 35000 + earthwork * s.earthRate + park.w * park.h * 650 + (amenity.w * amenity.h + utility.w * utility.h) * 12000;
    const revenue = plots.reduce((a, p) => a + p.area * SQFT * s.price * (1 + p.premium / 100), 0);
    const cost = s.land + infra + s.fees + revenue * s.marketing / 100;
    const rule = rules.find(r => r.authority === s.authority) || rules[0];
    const checks: Check[] = [
      { label: 'Usable plot yield', status: plots.length ? 'pass' : 'fail', detail: `${plots.length} road-fronting lots fit the current design`, source: 'Geometry check / local engine' },
      { label: 'Internal street width', status: rw >= rule.minRoad ? 'pass' : 'fail', detail: `${rw} m / ${rule.minRoad} m example threshold`, source: 'Road clause: pending authority verification' },
      { label: 'Open-space allocation', status: park.w * park.h / area * 100 >= rule.openSpace ? 'pass' : 'fail', detail: `${(park.w * park.h / area * 100).toFixed(1)}% / ${rule.openSpace}% example threshold`, source: 'OSR clause: pending authority verification' },
      { label: 'Constraint conflicts', status: [...roads, park, amenity, utility].some(r => zones.some(z => overlaps(r, z))) ? 'fail' : 'pass', detail: 'Roads and shared facilities checked against exclusion zones', source: 'Geometry check / local engine' },
      { label: 'Survey, title & public access', status: 'warn', detail: 'Boundary, access rights and site conditions require professional verification', source: 'Source documents: not verified' },
      { label: 'Statutory approval', status: 'warn', detail: `${s.authority} · ${rule.version} is an illustrative preset, not a statutory determination`, source: 'Official source URL and clause: not connected' },
    ];
    return { id: 'ABC'[i], name, plots, roads, park, amenity, utility, area, saleable, roadArea, parkArea: park.w * park.h, residual: area - saleable - roadArea - park.w * park.h - amenity.w * amenity.h - utility.w * utility.h, roadLength, infra, revenue, cost, profit: revenue - cost, margin: revenue ? (revenue - cost) / revenue * 100 : 0, efficiency: saleable / area * 100, earthwork, maxLand: revenue * (1 - (s.targetMargin + s.marketing) / 100) - infra - s.fees, checks };
  });
}
export interface LayoutProvider { generate(settings: Settings, boundary: Point[], zones: Zone[]): Promise<Scheme[]> }
export const demoLayoutProvider: LayoutProvider = { generate: async (s, b, z) => generate(s, b, z) };
export interface PromptProvider { edit(prompt: string, settings: Settings): { patch: Partial<Settings>; message: string } }
export const demoPromptProvider: PromptProvider = { edit(prompt, s) {
  const q = prompt.toLowerCase(), patch: Partial<Settings> = {};
  if (/park/.test(q) && /south|north/.test(q)) patch.park = q.includes('south') ? 'south' : 'north';
  if (/second|2nd/.test(q) && /entr/.test(q)) patch.secondEntry = true;
  if (/widen|road.*\d/.test(q)) patch.road = Math.min(18, Math.max(6, Number(q.match(/\d+/)?.[0]) || s.road + 3));
  if (/30\s*[x×]\s*40|more plots/.test(q)) patch.mix = 0;
  if (/30\s*[x×]\s*50/.test(q)) patch.mix = 1;
  if (/40\s*[x×]\s*60/.test(q)) patch.mix = 2;
  return { patch, message: Object.keys(patch).length ? 'Applied your planning parameters. Scenarios and checks have been recalculated.' : 'Local command mode supports: move park north/south, add second entrance, widen road to 12 m, or use 30x40 / 30x50 / 40x60 plots. Select a plot to lock it; draw exclusions in Site intelligence.' };
} };
export function parseBoundary(text: string, kind: string): Point[] {
  let points: Point[];
  if (kind === 'kml') {
    const coordinates = text.match(/<coordinates[^>]*>([\s\S]*?)<\/coordinates>/i)?.[1];
    if (!coordinates) throw Error('No KML polygon coordinates found.');
    const ll = coordinates.trim().split(/\s+/).map(t => t.split(',').map(Number));
    const lat = ll[0][1], lon = ll[0][0];
    points = ll.map(p => ({ x: (p[0] - lon) * 111320 * Math.cos(lat * Math.PI / 180), y: (lat - p[1]) * 111320 }));
  } else points = JSON.parse(text);
  if (!Array.isArray(points) || points.length < 3 || points.length > 500 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw Error('Use 3–500 finite x/y coordinates in metres.');
  if (points.length > 3 && points[0].x === points.at(-1)!.x && points[0].y === points.at(-1)!.y) points.pop();
  const minX = Math.min(...points.map(p => p.x)), minY = Math.min(...points.map(p => p.y));
  points = points.map(p => ({ x: p.x - minX, y: p.y - minY }));
  if (areaOf(points) < 1600 || bounds(points).w > 3000 || bounds(points).h > 3000) throw Error('Demo parcel must be at least 1,600 m² and within 3 km in each direction.');
  return points;
}

export type SolverResult = { settings: Settings; scheme: Scheme; feasible: boolean; unmet: string[] };
export function solveTargets(s: Settings, boundary: Point[], zones: Zone[]): SolverResult[] {
  const results: SolverResult[] = [];
  for (const mix of [0, 1, 2]) for (const road of [9, 12, 15]) for (const park of ['north', 'south'] as const) {
    const settings = { ...s, mix, road, park };
    for (const scheme of generate(settings, boundary, zones)) {
      const unmet = [scheme.plots.length < s.minPlots ? 'Plot count' : '', scheme.revenue < s.targetRevenue ? 'Revenue' : '', scheme.infra > s.maxInfra ? 'Infrastructure cap' : '', scheme.margin < s.targetMargin ? 'Margin' : '', scheme.checks.some(c => c.status === 'fail') ? 'Planning checks' : ''].filter(Boolean);
      results.push({ settings, scheme, feasible: unmet.length === 0, unmet });
    }
  }
  // Deduplicate identical geometry candidates before ranking.
  const seen = new Set<string>();
  return results.sort((a,b) => a.unmet.length - b.unmet.length || b.scheme.profit - a.scheme.profit).filter(r => {
    const key = JSON.stringify([r.scheme.plots, r.scheme.roads, r.scheme.park]);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 6);
}
