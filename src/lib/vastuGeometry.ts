// src/lib/vastuGeometry.ts
import type { Direction } from "@/types/vastu";

export type CentrePoint = { x: number; y: number };

// Normalize angle to [0, 360)
function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Given a room position (x,y in 0–1), centre, and rotationDeg (how much the
 * image is rotated CLOCKWISE), return world Direction (N, NE, E, ...).
 */
export function directionForPoint(
  x: number,
  y: number,
  centre: CentrePoint,
  rotationDeg: number
): Direction {
  const dx = x - centre.x;
  const dy = y - centre.y;

  if (Math.abs(dx) < 1e-4 && Math.abs(dy) < 1e-4) {
    // Very close to center – treat as N by default
    return "N";
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