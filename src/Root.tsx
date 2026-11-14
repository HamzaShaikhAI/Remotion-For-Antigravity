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

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
