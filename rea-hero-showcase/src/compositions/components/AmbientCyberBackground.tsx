import React from 'react';
import { useCurrentFrame } from 'remotion';
import { NeonEmbers } from '../../plugins/rea-particles';

export const AmbientCyberBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const glow1X = 30 + Math.sin(frame * 0.015) * 12;
  const glow1Y = 35 + Math.cos(frame * 0.02) * 10;

  const glow2X = 70 + Math.cos(frame * 0.018) * 14;
  const glow2Y = 65 + Math.sin(frame * 0.015) * 12;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#05070E',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Radial Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          left: `${glow1X}%`,
          top: `${glow1Y}%`,
          width: 750,
          height: 750,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.22) 0%, rgba(0, 245, 255, 0) 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${glow2X}%`,
          top: `${glow2Y}%`,
          width: 850,
          height: 850,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0) 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Deterministic Neon Embers */}
      <NeonEmbers count={65} />

      {/* Technical Grid Overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
        }}
      >
        <defs>
          <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3, 4, 8, 0.85) 100%)',
        }}
      />
    </div>
  );
};
