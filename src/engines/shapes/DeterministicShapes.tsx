import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '../effects/noise';

export interface BaseShapeProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation?: number;
  scale?: number;
  springEntrance?: boolean;
  style?: React.CSSProperties;
}

/**
 * Deterministic Regular Polygon Primitive (Triangle, Pentagon, Hexagon, Octagon)
 * Transcends @remotion/shapes with native spring physics and zero dependencies.
 */
export const PolygonShape: React.FC<
  BaseShapeProps & {
    sides: number;
    radius: number;
    cx?: number;
    cy?: number;
  }
> = ({
  sides = 6,
  radius = 100,
  cx = 150,
  cy = 150,
  fill = '#38bdf8',
  stroke = '#0284c7',
  strokeWidth = 2,
  rotation = 0,
  scale = 1,
  springEntrance = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = springEntrance
    ? spring({ frame, fps, config: { damping: 12, stiffness: 100 } })
    : 1;

  const effectiveRadius = radius * scale * entrance;
  const points: string[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2 + (rotation * Math.PI) / 180;
    const x = cx + effectiveRadius * Math.cos(angle);
    const y = cy + effectiveRadius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <svg width={cx * 2} height={cy * 2} style={style}>
      <polygon points={points.join(' ')} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};

/**
 * Deterministic Star Primitive
 */
export const StarShape: React.FC<
  BaseShapeProps & {
    points?: number;
    innerRadius?: number;
    outerRadius?: number;
    cx?: number;
    cy?: number;
  }
> = ({
  points = 5,
  innerRadius = 45,
  outerRadius = 100,
  cx = 150,
  cy = 150,
  fill = '#fbbf24',
  stroke = '#d97706',
  strokeWidth = 2,
  rotation = 0,
  scale = 1,
  springEntrance = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = springEntrance
    ? spring({ frame, fps, config: { damping: 14, stiffness: 110 } })
    : 1;

  const pts: string[] = [];
  const total = points * 2;

  for (let i = 0; i < total; i++) {
    const r = (i % 2 === 0 ? outerRadius : innerRadius) * scale * entrance;
    const angle = (i * Math.PI) / points - Math.PI / 2 + (rotation * Math.PI) / 180;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x},${y}`);
  }

  return (
    <svg width={cx * 2} height={cy * 2} style={style}>
      <polygon points={pts.join(' ')} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};

/**
 * Deterministic Circular Arc Segment
 */
export const ArcShape: React.FC<
  BaseShapeProps & {
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    cx?: number;
    cy?: number;
  }
> = ({
  radius = 80,
  startAngle = 0,
  endAngle = 270,
  cx = 100,
  cy = 100,
  fill = 'none',
  stroke = '#818cf8',
  strokeWidth = 6,
  style,
}) => {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

  return (
    <svg width={cx * 2} height={cy * 2} style={style}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};

/**
 * Deterministic Organic Animated Blob Shape
 */
export const BlobShape: React.FC<
  BaseShapeProps & {
    radius?: number;
    pointsCount?: number;
    cx?: number;
    cy?: number;
  }
> = ({
  radius = 90,
  pointsCount = 8,
  cx = 120,
  cy = 120,
  fill = '#ec4899',
  stroke = 'none',
  strokeWidth = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const coords: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i * 2 * Math.PI) / pointsCount;
    const wave = noise2D(Math.cos(angle) + frame * 0.04, Math.sin(angle) + frame * 0.04);
    const r = radius + wave * 24;
    coords.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }

  // Build smooth closed SVG path
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length; i++) {
    const curr = coords[i];
    const next = coords[(i + 1) % coords.length];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q ${curr.x} ${curr.y}, ${midX} ${midY}`;
  }
  d += ' Z';

  return (
    <svg width={cx * 2} height={cy * 2} style={style}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};
