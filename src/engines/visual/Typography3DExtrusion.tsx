import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface Typography3DExtrusionProps {
  text: string;
  depthLayers?: number;
  textColor?: string;
  depthColor?: string;
  perspectiveAngleDeg?: number;
}

/**
 * 3D Typography Extrusion
 *
 * Simulates ray-marched 3D metallic extruded typography by stacking perspective offset layers.
 */
export const Typography3DExtrusion: React.FC<Typography3DExtrusionProps> = ({
  text,
  depthLayers = 8,
  textColor = '#ffffff',
  depthColor = '#005577',
  perspectiveAngleDeg = 15,
}) => {
  const frame = useCurrentFrame();
  const tilt = Math.sin(frame * 0.05) * 4;

  const shadowStack = Array.from({ length: depthLayers }, (_, i) => {
    const offset = i + 1;
    return `${offset}px ${offset * 1.5}px 0px ${depthColor}`;
  }).join(', ');

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `perspective(600px) rotateY(${perspectiveAngleDeg + tilt}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontSize: '72px',
          fontWeight: 900,
          color: textColor,
          textShadow: shadowStack,
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
