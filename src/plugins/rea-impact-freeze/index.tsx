import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export interface ImpactFreezeFrameProps {
  children: React.ReactNode;
  triggerFrame: number;
  durationInFrames?: number;
  shakeIntensity?: number;
  mangaContrast?: boolean;
  flashColor?: string;
  audioSrc?: string; // Optional staticFile(...) URL for live sub-bass shake boost
}

export const ImpactFreezeFrame: React.FC<ImpactFreezeFrameProps> = ({
  children,
  triggerFrame,
  durationInFrames = 45,
  shakeIntensity = 18,
  mangaContrast = true,
  flashColor = '#ffffff',
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc ?? '');

  const isFrozen = frame >= triggerFrame && frame < triggerFrame + durationInFrames;
  const localFrame = Math.max(0, frame - triggerFrame);

  // Measure sub-bass amplitude (first 4 frequency bins ~ 20Hz-120Hz)
  let bassEnergy = 0;
  if (audioData && isFrozen) {
    const spectrum = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32,
    });
    bassEnergy = (spectrum[0] + spectrum[1] + spectrum[2] + spectrum[3]) / 4;
  }

  // 1. Impact Spring Zoom Punch (1.0 -> 1.24)
  const zoomSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 9, stiffness: 280, mass: 0.7 },
  });
  const baseScale = isFrozen ? interpolate(zoomSpring, [0, 1], [1.0, 1.24]) : 1;
  const totalScale = baseScale + bassEnergy * 0.14;

  // 2. Deterministic Decaying + Bass-Boosted Camera Shake
  const decay = isFrozen ? Math.exp(-localFrame * 0.12) : 0;
  const activeShake = isFrozen ? shakeIntensity * (decay + bassEnergy * 0.85) : 0;
  const shakeX = Math.sin(localFrame * 2.9) * activeShake;
  const shakeY = Math.cos(localFrame * 3.7) * activeShake;
  const shakeRot = Math.sin(localFrame * 2.1) * (activeShake * 0.12);

  // 3. Pre-Drop / On-Drop 4-Frame Impact Flash
  const flashOpacity = isFrozen
    ? interpolate(localFrame, [0, 4], [0.9, 0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Deterministic Radial Manga Speedlines (64 rays)
  const speedlines = useMemo(() => {
    return Array.from({ length: 64 }).map((_, i) => {
      const angleDeg = (i * 360) / 64 + ((i * 17) % 5) - 2.5;
      const innerRadius = 34 + ((i * 29) % 18); // % from center
      const strokeWidth = 1.5 + ((i * 13) % 4);
      return { id: i, angleDeg, innerRadius, strokeWidth };
    });
  }, []);

  const renderTransformedContent = () => (
    <AbsoluteFill
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${totalScale}) rotate(${shakeRot}deg)`,
        filter:
          isFrozen && mangaContrast
            ? 'grayscale(100%) contrast(215%) brightness(1.08)'
            : 'none',
      }}
    >
      {children}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000000' }}>
      {/* Freeze underlying video/animation at exact drop frame */}
      {isFrozen ? (
        <Freeze frame={triggerFrame}>{renderTransformedContent()}</Freeze>
      ) : (
        renderTransformedContent()
      )}

      {/* Manga Halftone Screen Dot Overlay */}
      {isFrozen && mangaContrast && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
            opacity: 0.42,
            backgroundImage:
              'radial-gradient(circle, #000000 1.35px, transparent 1.45px)',
            backgroundSize: '6px 6px',
            transform: `translate(${(localFrame % 2) * 1.5}px, ${(localFrame % 3) * 1.5}px)`,
          }}
        />
      )}

      {/* Radiating Manga Speedlines */}
      {isFrozen && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <svg
            viewBox="-50 -50 100 100"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}
          >
            {speedlines.map((ray) => {
              const rad = (ray.angleDeg * Math.PI) / 180;
              // Pulse inner radius deterministically per frame
              const pulse = Math.sin(localFrame * 0.9 + ray.id) * 4;
              const r1 = ray.innerRadius + pulse;
              const r2 = 85;
              return (
                <line
                  key={ray.id}
                  x1={Math.cos(rad) * r1}
                  y1={Math.sin(rad) * r1}
                  x2={Math.cos(rad) * r2}
                  y2={Math.sin(rad) * r2}
                  stroke="#ffffff"
                  strokeWidth={ray.strokeWidth * 0.18}
                  strokeOpacity={0.85}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      )}

      {/* Impact White/Color Flash */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: flashColor,
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
