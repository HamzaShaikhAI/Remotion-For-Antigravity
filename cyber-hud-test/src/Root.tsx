import React from 'react';
import { Composition } from 'remotion';
import { CyberHudShowcase } from './compositions/CyberHudShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CyberHudShowcase"
        component={CyberHudShowcase}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
