import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface BackgroundGameplayProps {
  mode?: 'split' | 'underlay' | 'pip';
  videoSrc?: string;
  opacity?: number;
  blur?: number;
  accentColor?: string;
  gameType?: 'cyber-runner' | 'retro-highway' | 'neon-grid';
  splitRatio?: number; // Default 0.50 (50/50 split)
  speedMultiplier?: number;
}

// Deterministic Pseudo-Random Generator (No Math.random)
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Procedural 3D Endless Cyber Runner / Parkour Canvas (Deterministic & Zero External Assets)
export const ProceduralGameplayRunner: React.FC<{
  accentColor?: string;
  speedMultiplier?: number;
}> = ({ accentColor = '#00f5ff', speedMultiplier = 1.0 }) => {
  const frame = useCurrentFrame();

  // Normalized Canvas Dimensions for Perfect Scaling
  const viewW = 1080;
  const viewH = 960;
  const horizonY = 160;
  const roadBottomWidth = 980;
  const roadTopWidth = 140;
  const roadCenterX = viewW / 2;

  // Grid / Strip Movement
  const zOffset = (frame * 18 * speedMultiplier) % 100;
  const numGridLines = 14;

  // Player Hovercraft / Cube physics (deterministic sway)
  const playerSway = Math.sin(frame * 0.08) * (viewW * 0.22);
  const playerBob = Math.abs(Math.sin(frame * 0.16)) * 20;
  const playerTilt = Math.cos(frame * 0.08) * 12;

  // Obstacles (Deterministic lanes and distances)
  const obstacles = [
    { lane: -1, zBase: 250, color: '#ff0055', heightRatio: 0.8 },
    { lane: 1, zBase: 550, color: '#eab308', heightRatio: 1.1 },
    { lane: 0, zBase: 850, color: '#a855f7', heightRatio: 0.9 },
    { lane: -1, zBase: 1150, color: '#22c55e', heightRatio: 1.0 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#050711',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080c1d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Starfield / Particle Tunnel */}
        {Array.from({ length: 35 }).map((_, i) => {
          const pSeed = i * 47.123;
          const pAngle = pseudoRandom(pSeed) * Math.PI * 2;
          const pSpeed = 0.5 + pseudoRandom(pSeed + 1) * 1.5;
          const pDist = (frame * pSpeed * 10 + pSeed * 100) % (viewW * 0.7);
          const px = roadCenterX + Math.cos(pAngle) * pDist;
          const py = horizonY + Math.sin(pAngle) * (pDist * 0.5);
          const pSize = 1.5 + (pDist / (viewW * 0.7)) * 4;
          const pAlpha = interpolate(pDist, [0, viewW * 0.7], [0.1, 0.85]);

          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={pSize}
              fill="#ffffff"
              opacity={pAlpha}
            />
          );
        })}

        {/* Cyber Horizon Sun Glow */}
        <ellipse
          cx={roadCenterX}
          cy={horizonY}
          rx="260"
          ry="120"
          fill="url(#sunGrad)"
        />

        {/* Horizon Dividing Beam */}
        <line
          x1="0"
          y1={horizonY}
          x2={viewW}
          y2={horizonY}
          stroke={accentColor}
          strokeWidth="3"
        />

        {/* 3D Perspective Road Surface */}
        <polygon
          points={`
            ${roadCenterX - roadTopWidth / 2},${horizonY}
            ${roadCenterX + roadTopWidth / 2},${horizonY}
            ${roadCenterX + roadBottomWidth / 2},${viewH}
            ${roadCenterX - roadBottomWidth / 2},${viewH}
          `}
          fill="url(#roadGrad)"
          stroke={accentColor}
          strokeWidth="3"
        />

        {/* Lane Dividers */}
        {[-0.5, 0, 0.5].map((laneRatio, idx) => {
          const topX = roadCenterX + roadTopWidth * laneRatio;
          const bottomX = roadCenterX + roadBottomWidth * laneRatio;
          return (
            <line
              key={idx}
              x1={topX}
              y1={horizonY}
              x2={bottomX}
              y2={viewH}
              stroke="url(#lineGrad)"
              strokeWidth={idx === 1 ? 4 : 2}
              strokeDasharray={idx === 1 ? '32,22' : 'none'}
            />
          );
        })}

        {/* Horizontal Speed Rungs (Foreshortened) */}
        {Array.from({ length: numGridLines }).map((_, i) => {
          const progress = ((i * (100 / numGridLines) + zOffset) % 100) / 100;
          const depth = Math.pow(progress, 2.5);
          const y = horizonY + depth * (viewH - horizonY);
          const currentWidth = roadTopWidth + depth * (roadBottomWidth - roadTopWidth);
          const leftX = roadCenterX - currentWidth / 2;
          const rightX = roadCenterX + currentWidth / 2;

          return (
            <line
              key={i}
              x1={leftX}
              y1={y}
              x2={rightX}
              y2={y}
              stroke={accentColor}
              strokeWidth={1 + depth * 3.5}
              strokeOpacity={0.25 + depth * 0.75}
            />
          );
        })}

        {/* Approaching 3D Neon Obstacles */}
        {obstacles.map((obs, idx) => {
          const loopZ = 1400;
          const currentZ = ((obs.zBase - frame * 16 * speedMultiplier) % loopZ + loopZ) % loopZ;
          const progress = 1 - currentZ / loopZ;
          if (progress < 0.05 || progress > 0.98) return null;

          const depth = Math.pow(progress, 2.2);
          const y = horizonY + depth * (viewH - horizonY) - 30 * depth * obs.heightRatio;
          const currentRoadW = roadTopWidth + depth * (roadBottomWidth - roadTopWidth);
          const laneOffset = obs.lane * (currentRoadW * 0.28);
          const x = roadCenterX + laneOffset;

          const obsW = 28 + depth * 140;
          const obsH = (20 + depth * 80) * obs.heightRatio;

          return (
            <rect
              key={idx}
              x={x - obsW / 2}
              y={y - obsH}
              width={obsW}
              height={obsH}
              rx="6"
              fill={obs.color}
              stroke="#ffffff"
              strokeWidth="2"
              opacity={0.4 + depth * 0.6}
            />
          );
        })}

        {/* Player Hovercraft / Cyber Racer */}
        <g
          transform={`translate(${roadCenterX + playerSway}, ${viewH - 160 + playerBob}) rotate(${playerTilt})`}
        >
          {/* Thruster Flame */}
          <ellipse
            cx="0"
            cy="35"
            rx="18"
            ry="24"
            fill="#ff0055"
            opacity="0.85"
          />
          <ellipse
            cx="0"
            cy="30"
            rx="10"
            ry="16"
            fill="#ffffff"
            opacity="0.95"
          />

          {/* Hovercraft Body */}
          <polygon
            points="-50,20 0,-35 50,20 30,30 -30,30"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="3"
          />
          <polygon
            points="-25,10 0,-20 25,10 0,18"
            fill={accentColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* Retro CRT Scanline Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />

      {/* Telemetry Tag */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          padding: '6px 14px',
          borderRadius: 6,
          backgroundColor: 'rgba(5, 7, 17, 0.85)',
          border: `1px solid ${accentColor}`,
          color: accentColor,
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        GAMEPLAY // 60 FPS DETERMINISTIC
      </div>
    </div>
  );
};

// Main Unified BackgroundGameplay Component
export const BackgroundGameplay: React.FC<BackgroundGameplayProps> = ({
  mode = 'split',
  videoSrc,
  opacity = 1.0,
  blur = 0,
  accentColor = '#00f5ff',
  splitRatio = 0.52,
  speedMultiplier = 1.0,
}) => {
  const isSplit = mode === 'split';
  const isUnderlay = mode === 'underlay';

  const containerStyle: React.CSSProperties = isSplit
    ? {
        position: 'absolute',
        left: 0,
        top: `${splitRatio * 100}%`,
        width: '100%',
        height: `${(1 - splitRatio) * 100}%`,
        overflow: 'hidden',
        borderTop: `4px solid ${accentColor}`,
        boxShadow: `0 0 35px ${accentColor}88`,
        zIndex: 5,
      }
    : isUnderlay
    ? {
        position: 'absolute',
        inset: 0,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        zIndex: 0,
      }
    : {
        // Picture-in-picture (PiP)
        position: 'absolute',
        right: 40,
        bottom: 80,
        width: 340,
        height: 480,
        borderRadius: 24,
        overflow: 'hidden',
        border: `3px solid ${accentColor}`,
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px ${accentColor}66`,
        zIndex: 10,
      };

  return (
    <div style={containerStyle}>
      {videoSrc ? (
        <OffthreadVideo
          src={videoSrc.startsWith('http') || videoSrc.startsWith('/') ? videoSrc : staticFile(videoSrc)}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <ProceduralGameplayRunner accentColor={accentColor} speedMultiplier={speedMultiplier} />
      )}
    </div>
  );
};
