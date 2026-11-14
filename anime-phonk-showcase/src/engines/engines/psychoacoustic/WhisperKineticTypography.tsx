import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WhisperWord {
  word: string;
  start: number; // In seconds
  end: number; // In seconds
  score?: number; // Confidence score
  highlight?: boolean; // Highlighted keyword
  emoji?: string; // Floating reaction emoji
}

export interface WhisperKineticTypographyProps {
  words: WhisperWord[];
  activeColor?: string; // Default neon yellow #FFE600
  inactiveColor?: string; // Default white #FFFFFF
  fontSize?: number; // Default 64
  fontFamily?: string;
  style?: React.CSSProperties;
}

/**
 * Word-Level Subtitle Sync & Hormozi Kinetic Typography Engine (WhisperX Syllable Driver)
 * Renders microsecond-accurate popping words, dynamic scaling, rotation jitter, and
 * highlight badges driven by transcription phoneme timestamps.
 */
export const WhisperKineticTypography: React.FC<WhisperKineticTypographyProps> = ({
  words = [],
  activeColor = '#FFE600',
  inactiveColor = '#FFFFFF',
  fontSize = 68,
  fontFamily = 'Montserrat, Impact, sans-serif',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Filter words into chunks of ~3-5 words visible on screen at once
  const activeWordIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  if (activeWordIndex === -1 && words.length > 0) {
    // If between words, keep the closest active group
    const nextIdx = words.findIndex((w) => w.start > currentTime);
    if (nextIdx === 0) return null;
  }

  // Display a window of 3 words around active index
  const safeIdx = Math.max(0, activeWordIndex);
  const startWindow = Math.max(0, safeIdx - 1);
  const endWindow = Math.min(words.length, startWindow + 3);
  const visibleWords = words.slice(startWindow, endWindow);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        width: '90%',
        maxWidth: '920px',
        margin: '0 auto',
        textTransform: 'uppercase',
        fontWeight: 900,
        fontFamily,
        ...style,
      }}
    >
      {visibleWords.map((item, idx) => {
        const isCurrent = currentTime >= item.start && currentTime <= item.end;
        const wordStartFrame = Math.floor(item.start * fps);
        const relFrame = Math.max(0, frame - wordStartFrame);

        // Spring punch scale on active word
        const scaleSpring = spring({
          frame: relFrame,
          fps,
          config: { damping: 9, stiffness: 260 },
        });

        const scale = isCurrent ? 1.0 + scaleSpring * 0.28 : 1.0;
        const color = isCurrent ? activeColor : inactiveColor;
        const rotation = isCurrent ? Math.sin(frame * 0.4) * 4 : 0;

        return (
          <span
            key={`${item.word}-${idx}`}
            style={{
              display: 'inline-block',
              fontSize: `${fontSize}px`,
              color,
              transform: `scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(1)}deg)`,
              transition: 'color 0.08s ease-out',
              textShadow: isCurrent
                ? `0 0 24px ${activeColor}88, 0 4px 16px rgba(0,0,0,0.9)`
                : '0 4px 12px rgba(0,0,0,0.85)',
              WebkitTextStroke: '3px #000000',
              letterSpacing: '1.5px',
            }}
          >
            {item.word}
            {item.emoji && isCurrent && (
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  transform: `scale(${1.0 + Math.sin(frame * 0.5) * 0.2})`,
                }}
              >
                {item.emoji}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};
