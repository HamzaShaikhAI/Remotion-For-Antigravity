import React from 'react';
import { useCurrentFrame } from 'remotion';
import { MotionLabControlId, MOTION_LAB_PRINCIPLES } from './types';

interface MotionLabBentoControlsProps {
  activeControl: MotionLabControlId;
}

export const MotionLabBentoControls: React.FC<MotionLabBentoControlsProps> = ({ activeControl }) => {
  const frame = useCurrentFrame();

  const currentPrinciple =
    MOTION_LAB_PRINCIPLES.find((p) => p.name === activeControl) || MOTION_LAB_PRINCIPLES[0];

  // Mascot eye blink
  const isBlink = frame % 60 < 4;

  // Mascot wire target position
  const wireTargets: Record<MotionLabControlId, { x: number; y: number }> = {
    SPACING: { x: 260, y: 1360 },
    TYPOGRAPHY: { x: 680, y: 1360 },
    MOTION_BLUR: { x: 1140, y: 1360 },
    EASING: { x: 260, y: 1540 },
    FOLLOW_THROUGH: { x: 680, y: 1540 },
    ANTICIPATION: { x: 1140, y: 1540 },
  };

  const currentTarget = wireTargets[activeControl] || wireTargets.SPACING;

  return (
    <div
      style={{
        position: 'absolute',
        top: 1120,
        left: 56,
        right: 56,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#f8fafc',
        zIndex: 20,
      }}
    >
      {/* ======================================================== */}
      {/* TERRACOTTA PIXEL MASCOT & CONNECTING WIRE                */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: -85,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 30,
        }}
      >
        {/* Pixel Crab Mascot (Pure SVG) */}
        <svg width="120" height="74" viewBox="0 0 120 74">
          {/* Main Terracotta Body */}
          <rect x="25" y="10" width="70" height="45" rx="4" fill="#d97706" />
          {/* Crab Pincers / Claws */}
          <rect x="10" y="22" width="15" height="20" rx="3" fill="#d97706" />
          <rect x="95" y="22" width="15" height="20" rx="3" fill="#d97706" />
          {/* Legs */}
          <rect x="35" y="55" width="8" height="15" fill="#d97706" />
          <rect x="52" y="55" width="8" height="15" fill="#d97706" />
          <rect x="68" y="55" width="8" height="15" fill="#d97706" />
          {/* Black Eyes */}
          <rect x="42" y="24" width="8" height={isBlink ? 2 : 8} fill="#09090b" />
          <rect x="70" y="24" width="8" height={isBlink ? 2 : 8} fill="#09090b" />
          {/* Mouth */}
          <rect x="56" y="38" width="8" height="4" fill="#09090b" />
        </svg>
      </div>

      {/* SVG Connecting Leader Wire Line to Active Control */}
      <svg
        style={{
          position: 'absolute',
          top: -30,
          left: 0,
          width: '100%',
          height: 600,
          pointerEvents: 'none',
          zIndex: 25,
        }}
      >
        <path
          d={`M 736 0 Q ${currentTarget.x} 60 ${currentTarget.x - 56} ${currentTarget.y - 1280}`}
          fill="none"
          stroke="#ea580c"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />
        <circle cx={currentTarget.x - 56} cy={currentTarget.y - 1280} r="4" fill="#ea580c" />
      </svg>

      {/* ======================================================== */}
      {/* DARK GLASS BENTO HUD DECK                                */}
      {/* ======================================================== */}
      <div
        style={{
          backgroundColor: '#090a0f',
          border: '1.5px solid #1e293b',
          borderRadius: 20,
          padding: '24px 28px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Deck Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b',
            paddingBottom: 14,
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 800,
            fontFamily: "'SF Mono', monospace",
          }}
        >
          <div style={{ color: '#ea580c' }}>&gt;_ CLAUDE CODE</div>
          <div style={{ color: '#94a3b8', letterSpacing: 2 }}>
            LIVE / SIX EDITABLE CONTROLS
          </div>
          <div style={{ color: '#64748b' }}>REMOTION + GSAP</div>
        </div>

        {/* 2x3 Bento Grid of the 6 Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* 01 SPACING */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'SPACING' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>01</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>SPACING</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Distance between poses
            </div>
            {/* Spacing dot chain */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
              {[0, 4, 10, 18, 28, 40].map((s, idx) => (
                <circle
                  key={idx}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#ea580c' : '#ffffff',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </div>

          {/* 02 TYPOGRAPHY */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'TYPOGRAPHY' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>02</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>TYPOGRAPHY</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Scale / tracking / line breaks
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#ffffff' }}>A</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#ea580c' }}>a</span>
            </div>
          </div>

          {/* 03 MOTION BLUR */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'MOTION_BLUR' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>03</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>MOTION BLUR</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Exposure during fast movement
            </div>
            {/* Blur swatch */}
            <div
              style={{
                marginTop: 10,
                width: 44,
                height: 18,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #ea580c 0%, rgba(234, 88, 12, 0.1) 100%)',
              }}
            />
          </div>

          {/* 04 EASING */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'EASING' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>04</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>EASING</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Acceleration and deceleration
            </div>
            {/* Bezier curve mini graph */}
            <svg width="120" height="24" viewBox="0 0 120 24" style={{ marginTop: 8 }}>
              <path d="M 0 20 C 40 20, 50 4, 120 4" fill="none" stroke="#ea580c" strokeWidth="2.5" />
              <circle cx="120" cy="4" r="3" fill="#ffffff" />
            </svg>
          </div>

          {/* 05 FOLLOW-THROUGH */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'FOLLOW_THROUGH' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>05</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>FOLLOW-THROUGH</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Secondary parts settle later
            </div>
            {/* Trailing snake chain */}
            <svg width="120" height="20" viewBox="0 0 120 20" style={{ marginTop: 8 }}>
              <path d="M 10 10 Q 40 4 80 16 T 120 10" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* 06 ANTICIPATION */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: activeControl === 'ANTICIPATION' ? '2px solid #ea580c' : '1px solid #1e293b',
              borderRadius: 12,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>06</span>
              <span style={{ fontSize: 20, fontWeight: 900 }}>ANTICIPATION</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Prepare before the main move
            </div>
            {/* Toggle switch */}
            <div
              style={{
                marginTop: 10,
                width: 38,
                height: 18,
                borderRadius: 9,
                backgroundColor: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 2px',
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ffffff' }} />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TELEMETRY SUB-PANELS (Prompt, Code, Delivery)             */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.3fr 1fr',
            gap: 20,
            fontFamily: "'SF Mono', monospace",
            fontSize: 12,
            borderTop: '1px solid #1e293b',
            paddingTop: 18,
          }}
        >
          {/* Panel 1: Directing Prompt */}
          <div>
            <div style={{ color: '#ea580c', fontWeight: 800, marginBottom: 8 }}>
              DIRECTING PROMPT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#94a3b8' }}>
              {currentPrinciple.directingPrompt.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 12 }}>
              EDIT ONE CONTROL / PREVIEW AGAIN
            </div>
          </div>

          {/* Panel 2: Frame-Driven Code */}
          <div>
            <div style={{ color: '#38bdf8', fontWeight: 800, marginBottom: 8 }}>
              FRAME-DRIVEN CODE
            </div>
            <div
              style={{
                backgroundColor: '#020617',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                color: '#cbd5e1',
                fontSize: 11,
              }}
            >
              {currentPrinciple.codeSnippet.map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>
          </div>

          {/* Panel 3: Preview / Delivery */}
          <div>
            <div style={{ color: '#94a3b8', fontWeight: 800, marginBottom: 8 }}>
              PREVIEW / DELIVERY
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {/* Delivery Thumbnails */}
              <div
                style={{
                  width: 58,
                  height: 38,
                  backgroundColor: '#ffffff',
                  color: '#09090b',
                  borderRadius: 4,
                  fontSize: 8,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                I MAKE MOVE
              </div>
              <div
                style={{
                  width: 58,
                  height: 38,
                  backgroundColor: '#ffffff',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#09090b', fontSize: 10 }}>📈</span>
              </div>
              <div
                style={{
                  width: 58,
                  height: 38,
                  backgroundColor: '#ffffff',
                  color: '#09090b',
                  borderRadius: 4,
                  fontSize: 7,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                CLAUDE
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>H.264 / AAC / FULL REEL</div>
            <div style={{ fontSize: 10, color: '#ea580c', marginTop: 4 }}>
              FRAME SYNC / EDITABLE CODE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
