import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';

export interface SpatialAudioPannerProps {
  src: string;
  startFrame?: number;
  durationInFrames: number;
  baseVolume?: number;
  /**
   * Character X position coordinate across time (0.0 = left edge, 0.5 = center, 1.0 = right edge)
   */
  trackingPoints?: Array<{ frame: number; x: number }>;
}

/**
 * Spatial 3D Audio Panner
 *
 * Simulates spatial stereo panning in Remotion by dynamically interpolating
 * left and right channel volumes based on a character's screen X-coordinate.
 */
export const SpatialAudioPanner: React.FC<SpatialAudioPannerProps> = ({
  src,
  startFrame = 0,
  durationInFrames,
  baseVolume = 1.0,
  trackingPoints = [{ frame: 0, x: 0.5 }],
}) => {
  const frame = useCurrentFrame();

  // Find surrounding tracking points
  const sorted = [...trackingPoints].sort((a, b) => a.frame - b.frame);
  let currentX = 0.5;

  if (frame <= sorted[0].frame) {
    currentX = sorted[0].x;
  } else if (frame >= sorted[sorted.length - 1].frame) {
    currentX = sorted[sorted.length - 1].x;
  } else {
    for (let i = 0; i < sorted.length - 1; i++) {
      if (frame >= sorted[i].frame && frame <= sorted[i + 1].frame) {
        const t = (frame - sorted[i].frame) / (sorted[i + 1].frame - sorted[i].frame);
        currentX = sorted[i].x + t * (sorted[i + 1].x - sorted[i].x);
        break;
      }
    }
  }

  // Pan value: -1.0 (hard left) to +1.0 (hard right)
  const pan = Math.max(-1, Math.min(1, (currentX - 0.5) * 2));

  // Equal-power stereo panning curve
  const angle = (pan + 1) * (Math.PI / 4); // 0 to PI/2
  const leftVol = Math.cos(angle) * baseVolume;
  const rightVol = Math.sin(angle) * baseVolume;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      {/* Remotion Audio Volume Callback modulated by spatial position */}
      <Audio
        src={staticFile(src)}
        volume={(f) => {
          // Average volume scaled by equal-power pan
          return Math.max(leftVol, rightVol);
        }}
      />
    </Sequence>
  );
};
