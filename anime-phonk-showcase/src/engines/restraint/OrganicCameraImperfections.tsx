import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface OrganicCameraProps {
  children: React.ReactNode;
  handheldDriftIntensity?: number; // default 1.0 (subtle)
  breathingRateBpm?: number; // default 14 BPM
}

/**
 * Organic Camera Imperfections
 *
 * Replaces robotic mathematical keyframes with simulated human camera operation:
 * subtle micro-drifts, handheld breathing, and gentle organic refocusing.
 */
export const OrganicCameraImperfections: React.FC<OrganicCameraProps> = ({
  children,
  handheldDriftIntensity = 1.0,
  breathingRateBpm = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const timeSec = frame / fps;
  const breathingFreq = (breathingRateBpm / 60) * 2 * Math.PI;

  // Multi-frequency trigonometric human tremor simulation (zero Math.random())
  const driftX =
    (Math.sin(timeSec * breathingFreq * 0.7) * 2.5 +
      Math.cos(timeSec * breathingFreq * 1.3) * 1.2) *
    handheldDriftIntensity;

  const driftY =
    (Math.sin(timeSec * breathingFreq) * 3.5 +
      Math.sin(timeSec * breathingFreq * 2.1) * 0.8) *
    handheldDriftIntensity;

  const tiltRoll = Math.sin(timeSec * breathingFreq * 0.5) * 0.25 * handheldDriftIntensity;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px) rotate(${tiltRoll.toFixed(2)}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
