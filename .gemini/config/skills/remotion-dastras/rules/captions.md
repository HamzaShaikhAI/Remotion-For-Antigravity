# Remotion Captions & Subtitles Guide

This guide details how to implement word-by-word kinetic captions, parse SRT/VTT subtitles, and integrate Whisper AI transcriptions inside Antigravity REA compositions.

---

## 1. Word-by-Word Animated Captions

Dynamic subtitles that highlight words as they are spoken increase viewer retention by over 80%.

Use the `rea-captions` plugin (`rea add rea-captions`):

```tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { AnimatedCaptions, CaptionWord } from '../plugins/rea-captions';

const sampleTranscription: CaptionWord[] = [
  { word: 'Autonomous', startInFrames: 0, endInFrames: 20 },
  { word: 'video', startInFrames: 21, endInFrames: 35 },
  { word: 'generation', startInFrames: 36, endInFrames: 55 },
  { word: 'in', startInFrames: 56, endInFrames: 65 },
  { word: 'Antigravity.', startInFrames: 66, endInFrames: 90 },
];

export const CaptionScene: React.FC = () => {
  return (
    <AnimatedCaptions
      words={sampleTranscription}
      activeColor="#00f5ff"
      inactiveColor="#64748b"
      fontSize={48}
    />
  );
};
```

---

## 2. Importing SRT and VTT Files

When users provide `.srt` or `.vtt` subtitle files, parse them into frame-accurate arrays:

```ts
export function parseSrtTimestampToFrames(timestamp: string, fps = 30): number {
  // Format: "00:01:23,456"
  const [time, ms] = timestamp.split(/[,.]/);
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
  return Math.round(totalSeconds * fps);
}
```

---

## 3. Styling Standards for Social Captions

- **Font Family:** High-contrast sans-serif or geometric display fonts (`Inter`, `Montserrat`, `Cabinet Grotesk`).
- **Text Shadows:** Add dark drop shadows or glowing neon outlines (`textShadow: '0 0 20px #00f5ff'`) to ensure readability over moving background video.
- **Positioning:** Anchor captions between 70% and 85% of canvas height (avoid bottom edges where social media UI bars reside).
