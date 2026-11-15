import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { AMANI_BLUEPRINT_DATA } from './types.ts';

export interface CadTechnicalBlueprintProps {
  frame: number;
  drawProgress: number; // 0..1 progress of vector line drawing
  opacity?: number;
  style?: React.CSSProperties;
}

export const CadTechnicalBlueprint: React.FC<CadTechnicalBlueprintProps> = ({
  frame,
  drawProgress,
  opacity = 1.0,
  style = {},
}) => {
  const { width, height, fps } = useVideoConfig();

  // Grid size
  const gridSize = 40;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  // Caliper & Label Fade-in Springs
  const caliperSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const labelSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // Emblem Outline SVG Path (Squircle with 45° radial notch cutout and inner channel)
  // Outer Box: (260, 260) to (820, 820), size 560x560 with r=60 rounded corners
  // Notch cut from (540, 260) curving down to (820, 480) with R=240 and inner R=190
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

  // Top-Right Detached Corner Piece
  const detachedCornerPath = `
    M 600 260
    L 760 260
    C 800 260, 820 280, 820 320
    L 820 420
    C 720 420, 600 320, 600 260
    Z
  `;

  // Inner Arched Cavity Path
  const innerArchPath = `
    M 300 720
    C 300 480, 480 340, 720 340
  `;

  const totalLength = 2600;
  const strokeDashoffset = interpolate(drawProgress, [0, 1], [totalLength, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        backgroundColor: '#05070a',
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* 1. Precision Technical Grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="cadGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.75" />
          </pattern>
          <pattern id="cadGridLarge" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#cadGridSmall)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.065)" strokeWidth="1.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cadGridLarge)" />
      </svg>

      {/* 2. Construction Lines & Alignment Guides */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: caliperSpring }}>
        {/* Alignment Crosshairs through Center Point (780, 260) */}
        <line x1="0" y1="260" x2={width} y2="260" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="6,6" />
        <line x1="780" y1="0" x2="780" y2={height} stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="6,6" />

        {/* 45° Diagonal Construction Rays */}
        <line x1="780" y1="260" x2="260" y2="780" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="6,6" />
        <line x1="260" y1="260" x2="820" y2="820" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="4,4" />

        {/* Origin Target Reticle (⌖) */}
        <circle cx="780" cy="260" r="16" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="780" cy="260" r="4" fill="#ffffff" />
        <line x1="756" y1="260" x2="804" y2="260" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="780" y1="236" x2="780" y2="284" stroke="#ffffff" strokeWidth="1.5" />

        {/* Concentric Dashed Construction Arc Radii from Origin */}
        <circle cx="780" cy="260" r="240" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" strokeDasharray="8,6" />
        <circle cx="780" cy="260" r="190" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" strokeDasharray="8,6" />

        {/* Bottom Left Corner Radius Guide Circle (r 2.4) */}
        <circle cx="320" cy="760" r="60" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="260" y1="820" x2="200" y2="880" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
        <line x1="200" y1="880" x2="140" y2="880" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

        {/* Calipers: Vertical Dimension "20" (Left) */}
        <line x1="160" y1="260" x2="260" y2="260" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        <line x1="160" y1="820" x2="260" y2="820" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        <line x1="180" y1="260" x2="180" y2="820" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
        {/* Caliper Arrows */}
        <path d="M 175 272 L 180 260 L 185 272" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 175 808 L 180 820 L 185 808" fill="none" stroke="#ffffff" strokeWidth="1.5" />

        {/* Calipers: Horizontal Dimension "20" (Bottom) */}
        <line x1="260" y1="820" x2="260" y2="920" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        <line x1="820" y1="820" x2="820" y2="920" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        <line x1="260" y1="900" x2="820" y2="900" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
        {/* Caliper Arrows */}
        <path d="M 272 895 L 260 900 L 272 905" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 808 895 L 820 900 L 808 905" fill="none" stroke="#ffffff" strokeWidth="1.5" />

        {/* 45° Sector Arc Caliper */}
        <path d="M 720 260 A 60 60 0 0 1 738 302" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" />
        <line x1="780" y1="260" x2="680" y2="360" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
      </svg>

      {/* 3. High-Precision Glowing Blueprint Emblem Contour Path */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.75))',
        }}
      >
        <path
          d={mainEmblemPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={strokeDashoffset}
        />
        <path
          d={detachedCornerPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={strokeDashoffset}
        />
        <path
          d={innerArchPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6,6"
        />
      </svg>

      {/* 4. Precision Technical Annotation Labels */}
      <div style={{ position: 'absolute', inset: 0, fontFamily: "'SF Mono', Menlo, Consolas, monospace", opacity: labelSpring }}>
        {/* grid 20 × 20 header */}
        <div style={{ position: 'absolute', top: 226, left: 260, fontSize: 18, color: '#ffffff', letterSpacing: 1.5, fontWeight: 700 }}>
          grid 20 × 20
        </div>

        {/* Caliper Left: 20 */}
        <div style={{ position: 'absolute', top: 525, left: 110, fontSize: 24, color: '#ffffff', fontWeight: 700 }}>
          20
        </div>

        {/* Caliper Bottom: 20 */}
        <div style={{ position: 'absolute', top: 920, left: 525, fontSize: 24, color: '#ffffff', fontWeight: 700 }}>
          20
        </div>

        {/* gap 2 */}
        <div style={{ position: 'absolute', top: 375, left: 510, fontSize: 16, color: '#ffffff', fontWeight: 600 }}>
          gap 2
        </div>

        {/* R 10 */}
        <div style={{ position: 'absolute', top: 375, left: 660, fontSize: 18, color: '#ffffff', fontWeight: 700 }}>
          R 10
        </div>

        {/* 45° */}
        <div style={{ position: 'absolute', top: 325, left: 755, fontSize: 16, color: '#ffffff', fontWeight: 700 }}>
          45°
        </div>

        {/* r 8 */}
        <div style={{ position: 'absolute', top: 485, left: 900, fontSize: 18, color: '#ffffff', fontWeight: 600 }}>
          r 8
        </div>

        {/* - r 2.4 */}
        <div style={{ position: 'absolute', top: 868, left: 35, fontSize: 18, color: '#ffffff', fontWeight: 600 }}>
          — r 2.4
        </div>
      </div>
    </div>
  );
};
