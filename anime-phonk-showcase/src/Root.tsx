import React from 'react';
import { Composition } from 'remotion';
import {
  AnimePhonkShort,
  animePhonkShortSchema,
} from './compositions/AnimePhonkShort';
import { MainVideo } from './compositions/MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AnimePhonkShort"
        component={AnimePhonkShort}
        durationInFrames={720}
        fps={60}
        width={1080}
        height={1920}
        schema={animePhonkShortSchema}
        defaultProps={{
          audioFile: 'audio/active-phonk.wav',
          dropFrame: 205,
          freezeDuration: 48,
          variant: 'chad',
          hookTitle: 'LIMIT BREAKER',
          dropCaption: 'COLDEST MOMENT',
          accentColor: '#00f5ff',
          useExternalClips: false,
        }}
      />
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Built with Antigravity REA',
          subtitle: 'Autonomous Motion Graphics for AI Agents',
        }}
      />
    </>
  );
};
