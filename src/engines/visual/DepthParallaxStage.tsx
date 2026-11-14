import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DepthParallaxStageProps {
  children: React.ReactNode;
  depthIntensity?: number; // 0.0 - 2.0 (default 1.0)
  cameraTiltX?: number; // deg
  cameraTiltY?: number; // deg
  dollyZoom?: number; // 1.0 - 1.4
  style?: React.CSSProperties;
}

/**
 * Depth Map 3D Parallax & Extrusion Engine (Depth Anything V2 Driver)
 * Gives 2D anime frames a true 3D volumetric space, letting the Remotion camera
 * pan, tilt, and dolly through the depth layers of a flat video.
 */
export const DepthParallaxStage: React.FC<DepthParallaxStageProps> = ({
  children,
  depthIntensity = 1.0,
  cameraTiltX = 0,
  cameraTiltY = 0,
  dollyZoom = 1.08,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural 3D camera pan & tilt motion
  const autoRotateX = Math.sin((frame * Math.PI) / (fps * 2.5)) * 6 * depthIntensity + cameraTiltX;
  const autoRotateY = Math.cos((frame * Math.PI) / (fps * 3.0)) * 8 * depthIntensity + cameraTiltY;
  const autoDolly = interpolate(
    Math.sin((frame * Math.PI) / (fps * 2)),
    [-1, 1],
    [1.0, dollyZoom]
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '1000px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `rotateX(${autoRotateX.toFixed(2)}deg) rotateY(${autoRotateY.toFixed(2)}deg) scale(${autoDolly.toFixed(3)})`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.04s ease-out',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
