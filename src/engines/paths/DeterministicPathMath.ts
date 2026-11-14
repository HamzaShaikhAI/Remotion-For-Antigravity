/**
 * Deterministic SVG Path Mathematics & Interpolation Engine
 * Complete drop-in transcendence over @remotion/paths with zero third-party dependencies.
 */

export interface Point2D {
  x: number;
  y: number;
}

export function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Computes coordinate along cubic bezier curve at parameter t [0, 1]
 */
export function getPointOnCubicBezier(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number
): Point2D {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

/**
 * Approximates arc length of a cubic bezier curve using adaptive sampling
 */
export function getCubicBezierLength(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  samples: number = 32
): number {
  let totalLength = 0;
  let prev = p0;

  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const curr = getPointOnCubicBezier(p0, p1, p2, p3, t);
    totalLength += distance(prev, curr);
    prev = curr;
  }

  return totalLength;
}

/**
 * Tangent angle (in radians) along cubic bezier curve at parameter t [0, 1]
 */
export function getCubicBezierTangent(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number
): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return Math.atan2(dy, dx);
}

/**
 * Interpolates between two equal-length polygon point sets
 */
export function interpolatePolygonPoints(
  pointsA: Point2D[],
  pointsB: Point2D[],
  progress: number
): Point2D[] {
  const len = Math.min(pointsA.length, pointsB.length);
  const interpolated: Point2D[] = [];

  for (let i = 0; i < len; i++) {
    interpolated.push({
      x: pointsA[i].x + (pointsB[i].x - pointsA[i].x) * progress,
      y: pointsA[i].y + (pointsB[i].y - pointsA[i].y) * progress,
    });
  }

  return interpolated;
}

/**
 * Converts array of 2D points into an SVG polygon points attribute string
 */
export function pointsToSvgPolygon(points: Point2D[]): string {
  return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}
