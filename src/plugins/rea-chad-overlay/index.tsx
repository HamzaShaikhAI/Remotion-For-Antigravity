import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export type ChadVariant = 'chad' | 'skull' | 'fire' | 'sigma';

export interface ChadEmojiOverlayProps {
  triggerFrame: number;
  durationInFrames?: number;
  variant?: ChadVariant;
  caption?: string;
  bassReactive?: boolean;
  audioSrc?: string; // Optional staticFile(...) URL for live bass thump
  accentColor?: string;
}

const VARIANT_GLYPHS: Record<ChadVariant, string> = {
  chad: '🗿',
  skull: '💀',
  fire: '🔥',
  sigma: '⚡',
};

export const ChadEmojiOverlay: React.FC<ChadEmojiOverlayProps> = ({
  triggerFrame,
  durationInFrames = 60,
  variant = 'chad',
  caption = 'COLDEST MOMENT',
  bassReactive = true,
  audioSrc = staticFile('audio/active-phonk.mp3'),
  accentColor = '#00f5ff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc ?? '');

  if (frame < triggerFrame || frame >= triggerFrame + durationInFrames) {
    return null;
  }

  const localFrame = frame - triggerFrame;

  // Sub-bass amplitude boost
  let bassScaleBoost = 0;
  if (bassReactive && audioData) {
    const spectrum = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32,
    });
    const subBass = (spectrum[0] + spectrum[1] + spectrum[2]) / 3;
    bassScaleBoost = subBass * 0.32;
  }

  // Slam-in spring entrance + smooth exit fade
  const slamSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 260, mass: 0.65 },
  });
  const exitOpacity = interpolate(
    localFrame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(slamSpring, [0, 1], [2.4, 1.0]) + bassScaleBoost;
  const tiltDeg = Math.sin(localFrame * 0.45) * 4;
  const rgbOffset = Math.max(0, 8 - localFrame * 0.8) + bassScaleBoost * 18;
  const glyph = VARIANT_GLYPHS[variant];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 240,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${scale}) rotate(${tiltDeg}deg)`,
        }}
      >
        {/* Chromatic RGB Split Emoji Badge */}
        <div style={{ position: 'relative', fontSize: 150, lineHeight: 1 }}>
          <span
            style={{
              position: 'absolute',
              left: -rgbOffset,
              top: 0,
              opacity: 0.75,
              filter: 'drop-shadow(0 0 18px #00f5ff)',
            }}
          >
            {glyph}
          </span>
          <span
            style={{
              position: 'absolute',
              left: rgbOffset,
              top: 0,
              opacity: 0.75,
              filter: 'drop-shadow(0 0 18px #ff0055)',
            }}
          >
            {glyph}
          </span>
          <span
            style={{
              position: 'relative',
              filter: 'grayscale(100%) contrast(160%) drop-shadow(0 12px 24px rgba(0,0,0,0.9))',
            }}
          >
            {glyph}
          </span>
        </div>

        {/* High-Contrast Phonk Edit Impact Caption */}
        {caption && (
          <div
            style={{
              marginTop: 18,
              padding: '8px 26px',
              backgroundColor: '#050814',
              border: `3px solid ${accentColor}`,
              boxShadow: `0 0 24px ${accentColor}, 6px 6px 0px #000000`,
              transform: 'skewX(-8deg)',
            }}
          >
            <span
              style={{
                fontFamily: 'Impact, Anton, Poppins, sans-serif',
                fontWeight: 900,
                fontSize: 46,
                letterSpacing: 3,
                color: '#ffffff',
                textTransform: 'uppercase',
                WebkitTextStroke: '1.5px #000000',
              }}
            >
              {caption}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
