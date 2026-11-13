import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const GyroscopeCoreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring scale
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Differential rotation speeds per user specification
  const rot1 = frame * 2.2;
  const rot2 = -frame * 3.1;
  const rot3 = frame * 1.5;

  // Spring heartbeat pulse: repeats every 30 frames (1 beat per second)
  const heartbeatCycle = frame % 30;
  const heartbeatSpring = spring({
    frame: heartbeatCycle,
    fps,
    config: { damping: 6, stiffness: 220, mass: 0.7 },
  });

  // Heartbeat scale: beats up to 1.3x and snaps back
  const coreScale = interpolate(heartbeatSpring, [0, 1], [1.0, 1.28]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${enterSpring})`,
      }}
    >
      {/* Top Header Tag */}
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 6,
          color: '#00f5ff',
          textTransform: 'uppercase',
          marginBottom: 35,
          textShadow: '0 0 15px rgba(0, 245, 255, 0.6)',
        }}
      >
        // STAGE 02: 3D QUANTUM GYROSCOPE CORE
      </div>

      {/* Gyroscopic Concentric Rings & Heartbeat Core */}
      <div
        style={{
          position: 'relative',
          width: 460,
          height: 460,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glowing Center Energy Orb (Heartbeat Spring) */}
        <div
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00f5ff 0%, #a855f7 65%, transparent 100%)',
            boxShadow: '0 0 50px #00f5ff, 0 0 100px rgba(168, 85, 247, 0.7)',
            transform: `scale(${coreScale})`,
            zIndex: 10,
          }}
        />

        {/* Ring 1 - Outer Cyan Dotted (frame * 2.2) */}
        <svg
          style={{
            position: 'absolute',
            width: 440,
            height: 440,
            transform: `rotate(${rot1}deg)`,
          }}
          viewBox="0 0 440 440"
        >
          <circle
            cx="220"
            cy="220"
            r="205"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="3.5"
            strokeDasharray="22 14 45 10"
            style={{ filter: 'drop-shadow(0 0 10px #00f5ff)' }}
          />
        </svg>

        {/* Ring 2 - Middle Magenta Segmented (-frame * 3.1) */}
        <svg
          style={{
            position: 'absolute',
            width: 340,
            height: 340,
            transform: `rotate(${rot2}deg)`,
          }}
          viewBox="0 0 340 340"
        >
          <circle
            cx="170"
            cy="170"
            r="155"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="4"
            strokeDasharray="50 30 15 30"
            style={{ filter: 'drop-shadow(0 0 12px #f43f5e)' }}
          />
        </svg>

        {/* Ring 3 - Inner Electric Purple (frame * 1.5) */}
        <svg
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            transform: `rotate(${rot3}deg)`,
          }}
          viewBox="0 0 250 250"
        >
          <circle
            cx="125"
            cy="125"
            r="110"
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeDasharray="10 10"
            style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }}
          />
        </svg>
      </div>

      {/* Audio Reactive Frequency Waveform synced to heartbeat */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', height: 60, marginTop: 40 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const barHeight = 8 + Math.abs(Math.sin((frame * 0.22) + i * 0.4)) * (coreScale * 35);
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: barHeight,
                borderRadius: 3,
                background: 'linear-gradient(180deg, #00f5ff 0%, #a855f7 100%)',
                boxShadow: '0 0 8px rgba(0, 245, 255, 0.6)',
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 15,
          color: '#cbd5e1',
          marginTop: 18,
          letterSpacing: 4,
        }}
      >
        HEARTBEAT FREQUENCY: 1.0 Hz (60 BPM) // QUANTUM_LOCKED
      </div>
    </div>
  );
};
