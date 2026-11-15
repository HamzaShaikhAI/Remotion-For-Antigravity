import React from 'react';
import { interpolate, useVideoConfig } from 'remotion';

export interface LiquidChromeEmblemProps {
  frame: number;
  opacity?: number;
  extrusionDepth?: number; // 0 (flat 2D) to 1.0 (thick 3D block)
  rotateX?: number; // degrees
  rotateY?: number; // degrees
  scale?: number;
  reflectionAngle?: number; // degrees
  style?: React.CSSProperties;
}

export const LiquidChromeEmblem: React.FC<LiquidChromeEmblemProps> = ({
  frame,
  opacity = 1.0,
  extrusionDepth = 0,
  rotateX = 0,
  rotateY = 0,
  scale = 1.0,
  reflectionAngle = 0,
  style = {},
}) => {
  const { width, height } = useVideoConfig();

  // Moving reflection angle
  const lightAngle = 45 + reflectionAngle + Math.sin(frame * 0.05) * 8;

  // Path data (matching CadTechnicalBlueprint)
  const mainEmblemPath = `
    M 320 260
    L 540 260
    C 540 380, 680 480, 820 480
    L 820 760
    C 820 800, 780 820, 740 820
    L 320 820
    C 280 820, 260 800, 260 760
    L 260 320
    C 260 280, 280 260, 320 260
    Z
  `;

  const detachedCornerPath = `
    M 600 260
    L 760 260
    C 800 260, 820 280, 820 320
    L 820 420
    C 720 420, 600 320, 600 260
    Z
  `;

  const innerCavityPath = `
    M 310 740
    C 310 500, 490 360, 740 360
    C 780 360, 800 370, 800 370
    L 800 480
    C 680 480, 540 380, 540 260
    L 320 260
    C 280 260, 260 280, 260 320
    L 260 740
    Z
  `;

  // Number of 3D extrusion slices
  const numSlices = Math.round(extrusionDepth * 28);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1400,
        transformStyle: 'preserve-3d',
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: '540px 540px',
        }}
      >
        {/* SVG Chrome Shading Definitions */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {/* Primary Liquid Chrome Linear Gradient */}
            <linearGradient
              id="liquidChromePrimary"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform={`rotate(${lightAngle}, 0.5, 0.5)`}
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="12%" stopColor="#d1d5db" />
              <stop offset="28%" stopColor="#0f172a" />
              <stop offset="42%" stopColor="#334155" />
              <stop offset="55%" stopColor="#f8fafc" />
              <stop offset="68%" stopColor="#1e293b" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Darker Sidewall Metal Gradient */}
            <linearGradient id="chromeSideWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Specular Bevel Glow Filter */}
            <filter id="chromeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset in="blur" dx="-2" dy="-2" result="offset" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="35" result="spec">
                <fePointLight x="400" y="200" z="300" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceGraphic" operator="in" result="lit" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="lit" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* 3D Extrusion Slices (rendered backwards along Z-axis) */}
        {Array.from({ length: numSlices }).map((_, idx) => {
          const zOffset = -(idx + 1) * 2.2;
          const brightness = interpolate(idx, [0, numSlices], [0.85, 0.35]);

          return (
            <svg
              key={`slice-${idx}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transform: `translateZ(${zOffset}px)`,
                filter: `brightness(${brightness})`,
              }}
              viewBox="0 0 1080 1080"
            >
              <path d={mainEmblemPath} fill="url(#chromeSideWall)" stroke="#334155" strokeWidth="1" />
              <path d={detachedCornerPath} fill="url(#chromeSideWall)" stroke="#334155" strokeWidth="1" />
            </svg>
          );
        })}

        {/* Front Face: Liquid Metal Chrome Surface */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: 'translateZ(0px)',
            filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.85))',
          }}
          viewBox="0 0 1080 1080"
        >
          {/* Main Body with Liquid Chrome Gradient */}
          <path
            d={mainEmblemPath}
            fill="url(#liquidChromePrimary)"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="3.5"
          />

          {/* Top-Right Corner Piece */}
          <path
            d={detachedCornerPath}
            fill="url(#liquidChromePrimary)"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="3.5"
          />

          {/* Inner Arched Cavity Bevel Depth */}
          <path
            d={innerCavityPath}
            fill="none"
            stroke="rgba(15, 23, 42, 0.75)"
            strokeWidth="14"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={innerCavityPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="2.5"
          />

          {/* Prismatic Chromatic Aberration Highlights along Chamfers */}
          <path
            d={mainEmblemPath}
            fill="none"
            stroke="rgba(34, 211, 238, 0.65)"
            strokeWidth="2"
            transform="translate(-1.5, -1.5)"
            style={{ mixBlendMode: 'screen' }}
          />
          <path
            d={mainEmblemPath}
            fill="none"
            stroke="rgba(244, 63, 94, 0.65)"
            strokeWidth="2"
            transform="translate(1.5, 1.5)"
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>
      </div>
    </div>
  );
};
