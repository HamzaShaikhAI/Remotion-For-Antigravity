import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const Scene2NeuralCore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring scale
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Concentric rotation velocities
  const rot1 = frame * 2.5;
  const rot2 = -frame * 3.8;
  const rot3 = frame * 1.8;

  // Pulsing energy core
  const pulse = 1 + Math.sin(frame * 0.25) * 0.12;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${enterScale})`,
      }}
    >
      {/* Upper header */}
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 6,
          color: '#38bdf8',
          textTransform: 'uppercase',
          marginBottom: 30,
        }}
      >
        // STAGE 02: NEURAL MOTION MATRIX
      </div>

      {/* 3D Gyroscopic Rings & Core */}
      <div
        style={{
          position: 'relative',
          width: 440,
          height: 440,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Core Glowing Orb */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00f5ff 0%, #7c3aed 70%, transparent 100%)',
            boxShadow: '0 0 60px #00f5ff, 0 0 120px rgba(124, 58, 237, 0.6)',
            transform: `scale(${pulse})`,
            zIndex: 5,
          }}
        />

        {/* Ring 1 - Outer Cyan Dotted */}
        <svg
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            transform: `rotate(${rot1}deg)`,
          }}
          viewBox="0 0 420 420"
        >
          <circle
            cx="210"
            cy="210"
            r="195"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="3"
            strokeDasharray="18 12 40 8"
            style={{ filter: 'drop-shadow(0 0 8px #00f5ff)' }}
          />
        </svg>

        {/* Ring 2 - Middle Magenta Segmented */}
        <svg
          style={{
            position: 'absolute',
            width: 330,
            height: 330,
            transform: `rotate(${rot2}deg)`,
          }}
          viewBox="0 0 330 330"
        >
          <circle
            cx="165"
            cy="165"
            r="150"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="4"
            strokeDasharray="60 40 10 40"
            style={{ filter: 'drop-shadow(0 0 10px #f43f5e)' }}
          />
        </svg>

        {/* Ring 3 - Inner Violet Hexagon Accent */}
        <svg
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            transform: `rotate(${rot3}deg)`,
          }}
          viewBox="0 0 240 240"
        >
          <circle
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeDasharray="8 8"
            style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }}
          />
        </svg>
      </div>

      {/* Simulated Audio Spectrum Waveform */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', height: 60, marginTop: 40 }}>
        {Array.from({ length: 32 }).map((_, i) => {
          const barHeight = 8 + Math.abs(Math.sin((frame * 0.18) + i * 0.35)) * 48;
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: barHeight,
                borderRadius: 3,
                background: `linear-gradient(180deg, #00f5ff 0%, #8b5cf6 100%)`,
                boxShadow: '0 0 8px rgba(0, 245, 255, 0.5)',
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          color: '#e2e8f0',
          marginTop: 18,
          letterSpacing: 3,
        }}
      >
        AUDIO_REACTIVE FREQUENCY: 432 Hz // SYNC: 100%
      </div>
    </div>
  );
};
