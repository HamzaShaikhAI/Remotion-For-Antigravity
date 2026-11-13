import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const Scene3EditorialTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  const highlightSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 10, stiffness: 180 },
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
        textAlign: 'center',
        padding: '0 60px',
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Editorial Counter Stats Row */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 36,
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #18181B',
            boxShadow: '6px 6px 0 #18181B',
            padding: '16px 32px',
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 900, color: '#18181B', fontFamily: 'system-ui, sans-serif' }}>
            550+
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#71717A', letterSpacing: 2 }}>
            ACTIVE SUBSEA CABLES
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #18181B',
            boxShadow: '6px 6px 0 #18181B',
            padding: '16px 32px',
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 900, color: '#18181B', fontFamily: 'system-ui, sans-serif' }}>
            1.4M km
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#71717A', letterSpacing: 2 }}>
            TOTAL GLOBAL FIBER LENGTH
          </div>
        </div>
      </div>

      {/* Highlighter-Yellow Punchline */}
      <div
        style={{
          transform: `scale(${highlightSpring})`,
          opacity: subOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: '#FACC15',
            color: '#18181B',
            fontSize: 46,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '16px 42px',
            border: '4px solid #18181B',
            boxShadow: '8px 8px 0px #18181B',
            letterSpacing: 1,
            textTransform: 'uppercase',
            display: 'inline-block',
          }}
        >
          THE ENTIRE GLOBAL ECONOMY RUNS UNDERWATER.
        </div>
      </div>

      {/* Source Attribution Stamp */}
      <div
        style={{
          marginTop: 40,
          fontFamily: 'monospace',
          fontSize: 13,
          fontWeight: 700,
          color: '#71717A',
          letterSpacing: 3,
          opacity: subOpacity,
        }}
      >
        DOCUMENTARY RESEARCH // TELEGEOGRAPHY SUBMARINE CABLE MAP 2026
      </div>
    </div>
  );
};
