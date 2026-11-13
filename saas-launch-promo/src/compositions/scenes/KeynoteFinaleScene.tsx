import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { KineticSplitText } from '../../plugins/rea-typography';

export const KeynoteFinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for container
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const subOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buttonSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '0 40px',
      }}
    >
      {/* Category Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 20px',
          borderRadius: 9999,
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          color: '#2563EB',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 32,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563EB' }} />
        Intelligence at Enterprise Scale
      </div>

      {/* Kinetic Hero Split Text */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <KineticSplitText
          text="SCALE WITHOUT LIMITS"
          delayPerLetter={2}
          style={{
            fontSize: 78,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: -2,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />
      </div>

      {/* Elegant Subtitle */}
      <p
        style={{
          fontSize: 24,
          color: '#64748B',
          maxWidth: 720,
          marginTop: 24,
          lineHeight: 1.5,
          opacity: subOpacity,
        }}
      >
        Transform raw data into real-time visual velocity with Google Antigravity 2.0 and the REA Engine.
      </p>

      {/* Apple-Keynote CTA Button */}
      <div
        style={{
          marginTop: 36,
          transform: `scale(${buttonSpring})`,
          opacity: subOpacity,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 36px',
            borderRadius: 9999,
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 700,
            boxShadow: '0 12px 30px -5px rgba(37, 99, 235, 0.4)',
          }}
        >
          Start Building with Antigravity
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </div>
  );
};
