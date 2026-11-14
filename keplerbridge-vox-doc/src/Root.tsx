import React from 'react';
import { Composition } from 'remotion';
import { KeplerBridgeVoxDocumentary } from './compositions/KeplerBridgeVoxDocumentary';
import { KeplerBridgeSpotlight } from './compositions/KeplerBridgeSpotlight';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 6-Act 4,172-Frame Vox Technical Documentary */}
      <Composition
        id="KeplerBridgeVoxDocumentary"
        component={KeplerBridgeVoxDocumentary}
        durationInFrames={4172}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 900-Frame (30s) Fast-Render Premiere Spotlight */}
      <Composition
        id="KeplerBridgeSpotlight"
        component={KeplerBridgeSpotlight}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
