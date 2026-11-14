import React from 'react';
import { AbsoluteFill } from 'remotion';

export interface ScreenSpaceReflectionsProps {
  children: React.ReactNode;
  reflectionOpacity?: number;
  groundOffsetPercent?: number; // e.g. 70% from top
}

/**
 * Screen Space Reflections (SSR)
 *
 * Simulates floor reflections for wet pavement or glossy arena surfaces.
 */
export const ScreenSpaceReflections: React.FC<ScreenSpaceReflectionsProps> = ({
  children,
  reflectionOpacity = 0.35,
  groundOffsetPercent = 65,
}) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Primary Visual Subject */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Screen Space Mirror Reflection Plane */}
      <AbsoluteFill
        style={{
          top: `${groundOffsetPercent}%`,
          transform: 'scaleY(-1)',
          opacity: reflectionOpacity,
          filter: 'blur(3px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
