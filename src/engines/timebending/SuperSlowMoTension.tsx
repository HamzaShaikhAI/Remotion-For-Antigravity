import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export interface SuperSlowMoTensionProps {
  videoSrc?: string; // The 192fps RIFE-upscaled video
  durationInFrames: number;
  children?: React.ReactNode;
  slowMoStartFrame?: number;
  slowMoDurationFrames?: number;
  speedMultiplier?: number;
}

/**
 * SuperSlowMoTension - Non-linear "Bullet Time" Velocity Curve
 *
 * Eases from normal speed (100%) down to 12.5% right at the apex of the action (75% mark),
 * paired with a subliminal heartbeat vignette and golden aura apex shift, snapping
 * forward violently into impact.
 */
export const SuperSlowMoTension: React.FC<SuperSlowMoTensionProps> = ({
  videoSrc,
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();

  // Create a U-shaped tension curve (1.0 -> 0.125 -> 1.2)
  // The apex of the slow-motion occurs at 75% of the sequence, forcing the viewer to wait for the hit.
  const tensionApexFrame = durationInFrames * 0.75;

  const playbackRate = interpolate(
    frame,
    [0, tensionApexFrame * 0.5, tensionApexFrame, durationInFrames],
    [1.0, 0.4, 0.125, 1.2], // Normal -> Slowing -> Suspended -> Snap-forward
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Subliminal heartbeat pulse tied to the extreme slow-motion phase
  const isDeepSlowMo = playbackRate < 0.25;
  const heartbeatVignetteOpacity = isDeepSlowMo
    ? Math.abs(Math.sin(frame * 0.15)) * 0.6
    : 0;

  // A slight push-in zoom to magnify the tension
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {videoSrc ? (
          <OffthreadVideo
            src={videoSrc}
            playbackRate={playbackRate}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          children
        )}
      </AbsoluteFill>

      {/* Tension Heartbeat Vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(circle, transparent 40%, rgba(0, 0, 0, ${heartbeatVignetteOpacity}))`,
          transition: 'background 0.1s ease-out',
        }}
      />

      {/* High-Contrast Color Shift during Apex */}
      {isDeepSlowMo && (
        <AbsoluteFill
          style={{
            mixBlendMode: 'overlay',
            backgroundColor: 'rgba(255, 215, 0, 0.15)', // Golden aura tint
            filter: 'contrast(150%) grayscale(40%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
