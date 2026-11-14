import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SelfDrawingSvgPathProps {
  pathData: string;
  strokeColor?: string;
  strokeWidth?: number;
  durationInFrames?: number;
  startFrame?: number;
  glow?: boolean;
  glowColor?: string;
  reverse?: boolean;
}

/**
 * SelfDrawingSvgPath
 * Deterministically animates SVG stroke drawing using strokeDasharray / strokeDashoffset.
 * Zero Math.random().
 */
export const SelfDrawingSvgPath: React.FC<SelfDrawingSvgPathProps> = ({
  pathData,
  strokeColor = '#38bdf8',
  strokeWidth = 3,
  durationInFrames = 60,
  startFrame = 0,
  glow = true,
  glowColor = 'rgba(56, 189, 248, 0.4)',
  reverse = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = Math.max(0, frame - startFrame);

  // Approximate path length metric
  const pathLength = 1000;

  const progress = spring({
    frame: activeFrame,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 80,
    },
  });

  const clampedProgress = Math.min(1, Math.max(0, progress));

  const dashOffset = reverse
    ? interpolate(clampedProgress, [0, 1], [-pathLength, 0])
    : interpolate(clampedProgress, [0, 1], [pathLength, 0]);

  return (
    <g style={{ filter: glow ? `drop-shadow(0 0 8px ${glowColor})` : 'none' }}>
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
    </g>
  );
};
