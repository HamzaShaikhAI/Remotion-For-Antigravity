import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { AnimePixelSprite } from './AnimePixelSprite';
import { ANIME_OP_175BPM } from './types';

interface AnimePixelRunnerStageProps {
  speed?: number; // runner scroll speed factor
  characterAction?: 'run' | 'dance' | 'ready';
  score?: number;
  combo?: number;
  stageName?: string;
}

export const AnimePixelRunnerStage: React.FC<AnimePixelRunnerStageProps> = ({
  speed = 1.0,
  characterAction = 'run',
  score = 48200,
  combo = 32,
  stageName = 'SHIBUYA TWILIGHT RUN',
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Scroll offsets (deterministic based on frame)
  const bgOffset = (frame * 1.5 * speed) % width;
  const midOffset = (frame * 6.0 * speed) % width;
  const trackOffset = (frame * 16.0 * speed) % 80;

  // 175 BPM beat pulse
  const beatProgress = (frame % ANIME_OP_175BPM.framesPerBeat) / ANIME_OP_175BPM.framesPerBeat;
  const beatBounce = Math.sin(beatProgress * Math.PI);

  // Floating score popups derived deterministically
  const popups = [
    { frameTrigger: 240, text: '+500 PTS', x: 780, y: 520 },
    { frameTrigger: 320, text: 'PERFECT!!', x: 840, y: 480 },
    { frameTrigger: 400, text: '+1000 PTS', x: 800, y: 510 },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Layer 1: Sunset Gradient Sky */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70%',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #581c87 35%, #be185d 65%, #f97316 90%, #fef08a 100%)',
        }}
      />

      {/* Giant Sunset Moon / Sun with Horizontal Speed Lines */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 240,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #fef08a 0%, #fb923c 60%, #e11d48 100%)',
          boxShadow: '0 0 80px rgba(251, 146, 60, 0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Horizontal Speed Cuts across the Sun */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 120 + i * 16,
              left: 0,
              width: '100%',
              height: 4 + i * 1.5,
              backgroundColor: '#581c87',
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Layer 2: Distant Parallax City Skyline */}
      <svg
        style={{
          position: 'absolute',
          bottom: 240,
          left: -bgOffset,
          width: width * 2,
          height: 280,
          opacity: 0.65,
        }}
      >
        <g fill="#18181b">
          {Array.from({ length: 28 }, (_, i) => {
            const bWidth = 60 + (i % 5) * 35;
            const bHeight = 120 + (i % 7) * 22;
            const bX = i * 140;
            return (
              <g key={i}>
                <rect x={bX} y={280 - bHeight} width={bWidth} height={bHeight} />
                {/* Antenna */}
                {i % 3 === 0 && (
                  <line
                    x1={bX + bWidth / 2}
                    y1={280 - bHeight}
                    x2={bX + bWidth / 2}
                    y2={280 - bHeight - 35}
                    stroke="#18181b"
                    strokeWidth={3}
                  />
                )}
                {/* Windows */}
                {Array.from({ length: 4 }, (_, w) => (
                  <rect
                    key={w}
                    x={bX + 12 + (w % 2) * 20}
                    y={280 - bHeight + 20 + Math.floor(w / 2) * 30}
                    width={8}
                    height={12}
                    fill={((i + w + frame) % 9 === 0) ? '#fde047' : '#27272a'}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Layer 3: Midground Telegraph Poles & Power Lines */}
      <svg
        style={{
          position: 'absolute',
          bottom: 220,
          left: -midOffset,
          width: width * 2,
          height: 380,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const poleX = i * 500;
          return (
            <g key={i}>
              {/* Pole */}
              <rect x={poleX} y={40} width={14} height={340} fill="#09090b" />
              {/* Crossbar 1 */}
              <rect x={poleX - 50} y={90} width={114} height={10} fill="#09090b" />
              {/* Crossbar 2 */}
              <rect x={poleX - 35} y={130} width={84} height={8} fill="#09090b" />
              {/* Transformers & Insulators */}
              <circle cx={poleX - 45} cy={86} r={5} fill="#71717a" />
              <circle cx={poleX + 59} cy={86} r={5} fill="#71717a" />
              {/* Power lines connecting */}
              <path
                d={`M ${poleX + 59} 86 Q ${poleX + 250} 140 ${poleX + 500 - 45} 86`}
                fill="none"
                stroke="#09090b"
                strokeWidth={2}
              />
              <path
                d={`M ${poleX + 45} 126 Q ${poleX + 250} 180 ${poleX + 500 - 35} 126`}
                fill="none"
                stroke="#09090b"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>

      {/* Layer 4: Street Ground & Checkered Arcade Track */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 240,
          backgroundColor: '#09090b',
          borderTop: '8px solid #dc2626',
          boxShadow: '0 -8px 24px rgba(220, 38, 38, 0.4)',
        }}
      >
        {/* Speed stripes on asphalt */}
        <div
          style={{
            position: 'absolute',
            top: 25,
            left: -trackOffset,
            width: width + 160,
            height: 14,
            backgroundImage:
              'repeating-linear-gradient(90deg, #facc15 0px, #facc15 40px, transparent 40px, transparent 80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: -trackOffset * 1.5,
            width: width + 160,
            height: 8,
            backgroundImage:
              'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 20px, transparent 20px, transparent 50px)',
            opacity: 0.7,
          }}
        />
        {/* Street curb */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 40,
            backgroundColor: '#18181b',
            borderTop: '3px solid #27272a',
          }}
        />
      </div>

      {/* Main Pixel Character Running / Dancing */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 380,
          zIndex: 15,
        }}
      >
        <AnimePixelSprite
          action={characterAction}
          pixelScale={9}
          direction="right"
          sparkles={true}
        />
      </div>

      {/* Layer 5: Retro Arcade HUD */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          right: 48,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '4px solid #facc15',
          borderRadius: 8,
          padding: '12px 24px',
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          boxShadow: '6px 6px 0px #dc2626',
          zIndex: 25,
          fontFamily: "'Courier New', monospace",
        }}
      >
        <div>
          <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>SCORE</div>
          <div style={{ color: '#ffffff', fontSize: 24, fontWeight: 900 }}>
            {score.toString().padStart(7, '0')}
          </div>
        </div>

        <div>
          <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>COMBO</div>
          <div
            style={{
              color: '#38bdf8',
              fontSize: 24,
              fontWeight: 900,
              transform: `scale(${1 + beatBounce * 0.15})`,
              display: 'inline-block',
            }}
          >
            {combo}x
          </div>
        </div>

        <div>
          <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>LIFE</div>
          <div style={{ color: '#ef4444', fontSize: 20 }}>❤❤❤</div>
        </div>
      </div>

      {/* Stage Location Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 48,
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '6px 18px',
          borderRadius: 4,
          fontFamily: "'Courier New', monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 2,
          border: '2px solid #52525b',
          zIndex: 25,
        }}
      >
        AREA: {stageName}
      </div>

      {/* Floating score popups */}
      {popups.map((p, idx) => {
        const pFrame = frame - p.frameTrigger;
        if (pFrame < 0 || pFrame > 40) return null;
        const pProgress = pFrame / 40;
        const pY = p.y - pProgress * 80;
        const pOpacity = 1 - pProgress;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: pY,
              left: p.x,
              color: '#facc15',
              fontSize: 28,
              fontWeight: 900,
              fontFamily: "'Impact', sans-serif",
              letterSpacing: 2,
              textShadow: '3px 3px 0px #000000',
              opacity: pOpacity,
              transform: 'skewX(-10deg)',
              zIndex: 30,
            }}
          >
            {p.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
