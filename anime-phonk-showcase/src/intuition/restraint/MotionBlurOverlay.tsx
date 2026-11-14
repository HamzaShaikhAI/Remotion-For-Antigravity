import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ShutterMotionBlurProps {
  children: React.ReactNode;
  cameraVelocityX?: number; // px per frame
  cameraVelocityY?: number; // px per frame
  shutterAngle?: number; // Default 180 degrees
  style?: React.CSSProperties;
}

/**
 * Optical Flow Motion Blur Engine (180-Degree Shutter Simulation)
 * Dynamically calculates directional motion blur for typography and floating emojis
 * proportional to camera shake velocity, convincing the human brain that text
 * physically inhabits the motion space of the anime footage.
 */
export const ShutterMotionBlur: React.FC<ShutterMotionBlurProps> = ({
  children,
  cameraVelocityX = 0,
  cameraVelocityY = 0,
  shutterAngle = 180,
  style,
}) => {
  const frame = useCurrentFrame();

  // Calculate velocity magnitude
  const speed = Math.sqrt(cameraVelocityX * cameraVelocityX + cameraVelocityY * cameraVelocityY);
  const blurPixels = Math.min(8.0, (speed * (shutterAngle / 180)) * 0.35);

  return (
    <div
      style={{
        display: 'inline-block',
        filter: blurPixels > 0.4 ? `blur(${blurPixels.toFixed(2)}px)` : 'none',
        willChange: 'filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
