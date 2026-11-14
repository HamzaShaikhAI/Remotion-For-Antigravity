import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface DynamicHalftoneMangaProps {
  dotSizePx?: number;
  contrast?: number;
  opacity?: number;
}

/**
 * Dynamic Halftone Screen-Tone Generator
 *
 * Simulates manga print screentone dot patterns that pulse rhythmically with the beat.
 */
export const DynamicHalftoneManga: React.FC<DynamicHalftoneMangaProps> = ({
  dotSizePx = 6,
  contrast = 1.3,
  opacity = 0.25,
}) => {
  const frame = useCurrentFrame();
  const pulse = dotSizePx + (frame % 4);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity,
        backgroundImage: `radial-gradient(#000000 20%, transparent 20%)`,
        backgroundSize: `${pulse}px ${pulse}px`,
        filter: `contrast(${contrast})`,
      }}
    />
  );
};
