import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { MOTION_LAB_CARDS } from './types.ts';
import { MotionLabMascot } from './MotionLabMascot.tsx';

export interface MotionLabBentoGridProps {
  frame: number;
  gridEntranceFrame: number; // e.g. frame 1300
}

export const MotionLabBentoGrid: React.FC<MotionLabBentoGridProps> = ({ frame, gridEntranceFrame }) => {
  const { fps } = useVideoConfig();

  // Grid Zoom-in Entrance Spring
  const gridSpring = spring({
    frame: frame - gridEntranceFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  const gridScale = interpolate(gridSpring, [0, 1], [0.82, 1.0]);
  const gridOpacity = interpolate(gridSpring, [0, 0.5], [0, 1.0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '160px 70px 60px 70px',
        boxSizing: 'border-box',
        transform: `scale(${gridScale})`,
        opacity: gridOpacity,
        transformOrigin: 'center center',
      }}
    >
      {/* Big Headline */}
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 84,
          fontWeight: 900,
          color: '#ffffff',
          margin: '0 0 36px 0',
          letterSpacing: -1.5,
          textShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        16 skills. One studio.
      </h1>

      {/* 4x4 Bento Glass Grid */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: 20,
          flex: 1,
        }}
      >
        {MOTION_LAB_CARDS.map((card, idx) => {
          // Staggered checkmark entrance spring
          const checkDelay = gridEntranceFrame + 15 + idx * 3;
          const checkSpring = spring({
            frame: frame - checkDelay,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          return (
            <div
              key={card.id}
              style={{
                position: 'relative',
                borderRadius: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(16px)',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              {/* Inner Mini Viewport Preview */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 110,
                  borderRadius: 14,
                  backgroundColor: '#0a0d14',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Miniature Mascot */}
                <MotionLabMascot
                  frame={frame + idx * 12}
                  expression={idx % 3 === 0 ? 'wink' : idx % 2 === 0 ? 'happy' : 'star'}
                  scale={0.52}
                />

                {/* Verified Green Checkmark Badge */}
                {checkSpring > 0.05 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${checkSpring})`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 22,
                      fontWeight: 900,
                      color: card.accentColor || '#f97316',
                    }}
                  >
                    {card.id}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: -0.3,
                    }}
                  >
                    {card.title}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'SF Mono', Menlo, Consolas, monospace",
                    fontSize: 13,
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {card.repo}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mascot Peeking from Bottom Edge */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}
      >
        <MotionLabMascot frame={frame} expression="star" action="peek" scale={1.8} />
      </div>

      {/* Bottom Bookmark CTA Pill */}
      <div
        style={{
          position: 'relative',
          zIndex: 30,
          marginTop: 24,
          padding: '16px 40px',
          borderRadius: 36,
          backgroundColor: 'rgba(245, 240, 250, 0.92)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: '#1a1824',
          cursor: 'pointer',
        }}
      >
        <span style={{ color: '#ea580c' }}>🔖</span>
        <span>Bookmark this · send it to your Opus 5.5</span>
      </div>
    </div>
  );
};
