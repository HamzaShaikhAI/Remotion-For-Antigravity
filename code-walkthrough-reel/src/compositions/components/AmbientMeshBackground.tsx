import React from 'react';
import { useCurrentFrame } from 'remotion';

export const AmbientMeshBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Deterministic floating mesh orb coordinates (zero Math.random)
  const orb1X = 25 + Math.sin(frame * 0.015) * 12;
  const orb1Y = 30 + Math.cos(frame * 0.02) * 10;

  const orb2X = 75 + Math.cos(frame * 0.018) * 14;
  const orb2Y = 60 + Math.sin(frame * 0.014) * 12;

  const orb3X = 45 + Math.sin(frame * 0.022 + 1.5) * 10;
  const orb3Y = 80 + Math.cos(frame * 0.016 + 2.0) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#070A13',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Background Gradient Mesh Orbs */}
      <div
        style={{
          position: 'absolute',
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          width: 650,
          height: 650,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%)',
          filter: 'blur(75px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          width: 750,
          height: 750,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.30) 0%, rgba(139, 92, 246, 0) 70%)',
          filter: 'blur(85px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${orb3X}%`,
          top: `${orb3Y}%`,
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0) 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle Technical Grid Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.12,
        }}
      >
        <defs>
          <pattern id="mesh-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh-grid)" />
      </svg>

      {/* Vignette Overlay for Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4, 6, 12, 0.85) 100%)',
        }}
      />
    </div>
  );
};
