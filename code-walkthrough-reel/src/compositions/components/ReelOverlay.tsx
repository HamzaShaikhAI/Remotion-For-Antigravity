import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ReelOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for top header
  const headerSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const headerY = interpolate(headerSpring, [0, 1], [-50, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  // Entrance spring for footer
  const footerSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const footerY = interpolate(footerSpring, [0, 1], [50, 0]);
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1]);

  return (
    <>
      {/* Top Header Section (Mobile Safe Zone ~200px from top) */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${headerY}px)`,
          opacity: headerOpacity,
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 999,
            backgroundColor: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 10px #38BDF8',
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Python Backend Architecture
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 48,
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          }}
        >
          How FastAPI Handles Async
        </h1>
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 22,
            fontWeight: 500,
            color: '#94A3B8',
            margin: '8px 0 0 0',
            textAlign: 'center',
          }}
        >
          Event Loop Concurrency in 10 Seconds
        </p>
      </div>

      {/* Bottom Footer Section (Mobile Safe Zone ~1620px from top) */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${footerY}px)`,
          opacity: footerOpacity,
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        {/* Interaction callout pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span style={{ fontSize: 18 }}>💡</span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: '#E2E8F0',
            }}
          >
            Save for later • Follow for more Python engineering reels
          </span>
        </div>

        {/* Tech tags */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 14,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            fontWeight: 600,
            color: '#64748B',
          }}
        >
          <span>#FastAPI</span>
          <span>#Python</span>
          <span>#AsyncIO</span>
          <span>#WebDev</span>
        </div>
      </div>
    </>
  );
};
