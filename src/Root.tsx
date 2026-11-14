import React from 'react';
import { Composition } from 'remotion';
import {
  AnimePhonkShort,
  animePhonkShortSchema,
} from './compositions/AnimePhonkShort';
import { ZenitsuVsKilluaShowdown } from './compositions/ZenitsuVsKilluaShowdown';
import { ZenitsuVsKilluaShowdownV2 } from './compositions/ZenitsuVsKilluaShowdownV2';
import { GodTierEngineShowcase } from './compositions/GodTierEngineShowcase';
import { HollywoodIntuitionMaster } from './compositions/HollywoodIntuitionMaster';
import { DiagramComposition } from './compositions/Diagram_flowchart';
import { GeneratedSAASComposition } from './compositions/Generated_saas';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape SVG Architecture & Data Flow */}
      <Composition
        id="ArchitectureFlowchart"
        component={DiagramComposition}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 16:9 Landscape Generative SaaS Product Demo */}
      <Composition
        id="GenerativeSaasDemo"
        component={GeneratedSAASComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="HollywoodIntuitionMaster"
        component={HollywoodIntuitionMaster}
        durationInFrames={1800}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="GodTierEngineShowcase"
        component={GodTierEngineShowcase}
        durationInFrames={360}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZenitsuVsKilluaShowdownV2"
        component={ZenitsuVsKilluaShowdownV2}
        durationInFrames={1920}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZenitsuVsKilluaShowdown"
        component={ZenitsuVsKilluaShowdown}
        durationInFrames={840}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnimePhonkShort"
        component={AnimePhonkShort}
        durationInFrames={720}
        fps={60}
        width={1080}
        height={1920}
        schema={animePhonkShortSchema}
        defaultProps={{
          audioFile: 'audio/active-phonk.mp3',
          dropFrame: 210,
          freezeDuration: 48,
          variant: 'chad',
          hookTitle: 'LIMIT BREAKER',
          dropCaption: 'COLDEST MOMENT',
          accentColor: '#00f5ff',
          useExternalClips: true,
          gameplayMode: 'none',
        }}
      />
    </>
  );
};
