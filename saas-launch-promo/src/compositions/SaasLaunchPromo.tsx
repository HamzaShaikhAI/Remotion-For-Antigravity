import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { KeynoteIntroScene } from './scenes/KeynoteIntroScene';
import { GlassmorphicDashboardScene } from './scenes/GlassmorphicDashboardScene';
import { KeynoteFinaleScene } from './scenes/KeynoteFinaleScene';

export const SaasLaunchPromo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Clean Apple Keynote Ambient Radial Aura */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Dot Matrix Architectural Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      {/* 3 Keynote Scenes Sequenced with <Series> (Total: 360 frames / 12.0s @ 30fps) */}
      <Series>
        {/* Scene 1: Introduction Tagline */}
        <Series.Sequence durationInFrames={75}>
          <KeynoteIntroScene />
        </Series.Sequence>

        {/* Scene 2: 3D Floating Glassmorphic Dashboard with KPI Counters & SVG Growth Curve */}
        <Series.Sequence durationInFrames={185}>
          <GlassmorphicDashboardScene />
        </Series.Sequence>

        {/* Scene 3: Crisp Kinetic Hero Title Finale */}
        <Series.Sequence durationInFrames={100}>
          <KeynoteFinaleScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
