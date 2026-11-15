// src/engines/kurzgesagt/KurzgesagtSpaceEnvironment.tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Star } from './types';

export interface KurzgesagtSpaceEnvironmentProps {
  cameraOffset?: { x: number; y: number };
  zoom?: number;
  ambientFrameOffset?: number;
  children?: React.ReactNode;
}

export const KurzgesagtSpaceEnvironment: React.FC<KurzgesagtSpaceEnvironmentProps> = ({
  cameraOffset = { x: 0, y: 0 },
  zoom = 1.0,
  ambientFrameOffset = 0,
  children,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Ambient clock for twinkling and grain
  const ambientFrame = currentFrame + ambientFrameOffset;

  // Grain quantized at 24 FPS
  const grainFps = 24;
  const grainTick = Math.floor(ambientFrame * (grainFps / fps));
  const grainSeedX = (grainTick * 37) % 100;
  const grainSeedY = (grainTick * 53) % 100;

  // Generate deterministic stars once across 3 depth layers
  const stars: Star[] = useMemo(() => {
    const starList: Star[] = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      const x = ((i * 137.5 + 47) % width);
      const y = ((i * 229.3 + 89) % height);
      const depthTier = i % 3;
      const depth: 0.12 | 0.35 | 0.6 =
        depthTier === 0 ? 0.12 : depthTier === 1 ? 0.35 : 0.6;
      const isSparkle = depth === 0.6 && (i % 5 < 2); // 40% of near stars are 4-point sparkles
      const radius = depth === 0.6 ? 2.5 : depth === 0.35 ? 1.8 : 1.2;
      const twinklePhase = (i * 0.41) % (Math.PI * 2);
      const twinkleSpeed = 0.08 + (i % 7) * 0.02;

      starList.push({
        x,
        y,
        radius,
        depth,
        isSparkle,
        twinklePhase,
        twinkleSpeed,
      });
    }
    return starList;
  }, [width, height]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #081d2c 0%, #102348 100%)',
      }}
    >
      {/* Five Huge Parallax Nebula Blobs */}
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
          <filter id="nebula-blur-teal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="160" />
          </filter>
          <filter id="nebula-blur-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="180" />
          </filter>
          <filter id="nebula-blur-coral" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="140" />
          </filter>
          <filter id="nebula-blur-indigo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="170" />
          </filter>
        </defs>

        {/* 1. Teal Nebula Blob (rgb 24,150,160 at 20%) */}
        <circle
          cx={width * 0.25 + cameraOffset.x * 0.04}
          cy={height * 0.35 + cameraOffset.y * 0.04}
          r="420"
          fill="rgb(24, 150, 160)"
          opacity="0.20"
          filter="url(#nebula-blur-teal)"
        />

        {/* 2. Blue Nebula Blob (rgb 40,95,195 at 16%) */}
        <circle
          cx={width * 0.75 + cameraOffset.x * 0.05}
          cy={height * 0.25 + cameraOffset.y * 0.05}
          r="480"
          fill="rgb(40, 95, 195)"
          opacity="0.16"
          filter="url(#nebula-blur-blue)"
        />

        {/* 3. Coral Nebula Blob (rgb 220,95,110 at 10%) */}
        <circle
          cx={width * 0.45 + cameraOffset.x * 0.06}
          cy={height * 0.75 + cameraOffset.y * 0.06}
          r="360"
          fill="rgb(220, 95, 110)"
          opacity="0.10"
          filter="url(#nebula-blur-coral)"
        />

        {/* 4. Indigo Nebula Blob (rgb 60,70,175 at 15%) */}
        <circle
          cx={width * 0.15 + cameraOffset.x * 0.05}
          cy={height * 0.85 + cameraOffset.y * 0.05}
          r="440"
          fill="rgb(60, 70, 175)"
          opacity="0.15"
          filter="url(#nebula-blur-indigo)"
        />

        {/* 5. Deep Cyan Parallax Core */}
        <circle
          cx={width * 0.65 + cameraOffset.x * 0.03}
          cy={height * 0.60 + cameraOffset.y * 0.03}
          r="390"
          fill="rgb(14, 116, 144)"
          opacity="0.12"
          filter="url(#nebula-blur-teal)"
        />
      </svg>

      {/* 3 Parallax Star Layers with 4-Point Sparkles */}
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
        {stars.map((star, idx) => {
          const parallaxX = (star.x + cameraOffset.x * star.depth) % width;
          const parallaxY = (star.y + cameraOffset.y * star.depth) % height;
          const normX = parallaxX < 0 ? parallaxX + width : parallaxX;
          const normY = parallaxY < 0 ? parallaxY + height : parallaxY;

          // Twinkle brightness modulation
          const twinkle =
            0.55 + 0.45 * Math.sin(ambientFrame * star.twinkleSpeed + star.twinklePhase);

          if (star.isSparkle) {
            // 4-point diamond sparkle vector
            const s = star.radius * 2.8 * twinkle;
            return (
              <g key={idx} transform={`translate(${normX}, ${normY})`}>
                <polygon
                  points={`0,-${s} ${s * 0.28},0 0,${s} -${s * 0.28},0`}
                  fill="#ffffff"
                  opacity={twinkle}
                />
                <polygon
                  points={`-${s},0 0,${s * 0.28} ${s},0 0,-${s * 0.28}`}
                  fill="#ffffff"
                  opacity={twinkle}
                />
                <circle cx="0" cy="0" r={s * 0.22} fill="#ffd98a" opacity={twinkle} />
              </g>
            );
          }

          return (
            <circle
              key={idx}
              cx={normX}
              cy={normY}
              r={star.radius * twinkle}
              fill={idx % 7 === 0 ? '#8fd8e6' : idx % 11 === 0 ? '#ffd98a' : '#f8fafc'}
              opacity={twinkle * 0.9}
            />
          );
        })}
      </svg>

      {/* Main Content Render Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </div>

      {/* Vignette Overlay (to rgba(4,4,20, 0.45)) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 50%, rgba(8, 29, 44, 0) 55%, rgba(4, 4, 20, 0.45) 100%)',
        }}
      />

      {/* 6% Film Grain (Re-randomized 24 times per second) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.06,
          backgroundImage: `radial-gradient(circle at ${grainSeedX}% ${grainSeedY}%, #fff 10%, transparent 11%), radial-gradient(circle at ${100 - grainSeedY}% ${100 - grainSeedX}%, #000 10%, transparent 11%)`,
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  );
};
