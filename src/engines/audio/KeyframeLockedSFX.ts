import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface SFXTriggerProps {
  triggerFrame?: number;
  transitionFrame?: number;
  sfxFile?: string;
  sfxSrc?: string;
  volume?: number;
  damping?: number;
  stiffness?: number;
  thresholdMin?: number;
  thresholdMax?: number;
}

/**
 * KeyframeLockedSFX
 * Locks sound effects directly to Remotion spring physics, eliminating timing drift
 * and ensuring audio impacts trigger synchronously with visual transitions.
 */
export const KeyframeLockedSFX: React.FC<SFXTriggerProps> = ({
  triggerFrame,
  transitionFrame,
  sfxFile,
  sfxSrc,
  volume = 0.8,
  damping = 12,
  stiffness = 180,
  thresholdMin = 0.02,
  thresholdMax = 0.15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const targetFrame =
    triggerFrame !== undefined ? triggerFrame : transitionFrame !== undefined ? transitionFrame : 0;
  const targetFile = sfxFile || sfxSrc || 'sfx/whoosh-impact.wav';

  // Compute spring progress relative to the exact transition trigger frame
  const impactProgress = spring({
    frame: frame - targetFrame,
    fps,
    config: { damping, stiffness },
  });

  // Play audio precisely during the impact window (prevents looping or mistiming)
  const shouldPlay = impactProgress > thresholdMin && impactProgress < thresholdMax;

  return shouldPlay ? React.createElement(Audio, { src: staticFile(targetFile), volume }) : null;
};
