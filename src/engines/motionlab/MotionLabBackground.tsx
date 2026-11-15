import React, { useMemo } from 'react';
import { interpolate, interpolateColors, useVideoConfig } from 'remotion';

interface MotionLabBackgroundProps {
  progress: number; // 0..1 overall progress across 4 acts
  isFinishAct?: boolean;
  frame: number;
}

// 12 deterministic floating bubbles with depth, radius, and speed
const BUBBLE_SEEDS = [
  { id: 1, x: 0.12, y: 0.22, r: 18, speed: 0.6, opacity: 0.75 },
  { id: 2, x: 0.88, y: 0.15, r: 24, speed: 0.8, opacity: 0.65 },
  { id: 3, x: 0.08, y: 0.52, r: 32, speed: 0.5, opacity: 0.8 },
  { id: 4, x: 0.92, y: 0.65, r: 42, speed: 0.7, opacity: 0.7 },
  { id: 5, x: 0.15, y: 0.88, r: 28, speed: 0.9, opacity: 0.6 },
  { id: 6, x: 0.85, y: 0.82, r: 20, speed: 0.55, opacity: 0.85 },
  { id: 7, x: 0.5, y: 0.08, r: 16, speed: 0.75, opacity: 0.6 },
  { id: 8, x: 0.78, y: 0.38, r: 22, speed: 0.65, opacity: 0.7 },
  { id: 9, x: 0.25, y: 0.42, r: 14, speed: 0.85, opacity: 0.5 },
  { id: 10, x: 0.68, y: 0.92, r: 36, speed: 0.6, opacity: 0.75 },
  { id: 11, x: 0.35, y: 0.18, r: 26, speed: 0.7, opacity: 0.65 },
  { id: 12, x: 0.04, y: 0.34, r: 18, speed: 0.5, opacity: 0.7 },
];

export const MotionLabBackground: React.FC<MotionLabBackgroundProps> = ({ progress, isFinishAct = false, frame }) => {
  const { width, height } = useVideoConfig();

  // Sky palette interpolation across the 4 acts
  // 0.00: Act 1 (Video)   -> Lavender/Lilac dream
  // 0.33: Act 2 (Motion)  -> Morning Meadow Green/Yellow
  // 0.66: Act 3 (3D)      -> Sage Cyan / Warm Sand
  // 1.00: Act 4 (Finish)  -> Twilight / Starry Space
  const skyTop = interpolateColors(
    progress,
    [0, 0.33, 0.66, 1.0],
    ['#b8b2e8', '#b4d6cb', '#84b8ae', '#181e33']
  );

  const skyBottom = interpolateColors(
    progress,
    [0, 0.33, 0.66, 1.0],
    ['#ebd4e8', '#faebd7', '#fcefd9', '#3e3852']
  );

  // Cloud drift calculation
  const cloudOffset1 = (frame * 0.4) % (width + 600);
  const cloudOffset2 = (frame * 0.25) % (width + 800);

  // Night stars opacity in Act 4 (Finish)
  const starsOpacity = interpolate(progress, [0.75, 0.95], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 100%)`,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Twilight stars (fading in during Act 4 & Finish) */}
      {starsOpacity > 0.01 && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: starsOpacity,
          }}
        >
          {Array.from({ length: 45 }).map((_, i) => {
            const sx = ((i * 137.5) % width);
            const sy = ((i * 219.3) % (height * 0.75));
            const twinkle = Math.sin(frame * 0.08 + i * 1.5) * 0.35 + 0.65;
            const size = (i % 3 === 0 ? 2.5 : 1.5) * twinkle;
            return (
              <circle
                key={`star-${i}`}
                cx={sx}
                cy={sy}
                r={size}
                fill="#ffffff"
                opacity={0.8}
              />
            );
          })}
        </svg>
      )}

      {/* Atmospheric Fluffy Peach & Cream Clouds */}
      <svg
        style={{
          position: 'absolute',
          bottom: -80,
          left: 0,
          width: '100%',
          height: '55%',
          opacity: 0.68,
          filter: 'blur(16px)',
        }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <path
          d={`M -200 450 Q 200 280 500 380 Q 800 220 1100 340 Q 1400 260 1700 420 L 1700 900 L -200 900 Z`}
          fill="rgba(252, 239, 233, 0.55)"
        />
        <path
          d={`M -150 520 Q 300 360 650 480 Q 950 320 1250 460 Q 1550 390 1800 550 L 1800 900 L -150 900 Z`}
          fill="rgba(254, 247, 240, 0.75)"
        />
      </svg>

      {/* Floating Iridescent Glass Bubbles with Specular Highlights */}
      {BUBBLE_SEEDS.map((b) => {
        const floatY = Math.sin(frame * 0.03 * b.speed + b.id * 1.2) * 18;
        const floatX = Math.cos(frame * 0.02 * b.speed + b.id * 0.8) * 10;
        const posX = b.x * width + floatX;
        const posY = b.y * height + floatY;

        return (
          <div
            key={`bubble-${b.id}`}
            style={{
              position: 'absolute',
              left: posX - b.r,
              top: posY - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.04) 70%, rgba(230,210,255,0.25) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              boxShadow: 'inset -2px -2px 6px rgba(180, 150, 220, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(120, 90, 160, 0.15)',
              backdropFilter: 'blur(4px)',
              opacity: b.opacity,
            }}
          >
            {/* Tiny specular glare dot */}
            <div
              style={{
                position: 'absolute',
                top: '22%',
                left: '26%',
                width: Math.max(3, b.r * 0.22),
                height: Math.max(3, b.r * 0.22),
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 4px rgba(255,255,255,0.9)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
