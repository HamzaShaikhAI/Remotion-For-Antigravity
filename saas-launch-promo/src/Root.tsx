import React from 'react';
import { Composition } from 'remotion';
import { SaasLaunchPromo } from './compositions/SaasLaunchPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SaasLaunchPromo"
        component={SaasLaunchPromo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
