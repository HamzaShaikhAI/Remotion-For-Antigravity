import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export interface SubliminalLoopBaitProps {
  children?: React.ReactNode;
  durationInFrames: number;
  loopWindowFrames?: number; // Duration of loop acceleration window (e.g. 18 frames @ 60fps = 0.3s)
  matchCutType?: 'whip_zoom' | 'optical_flash' | 'radial_vortex' | 'shadow_sheathe';
  subliminalBaitText?: string; // 1-frame cryptic visual easter egg at frame 0
  accentColor?: string;
  enableVignette?: boolean;
}

/**
 * Subliminal Loop-Bait Engine (The Infinite Replay Moebius Strip)
 *
 * Programmatically forces Average Percentage Viewed (APV) > 130% by matching
 * the ending camera momentum with Frame 0's entry velocity, masking the replay seam,
 * and planting a 1-frame subliminal question at Frame 0.
 */
export const SubliminalLoopBait: React.FC<SubliminalLoopBaitProps> = ({
  children,
  durationInFrames,
  loopWindowFrames = 18,
  matchCutType = 'whip_zoom',
  subliminalBaitText = 'HOW DID HE SURVIVE?',
  accentColor = '#00f5ff',
  enableVignette = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const isIntroSeam = frame < loopWindowFrames;
  const isOutroSeam = frame >= durationInFrames - loopWindowFrames;

  // 1. Kinetic Zoom Velocity Matching
  // Outro rapidly accelerates zoom-in (1.0 -> 1.48)
  // Intro begins at high zoom (1.48) and rapidly decelerates to 1.0
  let scale = 1.0;
  let blur = 0;
  let brightness = 1.0;
  let rotation = 0;

  if (isOutroSeam) {
    const outroProgress = (frame - (durationInFrames - loopWindowFrames)) / loopWindowFrames;
    scale = interpolate(outroProgress, [0, 1], [1.0, 1.48], {
      easing: Easing.bezier(0.7, 0, 0.9, 1),
    });
    blur = interpolate(outroProgress, [0, 0.7, 1], [0, 4, 12]);
    brightness = interpolate(outroProgress, [0, 0.8, 1], [1.0, 1.1, 1.35]);
    if (matchCutType === 'radial_vortex') {
      rotation = interpolate(outroProgress, [0, 1], [0, 8]);
    }
  } else if (isIntroSeam) {
    const introProgress = frame / loopWindowFrames;
    scale = interpolate(introProgress, [0, 1], [1.48, 1.0], {
      easing: Easing.bezier(0.1, 0.8, 0.2, 1),
    });
    blur = interpolate(introProgress, [0, 0.3, 1], [12, 4, 0]);
    brightness = interpolate(introProgress, [0, 0.2, 1], [1.35, 1.1, 1.0]);
    if (matchCutType === 'radial_vortex') {
      rotation = interpolate(introProgress, [0, 1], [-8, 0]);
    }
  }

  // 2. 1-Frame Subliminal Rewatch Bait (Rendered ONLY on Frame 0)
  const isFrameZero = frame === 0;

  // 3. Dynamic Loop Edge Vignette
  const seamIntensity = isOutroSeam
    ? (frame - (durationInFrames - loopWindowFrames)) / loopWindowFrames
    : isIntroSeam
    ? 1 - frame / loopWindowFrames
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* Scaled & Motion-Blurred Content Container */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: blur > 0 ? `blur(${blur}px) brightness(${brightness})` : undefined,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Seam Darkening Radial Vignette */}
      {enableVignette && seamIntensity > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, ${seamIntensity * 0.75}) 100%)`,
          }}
        />
      )}

      {/* Optical Flash Seam */}
      {matchCutType === 'optical_flash' && seamIntensity > 0.5 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            backgroundColor: '#ffffff',
            opacity: (seamIntensity - 0.5) * 0.7,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 1-Frame Subliminal Easter Egg Banner (Frame 0 Only) */}
      {isFrameZero && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
          }}
        >
          <div
            style={{
              padding: '16px 36px',
              border: `3px solid ${accentColor}`,
              borderRadius: '8px',
              backgroundColor: 'rgba(5, 5, 15, 0.95)',
              boxShadow: `0 0 40px ${accentColor}`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                fontSize: '20px',
                color: accentColor,
                letterSpacing: '4px',
                marginBottom: '6px',
              }}
            >
              [ REPLAY GLITCH DETECTED ]
            </div>
            <div
              style={{
                fontFamily: 'Arial Black, Impact, sans-serif',
                fontWeight: 900,
                fontSize: '36px',
                color: '#FFFFFF',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {subliminalBaitText}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
