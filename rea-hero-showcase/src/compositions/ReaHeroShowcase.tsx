import React from 'react';
import { Series, useVideoConfig } from 'remotion';
import { AmbientCyberBackground } from './components/AmbientCyberBackground';
import { Scene1AgentTerminal } from './scenes/Scene1AgentTerminal';
import { Scene2CoreEngine } from './scenes/Scene2CoreEngine';
import { Scene3StyleMultiverse } from './scenes/Scene3StyleMultiverse';
import { Scene4BrandingFinale } from './scenes/Scene4BrandingFinale';

export const ReaHeroShowcase: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#05070E',
        overflow: 'hidden',
      }}
    >
      {/* Persistent Background Layer with Deterministic Neon Embers */}
      <AmbientCyberBackground />

      {/* 4-Act Cinematic Series */}
      <Series>
        {/* Act I: The Agent Prompt (Frames 0 to 75 / 2.5s) */}
        <Series.Sequence durationInFrames={75}>
          <Scene1AgentTerminal />
        </Series.Sequence>

        {/* Act II: The Core Engine Awakens (Frames 75 to 160 / 2.83s) */}
        <Series.Sequence durationInFrames={85}>
          <Scene2CoreEngine />
        </Series.Sequence>

        {/* Act III: The Style Multiverse (Frames 160 to 240 / 2.67s) */}
        <Series.Sequence durationInFrames={80}>
          <Scene3StyleMultiverse />
        </Series.Sequence>

        {/* Act IV: The Grand Branding Finale (Frames 240 to 300 / 2.0s) */}
        <Series.Sequence durationInFrames={60}>
          <Scene4BrandingFinale />
        </Series.Sequence>
      </Series>
    </div>
  );
};
