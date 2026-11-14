import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface DatamoshShaderProps {
  children: React.ReactNode;
  triggerFrame?: number;
  durationFrames?: number;
  glitchIntensity?: number;
}

/**
 * Procedural Glitch & Datamoshing Shaders
 *
 * Simulates codec macroblock compression artifacts and delta-frame tearing on snare hits.
 */
export const DatamoshShader: React.FC<DatamoshShaderProps> = ({
  children,
  triggerFrame = 0,
  durationFrames = 8,
  glitchIntensity = 12,
}) => {
  const frame = useCurrentFrame();
  const isActive = frame >= triggerFrame && frame < triggerFrame + durationFrames;

  if (!isActive) return <>{children}</>;

  const offset = ((frame % 3) - 1) * glitchIntensity;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${offset}px)`,
        filter: `hue-rotate(${offset * 15}deg) contrast(140%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
