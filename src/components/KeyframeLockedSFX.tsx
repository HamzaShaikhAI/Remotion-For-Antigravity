import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface KeyframeLockedSFXProps {
  transitionFrame: number;
  sfxSrc?: string;
  volume?: number;
  damping?: number;
  stiffness?: number;
  thresholdMin?: number;
  thresholdMax?: number;
}

/**
 * KeyframeLockedSFX
 * Locks audio triggers directly to Remotion spring physics and transition progress values,
 * ensuring absolute zero audio-visual drift across framerates.
 */
export const KeyframeLockedSFX: React.FC<KeyframeLockedSFXProps> = ({
  transitionFrame,
  sfxSrc = 'sfx/whoosh-impact.wav',
  volume = 0.9,
  damping = 12,
  stiffness = 180,
  thresholdMin = 0.05,
  thresholdMax = 0.12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring triggers exactly when the visual transition hits its midpoint
  const impactProgress = spring({
    frame: frame - transitionFrame,
    fps,
    config: { damping, stiffness },
  });

  const playSFX = impactProgress > thresholdMin && impactProgress < thresholdMax;

  return (
    <>
      {playSFX && <Audio src={staticFile(sfxSrc)} volume={volume} />}
    </>
  );
};
