import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SyntaxHighlightedCode } from './SyntaxHighlightedCode';

export const MacTerminalWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the window (frame 0 to 20)
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const windowScale = interpolate(enterSpring, [0, 1], [0.88, 1.0]);
  const windowOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const windowY = interpolate(enterSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        transform: `translateY(${windowY}px) scale(${windowScale})`,
        opacity: windowOpacity,
        width: 960,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 17, 23, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow:
          '0 35px 80px -10px rgba(0, 0, 0, 0.8), 0 0 50px rgba(56, 189, 248, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* macOS Window Chrome Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 52,
          padding: '0 20px',
          backgroundColor: 'rgba(22, 27, 34, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        {/* Traffic Light Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#FF5F56',
              border: '1px solid #E0443E',
              boxShadow: '0 0 8px rgba(255, 95, 86, 0.4)',
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#FFBD2E',
              border: '1px solid #DEA123',
              boxShadow: '0 0 8px rgba(255, 189, 46, 0.4)',
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#27C93F',
              border: '1px solid #1AAB29',
              boxShadow: '0 0 8px rgba(39, 201, 63, 0.4)',
            }}
          />
        </div>

        {/* Tab & File Identifier */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 16px',
            backgroundColor: 'rgba(13, 17, 23, 0.75)',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#E2E8F0',
          }}
        >
          {/* Python Icon / Dot */}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 8px #38BDF8',
            }}
          />
          <span>api/routes/task.py</span>
          <span style={{ color: '#64748B', fontSize: 12, marginLeft: 4 }}>• Python 3.12</span>
        </div>

        {/* Right Status Badge */}
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            fontWeight: 600,
            color: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(52, 211, 153, 0.25)',
          }}
        >
          FASTAPI UVLOOP
        </div>
      </div>

      {/* Code Editor Body */}
      <SyntaxHighlightedCode />
    </div>
  );
};
