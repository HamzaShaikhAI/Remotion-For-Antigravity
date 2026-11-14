import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CalmBeforeTheStormProps {
  children: React.ReactNode;
  durationInFrames: number; // typically 180 frames (3.0s @ 60fps)
  ambientSoundSrc?: string;
  subtleZoom?: boolean;
}

/**
 * The "Calm Before the Storm" Pacing Padder
 *
 * Autonomously creates an atmospheric establishing shot (wind drifting, dust settling)
 * that resets the viewer's dopamine baseline before a major clash, maximizing drop impact.
 */
export const CalmBeforeTheStorm: React.FC<CalmBeforeTheStormProps> = ({
  children,
  durationInFrames,
  subtleZoom = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow, measured camera creep (1.0 -> 1.05)
  const scale = subtleZoom
    ? interpolate(frame, [0, durationInFrames], [1.0, 1.05], { extrapolateRight: 'clamp' })
    : 1.0;

  // Gentle breathing vignette
  const vignetteIntensity = interpolate(
    Math.sin((frame / fps) * 1.8),
    [-1, 1],
    [0.45, 0.65]
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#020205' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          filter: 'contrast(1.05) brightness(0.92)',
        }}
      >
        {children}
      </div>

      {/* Atmospheric Vignette Padder */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
