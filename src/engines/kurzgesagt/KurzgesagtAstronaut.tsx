// src/engines/kurzgesagt/KurzgesagtAstronaut.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { MascotProps } from './types';

export const KurzgesagtAstronaut: React.FC<MascotProps> = ({
  x = 0,
  y = 0,
  scale = 1.0,
  targetLookAt = null,
  lookAtCamera = true,
  costume = 'astronaut',
  antennaBlinkRate = 15,
  squashStretch = 1.0,
  idleBobIntensity = 1.0,
  ambientFrame: overrideAmbientFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = overrideAmbientFrame !== undefined ? overrideAmbientFrame : currentFrame;

  // Idle harmonic bob (floating in zero-g)
  const bobY = Math.sin((frame / fps) * Math.PI * 1.5) * 8 * idleBobIntensity;
  const bobRot = Math.sin((frame / fps) * Math.PI * 0.75) * 2 * idleBobIntensity;

  // Antenna blinking light (every N frames)
  const isAntennaLit = Math.floor(frame / antennaBlinkRate) % 2 === 0;

  // Eye tracking offsets
  let eyeOffsetX = 0;
  let eyeOffsetY = 0;
  if (targetLookAt) {
    const dx = targetLookAt.x - x;
    const dy = targetLookAt.y - y;
    const angle = Math.atan2(dy, dx);
    eyeOffsetX = Math.cos(angle) * 7;
    eyeOffsetY = Math.sin(angle) * 4;
  } else if (!lookAtCamera) {
    eyeOffsetX = -5; // default look left towards Sun
  }

  // Dimensions
  const mascotWidth = 140 * scale;
  const mascotHeight = 180 * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) translate3d(0px, ${bobY}px, 0px) rotate(${bobRot}deg) scale(${scale})`,
        width: `${mascotWidth}px`,
        height: `${mascotHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45))',
      }}
    >
      <svg
        width="140"
        height="180"
        viewBox="0 0 140 180"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Visor Gradient: #1f5a73 to #0a1c2c */}
          <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f5a73" />
            <stop offset="100%" stopColor="#0a1c2c" />
          </linearGradient>

          {/* Visor Reflection Streak */}
          <linearGradient id="visor-glare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Antenna Glow */}
          <filter id="antenna-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Antenna Rod & Blinking Bulb */}
        <line x1="70" y1="26" x2="70" y2="10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle
          cx="70"
          cy="8"
          r="5"
          fill={isAntennaLit ? '#ffc857' : '#ef4444'}
          filter={isAntennaLit ? 'url(#antenna-glow)' : 'none'}
        />

        {/* 2. Helmet (Base suit: #f3f7fb) */}
        <rect
          x="26"
          y="24"
          width="88"
          height="72"
          rx="36"
          fill="#f3f7fb"
          stroke="#0f172a"
          strokeWidth="3.5"
        />

        {/* 3. Visor (#1f5a73 to #0a1c2c) */}
        <rect
          x="36"
          y="34"
          width="68"
          height="48"
          rx="22"
          fill="url(#visor-grad)"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Visor Glare Streak */}
        <path
          d="M 44 42 Q 70 36 94 44"
          fill="none"
          stroke="url(#visor-glare)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 4. Glowing Cyan Eyes (#22d3ee) */}
        <g transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`}>
          {/* Left Eye */}
          <ellipse
            cx="58"
            cy="56"
            rx="4.5"
            ry="6"
            fill="#22d3ee"
            boxShadow="0 0 10px #22d3ee"
          />
          {/* Right Eye */}
          <ellipse
            cx="82"
            cy="56"
            rx="4.5"
            ry="6"
            fill="#22d3ee"
            boxShadow="0 0 10px #22d3ee"
          />
        </g>

        {/* 5. Costume Accessory Overlays */}
        {costume === 'pirate' ? (
          <g>
            {/* Pirate Red Bandana */}
            <path
              d="M 24 38 Q 70 22 116 38 Q 110 50 26 50 Z"
              fill="#ef4444"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Bandana Knot Tails */}
            <path d="M 114 42 Q 130 50 126 62 Q 120 54 114 48 Z" fill="#ef4444" />

            {/* Pirate Tricorn Hat with Skull */}
            <path
              d="M 15 28 Q 70 -12 125 28 Q 70 14 15 28 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            <path d="M 15 28 Q 70 18 125 28" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="70" cy="14" r="5" fill="#f8fafc" />
            <circle cx="68" cy="13" r="1" fill="#0f172a" />
            <circle cx="72" cy="13" r="1" fill="#0f172a" />
          </g>
        ) : costume === 'sunglasses' ? (
          /* Sunglasses Drop Accessory */
          <g transform="translate(0, 52)">
            <rect x="42" y="-4" width="24" height="14" rx="4" fill="#0f172a" />
            <rect x="74" y="-4" width="24" height="14" rx="4" fill="#0f172a" />
            <line x1="66" y1="2" x2="74" y2="2" stroke="#0f172a" strokeWidth="3" />
            {/* Cool Sunglasses Glare */}
            <line x1="45" y1="6" x2="52" y2="-2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="77" y1="6" x2="84" y2="-2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : null}

        {/* 6. Astronaut Torso */}
        {costume === 'pirate' ? (
          // Striped Sailor Shirt
          <g>
            <rect
              x="38"
              y="94"
              width="64"
              height="48"
              rx="14"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            <line x1="39" y1="106" x2="101" y2="106" stroke="#ef4444" strokeWidth="5" />
            <line x1="39" y1="120" x2="101" y2="120" stroke="#ef4444" strokeWidth="5" />
          </g>
        ) : (
          // Standard Clean Space Suit Torso (#f3f7fb)
          <rect
            x="38"
            y="94"
            width="64"
            height="48"
            rx="14"
            fill="#f3f7fb"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}

        {/* Chest Control Badge */}
        <rect x="58" y="102" width="24" height="12" rx="4" fill="#0f172a" />
        <circle cx="64" cy="108" r="2" fill="#38bdf8" />
        <circle cx="72" cy="108" r="2" fill="#4ade80" />
        <circle cx="78" cy="108" r="2" fill="#f87171" />

        {/* 7. Rounded Mitten Arms */}
        <rect
          x="22"
          y="98"
          width="18"
          height="32"
          rx="9"
          fill="#f3f7fb"
          stroke="#0f172a"
          strokeWidth="3"
          transform="rotate(12 31 114)"
        />
        <rect
          x="100"
          y="98"
          width="18"
          height="32"
          rx="9"
          fill="#f3f7fb"
          stroke="#0f172a"
          strokeWidth="3"
          transform="rotate(-12 109 114)"
        />

        {/* 8. Legs & Vibrant Orange Boots (#ff8f4a) */}
        {/* Left Leg & Boot */}
        <rect x="44" y="138" width="20" height="20" rx="6" fill="#f3f7fb" stroke="#0f172a" strokeWidth="3" />
        <rect x="40" y="152" width="26" height="16" rx="8" fill="#ff8f4a" stroke="#0f172a" strokeWidth="3" />

        {/* Right Leg & Boot */}
        <rect x="76" y="138" width="20" height="20" rx="6" fill="#f3f7fb" stroke="#0f172a" strokeWidth="3" />
        <rect x="74" y="152" width="26" height="16" rx="8" fill="#ff8f4a" stroke="#0f172a" strokeWidth="3" />
      </svg>
    </div>
  );
};
