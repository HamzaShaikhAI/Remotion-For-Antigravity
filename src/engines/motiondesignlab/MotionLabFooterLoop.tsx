import React from 'react';
import { useCurrentFrame } from 'remotion';

export const MotionLabFooterLoop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 56,
        right: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'SF Mono', monospace",
        fontSize: 12,
        color: '#64748b',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '4px 10px',
            borderRadius: 4,
            fontWeight: 800,
            color: '#09090b',
          }}
        >
          THE LOOP
        </span>
        <span style={{ fontWeight: 700, color: '#09090b', letterSpacing: 1 }}>
          BUILD &gt; RENDER &gt; SCRUB &gt; TUNE &gt; REPEAT
        </span>
      </div>

      {/* Audio Waveform Simulation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {Array.from({ length: 32 }, (_, i) => {
          const waveHeight = Math.abs(Math.sin(frame * 0.2 + i * 0.4)) * 18 + 4;
          return (
            <div
              key={i}
              style={{
                width: 2.5,
                height: waveHeight,
                backgroundColor: i % 3 === 0 ? '#ea580c' : '#cbd5e1',
                borderRadius: 1,
              }}
            />
          );
        })}
      </div>

      <div style={{ fontWeight: 700, color: '#94a3b8' }}>
        @beamnxw
      </div>
    </div>
  );
};
