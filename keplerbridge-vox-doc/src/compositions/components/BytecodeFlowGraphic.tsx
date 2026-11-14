import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const BytecodeFlowGraphic: React.FC<{ delay?: number }> = ({ delay = 15 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 150 },
  });

  const scale = interpolate(entrance, [0, 1], [0.85, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Animated flow line offset
  const streamOffset = (frame * 4) % 40;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 580,
        backgroundColor: '#0a0e1a',
        border: '3px solid #1e293b',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ color: '#facc15', fontSize: 13, fontWeight: 900, letterSpacing: 1.2 }}>
        [DXIL ➔ DXBC COMPILER LOWERING ENGINE]
      </div>

      {/* Stage 1: DXIL SM 6.0 Bitcode Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#161e2e',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: '12px 16px',
        }}
      >
        <div>
          <div style={{ color: '#f87171', fontWeight: 800, fontSize: 13 }}>INPUT: DXIL SM 6.0</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>LLVM Bitcode IR // WaveOps // Dynamic Indexing</div>
        </div>
        <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 4 }}>
          UNSUPPORTED ON FL 11_0
        </span>
      </div>

      {/* Flow Arrow */}
      <div style={{ textAlign: 'center', color: '#00f5ff', fontSize: 18, lineHeight: 1 }}>
        ▼ SSA Mem2Reg & CFG Structurizer ▼
      </div>

      {/* Stage 2: Bounded Translator Core */}
      <div
        style={{
          backgroundColor: '#111827',
          border: '2px solid #00f5ff',
          borderRadius: 8,
          padding: '14px 18px',
          boxShadow: '0 0 25px rgba(0, 245, 255, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#00f5ff', fontWeight: 900, fontSize: 13 }}>BOUNDED SHADER TRANSLATOR</span>
          <span style={{ color: '#a855f7', fontSize: 11 }}>C++20 CORE</span>
        </div>
        <div style={{ color: '#cbd5e1', fontSize: 11, lineHeight: 1.4 }}>
          • Root parameter normalization (SM 5.1 ➔ SM 5.0)<br />
          • Dynamic constant buffer staging (slot cb13)<br />
          • Multi-slot UAV counter reset sentinels (0xFFFFFFFF)
        </div>
      </div>

      {/* Flow Arrow */}
      <div style={{ textAlign: 'center', color: '#22c55e', fontSize: 18, lineHeight: 1 }}>
        ▼ 64-bit FNV-1a Hash Disk Cache ▼
      </div>

      {/* Stage 3: Direct3D 11 DXBC Output */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          border: '2px solid #22c55e',
          borderRadius: 8,
          padding: '12px 16px',
        }}
      >
        <div>
          <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 13 }}>OUTPUT: DXBC SM 5.0 BYTECODE</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>kepler_cache/shaders/&lt;hash&gt;.dxbc (~0.2 ms bypass)</div>
        </div>
        <span style={{ backgroundColor: '#22c55e', color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 4 }}>
          FL 11_0 READY
        </span>
      </div>
    </div>
  );
};
