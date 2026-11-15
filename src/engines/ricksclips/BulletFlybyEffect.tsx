import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface BulletFlybyEffectProps {
  progress?: number; // 0 to 1
}

export const BulletFlybyEffect: React.FC<BulletFlybyEffectProps> = ({ progress = 0 }) => {
  const frame = useCurrentFrame();

  // Bullet trajectory: flying from midground (far) into extreme foreground (bottom left)
  const posX = interpolate(progress, [0, 1], [720, 280]);
  const posY = interpolate(progress, [0, 1], [400, 1420]);
  const scale = interpolate(progress, [0, 1], [0.15, 1.35]);
  const rot = interpolate(progress, [0, 1], [-45, -35]);

  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <svg width="240" height="140" viewBox="-120 -70 240 140" style={{ overflow: 'visible' }}>
        <defs>
          {/* Copper Bullet Metallic Gradient */}
          <linearGradient id="bulletCopper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          {/* Rifling Groove Shadow */}
          <linearGradient id="grooveShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Motion Streak Speed Lines */}
        <g stroke="#ffffff" opacity="0.65" strokeLinecap="round">
          <line x1="-140" y1="-25" x2="-60" y2="-25" strokeWidth="4" />
          <line x1="-180" y1="0" x2="-70" y2="0" strokeWidth="6" />
          <line x1="-130" y1="25" x2="-60" y2="25" strokeWidth="4" />
        </g>

        {/* Base Rim of Bullet */}
        <ellipse cx="-55" cy="0" rx="16" ry="38" fill="#1c1917" stroke="#09090b" strokeWidth="5" />

        {/* Bullet Body (Cylindrical Section) */}
        <path
          d="M -55 -38 L 10 -38 L 10 38 L -55 38 Z"
          fill="url(#bulletCopper)"
          stroke="#09090b"
          strokeWidth="5"
        />

        {/* Ogive Aerodynamic Pointed Tip */}
        <path
          d="M 10 -38 C 45 -38, 75 -20, 85 0 C 75 20, 45 38, 10 38 Z"
          fill="url(#bulletCopper)"
          stroke="#09090b"
          strokeWidth="5"
        />

        {/* 3 Rifling Grooves (Laser-etched lines) */}
        <line x1="-30" y1="-26" x2="25" y2="-26" stroke="#451a03" strokeWidth="3" />
        <line x1="-25" y1="0" x2="35" y2="0" stroke="#451a03" strokeWidth="3.5" />
        <line x1="-30" y1="26" x2="25" y2="26" stroke="#451a03" strokeWidth="3" />

        {/* Specular White Glint */}
        <ellipse cx="25" cy="-14" rx="18" ry="4" fill="#ffffff" opacity="0.75" />
      </svg>
    </div>
  );
};
