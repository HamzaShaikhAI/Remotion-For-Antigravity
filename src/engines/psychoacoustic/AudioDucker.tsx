import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DuckingTrigger {
  frame: number;
  durationFrames?: number; // How long ducking lasts (default 18 frames)
  duckLevel?: number; // Target volume multiplier (0.0 - 1.0, default 0.25)
  attackFrames?: number; // Fade down duration (default 2 frames)
  releaseFrames?: number; // Recovery duration (default 12 frames)
}

export interface AudioDuckerProps {
  children: (duckedVolume: number) => React.ReactNode;
  triggers: DuckingTrigger[];
  baseVolume?: number; // Default 1.0
}

/**
 * Algorithmic Sidechain Audio Ducking Engine
 * Dynamically attenuates (ducks) background music, SFX, or gameplay audio the exact
 * millisecond an 808 bass drop, dialogue line, or cinematic impact hits.
 */
export const AudioDucker: React.FC<AudioDuckerProps> = ({
  children,
  triggers = [],
  baseVolume = 1.0,
}) => {
  const currentFrame = useCurrentFrame();

  let minVolume = baseVolume;

  for (const trigger of triggers) {
    const {
      frame: triggerFrame,
      durationFrames = 18,
      duckLevel = 0.25,
      attackFrames = 2,
      releaseFrames = 12,
    } = trigger;

    const endFrame = triggerFrame + durationFrames + releaseFrames;

    if (currentFrame >= triggerFrame && currentFrame <= endFrame) {
      const relFrame = currentFrame - triggerFrame;
      let vol = baseVolume;

      if (relFrame < attackFrames) {
        // Fast attack drop
        vol = interpolate(relFrame, [0, attackFrames], [baseVolume, duckLevel], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      } else if (relFrame < attackFrames + durationFrames) {
        // Sustained ducking
        vol = duckLevel;
      } else {
        // Smooth release back to base
        const releaseProg = relFrame - (attackFrames + durationFrames);
        vol = interpolate(releaseProg, [0, releaseFrames], [duckLevel, baseVolume], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }

      if (vol < minVolume) {
        minVolume = vol;
      }
    }
  }

  return <>{children(parseFloat(minVolume.toFixed(3)))}</>;
};
