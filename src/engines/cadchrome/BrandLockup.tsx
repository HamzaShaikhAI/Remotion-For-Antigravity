import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';

export interface BrandLockupProps {
  frame: number;
  entranceFrame: number; // e.g. frame 840
  brandName?: string;
  brandSuffix?: string;
  style?: React.CSSProperties;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({
  frame,
  entranceFrame,
  brandName = 'amani',
  brandSuffix = '/studio',
  style = {},
}) => {
  const { fps } = useVideoConfig();

  // Smooth ease-out-quint vertical slide-up spring
  const textSpring = spring({
    frame: frame - entranceFrame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.9 },
  });

  const translateY = interpolate(textSpring, [0, 1], [80, 0]);
  const opacity = interpolate(textSpring, [0, 0.4], [0, 1.0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 240,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          display: 'flex',
          alignItems: 'baseline',
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 68,
          letterSpacing: -1.5,
          textShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span style={{ fontWeight: 800, color: '#ffffff' }}>{brandName}</span>
        <span style={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.55)' }}>{brandSuffix}</span>
      </div>
    </div>
  );
};
