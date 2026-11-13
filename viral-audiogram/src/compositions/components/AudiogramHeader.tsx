import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export const AudiogramHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const headerY = interpolate(headerSpring, [0, 1], [-40, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        left: 48,
        right: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transform: `translateY(${headerY}px)`,
        opacity: headerOpacity,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Podcast Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: 'rgba(0, 245, 255, 0.15)',
            border: '1.5px solid #00F5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.4)',
          }}
        >
          🎙️
        </div>
        <div>
          <div
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 18,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            The Engineering Podcast
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 600,
              color: '#00F5FF',
              letterSpacing: '0.06em',
            }}
          >
            EPISODE 42 • FEAT. ALEX RIVERS
          </div>
        </div>
      </div>

      {/* Live Audio Telemetry Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          borderRadius: 999,
          padding: '6px 16px',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#00F5FF',
            boxShadow: '0 0 8px #00F5FF',
          }}
        />
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            fontWeight: 700,
            color: '#E2E8F0',
          }}
        >
          48kHz MASTER
        </span>
      </div>
    </div>
  );
};
