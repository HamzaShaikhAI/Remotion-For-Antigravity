import React from 'react';
import { Composition } from 'remotion';
import { PokeVyparMovie } from './compositions/PokeVyparMovie';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PokeVyparMovie"
        component={PokeVyparMovie}
        durationInFrames={1896}
        fps={24}
        width={1280}
        height={720}
      />
    </>
  );
};
