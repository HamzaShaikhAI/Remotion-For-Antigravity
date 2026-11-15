import React from 'react';
import type { SliderControls } from './types.ts';

interface PixelArtInteractiveControlsProps {
  sliders?: Partial<SliderControls>;
  activeDurationSec?: number;
  isRecording?: boolean;
  isPlaying?: boolean;
  onSliderChange?: (key: keyof SliderControls, val: number) => void;
  onDurationSelect?: (sec: number) => void;
  onPlayToggle?: () => void;
  onExportClick?: () => void;
}

export const PixelArtInteractiveControls: React.FC<PixelArtInteractiveControlsProps> = ({
  sliders = { motionIntensity: 1.0, environmentalMotion: 1.0, ambientEffects: 1.0 },
  activeDurationSec = 10,
  isRecording = false,
  isPlaying = true,
}) => {
  const motionVal = sliders.motionIntensity ?? 1.0;
  const envVal = sliders.environmentalMotion ?? 1.0;
  const ambientVal = sliders.ambientEffects ?? 1.0;

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#111520',
        border: '1px solid #1e2638',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* 3 Adaptive Sliders Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {/* Slider 1: Motion Intensity */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '14px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Motion Intensity</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#f97316',
                fontWeight: 700,
              }}
            >
              {motionVal.toFixed(2)}x
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: '#1e293b',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(motionVal / 2) * 100}%`,
                height: '100%',
                backgroundColor: '#f97316',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Global animation speed &amp; travel</div>
        </div>

        {/* Slider 2: Environmental Motion */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '14px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Environmental Motion</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              {envVal.toFixed(2)}x
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: '#1e293b',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(envVal / 2) * 100}%`,
                height: '100%',
                backgroundColor: '#38bdf8',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Rain streaks, wind sway, water chop</div>
        </div>

        {/* Slider 3: Ambient Effects */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '14px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Ambient Effects</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#fbbf24',
                fontWeight: 700,
              }}
            >
              {ambientVal.toFixed(2)}x
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: '#1e293b',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(ambientVal / 2) * 100}%`,
                height: '100%',
                backgroundColor: '#fbbf24',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Lantern flicker &amp; moon breathing</div>
        </div>
      </div>

      {/* Action Controls & Export Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Play/Pause & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#94a3b8',
              letterSpacing: 0.5,
            }}
          >
            LOOP: 12 FPS SEAMLESS
          </div>
        </div>

        {/* Duration Selectors & Export Video Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Duration Chips */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#090c14',
              padding: 4,
              borderRadius: 8,
              border: '1px solid #1e2433',
              gap: 4,
            }}
          >
            {[5, 10, 30, 60].map((sec) => (
              <div
                key={sec}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: 6,
                  fontWeight: activeDurationSec === sec ? 700 : 500,
                  backgroundColor: activeDurationSec === sec ? '#1e293b' : 'transparent',
                  color: activeDurationSec === sec ? '#ffffff' : '#64748b',
                }}
              >
                {sec}s
              </div>
            ))}
          </div>

          {/* Download Video Action */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: isRecording ? '#dc2626' : '#ea580c',
              color: '#ffffff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: isRecording
                ? '0 0 16px rgba(220, 38, 38, 0.5)'
                : '0 4px 14px rgba(234, 88, 12, 0.35)',
            }}
          >
            <span>{isRecording ? '🔴' : '🎬'}</span>
            <span>{isRecording ? 'Recording MP4...' : 'Download Video'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
