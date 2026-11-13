import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Typewriter } from '../../plugins/rea-typography';

export const TerminalBootScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Cyan scanning laser beam
  const scanY = interpolate(frame, [10, 85], [0, height], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scanOpacity = interpolate(frame, [10, 20, 75, 85], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hudOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const modules = [
    { name: 'KERNEL_INITIALIZE', latency: '0.12ms' },
    { name: 'NEURAL_GRAPHICS_CORE', latency: '0.24ms' },
    { name: 'ANTIGRAVITY_AGENT_SWARM', latency: '0.18ms' },
    { name: 'REMOTION_CHROME_ENGINE', latency: '0.08ms' },
  ];

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
      {/* Cyan Scanning Laser Line */}
      <div
        style={{
          position: 'absolute',
          top: scanY,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #00f5ff, #38bdf8, #00f5ff, transparent)',
          boxShadow: '0 0 25px #00f5ff, 0 0 50px #00f5ff',
          opacity: scanOpacity,
          zIndex: 10,
        }}
      />

      {/* Cyberpunk HUD Corner Brackets */}
      <div style={{ position: 'absolute', top: 50, left: 60, width: 50, height: 50, borderTop: '3px solid #00f5ff', borderLeft: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', top: 50, right: 60, width: 50, height: 50, borderTop: '3px solid #00f5ff', borderRight: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', bottom: 50, left: 60, width: 50, height: 50, borderBottom: '3px solid #00f5ff', borderLeft: '3px solid #00f5ff' }} />
      <div style={{ position: 'absolute', bottom: 50, right: 60, width: 50, height: 50, borderBottom: '3px solid #00f5ff', borderRight: '3px solid #00f5ff' }} />

      {/* Top telemetry bar */}
      <div
        style={{
          position: 'absolute',
          top: 65,
          left: 130,
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#38bdf8',
          letterSpacing: 3,
        }}
      >
        [SYSTEM: DASTRAS_OS_v2.0] &nbsp;|&nbsp; [BOOT_SECTOR: 0x7F9A] &nbsp;|&nbsp; [RENDER_FPS: 30]
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 65,
          right: 130,
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#a855f7',
          letterSpacing: 3,
        }}
      >
        RESOLUTION: 1920x1080 // HARDWARE_ACCELERATION: TRUE
      </div>

      {/* Main Terminal Window */}
      <div
        style={{
          width: '75%',
          maxWidth: 960,
          backgroundColor: 'rgba(5, 12, 28, 0.85)',
          border: '1px solid rgba(0, 245, 255, 0.35)',
          borderRadius: 16,
          padding: '40px 50px',
          boxShadow: '0 0 60px rgba(0, 245, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              borderRadius: 9999,
              backgroundColor: 'rgba(0, 245, 255, 0.12)',
              border: '1px solid #00f5ff',
              color: '#00f5ff',
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }} />
            INITIALIZING DASTRAS OS v2.0
          </div>
          <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 13 }}>T-MINUS BOOT</span>
        </div>

        {/* Typewriter Header */}
        <Typewriter text="INITIALIZING QUANTUM MOTION ENGINE..." speed={1.5} color="#ffffff" />

        {/* Sub-system blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 10 }}>
          {modules.map((mod, i) => {
            const active = frame > 25 + i * 12;
            return (
              <div
                key={mod.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: 8,
                  backgroundColor: active ? 'rgba(0, 245, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: active ? '1px solid #00f5ff' : '1px solid #334155',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ color: active ? '#f8fafc' : '#64748b' }}>{mod.name}</span>
                <span style={{ color: active ? '#00f5ff' : '#475569', fontWeight: 700 }}>
                  {active ? `ONLINE [${mod.latency}]` : 'PENDING...'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
