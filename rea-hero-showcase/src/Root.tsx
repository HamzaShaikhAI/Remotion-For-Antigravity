import React from 'react';
import { Composition } from 'remotion';
import { ReaHeroShowcase } from './compositions/ReaHeroShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReaHeroShowcase"
        component={ReaHeroShowcase}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
