export type Point = { x: number; y: number };

export const SVG_SIZE = 360;

export const SHAPES: Record<"rectangle" | "wide" | "irregular", Point[]> = {
  rectangle: [
    { x: 64, y: 58 },
    { x: 296, y: 58 },
    { x: 296, y: 302 },
    { x: 64, y: 302 },
  ],
  wide: [
    { x: 34, y: 91 },
    { x: 326, y: 91 },
    { x: 326, y: 269 },
    { x: 34, y: 269 },
  ],
  irregular: [
    { x: 88, y: 50 },
    { x: 303, y: 80 },
    { x: 324, y: 296 },
    { x: 42, y: 314 },
  ],
};

const SCORE_ANCHORS = [84, 95, 98, 90, 78, 50, 32, 22, 18, 12, 8, 16, 28, 45, 60, 74];
const DIRECTION_NAMES = [
  "North", "North-north-east", "North-East", "East-north-east",
  "East", "East-south-east", "South-East", "South-south-east",
  "South", "South-south-west", "South-West", "West-south-west",
  "West", "West-north-west", "North-West", "North-north-west",
];
const DIRECTION_CODES = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export const clonePoints = (points: Point[]) => points.map((point) => ({ ...point }));
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const normalizeAngle = (value: number) => ((value % 360) + 360) % 360;
export const pointsAttribute = (points: Point[]) => points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");

export function polygonCentroid(points: Point[]): Point {
  let twiceArea = 0;
  let x = 0;
  let y = 0;
  points.forEach((current, index) => {
    const next = points[(index + 1) % points.length];
    const cross = current.x * next.y - next.x * current.y;
    twiceArea += cross;
    x += (current.x + next.x) * cross;
    y += (current.y + next.y) * cross;
  });
  return Math.abs(twiceArea) < 0.001
    ? { x: SVG_SIZE / 2, y: SVG_SIZE / 2 }
    : { x: x / (3 * twiceArea), y: y / (3 * twiceArea) };
}

export function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    const intersects = a.y > point.y !== b.y > point.y
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 0.0001) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function screenBearing(from: Point, to: Point) {
  return normalizeAngle((Math.atan2(to.x - from.x, -(to.y - from.y)) * 180) / Math.PI);
}

export function directionForAngle(angle: number) {
  const index = Math.round(normalizeAngle(angle) / 22.5) % 16;
  return { name: DIRECTION_NAMES[index], code: DIRECTION_CODES[index] };
}

export function scoreForAngle(angle: number, distanceRatio = 0.55) {
  const raw = normalizeAngle(angle) / 22.5;
  const low = Math.floor(raw) % 16;
  const high = (low + 1) % 16;
  const angularScore = SCORE_ANCHORS[low] + (SCORE_ANCHORS[high] - SCORE_ANCHORS[low]) * (raw - Math.floor(raw));
  const radialAdjustment = distanceRatio < 0.18 ? -12 : distanceRatio < 0.35 ? -5 : distanceRatio > 0.88 ? -3 : 2;
  return clamp(Math.round(angularScore + radialAdjustment), 5, 99);
}

export function scoreMeta(score: number) {
  if (score >= 88) return { status: "Excellent position", caption: "One of the most preferred zones", color: "#16a36e" };
  if (score >= 72) return { status: "Good position", caption: "Generally favourable by Vastu", color: "#75a92f" };
  if (score >= 50) return { status: "Consider with care", caption: "A conditional placement zone", color: "#dda21a" };
  if (score >= 25) return { status: "Avoid if possible", caption: "Look for a stronger alternative", color: "#e56b2f" };
  return { status: "Not recommended", caption: "A traditionally unfavourable zone", color: "#d94c55" };
}

export function colorForScore(score: number, alpha = 0.72) {
  if (score >= 88) return `rgba(20, 171, 117, ${alpha})`;
  if (score >= 72) return `rgba(116, 174, 62, ${alpha})`;
  if (score >= 50) return `rgba(235, 178, 52, ${alpha})`;
  if (score >= 25) return `rgba(239, 116, 47, ${alpha})`;
  return `rgba(215, 65, 79, ${alpha})`;
}

export const maxCornerDistance = (center: Point, points: Point[]) => Math.max(...points.map((point) => Math.hypot(point.x - center.x, point.y - center.y)));

export function polarPoint(center: Point, bearing: number, radius: number): Point {
  const radians = (bearing * Math.PI) / 180;
  return { x: center.x + Math.sin(radians) * radius, y: center.y - Math.cos(radians) * radius };
}

export function bestPoint(center: Point, points: Point[], north: number) {
  let radius = maxCornerDistance(center, points) * 0.58;
  let candidate = polarPoint(center, north + 45, radius);
  while (!pointInPolygon(candidate, points) && radius > 12) {
    radius -= 4;
    candidate = polarPoint(center, north + 45, radius);
  }
  return candidate;
}

export function guidance(code: string, direction: string, score: number) {
  if (["NNE", "NE", "ENE"].includes(code)) return { title: "Strong Vastu preference", copy: "This point sits in the north-east band, traditionally preferred for water elements." };
  if (["N", "E"].includes(code)) return { title: "Generally favourable", copy: `The ${direction.toLowerCase()} zone is commonly considered suitable when the north-east is unavailable.` };
  if (score >= 50) return { title: "Compare nearby points", copy: "This is a conditional zone. Move toward north or east to find a stronger Vastu preference." };
  return { title: "A better zone is available", copy: "This area is traditionally avoided for borewells. Try the highlighted north-east area instead." };
}
