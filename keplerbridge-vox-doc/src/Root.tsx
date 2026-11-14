import React from 'react';
import { Composition, Folder, Series } from 'remotion';
import { Act1Paradox } from './compositions/acts/Act1Paradox';
import { Act2Proxy } from './compositions/acts/Act2Proxy';
import { Act3Compiler } from './compositions/acts/Act3Compiler';
import { Act4Batching } from './compositions/acts/Act4Batching';
import { Act5Conformance } from './compositions/acts/Act5Conformance';
import { Act6Mission } from './compositions/acts/Act6Mission';
import { KeplerBridgeSpotlight } from './compositions/KeplerBridgeSpotlight';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

// 1. Single source of truth for exact audio-locked act durations
export const ACTS_MANIFEST = [
  { id: 'Act1Paradox', component: Act1Paradox, durationInFrames: 777 },
  { id: 'Act2Proxy', component: Act2Proxy, durationInFrames: 753 },
  { id: 'Act3Compiler', component: Act3Compiler, durationInFrames: 857 },
  { id: 'Act4Batching', component: Act4Batching, durationInFrames: 647 },
  { id: 'Act5Conformance', component: Act5Conformance, durationInFrames: 658 },
  { id: 'Act6Mission', component: Act6Mission, durationInFrames: 480 },
] as const;

const TOTAL_FRAMES = ACTS_MANIFEST.reduce(
  (sum, act) => sum + act.durationInFrames,
  0
);

// 2. Master composition for full timeline preview in Remotion Studio
export const MasterDocumentary: React.FC = () => {
  return (
    <Series>
      {ACTS_MANIFEST.map(({ id, component: SceneComponent, durationInFrames }) => (
        <Series.Sequence key={id} durationInFrames={durationInFrames}>
          <SceneComponent />
        </Series.Sequence>
      ))}
    </Series>
  );
};

// 3. Register both the Master preview and standalone Act targets
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 6-Act Vox Technical Documentary Preview */}
      <Composition
        id="MasterDocumentary"
        component={MasterDocumentary}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Standalone Segment Targets for Memory-Safe Chunked Rendering */}
      <Folder name="Render-Segments">
        {ACTS_MANIFEST.map(({ id, component, durationInFrames }) => (
          <Composition
            key={id}
            id={id}
            component={component}
            durationInFrames={durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
      </Folder>

      {/* 900-Frame (30s) Fast-Render Premiere Spotlight */}
      <Composition
        id="KeplerBridgeSpotlight"
        component={KeplerBridgeSpotlight}
        durationInFrames={900}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
