import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

export interface AudioVacuumProps {
  audioSrc: string;
  dropFrame: number;
  totalDurationFrames: number;
  vacuumDurationFrames?: number; // default 12 frames (0.2s @ 60fps)
  baseVolume?: number;
}

/**
 * Contextual Audio Negative Space (The 12-Frame Silence Vacuum)
 *
 * Intentionally mutes all audio channels for 12 frames immediately preceding the beat drop.
 * This acoustic void creates a sensory vacuum that makes the subsequent 808 drop feel massive.
 */
export const ContextualAudioVacuum: React.FC<AudioVacuumProps> = ({
  audioSrc,
  dropFrame,
  totalDurationFrames,
  vacuumDurationFrames = 12,
  baseVolume = 0.9,
}) => {
  const vacuumStart = Math.max(0, dropFrame - vacuumDurationFrames);

  return (
    <Sequence from={0} durationInFrames={totalDurationFrames}>
      <Audio
        src={staticFile(audioSrc)}
        volume={(frame) => {
          // Absolute zero volume during the 12-frame vacuum window
          if (frame >= vacuumStart && frame < dropFrame) {
            return 0.0;
          }
          return baseVolume;
        }}
      />
    </Sequence>
  );
};
