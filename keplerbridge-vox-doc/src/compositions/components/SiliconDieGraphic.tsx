import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const SiliconDieGraphic: React.FC<{
  delay?: number;
  unlocked?: boolean;
}> = ({ delay = 10, unlocked = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 140 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Pulse effect
  const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        position: 'relative',
        width: 520,
        height: 480,
        backgroundColor: '#0a0e17',
        border: '3px solid #334155',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 245, 255, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#94a3b8',
        }}
      >
        <span>NVIDIA KEPLER GK107 DIE</span>
        <span style={{ color: unlocked ? '#22c55e' : '#f43f5e', fontWeight: 900 }}>
          {unlocked ? 'PROXY BRIDGED: FL 12_0' : 'FROZEN: FL 11_0 (0xB000)'}
        </span>
      </div>

      {/* Grid of SMX Compute Clusters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[1, 2].map((gpc) => (
          <div
            key={gpc}
            style={{
              backgroundColor: '#111827',
              border: '2px solid #1e293b',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ color: '#facc15', fontSize: 11, fontWeight: 900, marginBottom: 8 }}>
              GPC #{gpc} (POLYMORPH 2.0)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {[1, 2].map((smx) => (
                <div
                  key={smx}
                  style={{
                    backgroundColor: '#1e293b',
                    border: `1px solid ${unlocked ? '#00f5ff' : '#475569'}`,
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#e2e8f0',
                    boxShadow: unlocked ? '0 0 10px rgba(0, 245, 255, 0.2)' : 'none',
                  }}
                >
                  SMX {gpc}.{smx}
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>192 CUDA</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shared L2 Cache & Memory Interface */}
      <div
        style={{
          backgroundColor: '#1e293b',
          border: '2px dashed #475569',
          borderRadius: 8,
          padding: 12,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ color: '#38bdf8', fontSize: 12, fontWeight: 800 }}>
          512 KB L2 CACHE // 128-BIT DDR3/GDDR5 CONTROLLER (14.4 GB/s)
        </span>
      </div>

      {/* Translation Proxy Intercept Badge */}
      <div
        style={{
          backgroundColor: unlocked ? 'rgba(0, 245, 255, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `2px solid ${unlocked ? '#00f5ff' : '#ef4444'}`,
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: unlocked ? '#00f5ff' : '#ef4444',
              boxShadow: `0 0 12px ${unlocked ? '#00f5ff' : '#ef4444'}`,
              opacity: pulse,
            }}
          />
          <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 800 }}>
            {unlocked ? 'd3d12.dll Proxy Active' : 'DirectX 12 Execution Blocked'}
          </span>
        </div>
        <span style={{ color: unlocked ? '#00f5ff' : '#f87171', fontSize: 11, fontFamily: 'monospace' }}>
          {unlocked ? 'IMMEDIATE CONTEXT REPLAY' : 'WDDM 2.7 DRIVER LOCKOUT'}
        </span>
      </div>
    </div>
  );
};
