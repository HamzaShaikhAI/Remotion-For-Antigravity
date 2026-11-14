import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VectorMorphEngineProps {
  startPoints: Array<[number, number]>;
  endPoints: Array<[number, number]>;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  durationInFrames?: number;
  startFrame?: number;
}

export const VectorMorphEngine: React.FC<VectorMorphEngineProps> = ({
  startPoints = [[50, 10], [90, 90], [10, 90]], // Triangle
  endPoints = [[20, 20], [80, 20], [80, 80], [20, 80]], // Square
  strokeColor = '#38bdf8',
  fillColor = 'rgba(56, 189, 248, 0.2)',
  strokeWidth = 3,
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const clamped = Math.min(1, Math.max(0, progress));

  // Normalize point counts
  const maxPts = Math.max(startPoints.length, endPoints.length);
  const normalizedStart = Array.from({ length: maxPts }).map((_, i) => startPoints[i % startPoints.length]);
  const normalizedEnd = Array.from({ length: maxPts }).map((_, i) => endPoints[i % endPoints.length]);

  const currentPts = normalizedStart.map((p1, i) => {
    const p2 = normalizedEnd[i];
    const x = interpolate(clamped, [0, 1], [p1[0], p2[0]]);
    const y = interpolate(clamped, [0, 1], [p1[1], p2[1]]);
    return `${x},${y}`;
  });

  const pathD = `M ${currentPts[0]} L ${currentPts.slice(1).join(' ')} Z`;

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <path
        d={pathD}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))' }}
      />
    </svg>
  );
};
