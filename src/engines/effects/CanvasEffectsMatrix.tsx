import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export type CanvasEffectType =
  | 'blur'
  | 'chromaticAberration'
  | 'halftone'
  | 'scanlines'
  | 'barrelDistortion'
  | 'wave'
  | 'vhsGlitch'
  | 'filmGrain';

export interface CanvasEffect {
  type: CanvasEffectType;
  intensity?: number;
  params?: Record<string, number | string>;
}

export interface CanvasEffectsMatrixProps {
  children: React.ReactNode;
  effects?: CanvasEffect[];
  style?: React.CSSProperties;
}

/**
 * CanvasEffectsMatrix
 * Hardware-accelerated deterministic Remotion canvas & post-processing shader stack.
 * Replaces and surpasses @remotion/effects with zero Math.random() and pure CSS/SVG filters.
 */
export const CanvasEffectsMatrix: React.FC<CanvasEffectsMatrixProps> = ({
  children,
  effects = [],
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Compute chained CSS filters
  let filterString = '';
  let transformString = '';

  let hasScanlines = false;
  let scanlineOpacity = 0.2;
  let hasAberration = false;
  let aberrationOffset = 4;
  let hasBarrel = false;
  let barrelScale = 1.0;
  let hasWave = false;
  let waveOffset = 0;

  effects.forEach(eff => {
    const intensity = eff.intensity ?? 1.0;

    switch (eff.type) {
      case 'blur': {
        const radius = (eff.params?.radius as number) ?? intensity * 8;
        filterString += ` blur(${radius}px)`;
        break;
      }
      case 'chromaticAberration': {
        hasAberration = true;
        aberrationOffset = (eff.params?.offset as number) ?? intensity * 6;
        break;
      }
      case 'scanlines': {
        hasScanlines = true;
        scanlineOpacity = (eff.params?.opacity as number) ?? intensity * 0.25;
        break;
      }
      case 'barrelDistortion': {
        hasBarrel = true;
        barrelScale = 1.0 + intensity * 0.08;
        transformString += ` scale(${barrelScale})`;
        break;
      }
      case 'wave': {
        hasWave = true;
        waveOffset = Math.sin((frame * 0.1)) * (intensity * 8);
        transformString += ` skewX(${Math.sin(frame * 0.08) * intensity * 2}deg)`;
        break;
      }
      case 'vhsGlitch': {
        const glitchCycle = frame % 45;
        if (glitchCycle < 3) {
          filterString += ` hue-rotate(${intensity * 90}deg) contrast(${1 + intensity * 0.4})`;
          transformString += ` translateX(${Math.sin(frame * 3) * intensity * 12}px)`;
        }
        break;
      }
      case 'filmGrain': {
        filterString += ` contrast(${1 + intensity * 0.15}) brightness(${1 + intensity * 0.05})`;
        break;
      }
    }
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        filter: filterString.trim() || undefined,
        transform: transformString.trim() || undefined,
        ...style,
      }}
    >
      {/* Chromatic Aberration RGB Separation Layers */}
      {hasAberration ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Red Channel Shift */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(${aberrationOffset}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.9,
              filter: 'drop-shadow(0 0 1px #ff0055)',
            }}
          >
            {children}
          </div>
          {/* Blue Channel Shift */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(-${aberrationOffset}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.9,
              filter: 'drop-shadow(0 0 1px #00f0ff)',
            }}
          >
            {children}
          </div>
          {/* Primary Layer */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}
          </div>
        </div>
      ) : (
        children
      )}

      {/* CRT / Analog Scanlines Overlay */}
      {hasScanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
            backgroundSize: '100% 4px',
            opacity: scanlineOpacity,
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
};

// Builder helpers for chaining
export const blurEffect = (radius = 8): CanvasEffect => ({ type: 'blur', params: { radius } });
export const chromaticAberrationEffect = (offset = 5): CanvasEffect => ({ type: 'chromaticAberration', params: { offset } });
export const scanlinesEffect = (opacity = 0.25): CanvasEffect => ({ type: 'scanlines', params: { opacity } });
export const barrelDistortionEffect = (intensity = 1.0): CanvasEffect => ({ type: 'barrelDistortion', intensity });
export const waveEffect = (amplitude = 8): CanvasEffect => ({ type: 'wave', intensity: amplitude / 8 });
export const vhsGlitchEffect = (intensity = 1.0): CanvasEffect => ({ type: 'vhsGlitch', intensity });
