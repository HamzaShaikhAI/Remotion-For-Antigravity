import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, interpolate } from 'remotion';
import { NeonEmbers } from '../plugins/rea-particles';
import { Scene1BootHUD } from './scenes/Scene1BootHUD';
import { Scene2NeuralCore } from './scenes/Scene2NeuralCore';
import { Scene3AgentWindow } from './scenes/Scene3AgentWindow';
import { Scene4Finale } from './scenes/Scene4Finale';

export const DastrasShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing background gradient
  const bgShift = Math.sin(frame * 0.04) * 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#040714',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Dynamic Cyber Ambient Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 245, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `perspective(600px) rotateX(45deg) translateY(${bgShift}px)`,
          opacity: 0.7,
        }}
      />

      {/* Deep Space Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '25%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating REA Particles (Neon Embers) */}
      <NeonEmbers count={55} color="#00f5ff" speed={1.1} />

      {/* Cinematic Scene Sequences (Total: 300 frames / 10s @ 30fps) */}
      <Series>
        <Series.Sequence durationInFrames={75}>
          <Scene1BootHUD />
        </Series.Sequence>

        <Series.Sequence durationInFrames={95}>
          <Scene2NeuralCore />
        </Series.Sequence>

        <Series.Sequence durationInFrames={70}>
          <Scene3AgentWindow />
        </Series.Sequence>

        <Series.Sequence durationInFrames={60}>
          <Scene4Finale />
        </Series.Sequence>
      </Series>

      {/* CRT Scanline Overlay Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Vignette border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 140px rgba(0, 0, 0, 0.85)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
