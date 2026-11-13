import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const Scene1HeadlineHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Highlighter slam spring
  const highlightSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const highlightScale = interpolate(highlightSpring, [0, 1], [0.85, 1.0]);
  const highlightOpacity = interpolate(highlightSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 80px',
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Category Tag */}
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: 800,
          backgroundColor: '#18181B',
          color: '#FFFFFF',
          padding: '6px 18px',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 28,
          border: '2px solid #18181B',
          boxShadow: '4px 4px 0 #FACC15',
          transform: `translateY(${translateY * 0.5}px)`,
          opacity,
        }}
      >
        EXPLAINER // THE PHYSICAL INFRASTRUCTURE
      </div>

      {/* Main Narrative Question */}
      <h1
        style={{
          fontSize: 68,
          fontWeight: 900,
          color: '#18181B',
          lineHeight: 1.15,
          maxWidth: 1300,
          margin: 0,
          letterSpacing: -1,
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        99% of international data traffic does <span style={{ textDecoration: 'line-through', color: '#71717A' }}>not</span> travel through satellites.
      </h1>

      {/* Highlighter Yellow Callout Box */}
      <div
        style={{
          marginTop: 36,
          transform: `scale(${highlightScale})`,
          opacity: highlightOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: '#FACC15',
            color: '#18181B',
            fontSize: 48,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '14px 38px',
            border: '4px solid #18181B',
            boxShadow: '8px 8px 0px #18181B',
            letterSpacing: 1,
            textTransform: 'uppercase',
            display: 'inline-block',
          }}
        >
          IT LIES ON THE DEEP OCEAN FLOOR.
        </div>
      </div>
    </div>
  );
};
