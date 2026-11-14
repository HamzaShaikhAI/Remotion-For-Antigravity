import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CaptionWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface KineticCaptionsProps {
  words: CaptionWord[];
  activeColor?: string;
  inactiveColor?: string;
  pillBgColor?: string;
  fontSize?: number;
  bottomOffset?: number; // Safe zone clearance (e.g. 280px for TikTok/Reels)
}

/**
 * Kinetic Karaoke Caption Engine
 * Transcends @remotion/captions with spring-bounced word-level highlights and platform safe-zone compliance.
 */
export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  activeColor = '#38bdf8',
  inactiveColor = '#94a3b8',
  pillBgColor = 'rgba(56, 189, 248, 0.15)',
  fontSize = 42,
  bottomOffset = 280,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the currently active sentence/window of words
  const activeWordIndex = words.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '85%',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      {words.map((word, i) => {
        const isActive = i === activeWordIndex;
        const isPast = frame > word.endFrame;

        const popSpring = spring({
          frame: frame - word.startFrame,
          fps,
          config: { damping: 10, stiffness: 200 },
        });

        const scale = isActive ? Math.max(1, 1 + (popSpring - 1) * 0.35) : 1;
        const color = isActive ? activeColor : isPast ? '#ffffff' : inactiveColor;
        const textShadow = isActive ? `0 0 20px ${activeColor}` : '0 2px 8px rgba(0,0,0,0.8)';

        return (
          <span
            key={i}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color,
              textShadow,
              transform: `scale(${scale})`,
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '8px',
              background: isActive ? pillBgColor : 'transparent',
              border: isActive ? `1px solid ${activeColor}` : '1px solid transparent',
              transition: 'color 0.1s ease',
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Parses simple SRT subtitle format into frame-accurate CaptionWord array
 */
export function parseSrtToWords(srtText: string, fps: number = 60): CaptionWord[] {
  const blocks = srtText.trim().split(/\n\s*\n/);
  const words: CaptionWord[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;

    const timeLine = lines[1];
    const text = lines.slice(2).join(' ');

    const match = timeLine.match(/(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)/);
    if (!match) continue;

    const startSec =
      parseInt(match[1], 10) * 3600 +
      parseInt(match[2], 10) * 60 +
      parseInt(match[3], 10) +
      parseInt(match[4], 10) / 1000;

    const endSec =
      parseInt(match[5], 10) * 3600 +
      parseInt(match[6], 10) * 60 +
      parseInt(match[7], 10) +
      parseInt(match[8], 10) / 1000;

    const blockStartFrame = Math.round(startSec * fps);
    const blockEndFrame = Math.round(endSec * fps);

    const tokenList = text.trim().split(/\s+/);
    const durationPerWord = (blockEndFrame - blockStartFrame) / Math.max(1, tokenList.length);

    tokenList.forEach((token, idx) => {
      words.push({
        text: token,
        startFrame: Math.round(blockStartFrame + idx * durationPerWord),
        endFrame: Math.round(blockStartFrame + (idx + 1) * durationPerWord),
      });
    });
  }

  return words;
}
