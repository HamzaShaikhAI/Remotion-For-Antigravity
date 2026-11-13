# Multimedia Processing & FFmpeg Rules

This guide explains how the Antigravity agent manipulates raw footage, slices clips, normalizes audio, and inspects video files using the bundled Remotion FFmpeg toolchain in the REA ecosystem.

---

## 1. Zero-Loss Video Cutting (`rea cut`)

When cutting or trimming raw source video clips, use the built-in `rea cut` command. It leverages Remotion's isolated cross-platform FFmpeg binary without needing system PATH configuration.

### Fast Stream-Copy (No Quality Loss)
```bash
rea cut <input.mp4> <start_seconds> <duration_seconds> [output.mp4]
```
- **Example:** Slice a 15-second highlight starting at 45 seconds:
  ```bash
  rea cut raw-meeting.mp4 45 15 highlight.mp4
  ```
- **Performance:** Runs at 10x-50x speed via `-c:v copy -c:a copy` because it avoids re-encoding.

---

## 2. Audio Loudness Normalization (`--normalize`)

Raw footage often has inconsistent or quiet audio levels. Passing `--normalize` triggers EBU R128 loudness normalization using the `loudnorm` filter while stream-copying the video:

```bash
rea cut interview.mp4 10 30 interview-normalized.mp4 --normalize
```
- **Filter Applied:** `loudnorm=I=-16:TP=-1.5:LRA=11`
- **Target Integrated Loudness:** `-16 LUFS` (standard for web & social video)
- **True Peak:** `-1.5 dBFS` (prevents digital clipping)

---

## 3. Media Metadata Probing (`rea probe`)

Never guess video resolution, framerate, or duration. Run `rea probe` to extract full JSON telemetry:

```bash
rea probe raw-footage.mp4
```
**Telemetry Returned:**
- Duration in seconds and exact frame count
- Video codec, resolution, and framerate
- Audio sample rate, channel layout, and bit depth

---

## 4. Audio Extraction (`rea audio`)

To separate voiceover tracks or extract background music from raw footage:
```bash
rea audio raw-presentation.mp4 voiceover.mp3
```

---

## 5. Chroma Key & Green Screen Matting

To composite subjects over custom Remotion backgrounds, use CSS screen-mode or Remotion's shader blending:

```tsx
import { Video, staticFile, AbsoluteFill } from 'remotion';

export const ChromaKeyComposite: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background Graphic */}
      <BackgroundScene />

      {/* Foreground Video with Chroma Blend */}
      <Video
        src={staticFile('host-transparent.webm')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};
```
