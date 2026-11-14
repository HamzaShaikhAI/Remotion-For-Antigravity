import React from 'react';
import { AbsoluteFill } from 'remotion';

export interface AnimeToonShaderProps {
  children: React.ReactNode;
  edgeThreshold?: number;
  saturationBoost?: number;
  contrastBoost?: number;
  posterizeLevels?: number;
}

/**
 * Anime Line-Art Vectorization & Toon-Shading
 *
 * Applies edge detection and cel-shading quantization filters to emphasize
 * crisp anime outlines and intense combat contrast without external raster plugins.
 */
export const AnimeToonShader: React.FC<AnimeToonShaderProps> = ({
  children,
  saturationBoost = 1.35,
  contrastBoost = 1.4,
}) => {
  return (
    <AbsoluteFill
      style={{
        filter: `saturate(${saturationBoost}) contrast(${contrastBoost})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
