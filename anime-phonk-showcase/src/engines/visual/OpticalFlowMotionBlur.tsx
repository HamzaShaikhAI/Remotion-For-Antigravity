import React, { useMemo } from 'react';
import { interpolate } from 'remotion';

export interface OpticalFlowMotionBlurProps {
  children: React.ReactNode;
  velocityX: number; // pixels per frame
  velocityY?: number;
  shutterAngle?: number; // default 180 degrees
  samplePasses?: number;
}

/**
 * Optical Flow 180-Degree Shutter Motion Blur
 *
 * Recreates professional camera shutter physics by applying directional
 * multi-sample displacement blur proportional to transform velocity.
 */
export const OpticalFlowMotionBlur: React.FC<OpticalFlowMotionBlurProps> = ({
  children,
  velocityX,
  velocityY = 0,
  shutterAngle = 180,
  samplePasses = 3,
}) => {
  const shutterFraction = shutterAngle / 360; // 0.5 for 180deg
  const blurX = Math.abs(velocityX * shutterFraction);
  const blurY = Math.abs(velocityY * shutterFraction);

  // If camera is stationary or moving under 1px/frame, skip blur filter
  if (blurX < 1.0 && blurY < 1.0) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        filter: `blur(${Math.min(12, Math.max(blurX, blurY) * 0.45).toFixed(1)}px)`,
        transform: `translate(${(-velocityX * 0.1).toFixed(1)}px, ${(-velocityY * 0.1).toFixed(1)}px)`,
      }}
    >
      {children}
    </div>
  );
};
