import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { AnalogPaperBackground } from './components/AnalogPaperBackground';
import { DeterministicFilmGrain } from './components/DeterministicFilmGrain';
import { Scene1HeadlineHook } from './scenes/Scene1HeadlineHook';
import { Scene2AtlanticMapCables } from './scenes/Scene2AtlanticMapCables';
import { Scene3EditorialTakeaway } from './scenes/Scene3EditorialTakeaway';

export const SubmarineCablesDoc: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5EFEB',
        overflow: 'hidden',
      }}
    >
      {/* 1. Analog Paper Texture with Grid & Archival Fold */}
      <AnalogPaperBackground />

      {/* 2. Deterministic Film Grain (Zero Math.random()) */}
      <DeterministicFilmGrain />

      {/* 3. Editorial Scenes Sequenced via <Series> (240 frames / 8.0s @ 30fps) */}
      <Series>
        {/* Scene 1: The Provocative Headline Hook */}
        <Series.Sequence durationInFrames={60}>
          <Scene1HeadlineHook />
        </Series.Sequence>

        {/* Scene 2: The Transatlantic Map, Drawing Cables, and Spring Latency Badges */}
        <Series.Sequence durationInFrames={120}>
          <Scene2AtlanticMapCables />
        </Series.Sequence>

        {/* Scene 3: The Editorial Conclusion & Cable Statistics */}
        <Series.Sequence durationInFrames={60}>
          <Scene3EditorialTakeaway />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
