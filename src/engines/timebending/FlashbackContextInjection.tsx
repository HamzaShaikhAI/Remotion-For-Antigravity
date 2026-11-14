import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlashbackContextProps {
  children: React.ReactNode;
  triggerFrame: number;
  durationInFrames?: number; // default 90 frames (1.5s @ 60fps)
  loreText?: string;
}

/**
 * Flashback Context Injection
 *
 * Stretches short sequences by intercutting a 1.5-second high-contrast monochrome
 * memory/lore sequence with subtle CRT scanlines right before a decisive strike.
 */
export const FlashbackContextInjection: React.FC<FlashbackContextProps> = ({
  children,
  triggerFrame,
  durationInFrames = 90,
  loreText = 'MEMORY: THE UNPROMISED OATH',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFlashback = frame >= triggerFrame && frame < triggerFrame + durationInFrames;
  if (!isFlashback) {
    return <>{children}</>;
  }

  const localFrame = frame - triggerFrame;

  // Flash in / out white strobes
  const flashOpacity =
    localFrame < 4
      ? interpolate(localFrame, [0, 4], [0.95, 0])
      : localFrame > durationInFrames - 6
      ? interpolate(localFrame, [durationInFrames - 6, durationInFrames], [0, 0.9])
      : 0;

  // Slow zoom through the memory
  const memoryScale = interpolate(localFrame, [0, durationInFrames], [1.12, 1.28]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* Monochrome Memory Layer */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${memoryScale})`,
          filter: 'grayscale(1) contrast(2.4) brightness(0.85)',
        }}
      >
        {children}
      </div>

      {/* Memory Vignette and Scanline Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subliminal Lore Text */}
      {loreText && (
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '6px',
            color: 'rgba(255, 255, 255, 0.75)',
            textTransform: 'uppercase',
            textShadow: '0 0 16px rgba(255,255,255,0.4)',
          }}
        >
          {loreText}
        </div>
      )}

      {/* Transition Flash Strobe */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
