import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ANIME_OP_175BPM } from './types';

interface AnimeHalftoneBackgroundProps {
  theme?: 'scarlet' | 'cream' | 'night' | 'cyan';
  showTvSize?: boolean;
  showTape?: boolean;
  tapeText?: string;
  speedLines?: boolean;
}

export const AnimeHalftoneBackground: React.FC<AnimeHalftoneBackgroundProps> = ({
  theme = 'scarlet',
  showTvSize = true,
  showTape = true,
  tapeText = 'TV ANIMATION OPENING • 175 BPM',
  speedLines = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 175 BPM beat pulse
  const beatProgress = (frame % ANIME_OP_175BPM.framesPerBeat) / ANIME_OP_175BPM.framesPerBeat;
  const beatBounce = Math.sin(beatProgress * Math.PI);

  // Background color schemes
  const bgStyles: Record<string, { base: string; dot: string; accent: string; text: string }> = {
    scarlet: {
      base: '#dc2626', // Scarlet crimson
      dot: '#991b1b', // Deep crimson dot
      accent: '#fef3c7', // Warm cream
      text: '#ffffff',
    },
    cream: {
      base: '#fef3c7', // Warm cream
      dot: '#fed7aa', // Light amber dot
      accent: '#dc2626', // Red
      text: '#1e1b4b',
    },
    night: {
      base: '#0f172a', // Deep midnight slate
      dot: '#1e293b', // Dark dot
      accent: '#38bdf8', // Neon sky blue
      text: '#ffffff',
    },
    cyan: {
      base: '#0284c7', // Vibrant idol blue
      dot: '#0369a1',
      accent: '#facc15', // Yellow
      text: '#ffffff',
    },
  };

  const currentTheme = bgStyles[theme] || bgStyles.scarlet;

  // Star twinkles derived deterministically
  const stars = Array.from({ length: 8 }, (_, i) => {
    const posX = ((i * 240 + 80 + frame * 0.4) % (width + 100)) - 50;
    const posY = (120 + i * 110 + Math.sin(i * 1.7) * 40) % (height - 100);
    const starPhase = (frame * 0.15 + i * 0.8) % (Math.PI * 2);
    const scale = 0.6 + 0.5 * Math.sin(starPhase) + beatBounce * 0.2;
    const rotation = (frame * 1.5 + i * 45) % 360;
    return { id: i, posX, posY, scale, rotation };
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: currentTheme.base }}>
      {/* SVG Halftone Pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.35,
        }}
      >
        <defs>
          <pattern
            id="halftone-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(25)`}
          >
            <circle cx="12" cy="12" r={4 + beatBounce * 1.2} fill={currentTheme.dot} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#halftone-dots)" />
      </svg>

      {/* Manga Action Speed Slashes */}
      {speedLines && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.22,
            mixBlendMode: 'overlay',
          }}
        >
          {Array.from({ length: 16 }, (_, i) => {
            const lineY = ((i * 75 + frame * 12) % (height + 200)) - 100;
            const strokeWidth = 2 + (i % 4) * 2;
            return (
              <line
                key={i}
                x1="-100"
                y1={lineY + 150}
                x2={width + 100}
                y2={lineY - 150}
                stroke={currentTheme.accent}
                strokeWidth={strokeWidth}
                strokeDasharray={`${60 + (i % 3) * 40} ${30 + (i % 2) * 20}`}
              />
            );
          })}
        </svg>
      )}

      {/* 4-Point Sparkling Glitter Stars */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {stars.map((s) => (
          <g
            key={s.id}
            transform={`translate(${s.posX}, ${s.posY}) scale(${s.scale}) rotate(${s.rotation})`}
          >
            {/* 4-point sparkle path */}
            <path
              d="M 0 -22 Q 2 -4 22 0 Q 2 4 0 22 Q -2 4 -22 0 Q -2 -4 0 -22 Z"
              fill={currentTheme.accent}
              filter="drop-shadow(0 0 6px rgba(254, 240, 138, 0.8))"
            />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        ))}
      </svg>

      {/* Top Left: TV SIZE Indicator */}
      {showTvSize && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '6px 14px',
              backgroundColor: currentTheme.accent,
              color: currentTheme.base === '#fef3c7' ? '#dc2626' : currentTheme.base,
              fontWeight: 900,
              fontFamily: "'Impact', 'Montserrat', sans-serif",
              fontSize: 18,
              letterSpacing: 2,
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transform: 'skewX(-10deg)',
            }}
          >
            ● REC [ 24.00 FPS ]
          </div>
          <span
            style={{
              color: currentTheme.text,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 3,
              fontFamily: "'Courier New', monospace",
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            TV SIZE EDIT • 175 BPM
          </span>
        </div>
      )}

      {/* Diagonal Anime Caution Tape / Action Banner */}
      {showTape && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: -50,
            width: width + 100,
            height: 44,
            backgroundColor: '#facc15', // Yellow action tape
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontWeight: 900,
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 17,
            letterSpacing: 4,
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
            borderTop: '3px solid #000000',
            borderBottom: '3px solid #000000',
            zIndex: 8,
          }}
        >
          <span>★ {tapeText} ★</span>
          <span>★ J-POP IDOL ROCK ★</span>
          <span>★ {tapeText} ★</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
