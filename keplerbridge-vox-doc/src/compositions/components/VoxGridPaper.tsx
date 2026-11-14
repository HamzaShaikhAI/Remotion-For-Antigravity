import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const VoxGridPaper: React.FC<{
  children?: React.ReactNode;
  gridColor?: string;
  bgColor?: string;
}> = ({ children, gridColor = 'rgba(250, 204, 21, 0.08)', bgColor = '#0c101a' }) => {
  const frame = useCurrentFrame();

  // Subtle deterministic paper texture jitter (zero Math.random())
  const grainSeed = (frame * 17 + 29) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      }}
    >
      {/* SVG Background Grid */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="vox-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={gridColor}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <circle cx="60" cy="0" r="1.5" fill="#facc15" opacity="0.25" />
            <circle cx="0" cy="60" r="1.5" fill="#facc15" opacity="0.25" />
          </pattern>

          {/* Deterministic SVG Film Grain */}
          <filter id="vox-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              seed={grainSeed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.04" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#vox-grid)" />
        <rect width="100%" height="100%" filter="url(#vox-grain)" pointerEvents="none" />
      </svg>

      {/* Top and Bottom Technical Border Rules */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: '#facc15',
          boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: '#facc15',
        }}
      />

      {/* Technical Metadata Corner Watermarks */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.5,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            backgroundColor: '#facc15',
            color: '#000000',
            padding: '3px 8px',
            borderRadius: 4,
            fontWeight: 900,
          }}
        >
          VOX DOC
        </span>
        <span>SPEC-D3D12-TO-D3D11 // KEPLERBRIDGE</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 36,
          color: '#64748b',
          fontSize: 13,
          fontFamily: 'monospace',
        }}
      >
        FRAME {String(frame).padStart(5, '0')} // FL 11_0 TRANSLATION
      </div>

      {children}
    </AbsoluteFill>
  );
};
