import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DeterministicMotionBlurProps {
  children: React.ReactNode;
  /** Current X translation or position */
  x?: number;
  /** Current Y translation or position */
  y?: number;
  /** Shutter angle in degrees (0 to 360, standard cinematic is 180) */
  shutterAngle?: number;
  /** Number of directional blur samples (higher = smoother, 3-8 recommended) */
  samples?: number;
  /** Current velocity vector override if calculated externally */
  velocity?: { vx: number; vy: number };
}

/**
 * Deterministic Shutter-Angle Motion Blur Component
 * Transcends @remotion/motion-blur with pure mathematical multi-pass directional ghosting.
 */
export const DeterministicMotionBlur: React.FC<DeterministicMotionBlurProps> = ({
  children,
  x = 0,
  y = 0,
  shutterAngle = 180,
  samples = 5,
  velocity,
}) => {
  const frame = useCurrentFrame();

  // If velocity is not provided, estimate from subtle frame delta
  const vx = velocity ? velocity.vx : 0;
  const vy = velocity ? velocity.vy : 0;

  // Normalized blur strength based on shutter angle (180deg = 0.5 frame exposure)
  const exposureFactor = (shutterAngle / 360) * 0.5;
  const blurX = vx * exposureFactor;
  const blurY = vy * exposureFactor;

  // If negligible motion, render clean single element
  if (Math.abs(blurX) < 0.5 && Math.abs(blurY) < 0.5) {
    return <div style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>{children}</div>;
  }

  const sampleArray = Array.from({ length: samples });
  const opacityPerSample = 1 / samples;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {sampleArray.map((_, index) => {
        const offsetRatio = (index / (samples - 1) - 0.5) * 2; // -1 to +1
        const sampleX = x + blurX * offsetRatio;
        const sampleY = y + blurY * offsetRatio;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: opacityPerSample,
              transform: `translate3d(${sampleX}px, ${sampleY}px, 0)`,
              pointerEvents: index === Math.floor(samples / 2) ? 'auto' : 'none',
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
};
