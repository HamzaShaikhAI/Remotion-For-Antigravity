import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface VolumetricGodRaysShaderProps {
  rayColor?: string;
  angleDeg?: number;
  density?: number;
  intensity?: number;
}

/**
 * Volumetric Light Shafts & God-Rays Shader
 *
 * Atmospheric light beams cast across the battlefield, reacting to character momentum.
 */
export const VolumetricGodRaysShader: React.FC<VolumetricGodRaysShaderProps> = ({
  rayColor = 'rgba(255, 220, 120, 0.25)',
  angleDeg = 45,
  intensity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame * 0.04) * 8;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: intensity,
        background: `repeating-linear-gradient(${angleDeg + shift}deg, ${rayColor} 0px, transparent 40px, ${rayColor} 80px, transparent 140px)`,
      }}
    />
  );
};
