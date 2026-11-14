import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BezierVelocityPoint {
  frame: number;
  speedMultiplier: number; // e.g. 2.8 for fast dialogue, 0.3 for blade impact slow-mo
}

export interface BezierTimeRemappingProps {
  children: (virtualFrame: number, currentSpeed: number) => React.ReactNode;
  points: BezierVelocityPoint[];
}

/**
 * Bezier Time-Remapping Engine (Micro-Pacing)
 * Smoothly interpolates playback speed without chopping the scene into fragments:
 * rushes dialogue and approaches at 300% speed, then slams to 30% slow-motion
 * on the exact frame of blade impact.
 */
export const BezierTimeRemapping: React.FC<BezierTimeRemappingProps> = ({
  children,
  points,
}) => {
  const frame = useCurrentFrame();

  if (!points || points.length === 0) {
    return <>{children(frame, 1.0)}</>;
  }

  const sorted = [...points].sort((a, b) => a.frame - b.frame);
  const frames = sorted.map((p) => p.frame);
  const speeds = sorted.map((p) => p.speedMultiplier);

  let currentSpeed = 1.0;
  if (frame <= frames[0]) {
    currentSpeed = speeds[0];
  } else if (frame >= frames[frames.length - 1]) {
    currentSpeed = speeds[speeds.length - 1];
  } else {
    currentSpeed = interpolate(frame, frames, speeds, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Calculate cumulative virtual frame
  let virtualFrame = 0;
  for (let f = 0; f < frame; f++) {
    const s = interpolate(f, frames, speeds, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    virtualFrame += s;
  }

  return <>{children(Math.floor(virtualFrame), currentSpeed)}</>;
};
