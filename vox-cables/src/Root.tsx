import React from 'react';
import { Composition } from 'remotion';
import { SubmarineCablesDoc } from './compositions/SubmarineCablesDoc';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SubmarineCablesDoc"
        component={SubmarineCablesDoc}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
