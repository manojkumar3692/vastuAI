// src/lib/vastuGeometry.ts
import type { Direction } from "@/types/vastu";

export type CentrePoint = { x: number; y: number };

// How far (in normalized 0–1 plan coordinates, on each axis) a room can sit
// from the centre point and still count as the Brahmasthan rather than a
// compass sector. Classical Vastu grids the plot into a 3x3 or 9x9 mandala;
// this sits between those (a 3x3 grid's centre cell would be ~0.167, a 9x9
// grid's centre cell alone would be ~0.056) — deliberately on the stricter
// side so only genuinely central placements get flagged, not anything
// merely "near-ish" the middle. Exported so the UI can render the same zone
// it's scored against instead of a decorative, unrelated box.
export const CENTRE_ZONE_RADIUS = 0.1;

// Normalize angle to [0, 360)
function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Given a room position (x,y in 0–1), centre, and rotationDeg (how much the
 * image is rotated CLOCKWISE), return world Direction (N, NE, E, ... or
 * Centre if the point falls within the Brahmasthan zone).
 */
export function directionForPoint(
  x: number,
  y: number,
  centre: CentrePoint,
  rotationDeg: number
): Direction {
  const dx = x - centre.x;
  const dy = y - centre.y;

  // Square zone (not a circle) — matches the classical grid/mandala
  // approach of dividing the plot into square cells, and matches the
  // dashed square already shown to users on the Set Centre step.
  if (Math.abs(dx) < CENTRE_ZONE_RADIUS && Math.abs(dy) < CENTRE_ZONE_RADIUS) {
    return "Centre";
  }

  // Screen angle: 0° = East, 90° = North, CCW positive
  const rad = Math.atan2(-dy, dx);
  const screenDeg = (rad * 180) / Math.PI;

  // World angle compensating for clockwise image rotation
  const worldDeg = normalizeAngle(screenDeg + rotationDeg);

  // Map to 8 sectors of 45°
  if (worldDeg >= 337.5 || worldDeg < 22.5) return "E";
  if (worldDeg >= 22.5 && worldDeg < 67.5) return "NE";
  if (worldDeg >= 67.5 && worldDeg < 112.5) return "N";
  if (worldDeg >= 112.5 && worldDeg < 157.5) return "NW";
  if (worldDeg >= 157.5 && worldDeg < 202.5) return "W";
  if (worldDeg >= 202.5 && worldDeg < 247.5) return "SW";
  if (worldDeg >= 247.5 && worldDeg < 292.5) return "S";
  return "SE";
}