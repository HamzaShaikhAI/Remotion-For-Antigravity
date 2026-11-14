import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface AnamorphicLensFlareProps {
  flareColor?: string;
  horizontalStreakWidthPx?: number;
  bloomIntensity?: number;
}

/**
 * Anamorphic Lens Flare & Optical Aberration
 *
 * Casts horizontal cyan/blue anamorphic laser streaks across high-luminance combat flashes.
 */
export const AnamorphicLensFlare: React.FC<AnamorphicLensFlareProps> = ({
  flareColor = '#00f5ff',
  horizontalStreakWidthPx = 800,
  bloomIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const pulse = 1.0 + Math.sin(frame * 0.15) * 0.2;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: 'screen',
        opacity: bloomIntensity,
      }}
    >
      {/* Horizontal Anamorphic Laser Streak */}
      <div
        style={{
          width: `${horizontalStreakWidthPx * pulse}px`,
          height: '4px',
          backgroundColor: '#ffffff',
          boxShadow: `0 0 20px ${flareColor}, 0 0 60px ${flareColor}`,
          borderRadius: '2px',
        }}
      />
    </AbsoluteFill>
  );
};
