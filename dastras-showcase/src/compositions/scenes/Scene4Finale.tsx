import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Scene4Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Expanding shockwave burst
  const shockwaveScale = interpolate(frame, [0, 45], [0.2, 3.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shockwaveOpacity = interpolate(frame, [0, 10, 45], [0.9, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Emblem scale spring
  const emblemScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 130 },
  });

  const subOpacity = interpolate(frame, [25, 45], [0, 1], {
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
      }}
    >
      {/* Expanding shockwave ring */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '2px solid #00f5ff',
          boxShadow: '0 0 40px #00f5ff, inset 0 0 40px #00f5ff',
          transform: `scale(${shockwaveScale})`,
          opacity: shockwaveOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Futuristic Emblem Icon */}
      <div
        style={{
          transform: `scale(${emblemScale})`,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 22,
            background: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 50px rgba(0, 245, 255, 0.6), 0 0 100px rgba(168, 85, 247, 0.4)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>

      {/* Kinetic Title Text */}
      <div style={{ textAlign: 'center' }}>
        <KineticSplitText
          text="DASTRAS x ANTIGRAVITY"
          fontSize={68}
          color="#ffffff"
          stagger={2}
        />
      </div>

      {/* Subtitle with glow */}
      <div
        style={{
          marginTop: 22,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 8,
          background: 'linear-gradient(90deg, #38bdf8, #c084fc, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          opacity: subOpacity,
        }}
      >
        THE NEW ERA OF AI MOTION GRAPHICS
      </div>
    </div>
  );
};
