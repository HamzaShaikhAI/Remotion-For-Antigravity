import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GlitchTransition } from '../../plugins/rea-transitions';

export const Scene2CoreEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for central core
  const coreSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });
  const coreScale = interpolate(coreSpring, [0, 1], [0.6, 1.0]);

  // Gyroscope rotation angles
  const angle1 = frame * 2.2;
  const angle2 = -frame * 3.1;
  const angle3 = frame * 1.5;

  // Feature pills data with staggered spring frames
  const PILL_DATA = [
    { text: '⚡ 100% Deterministic (Zero Math.random)', color: '#00F5FF', delay: 8 },
    { text: '🎬 Bundled Zero-Config FFmpeg', color: '#38BDF8', delay: 18 },
    { text: '💎 Spring Physics Motion Engine', color: '#A855F7', delay: 28 },
    { text: '🛡️ Antigravity 2.0 Lifecycle Hooks', color: '#34D399', delay: 38 },
  ];

  return (
    <GlitchTransition intensity={1.3}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        {/* Upper Title */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#00F5FF',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            ARCHITECTURE & CAPABILITIES
          </div>
          <h2
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 0 25px rgba(0, 245, 255, 0.4)',
            }}
          >
            The Motion Engine Built for Autonomous Agents
          </h2>
        </div>

        {/* Central Layout: Gyroscope on Left, 4 Capability Pills on Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          {/* 3D Differential Gyroscope Core */}
          <div
            style={{
              position: 'relative',
              width: 320,
              height: 320,
              transform: `scale(${coreScale})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="320" height="320" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="core-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ring 1 (Outer - Cyan) */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#00F5FF"
                strokeWidth="3.5"
                strokeDasharray="40 18 10 18"
                filter="url(#core-glow)"
                transform={`rotate(${angle1} 160 160)`}
              />

              {/* Ring 2 (Middle - Purple) */}
              <circle
                cx="160"
                cy="160"
                r="105"
                fill="none"
                stroke="#A855F7"
                strokeWidth="4"
                strokeDasharray="60 30"
                filter="url(#core-glow)"
                transform={`rotate(${angle2} 160 160)`}
              />

              {/* Ring 3 (Inner - Blue) */}
              <circle
                cx="160"
                cy="160"
                r="70"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="20 12"
                filter="url(#core-glow)"
                transform={`rotate(${angle3} 160 160)`}
              />

              {/* Center Glowing Orb */}
              <circle cx="160" cy="160" r="30" fill="#00F5FF" filter="url(#core-glow)" opacity={0.85} />
              <text
                x="160"
                y="166"
                textAnchor="middle"
                fill="#05070E"
                fontFamily='"JetBrains Mono", monospace'
                fontSize="18"
                fontWeight="900"
              >
                REA
              </text>
            </svg>
          </div>

          {/* 4 Feature Pills with Staggered Spring Overshoot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PILL_DATA.map((pill, i) => {
              const pSpring = spring({
                frame: frame - pill.delay,
                fps,
                config: { damping: 11, mass: 0.5, stiffness: 130 },
              });
              const pScale = interpolate(pSpring, [0, 1], [0.7, 1.0]);
              const pOpacity = interpolate(pSpring, [0, 1], [0, 1]);
              const pX = interpolate(pSpring, [0, 1], [40, 0]);

              return (
                <div
                  key={i}
                  style={{
                    transform: `translateX(${pX}px) scale(${pScale})`,
                    opacity: pOpacity,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(16px)',
                    border: `2px solid ${pill.color}`,
                    borderRadius: 14,
                    padding: '14px 28px',
                    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px ${pill.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#F8FAFC',
                    width: 580,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: pill.color,
                      boxShadow: `0 0 10px ${pill.color}`,
                    }}
                  />
                  <span>{pill.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlitchTransition>
  );
};
