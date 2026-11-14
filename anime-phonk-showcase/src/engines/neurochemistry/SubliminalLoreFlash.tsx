import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SubliminalLoreProps {
  flashFrame: number;
  loreSecretText: string;
  durationFrames?: number; // default 2 frames (0.033s @ 60fps)
  accentColor?: string;
}

/**
 * Subliminal Lore Injection (2-Frame Easter Egg)
 *
 * Flashes secret lore, easter eggs, or ranking codes for exactly 2 frames during
 * intense action, forcing viewers to scrub back and rewatch 3-5 times (APV > 150%).
 */
export const SubliminalLoreFlash: React.FC<SubliminalLoreProps> = ({
  flashFrame,
  loreSecretText,
  durationFrames = 2,
  accentColor = '#FF0055',
}) => {
  const frame = useCurrentFrame();

  const isFlashing = frame >= flashFrame && frame < flashFrame + durationFrames;
  if (!isFlashing) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        zIndex: 999,
      }}
    >
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          fontSize: '32px',
          color: accentColor,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        [ CLASSIFIED LORE ]
      </div>

      <div
        style={{
          fontFamily: 'Courier New, monospace',
          fontWeight: 800,
          fontSize: '28px',
          color: '#FFFFFF',
          textAlign: 'center',
          maxWidth: '85%',
          textShadow: `0 0 20px ${accentColor}`,
        }}
      >
        {loreSecretText}
      </div>
    </div>
  );
};
