import React from 'react';
import { Composition } from 'remotion';
import { DastrasShowcase } from './compositions/DastrasShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DastrasShowcase"
        component={DastrasShowcase}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
