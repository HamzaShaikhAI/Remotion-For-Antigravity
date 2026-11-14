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

---

## 6. AI Voiceover & Multi-Speaker Dialogue (`rea voice`)

REA features a dual-engine speech synthesis pipeline supporting both zero-key free Edge TTS and broadcast-grade Google Gemini 3.8 Flash TTS (`gemini-3.8-flash-tts`).

### 6.1 Provider Selection & Flags
- **Edge TTS (Default, Zero-Key):** `rea voice "<script>" public/audio/scene1.mp3 --voice=en-US-AndrewNeural`
- **Gemini TTS (Requires GEMINI_API_KEY):** `rea voice "<script>" public/audio/scene1.wav --provider=gemini --voice=Charon --style="warm documentary narrator"`

### 6.2 Curated Gemini Prebuilt Voices & Delivery Styles
| Video Style | Voice | Recommended `--style` Flag | Vocal Character |
| :--- | :--- | :--- | :--- |
| **Vox / Documentary** | `Charon` or `Rasalgethi` | `"warm, authoritative, measured documentary narrator"` | Informative, clear, grounded |
| **Cyberpunk / Sci-Fi HUD** | `Orus` or `Alnilam` | `"calm, futuristic, slightly resonant AI system voice"` | Firm, deep, cinematic |
| **Tech / SaaS Launch** | `Zephyr` or `Puck` | `"energetic, upbeat, modern product keynote"` | Bright, enthusiastic, crisp |
| **Storytelling / Calm Explainer** | `Sulafat` or `Aoede` | `"warm, inviting, conversational storyteller"` | Warm, breezy, natural |

> **Note on Verbatim Synthesis:** `gemini-3.8-flash-tts` synthesizes text strictly verbatim. Always pass delivery instructions in `--style="..."` rather than inside the script text so stage directions are never spoken aloud.

### 6.3 Multi-Speaker 2-Person Dialogue Mode (`--dialogue=dialogue.json`)
For podcast audiograms, interviews, or conversational explainers, pass a dialogue manifest:
```json
{
  "speakers": [
    { "speaker": "Alex", "voice": "Charon" },
    { "speaker": "Maya", "voice": "Kore" }
  ],
  "turns": [
    {
      "speaker": "Alex",
      "style": "curious, energetic podcast host",
      "text": "Wait... <short pause> did Antigravity just compile that entire ten-second motion graphic without a single render crash?"
    },
    {
      "speaker": "Maya",
      "style": "calm, confident systems architect",
      "text": "Every frame. The pre-render hook audited all static assets before Chromium even booted."
    }
  ]
}
```
Run:
```bash
rea voice --dialogue=dialogue.json public/audio/podcast-dialogue.wav
```
