import React from 'react';
import { Series } from 'remotion';
import { Act1Paradox } from './acts/Act1Paradox';
import { Act2Proxy } from './acts/Act2Proxy';
import { Act3Compiler } from './acts/Act3Compiler';
import { Act4Batching } from './acts/Act4Batching';
import { Act5Conformance } from './acts/Act5Conformance';
import { Act6Mission } from './acts/Act6Mission';

/**
 * Fast-Render 900-Frame (30s) Premiere Spotlight Composition
 * Perfect for quick preview rendering, social teasers, and CI verification
 */
export const KeplerBridgeSpotlight: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={150}>
        <Act1Paradox />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Act2Proxy />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <Act3Compiler />
      </Series.Sequence>
      <Series.Sequence durationInFrames={140}>
        <Act4Batching />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Act5Conformance />
      </Series.Sequence>
      <Series.Sequence durationInFrames={130}>
        <Act6Mission />
      </Series.Sequence>
    </Series>
  );
};
