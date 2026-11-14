import React from 'react';
import { Composition } from 'remotion';
import {
  AnimePhonkShort,
  animePhonkShortSchema,
} from './compositions/AnimePhonkShort';

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
    </>
  );
};
