import React from 'react';
import { useCurrentFrame } from 'remotion';

export const DeterministicFilmGrain: React.FC = () => {
  const frame = useCurrentFrame();

  // Pure deterministic pseudo-random offsets based strictly on frame index (no Math.random())
  const seed = (frame * 17 + 29) % 100;
  const shiftX = Math.sin(frame * 0.7) * 2;
  const shiftY = Math.cos(frame * 0.7) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        inset: -20,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: 0.16,
        mixBlendMode: 'multiply',
        transform: `translate(${shiftX}px, ${shiftY}px)`,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="filmGrainFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#filmGrainFilter)" />
      </svg>
    </div>
  );
};
