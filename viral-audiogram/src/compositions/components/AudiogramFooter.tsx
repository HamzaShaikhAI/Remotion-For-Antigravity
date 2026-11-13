import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const AudiogramFooter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring
  const footerSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const footerY = interpolate(footerSpring, [0, 1], [30, 0]);
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1]);

  // Audio track progress
  const progressPercent = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentSeconds = Math.floor(frame / fps);
  const formattedTime = `00:0${currentSeconds} / 00:08`;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 48,
        right: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transform: `translateY(${footerY}px)`,
        opacity: footerOpacity,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Audio Scrubbing Bar & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            fontWeight: 700,
            color: '#00F5FF',
            width: 120,
          }}
        >
          {formattedTime}
        </span>

        {/* Track Line */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #00F5FF 0%, #3B82F6 70%, #A855F7 100%)',
              boxShadow: '0 0 12px #00F5FF',
            }}
          />
        </div>
      </div>

      {/* Streaming Badges Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#94A3B8',
          }}
        >
          Available wherever you get your podcasts
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {['Spotify', 'Apple Podcasts', 'YouTube'].map((platform) => (
            <span
              key={platform}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                color: '#CBD5E1',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
