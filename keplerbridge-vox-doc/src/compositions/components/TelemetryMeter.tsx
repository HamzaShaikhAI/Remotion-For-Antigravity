import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const TelemetryMeter: React.FC<{
  targetFps?: number;
  gpuName?: string;
  resolution?: string;
  delay?: number;
}> = ({
  targetFps = 32.4,
  gpuName = 'NVIDIA GeForce GT 740 (4GB DDR3)',
  resolution = '720p (1280x720) Performance',
  delay = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle live FPS jitter
  const liveFps = (targetFps + Math.sin(frame * 0.2) * 1.8).toFixed(1);
  const frameTime = (1000 / parseFloat(liveFps)).toFixed(1);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: '#0f172a',
        border: '2px solid #00f5ff',
        borderRadius: 10,
        padding: '16px 20px',
        fontFamily: 'monospace',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 245, 255, 0.2)',
        minWidth: 320,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: '#00f5ff', fontWeight: 900, fontSize: 13 }}>KEPLERBRIDGE TELEMETRY</span>
        <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 800 }}>LIVE PROXY</span>
      </div>

      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 12 }}>
        {gpuName}<br />
        Target: {resolution}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 44, fontWeight: 900, color: '#facc15' }}>{liveFps}</span>
        <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>FPS ({frameTime} ms)</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1' }}>
        <span>GPU Load: 99%</span>
        <span>Replay Overhead: 142 ns</span>
      </div>
    </div>
  );
};
