import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface VhsCrtDegradeShaderProps {
  children: React.ReactNode;
  scanlineIntensity?: number;
  flickerSpeed?: number;
}

/**
 * Procedural VHS Tape Degrade & CRT Shader
 *
 * Emulates retro 90s anime VHS tracking lines, RGB color bleeding, and scanline flicker.
 */
export const VhsCrtDegradeShader: React.FC<VhsCrtDegradeShaderProps> = ({
  children,
  scanlineIntensity = 0.18,
  flickerSpeed = 0.2,
}) => {
  const frame = useCurrentFrame();
  const scanlineShift = (frame * 2) % 6;
  const flicker = 1.0 + Math.sin(frame * flickerSpeed) * 0.04;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Visual Content Layer */}
      <AbsoluteFill style={{ filter: `contrast(115%) brightness(${flicker})` }}>
        {children}
      </AbsoluteFill>

      {/* CRT Scanline Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: scanlineIntensity,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
          backgroundSize: '100% 4px',
          transform: `translateY(${scanlineShift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
