import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface Deterministic3dCanvasProps {
  children?: React.ReactNode;
  orbitSpeed?: number;
  perspective?: number;
  tiltAngle?: number;
}

/**
 * Deterministic3dCanvas
 * Provides a 3D transformation context that derives all camera yaw, pitch, and roll
 * strictly from Remotion's frame number.
 */
export const Deterministic3dCanvas: React.FC<Deterministic3dCanvasProps> = ({
  children,
  orbitSpeed = 0.6,
  perspective = 1200,
  tiltAngle = 25,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const rotY = (frame * orbitSpeed) % 360;
  const rotX = tiltAngle + Math.sin(frame * 0.04) * 5;
  const scale = Math.max(0, entrance);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: `${perspective}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
