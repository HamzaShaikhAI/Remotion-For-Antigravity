import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene3StyleMultiverse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grid of 6 distinct styles
  const STYLES = [
    { title: 'Cyberpunk HUD', icon: '🌌', color: '#00F5FF', tag: 'Neon Physics & Gyro' },
    { title: 'Apple Keynote SaaS', icon: '💎', color: '#38BDF8', tag: '3D Cards & Counters' },
    { title: 'Vox Documentary', icon: '📰', color: '#FACC15', tag: 'Paper & SVG Cable Maps' },
    { title: 'Vertical Shorts 9:16', icon: '📱', color: '#A855F7', tag: 'Syntax Typing & Zoom' },
    { title: 'Podcast Audiograms', icon: '🎙️', color: '#34D399', tag: '48-Bar Radial Spectrum' },
    { title: 'Multi-Scene Anime Edit', icon: '🎬', color: '#F43F5E', tag: 'Lossless FFmpeg Trimming' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            fontWeight: 800,
            color: '#A855F7',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          VERSATILE MULTIVERSE
        </div>
        <h2
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 46,
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em',
            textShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
          }}
        >
          Six Native Motion Graphic Formats
        </h2>
      </div>

      {/* 2x3 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          width: 1100,
        }}
      >
        {STYLES.map((style, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 12, mass: 0.5, stiffness: 120 },
          });
          const cScale = interpolate(cardSpring, [0, 1], [0.75, 1.0]);
          const cOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
          const cY = interpolate(cardSpring, [0, 1], [30, 0]);

          return (
            <div
              key={idx}
              style={{
                transform: `translateY(${cY}px) scale(${cScale})`,
                opacity: cOpacity,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                borderRadius: 16,
                border: `1.5px solid ${style.color}55`,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${style.color}22`,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: `${style.color}22`,
                  border: `1px solid ${style.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {style.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#F8FAFC',
                  }}
                >
                  {style.title}
                </div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 13,
                    color: style.color,
                    fontWeight: 600,
                    marginTop: 3,
                  }}
                >
                  {style.tag}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kinetic Pill Callout */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 28px',
          backgroundColor: 'rgba(0, 245, 255, 0.12)',
          border: '1.5px solid #00F5FF',
          borderRadius: 999,
          boxShadow: '0 0 30px rgba(0, 245, 255, 0.35)',
        }}
      >
        <span style={{ fontSize: 20 }}>⚡</span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 17,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
          }}
        >
          Prompt → Deterministic Code → Broadcast-Grade Video
        </span>
      </div>
    </div>
  );
};
