import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Typewriter } from '../../plugins/rea-typography';

export const Scene1BootHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Scanning laser beam Y-coordinate
  const scanY = interpolate(frame, [10, 65], [0, height], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scanOpacity = interpolate(frame, [10, 20, 55, 65], [0, 0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hudOpacity = interpolate(frame, [0, 15], [0, 1], {
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
        justifyContent: 'center',
        alignItems: 'center',
        opacity: hudOpacity,
      }}
    >
      {/* Laser scan line */}
      <div
        style={{
          position: 'absolute',
          top: scanY,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #00f5ff, #38bdf8, transparent)',
          boxShadow: '0 0 20px #00f5ff, 0 0 40px #00f5ff',
          opacity: scanOpacity,
          zIndex: 10,
        }}
      />

      {/* Cyber HUD Corner Brackets */}
      <div style={{ position: 'absolute', top: 60, left: 80, width: 60, height: 60, borderTop: '3px solid #00f5ff', borderLeft: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', top: 60, right: 80, width: 60, height: 60, borderTop: '3px solid #00f5ff', borderRight: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', bottom: 60, left: 80, width: 60, height: 60, borderBottom: '3px solid #00f5ff', borderLeft: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', bottom: 60, right: 80, width: 60, height: 60, borderBottom: '3px solid #00f5ff', borderRight: '3px solid #00f5ff' }} />

      {/* Telemetry data tags */}
      <div
        style={{
          position: 'absolute',
          top: 75,
          left: 160,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#38bdf8',
          letterSpacing: 2,
        }}
      >
        [SYSTEM: DASTRAS_KERNEL_v2.0] &nbsp; | &nbsp; [STATUS: SECURE_AGENTS_ACTIVE] &nbsp; | &nbsp; [RENDER_FPS: 30]
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 75,
          right: 160,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#a855f7',
          letterSpacing: 2,
        }}
      >
        COORDINATE_SYSTEM: [1920x1080] &nbsp; | &nbsp; QUANTUM_SYNC: 99.98%
      </div>

      {/* Center Console & Typewriter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          backgroundColor: 'rgba(5, 12, 28, 0.75)',
          padding: '40px 60px',
          borderRadius: 16,
          border: '1px solid rgba(0, 245, 255, 0.3)',
          boxShadow: '0 0 50px rgba(0, 245, 255, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: 9999,
            backgroundColor: 'rgba(0, 245, 255, 0.1)',
            border: '1px solid #00f5ff',
            color: '#00f5ff',
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          ● Autonomous Engine Online
        </div>

        <Typewriter text="INITIALIZING DASTRAS VIDEO INTELLIGENCE..." speed={1.5} color="#ffffff" />

        <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
          {['ORCHESTRATOR', 'NEURAL_GRAPHICS', 'AGENT_SWARM', 'REMOTION_CORE'].map((node, i) => {
            const active = frame > 20 + i * 10;
            return (
              <div
                key={node}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  padding: '6px 12px',
                  borderRadius: 6,
                  backgroundColor: active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: active ? '1px solid #38bdf8' : '1px solid #334155',
                  color: active ? '#38bdf8' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {node}: {active ? 'READY' : 'WAIT'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
