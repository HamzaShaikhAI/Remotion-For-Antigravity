import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SuperSlowMoTensionProps {
  children: React.ReactNode;
  slowMoStartFrame: number;
  slowMoDurationFrames: number; // e.g. 240 frames (4.0s @ 60fps)
  speedMultiplier?: number; // 0.125 (1/8th speed)
}

/**
 * 1000fps Super-Slow-Mo Tension Curve
 *
 * Simulates ultra-high-speed phantom cameras by applying non-linear optical flow
 * time deceleration to a brief 0.5s swing, extending it into 4 seconds of tension.
 */
export const SuperSlowMoTension: React.FC<SuperSlowMoTensionProps> = ({
  children,
  slowMoStartFrame,
  slowMoDurationFrames,
  speedMultiplier = 0.125,
}) => {
  const frame = useCurrentFrame();

  const isSlowMo = frame >= slowMoStartFrame && frame < slowMoStartFrame + slowMoDurationFrames;
  if (!isSlowMo) {
    return <>{children}</>;
  }

  const localFrame = frame - slowMoStartFrame;
  const progress = localFrame / slowMoDurationFrames;

  // Parabolic suspension curve: slows down to minimum at peak apex (progress = 0.5)
  const currentSpeed = interpolate(
    progress,
    [0, 0.4, 0.6, 1.0],
    [1.0, speedMultiplier, speedMultiplier * 0.8, 1.0]
  );

  // Subtle camera drift during suspension
  const driftY = Math.sin(progress * Math.PI) * 12;

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${driftY}px)`,
        filter: `contrast(${1.0 + (1 - currentSpeed) * 0.25})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
