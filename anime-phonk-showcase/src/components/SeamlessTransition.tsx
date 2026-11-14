import React from 'react';
import { Sequence, AbsoluteFill, Audio, staticFile } from 'remotion';

export interface JCutTransitionProps {
  scene1Video: React.ReactNode;
  scene1AudioSrc: string;
  scene2Video: React.ReactNode;
  scene2AudioSrc: string;
  scene1Duration: number;
  scene2Duration: number;
  jCutFrames?: number; // How many frames early the next audio comes in (e.g., 15 frames / 0.25s)
}

/**
 * J-Cut Audio Transition
 *
 * The audio of Scene 2 begins playing `jCutFrames` BEFORE Scene 2 Video actually appears,
 * creating an anticipatory, professional bridge between scenes.
 */
export const JCutTransition: React.FC<JCutTransitionProps> = ({
  scene1Video,
  scene1AudioSrc,
  scene2Video,
  scene2AudioSrc,
  scene1Duration,
  scene2Duration,
  jCutFrames = 15,
}) => {
  return (
    <AbsoluteFill>
      {/* --- VIDEO LAYER (Hard Cut at scene1Duration) --- */}
      <Sequence from={0} durationInFrames={scene1Duration}>
        {scene1Video}
      </Sequence>
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        {scene2Video}
      </Sequence>

      {/* --- AUDIO LAYER (J-Cut Offset) --- */}
      {/* Scene 1 audio plays normally but ducks down as Scene 2 audio creeps in */}
      <Sequence from={0} durationInFrames={scene1Duration}>
        <Audio
          src={staticFile(scene1AudioSrc)}
          volume={(f) => (f > scene1Duration - jCutFrames ? 0.3 : 1)}
        />
      </Sequence>

      {/* J-CUT: Scene 2 Audio starts playing `jCutFrames` BEFORE Scene 2 Video actually appears */}
      <Sequence from={Math.max(0, scene1Duration - jCutFrames)} durationInFrames={scene2Duration + jCutFrames}>
        <Audio src={staticFile(scene2AudioSrc)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export interface LCutTransitionProps {
  scene1Video: React.ReactNode;
  scene1AudioSrc: string;
  scene2Video: React.ReactNode;
  scene2AudioSrc: string;
  scene1Duration: number;
  scene2Duration: number;
  lCutFrames?: number; // How many frames Scene 1 audio lingers past the video cut
}

/**
 * L-Cut Audio Transition
 *
 * The video cuts immediately to Scene 2, but Scene 1's audio lingers for `lCutFrames`
 * before fading into Scene 2's audio, reinforcing emotional continuity.
 */
export const LCutTransition: React.FC<LCutTransitionProps> = ({
  scene1Video,
  scene1AudioSrc,
  scene2Video,
  scene2AudioSrc,
  scene1Duration,
  scene2Duration,
  lCutFrames = 15,
}) => {
  return (
    <AbsoluteFill>
      {/* --- VIDEO LAYER (Hard Cut at scene1Duration) --- */}
      <Sequence from={0} durationInFrames={scene1Duration}>
        {scene1Video}
      </Sequence>
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        {scene2Video}
      </Sequence>

      {/* --- AUDIO LAYER (L-Cut Offset) --- */}
      {/* Scene 1 audio lingers into Scene 2 for lCutFrames */}
      <Sequence from={0} durationInFrames={scene1Duration + lCutFrames}>
        <Audio
          src={staticFile(scene1AudioSrc)}
          volume={(f) => {
            if (f < scene1Duration) return 1;
            const progress = (f - scene1Duration) / lCutFrames;
            return Math.max(0, 1 - progress);
          }}
        />
      </Sequence>

      {/* Scene 2 audio fades in as Scene 1 audio finishes lingering */}
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        <Audio
          src={staticFile(scene2AudioSrc)}
          volume={(f) => {
            if (f >= lCutFrames) return 1;
            return Math.min(1, 0.4 + (f / lCutFrames) * 0.6);
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Clean Cinematic Hard Cut (Fallback when VFX budget is depleted)
 */
export const HardCut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AbsoluteFill>{children}</AbsoluteFill>;
};
