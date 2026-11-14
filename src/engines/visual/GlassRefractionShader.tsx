import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface GlassRefractionShaderProps {
  children: React.ReactNode;
  shardCount?: number;
  chromaticShiftPx?: number;
}

/**
 * Chromatic Dispersion & Glass Refraction
 *
 * Simulates shattered lens glass shards and prism chromatic dispersion across impact frames.
 */
export const GlassRefractionShader: React.FC<GlassRefractionShaderProps> = ({
  children,
  chromaticShiftPx = 6,
}) => {
  const frame = useCurrentFrame();
  const shift = (frame % 3 === 0) ? chromaticShiftPx : 0;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {shift > 0 ? (
        <>
          <AbsoluteFill style={{ transform: `translateX(${-shift}px)`, filter: 'drop-shadow(2px 0 0 rgba(255,0,0,0.6))' }}>
            {children}
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `translateX(${shift}px)`, filter: 'drop-shadow(-2px 0 0 rgba(0,255,255,0.6))', mixBlendMode: 'screen' }}>
            {children}
          </AbsoluteFill>
        </>
      ) : (
        children
      )}
    </AbsoluteFill>
  );
};
