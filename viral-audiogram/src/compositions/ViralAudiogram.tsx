import React from 'react';
import { useVideoConfig } from 'remotion';
import { ObsidianBackground } from './components/ObsidianBackground';
import { RadialAudioVisualizer } from './components/RadialAudioVisualizer';
import { AudiogramHeader } from './components/AudiogramHeader';
import { AudiogramFooter } from './components/AudiogramFooter';
import { AnimatedCaptions, CaptionWord } from '../plugins/rea-captions';

const CAPTION_WORDS: CaptionWord[] = [
  { word: 'The', startInFrames: 10, endInFrames: 22 },
  { word: 'biggest', startInFrames: 22, endInFrames: 38 },
  { word: 'misconception', startInFrames: 38, endInFrames: 60 },
  { word: 'in', startInFrames: 60, endInFrames: 72 },
  { word: 'engineering', startInFrames: 72, endInFrames: 98 },
  { word: 'is', startInFrames: 98, endInFrames: 110 },
  { word: 'that', startInFrames: 110, endInFrames: 124 },
  { word: 'AI', startInFrames: 124, endInFrames: 142 },
  { word: 'replaces', startInFrames: 142, endInFrames: 162 },
  { word: 'developers.', startInFrames: 162, endInFrames: 184 },
  { word: 'It', startInFrames: 184, endInFrames: 194 },
  { word: 'amplifies', startInFrames: 194, endInFrames: 214 },
  { word: 'the', startInFrames: 214, endInFrames: 224 },
  { word: 'best', startInFrames: 224, endInFrames: 232 },
  { word: 'ones.', startInFrames: 232, endInFrames: 240 },
];

export const ViralAudiogram: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#07080C',
        overflow: 'hidden',
      }}
    >
      {/* 1. Deep Obsidian Background with Pulsing Cyan-Purple Core */}
      <ObsidianBackground />

      {/* 2. Podcast Show Header */}
      <AudiogramHeader />

      {/* 3. Central Radial Audio Spectrum Visualizer (48 Oscillating Bars) */}
      <RadialAudioVisualizer cx={540} cy={390} />

      {/* 4. Captions Section: Word-by-Word Animated Subtitles with Electric Cyan Highlight Pill */}
      <div
        style={{
          position: 'absolute',
          top: 670,
          left: 60,
          right: 60,
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(11, 15, 25, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          padding: '16px 24px',
          zIndex: 30,
        }}
      >
        <AnimatedCaptions
          words={CAPTION_WORDS}
          activeColor="#00F5FF"
          inactiveColor="#64748B"
          fontSize={38}
          highlightPill={true}
        />
      </div>

      {/* 5. Audio Scrubbing Timeline & Distribution Badges */}
      <AudiogramFooter />
    </div>
  );
};
