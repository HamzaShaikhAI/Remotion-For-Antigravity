import React from 'react';
import { Composition } from 'remotion';
import { ViralAudiogram } from './compositions/ViralAudiogram';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ViralAudiogram"
        component={ViralAudiogram}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
