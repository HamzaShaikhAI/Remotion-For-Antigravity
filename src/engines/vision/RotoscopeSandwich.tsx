import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RotoscopeSandwichProps {
  background: React.ReactNode;
  middleLayer: React.ReactNode; // Typography, floating HUD, or particles BEHIND subject
  foreground: React.ReactNode; // Subject with mask or isolated matte
  overlay?: React.ReactNode; // Film grain, lens flares, or chromatic aberration
  depthDistance?: number; // 3D depth separation factor (default 40px)
  parallaxIntensity?: number; // Camera motion parallax (default 1.0)
  style?: React.CSSProperties;
}

/**
 * Semantic Rotoscoping & 3D Sandwich Engine (SAM / Mask R-CNN Layering)
 * Places kinetic typography and visual VFX mathematically BEHIND the primary anime character
 * but in front of the background environment, creating true 3D spatial depth.
 */
export const RotoscopeSandwich: React.FC<RotoscopeSandwichProps> = ({
  background,
  middleLayer,
  foreground,
  overlay,
  depthDistance = 40,
  parallaxIntensity = 1.0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Subtle natural camera sway to accentuate the 3D parallax depth
  const swayX = Math.sin((frame * Math.PI) / 60) * 12 * parallaxIntensity;
  const swayY = Math.cos((frame * Math.PI) / 80) * 6 * parallaxIntensity;

  // Parallax offsets based on depth layers
  const bgOffsetX = swayX * 0.3;
  const bgOffsetY = swayY * 0.3;

  const midOffsetX = swayX * 0.7;
  const midOffsetY = swayY * 0.7;

  const fgOffsetX = swayX * 1.2;
  const fgOffsetY = swayY * 1.2;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '1200px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* 1. Deep Background Layer (Z: -depthDistance) */}
      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          transform: `translate3d(${bgOffsetX.toFixed(1)}px, ${bgOffsetY.toFixed(1)}px, ${-depthDistance}px) scale(1.08)`,
          zIndex: 1,
        }}
      >
        {background}
      </div>

      {/* 2. Middle Sandwich Layer (Kinetic Typography, VFX, HUD) (Z: 0) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${midOffsetX.toFixed(1)}px, ${midOffsetY.toFixed(1)}px, 0px)`,
          zIndex: 2,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {middleLayer}
      </div>

      {/* 3. Foreground Subject (Rotoscoped Character Mask) (Z: +depthDistance) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${fgOffsetX.toFixed(1)}px, ${fgOffsetY.toFixed(1)}px, ${depthDistance}px)`,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {foreground}
      </div>

      {/* 4. Global Lens & Atmosphere Overlay (Z: +depthDistance * 2) */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};
