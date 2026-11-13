import React from 'react';
import { Composition } from 'remotion';
import { CodeWalkthroughReel } from './compositions/CodeWalkthroughReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CodeWalkthroughReel"
        component={CodeWalkthroughReel}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
