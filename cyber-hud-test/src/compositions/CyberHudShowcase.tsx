import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame } from 'remotion';
import { NeonEmbers } from '../plugins/rea-particles';
import { TerminalBootScene } from './scenes/TerminalBootScene';
import { GyroscopeCoreScene } from './scenes/GyroscopeCoreScene';
import { GlitchHeroScene } from './scenes/GlitchHeroScene';

export const CyberHudShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic grid drift
  const gridShift = Math.sin(frame * 0.05) * 12;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#050814',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Deep #050814 Radial Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.16) 0%, rgba(168, 85, 247, 0.08) 45%, #050814 85%)',
          pointerEvents: 'none',
        }}
      />

      {/* Cyber Perspective Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: -120,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 245, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          transform: `perspective(650px) rotateX(50deg) translateY(${gridShift}px)`,
          opacity: 0.8,
          pointerEvents: 'none',
        }}
      />

      {/* Layer NeonEmbers (count: 80, interactive: true) */}
      <NeonEmbers count={80} interactive={true} />

      {/* 3 Scenes Sequenced with <Series> (Total: 300 frames / 10s @ 30fps) */}
      <Series>
        {/* Scene 1: Terminal Boot with Cyan Laser & Typewriter Telemetry */}
        <Series.Sequence durationInFrames={100}>
          <TerminalBootScene />
        </Series.Sequence>

        {/* Scene 2: 3D Multi-ring Gyroscope Core with Heartbeat Spring */}
        <Series.Sequence durationInFrames={110}>
          <GyroscopeCoreScene />
        </Series.Sequence>

        {/* Scene 3: GlitchTransition (intensity: 1.5) & KineticSplitText Hero Title */}
        <Series.Sequence durationInFrames={90}>
          <GlitchHeroScene />
        </Series.Sequence>
      </Series>

      {/* CRT Scanline Overlay Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />

      {/* Subtle Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.9)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
