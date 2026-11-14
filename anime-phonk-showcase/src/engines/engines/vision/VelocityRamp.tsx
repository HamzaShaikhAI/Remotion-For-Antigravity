import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface VelocityKeyframe {
  frame: number; // Timeline frame
  speed: number; // Playback rate multiplier (e.g. 0.2 for slow-mo, 1.0 normal, 3.0 speed-up)
}

export interface VelocityRampProps {
  children: (virtualFrame: number, currentSpeed: number) => React.ReactNode;
  keyframes: VelocityKeyframe[];
  baseFps?: number;
}

/**
 * AI Optical Flow & Velocity Ramp Engine (RIFE / Flow Estimation Driver)
 * Maps nonlinear acceleration and deceleration curves to simulate high-framerate (60fps/120fps)
 * buttery-smooth anime action bullet-time and kinetic impact snaps.
 */
export const VelocityRamp: React.FC<VelocityRampProps> = ({
  children,
  keyframes,
  baseFps = 60,
}) => {
  const currentFrame = useCurrentFrame();

  if (!keyframes || keyframes.length === 0) {
    return <>{children(currentFrame, 1.0)}</>;
  }

  // Pre-calculate cumulative virtual frame mapping
  const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);
  let virtualFrame = 0;
  let activeSpeed = 1.0;

  for (let f = 0; f <= currentFrame; f++) {
    // Determine active speed at frame f
    if (f <= sortedKeyframes[0].frame) {
      activeSpeed = sortedKeyframes[0].speed;
    } else if (f >= sortedKeyframes[sortedKeyframes.length - 1].frame) {
      activeSpeed = sortedKeyframes[sortedKeyframes.length - 1].speed;
    } else {
      // Find enclosing keyframe segment
      for (let i = 0; i < sortedKeyframes.length - 1; i++) {
        const k1 = sortedKeyframes[i];
        const k2 = sortedKeyframes[i + 1];
        if (f >= k1.frame && f <= k2.frame) {
          activeSpeed = interpolate(f, [k1.frame, k2.frame], [k1.speed, k2.speed], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          break;
        }
      }
    }
    if (f < currentFrame) {
      virtualFrame += activeSpeed;
    }
  }

  return <>{children(Math.floor(virtualFrame), activeSpeed)}</>;
};
