import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const AnnotationBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring starting at frame 105
  const badgeSpring = spring({
    frame: frame - 105,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 110 },
  });

  const badgeScale = interpolate(badgeSpring, [0, 1], [0.65, 1.0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);
  const badgeY = interpolate(badgeSpring, [0, 1], [60, 0]);

  // Subtle breathing glow on the badge after entry
  const pulseGlow = Math.sin(frame * 0.1) * 0.15 + 0.85;

  if (frame < 105) return null;

  return (
    <div
      style={{
        position: 'relative',
        transform: `translateY(${badgeY}px) scale(${badgeScale})`,
        opacity: badgeOpacity,
        width: 880,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(24px)',
        borderRadius: 18,
        border: '2px solid #38BDF8',
        boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 ${40 * pulseGlow}px rgba(56, 189, 248, ${0.4 * pulseGlow})`,
        padding: '24px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 50,
      }}
    >
      {/* Top Laser Connector Pip pointing upward to Lines 4-7 */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: 140,
          width: 20,
          height: 20,
          backgroundColor: '#0F172A',
          borderLeft: '2px solid #38BDF8',
          borderTop: '2px solid #38BDF8',
          transform: 'rotate(45deg)',
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Animated Icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid #38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#38BDF8',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#F8FAFC',
                letterSpacing: '-0.02em',
              }}
            >
              Non-Blocking Async Execution
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13,
                fontWeight: 600,
                color: '#38BDF8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Python Event Loop • asyncio • uvloop
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22C55E',
            borderRadius: 999,
            padding: '4px 12px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px #22C55E',
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#4ADE80',
            }}
          >
            I/O YIELD ACTIVE
          </span>
        </div>
      </div>

      {/* Explanation Text */}
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 17,
          lineHeight: '26px',
          color: '#CBD5E1',
          fontWeight: 450,
        }}
      >
        During <code style={{ color: '#FF7B72', backgroundColor: 'rgba(255,123,114,0.15)', padding: '2px 6px', borderRadius: 4, fontFamily: '"JetBrains Mono", monospace' }}>await</code>, the worker thread is released immediately back to the event loop. While network I/O waits, the server handles thousands of other concurrent requests!
      </div>

      {/* Metric Counters Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginTop: 4,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: 10,
            padding: '8px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#94A3B8' }}>Throughput</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 17, fontWeight: 700, color: '#38BDF8' }}>
            10,000+ req/s
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: 10,
            padding: '8px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#94A3B8' }}>OS Threading</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 17, fontWeight: 700, color: '#A855F7' }}>
            Single-Threaded
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: 10,
            padding: '8px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#94A3B8' }}>I/O Blocking</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 17, fontWeight: 700, color: '#34D399' }}>
            0.00 ms (Zero)
          </div>
        </div>
      </div>
    </div>
  );
};
