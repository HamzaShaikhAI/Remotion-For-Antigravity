import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface PaperCameraRigProps {
  children: React.ReactNode;
  sceneIndex?: number;
  zoomRange?: [number, number];
  driftIntensity?: number;
  stopMotionFps?: number;
}

export const PaperCameraRig: React.FC<PaperCameraRigProps> = ({
  children,
  sceneIndex = 0,
  zoomRange = [1.0, 1.1],
  driftIntensity = 1.0,
  stopMotionFps = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Quantized stop-motion frame
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // Push-in 3D Zoom Drift
  const cameraZoom = interpolate(frame, [0, durationInFrames], zoomRange, {
    extrapolateRight: 'clamp',
  });

  // Quantized harmonic desk drift (stepped at 16 FPS for tangible workbench wobble)
  const driftTime = quantizedFrame / stopMotionFps;
  const driftX = Math.sin(driftTime * 0.75) * 14 * driftIntensity;
  const driftY = Math.cos(driftTime * 0.6) * 10 * driftIntensity;
  const driftRotZ = Math.sin(driftTime * 0.45) * 0.75 * driftIntensity;
  const driftTiltX = Math.cos(driftTime * 0.5) * 1.2 * driftIntensity;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${cameraZoom}) translate3d(${driftX}px, ${driftY}px, 0px) rotateZ(${driftRotZ}deg) rotateX(${driftTiltX}deg)`,
          transformOrigin: '50% 48%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
