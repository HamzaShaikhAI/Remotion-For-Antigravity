// src/engines/kurzgesagt/KurzgesagtDarknessFront.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface DarknessFrontProps {
  sunOrigin?: { x: number; y: number };
  startFrame: number;
  reachEarthFrame: number;
  earthPosition?: { x: number; y: number };
}

/**
 * Kurzgesagt Darkness Front Engine
 * Propagates an expanding dark disk with a 30px soft feathered edge from the Sun.
 * Moves at ~47px/s initially and ramps to 700px/s near Earth.
 */
export const KurzgesagtDarknessFront: React.FC<DarknessFrontProps> = ({
  sunOrigin = { x: 0, y: 540 },
  startFrame,
  reachEarthFrame,
  earthPosition = { x: 1400, y: 540 },
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (frame < startFrame) return null;

  // Calculate distance between Sun and Earth
  const totalDistance = Math.hypot(
    earthPosition.x - sunOrigin.x,
    earthPosition.y - sunOrigin.y
  );

  // Non-linear acceleration curve: starts at 47px/s and ramps up to 700px/s near Earth
  const tNorm = Math.min(
    1.4,
    (frame - startFrame) / Math.max(1, reachEarthFrame - startFrame)
  );

  // Cubic acceleration: distance = t^2.4
  const currentRadius = totalDistance * Math.pow(tNorm, 2.2);

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        {/* 30px Soft Edge Radial Gradient */}
        <radialGradient
          id="darkness-front-radial"
          cx={sunOrigin.x}
          cy={sunOrigin.y}
          r={currentRadius}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#030712" stopOpacity="0.92" />
          <stop
            offset={`${Math.max(0, ((currentRadius - 30) / Math.max(1, currentRadius)) * 100)}%`}
            stopColor="#030712"
            stopOpacity="0.92"
          />
          <stop offset="100%" stopColor="#030712" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark Disk */}
      <circle
        cx={sunOrigin.x}
        cy={sunOrigin.y}
        r={currentRadius}
        fill="url(#darkness-front-radial)"
      />

      {/* "LAST LIGHT" label riding the edge of the growing dark disc */}
      {tNorm > 0.1 && tNorm < 1.1 && (
        <g
          transform={`translate(${
            sunOrigin.x + currentRadius * 0.95 * Math.cos(0.2)
          }, ${sunOrigin.y + currentRadius * 0.95 * Math.sin(0.2)})`}
        >
          <rect
            x="-60"
            y="-16"
            width="120"
            height="32"
            rx="12"
            fill="rgba(6, 20, 40, 0.85)"
            stroke="#8fd8e6"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill="#8fd8e6"
            fontSize="12"
            fontWeight="700"
            fontFamily='"Fredoka", sans-serif'
            letterSpacing="2"
          >
            LAST LIGHT
          </text>
        </g>
      )}
    </svg>
  );
};
