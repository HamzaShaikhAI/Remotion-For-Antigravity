import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1AgentTerminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.85, 1.0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const rotateX = interpolate(enterSpring, [0, 1], [20, 8]);
  const rotateY = interpolate(enterSpring, [0, 1], [-25, -6]);

  // Typewriter prompt text
  const fullPrompt = '> agy "Build an autonomous launch video for Remotion Engine"';
  const promptChars = Math.floor(
    interpolate(frame, [10, 48], [0, fullPrompt.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const currentPrompt = fullPrompt.slice(0, promptChars);

  // Response lines appearing at frame 50+
  const respSpring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const respOpacity = interpolate(respSpring, [0, 1], [0, 1]);
  const respY = interpolate(respSpring, [0, 1], [15, 0]);

  // Cursor blink
  const isCursorBlink = Math.floor(frame / 12) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D Tilted Agent Terminal Window */}
      <div
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          opacity,
          width: 1040,
          backgroundColor: 'rgba(10, 14, 24, 0.92)',
          backdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1.5px solid rgba(0, 245, 255, 0.35)',
          boxShadow:
            '0 35px 80px -10px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 245, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Terminal Chrome Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 52,
            padding: '0 20px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Traffic Lights */}
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#27C93F' }} />
          </div>

          {/* Window Title */}
          <div
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00F5FF', boxShadow: '0 0 8px #00F5FF' }} />
            <span>Google Antigravity 2.0 • REA Agent Terminal</span>
          </div>

          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#34D399',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            AUTONOMOUS
          </div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            padding: '28px 36px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 22,
            lineHeight: 1.7,
            minHeight: 240,
          }}
        >
          {/* Prompt line */}
          <div style={{ color: '#00F5FF', fontWeight: 600 }}>
            <span>{currentPrompt}</span>
            {frame < 50 && isCursorBlink && (
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 24,
                  marginLeft: 4,
                  backgroundColor: '#00F5FF',
                  verticalAlign: 'middle',
                }}
              />
            )}
          </div>

          {/* Agent execution output */}
          {frame >= 48 && (
            <div
              style={{
                marginTop: 20,
                transform: `translateY(${respY}px)`,
                opacity: respOpacity,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ color: '#34D399', fontSize: 18, fontWeight: 700 }}>
                ✔ REA Engine v1.2 initialized successfully
              </div>
              <div style={{ color: '#94A3B8', fontSize: 16 }}>
                ℹ Bundled FFmpeg ready • 5 visual plugins loaded • Deterministic Chromium pipeline active
              </div>
              <div style={{ color: '#A855F7', fontSize: 17, fontWeight: 600, marginTop: 4 }}>
                ⚡ Launching high-octane motion graphics orchestration...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
