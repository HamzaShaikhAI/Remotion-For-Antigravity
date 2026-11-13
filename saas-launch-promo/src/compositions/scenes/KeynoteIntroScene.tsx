import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const KeynoteIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const translateY = interpolate(titleSpring, [0, 1], [40, 0]);
  const opacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
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
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '0 60px',
      }}
    >
      {/* Sleek Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 22px',
          borderRadius: 9999,
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          color: '#2563EB',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 28,
          opacity,
          transform: `translateY(${translateY * 0.5}px)`,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563EB' }} />
        Enterprise Cloud Analytics 2.0
      </div>

      {/* Main Title */}
      <h1
        style={{
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: -2,
          color: '#0F172A',
          margin: 0,
          lineHeight: 1.1,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        The Future of Metrics.<br />
        <span
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Instantaneous Clarity.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 26,
          color: '#64748B',
          maxWidth: 780,
          marginTop: 26,
          lineHeight: 1.5,
          opacity: subOpacity,
        }}
      >
        Real-time financial telemetry, autonomous workflow monitoring, and high-velocity business intelligence.
      </p>
    </div>
  );
};
