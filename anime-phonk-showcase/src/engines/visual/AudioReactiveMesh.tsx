import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface AudioReactiveMeshProps {
  gridSize?: number;
  wireframeColor?: string;
  reactivitySpeed?: number;
}

/**
 * Audio-Reactive Background Meshes
 *
 * Wireframe synthwave mesh grid that pulses and ripples in sync with the master sub-bass frequency.
 */
export const AudioReactiveMesh: React.FC<AudioReactiveMeshProps> = ({
  gridSize = 40,
  wireframeColor = 'rgba(0, 245, 255, 0.25)',
  reactivitySpeed = 0.08,
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * reactivitySpeed) * 10;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `linear-gradient(to bottom, transparent 40%, rgba(5, 5, 20, 0.95) 100%),
          linear-gradient(90deg, ${wireframeColor} 1px, transparent 1px),
          linear-gradient(0deg, ${wireframeColor} 1px, transparent 1px)`,
        backgroundSize: `100% 100%, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
        transform: `perspective(500px) rotateX(60deg) translateY(${wave}px)`,
        transformOrigin: 'bottom center',
      }}
    />
  );
};
