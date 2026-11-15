import React from 'react';
import { useCurrentFrame } from 'remotion';

export const MotionLabDashboardHeader: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '36px 56px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {/* Top Author Tag */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: 2,
          fontFamily: "'SF Mono', monospace",
          marginBottom: 16,
        }}
      >
        @BEAMNXW / CREATIVE CODING WITH CLAUDE CODE
      </div>

      {/* Header Container with Logo Badges */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Badge: Anthropic AI */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 900, color: '#09090b', letterSpacing: -1 }}>
            AI
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1 }}>
            Anthropic
          </span>
        </div>

        {/* Center Title Lockup */}
        <div style={{ textAlign: 'center', marginTop: -6 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 54,
              fontWeight: 900,
              color: '#09090b',
              letterSpacing: 1.5,
              lineHeight: 1.05,
            }}
          >
            OPUS 5.5 / YOUR F*CKING
          </h1>
          <h2
            style={{
              margin: '4px 0 0',
              fontSize: 68,
              fontWeight: 900,
              color: '#d97706',
              letterSpacing: 3,
              lineHeight: 1,
            }}
          >
            MOTION DESIGN LAB
          </h2>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: 3,
              marginTop: 10,
              fontFamily: "'SF Mono', monospace",
            }}
          >
            CLAUDE CODE + REMOTION + GSAP / SIX EDITABLE CONTROLS
          </div>
        </div>

        {/* Right Badge: Claude Code */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          {/* Claude Terracotta Starburst Mark */}
          <span style={{ fontSize: 26, color: '#d97706', lineHeight: 1 }}>
            ✹
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginTop: 4 }}>
            Claude Code
          </span>
        </div>
      </div>

      {/* Terminal Directing Prompt Bar */}
      <div
        style={{
          width: '100%',
          marginTop: 22,
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 12,
          padding: '14px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          fontFamily: "'SF Mono', 'Courier New', monospace",
          fontSize: 15,
          color: '#334155',
        }}
      >
        <span style={{ color: '#ea580c', fontWeight: 900 }}>&gt;_</span>
        <span style={{ fontWeight: 600 }}>
          build a motion lab. expose six controls. keep every scene editable.
        </span>
      </div>
    </div>
  );
};
