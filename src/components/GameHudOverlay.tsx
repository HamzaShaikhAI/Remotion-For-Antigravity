import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface GameHudOverlayProps {
  haul?: number;
  startHaul?: number;
  crew?: number;
  heat?: number; // 0 to 100 percentage
  statusText?: string;
  countDurationFrames?: number;
  startFrame?: number;
}

export const GameHudOverlay: React.FC<GameHudOverlayProps> = ({
  haul = 8400000,
  startHaul = 1112024,
  crew = 2,
  heat = 0,
  statusText,
  countDurationFrames = 60,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Animated counting for haul
  const countingProgress = interpolate(
    frame - startFrame,
    [0, countDurationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const currentHaul = Math.floor(startHaul + (haul - startHaul) * countingProgress);
  const formattedHaul = `$${currentHaul.toLocaleString('en-US')}`;

  // Heat warning pulse if heat > 20%
  const isHighHeat = heat > 20;
  const heatPulse = isHighHeat ? Math.sin((frame / fps) * Math.PI * 4) * 0.15 + 0.85 : 1;
  const heatColor = heat > 50 ? '#EF4444' : heat > 20 ? '#F59E0B' : '#10B981';

  return (
    <div
      style={{
        position: 'absolute',
        top: '48px',
        left: '48px',
        right: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: entranceProgress,
        transform: `translateY(${interpolate(entranceProgress, [0, 1], [-20, 0])}px)`,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* Tactical Variable HUD Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '12px 28px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* HAUL */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            HAUL
          </span>
          <span
            style={{
              fontFamily: '"SF Pro Display", -apple-system, monospace',
              fontSize: '26px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#F8FAFC',
            }}
          >
            {formattedHaul}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.15)' }} />

        {/* CREW */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            CREW
          </span>
          <span
            style={{
              fontFamily: '"SF Pro Display", -apple-system, monospace',
              fontSize: '26px',
              fontWeight: 900,
              color: '#F8FAFC',
            }}
          >
            {crew}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.15)' }} />

        {/* HEAT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            HEAT
          </span>
          <span
            style={{
              fontFamily: '"SF Pro Display", -apple-system, monospace',
              fontSize: '26px',
              fontWeight: 900,
              color: heatColor,
              opacity: heatPulse,
              textShadow: isHighHeat ? `0 0 12px ${heatColor}` : 'none',
            }}
          >
            {heat}%
          </span>
        </div>
      </div>

      {/* Optional Status Pill */}
      {statusText && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#38BDF8',
            textTransform: 'uppercase',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          {statusText}
        </div>
      )}
    </div>
  );
};
