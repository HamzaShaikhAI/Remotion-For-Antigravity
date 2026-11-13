import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Scene4BrandingFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for container
  const heroSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100, mass: 0.7 },
  });

  const scale = interpolate(heroSpring, [0, 1], [0.85, 1.0]);
  const opacity = interpolate(heroSpring, [0, 1], [0, 1]);

  // Subtitle spring
  const subSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subY = interpolate(subSpring, [0, 1], [25, 0]);

  // Badge spring
  const badgeSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 110 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.75, 1.0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
        textAlign: 'center',
      }}
    >
      {/* Top Pre-title Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 20px',
          borderRadius: 999,
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid #38BDF8',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
          marginBottom: 20,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00F5FF', boxShadow: '0 0 10px #00F5FF' }} />
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            fontWeight: 800,
            color: '#00F5FF',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Google Antigravity 2.0 Ecosystem
        </span>
      </div>

      {/* Hero Title using KineticSplitText */}
      <KineticSplitText
        text="REMOTION FOR ANTIGRAVITY"
        delayPerLetter={1}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 66,
          fontWeight: 950,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          textShadow: '0 0 40px rgba(0, 245, 255, 0.6), 0 0 80px rgba(168, 85, 247, 0.3)',
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subY}px)`,
          opacity: subOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 24,
          fontWeight: 600,
          color: '#CBD5E1',
          maxWidth: 900,
          marginTop: 18,
          lineHeight: 1.5,
        }}
      >
        The Autonomous Motion Graphics & Video Editing Engine for AI Agents
      </div>

      {/* GitHub Repository Badge */}
      <div
        style={{
          transform: `scale(${badgeScale})`,
          opacity: badgeOpacity,
          marginTop: 32,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 32px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 999,
          border: '2px solid #00F5FF',
          boxShadow: '0 15px 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 255, 0.45)',
        }}
      >
        <span style={{ fontSize: 22 }}>⭐</span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 18,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          github.com/HamzaShaikhAI/Remotion-For-Antigravity
        </span>
      </div>

      {/* Author Credit */}
      <div
        style={{
          marginTop: 24,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          color: '#64748B',
          letterSpacing: '0.08em',
        }}
      >
        Created by Hamza Shaikh • Open Source MIT
      </div>
    </div>
  );
};
