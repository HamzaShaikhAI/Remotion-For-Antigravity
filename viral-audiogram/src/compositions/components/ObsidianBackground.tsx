import React from 'react';
import { useCurrentFrame } from 'remotion';

export const ObsidianBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Deterministic breathing pulse around the visualizer center
  const glowScale = Math.sin(frame * 0.08) * 0.1 + 1.0;
  const glowOpacity = Math.sin(frame * 0.06) * 0.04 + 0.14;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#07080C',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Central Cyan-Purple Obsidian Core Glow */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 410,
          width: 720 * glowScale,
          height: 720 * glowScale,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0, 245, 255, ${glowOpacity}) 0%, rgba(168, 85, 247, ${glowOpacity * 0.6}) 40%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />

      {/* Deep Obsidian Corner Vignettes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 35%, rgba(4, 5, 8, 0.95) 100%)',
        }}
      />

      {/* Concentric Audio Radar Guides */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.22,
        }}
      >
        <circle cx="540" cy="410" r="140" fill="none" stroke="#00F5FF" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="540" cy="410" r="290" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="540" cy="410" r="390" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="1 10" />

        {/* Diagonal Crosshairs */}
        <line x1="140" y1="410" x2="200" y2="410" stroke="#00F5FF" strokeWidth="1.5" />
        <line x1="880" y1="410" x2="940" y2="410" stroke="#00F5FF" strokeWidth="1.5" />
        <line x1="540" y1="60" x2="540" y2="120" stroke="#00F5FF" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
