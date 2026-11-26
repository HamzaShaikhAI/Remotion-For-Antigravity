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
  bottomOffset?: number; // Safe zone clearance (e.g. 520px above Shorts lower-third/chrome)
  rightSafeMargin?: number; // Clearance from right-hand Shorts UI icons (e.g. 140px)
  wordsPerWindow?: number; // Rolling window size so long scripts stay 1-2 crisp lines
  maxWidth?: number | string;
}

/**
 * Kinetic Karaoke Caption Engine
 * Transcends @remotion/captions with spring-bounced word-level highlights,
 * rolling phrase windowing, and YouTube Shorts / TikTok safe-zone compliance.
 */
export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  activeColor = '#38bdf8',
  inactiveColor = '#e2e8f0',
  pillBgColor = 'rgba(56, 189, 248, 0.22)',
  fontSize = 38,
  bottomOffset = 510,
  rightSafeMargin = 0,
  wordsPerWindow = 4,
  maxWidth = 860,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  if (!words || words.length === 0) return null;

  // Locate active word or clamp to nearest phrase when between words
  let activeWordIndex = words.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame);
  if (activeWordIndex === -1) {
    const nextIdx = words.findIndex((w) => w.startFrame > frame);
    activeWordIndex = nextIdx === -1 ? words.length - 1 : Math.max(0, nextIdx - 1);
  }

  const windowSize = Math.max(1, wordsPerWindow);
  const windowStart = Math.floor(activeWordIndex / windowSize) * windowSize;
  const visibleWords = words.slice(windowStart, windowStart + windowSize);

  const horizontalAnchorLeft = rightSafeMargin > 0
    ? `${44 + Math.round((width - rightSafeMargin - 44) / 2)}px`
    : '50%';
  const resolvedMaxWidth = typeof maxWidth === 'number' && rightSafeMargin > 0
    ? Math.min(maxWidth, width - rightSafeMargin - 48)
    : maxWidth;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        left: horizontalAnchorLeft,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        width: typeof resolvedMaxWidth === 'number' ? `${resolvedMaxWidth}px` : resolvedMaxWidth,
        padding: '12px 18px',
        borderRadius: '18px',
        background: 'rgba(5, 8, 17, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.78)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 90,
      }}
    >
      {visibleWords.map((word, offsetIdx) => {
        const globalIdx = windowStart + offsetIdx;
        const isActive = globalIdx === activeWordIndex && frame >= word.startFrame && frame <= word.endFrame;
        const isPast = frame > word.endFrame;

        const popSpring = spring({
          frame: Math.max(0, frame - word.startFrame),
          fps,
          config: { damping: 12, stiffness: 210 },
        });

        const scale = isActive ? Math.max(1, 1 + (popSpring - 1) * 0.22) : 1;
        const color = isActive ? activeColor : isPast ? '#ffffff' : inactiveColor;
        const textShadow = isActive ? `0 0 18px ${activeColor}` : '0 2px 10px rgba(0,0,0,0.9)';

        return (
          <span
            key={globalIdx}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.15,
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
 * Generates synchronized CaptionWord timings from visual narration copy weighted by syllable/character length.
 */
export function buildWordTimingsFromNarration(
  visualScript: string,
  durationInFrames: number,
  startFrame: number = 4,
  endPadFrames: number = 8
): CaptionWord[] {
  const tokens = visualScript.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const activeSpan = Math.max(tokens.length, durationInFrames - startFrame - endPadFrames);
  const weights = tokens.map((t) => Math.max(2, t.replace(/[^A-Za-z0-9]/g, '').length + 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let cursor = startFrame;
  return tokens.map((text, idx) => {
    const share = (weights[idx] / totalWeight) * activeSpan;
    const wStart = Math.round(cursor);
    cursor += share;
    const wEnd = idx === tokens.length - 1 ? startFrame + activeSpan : Math.max(wStart + 1, Math.round(cursor));
    return { text, startFrame: wStart, endFrame: wEnd };
  });
}

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
