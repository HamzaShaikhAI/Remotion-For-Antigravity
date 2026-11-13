import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlitchTransition } from '../../plugins/rea-transitions';
import { KineticSplitText } from '../../plugins/rea-typography';

export const GlitchHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Expanding shockwave burst on entry
  const shockwave = interpolate(frame, [0, 40], [0.3, 3.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shockwaveOpacity = interpolate(frame, [0, 10, 40], [0.95, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Badge entrance spring
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const subOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <GlitchTransition intensity={1.5}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 40px',
        }}
      >
        {/* Shockwave Blast Ring */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '2px solid #00f5ff',
            boxShadow: '0 0 50px #00f5ff, inset 0 0 50px #00f5ff',
            transform: `scale(${shockwave})`,
            opacity: shockwaveOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* Status Chip */}
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            marginBottom: 24,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 20px',
            borderRadius: 9999,
            backgroundColor: 'rgba(0, 245, 255, 0.12)',
            border: '1px solid #00f5ff',
            color: '#00f5ff',
            fontFamily: 'monospace',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 3,
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#00f5ff', boxShadow: '0 0 10px #00f5ff' }} />
          SYSTEM STATE: FULLY SYNCHRONIZED
        </div>

        {/* Hero Title with Kinetic Split-Text */}
        <div style={{ textAlign: 'center' }}>
          <KineticSplitText
            text="AUTONOMOUS CORE ONLINE"
            delayPerLetter={2}
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: 'system-ui, sans-serif',
              color: '#ffffff',
              textShadow: '0 0 35px rgba(0, 245, 255, 0.8), 0 0 70px rgba(168, 85, 247, 0.5)',
              letterSpacing: 2,
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 24,
            fontFamily: 'monospace',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 8,
            background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 50%, #00f5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            opacity: subOpacity,
          }}
        >
          DASTRAS OS v2.0 // GOOGLE ANTIGRAVITY
        </div>
      </div>
    </GlitchTransition>
  );
};
