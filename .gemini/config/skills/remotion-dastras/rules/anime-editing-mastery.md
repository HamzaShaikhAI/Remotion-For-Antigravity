# Anime Editing Mastery & Raw Footage Deconstruction Standards

This document establishes the advanced editing, motion graphics, and audio-reactive standards for high-retention Anime Music Videos (AMVs), battle edits, and character clash shorts inside the **Remotion Engine for Antigravity (REA)**.

---

## 1. Core Philosophy: Clip-Driven Architecture (No Generic Templates)

A high-performing anime edit is never built from a canned template. It is built **from the raw clip outward**:

1. **Footage First, Effects Second:** Before applying any visual effects, deconstruct the raw clip frame-by-frame: identify the subjects, camera movement, emotional tempo, visual beats, and elemental themes.
2. **Subject-Aware 9:16 Pan & Scan:** Anime is natively produced in 16:9 (`1920x1080` or `1280x720`). Cropping blindly to the center cuts off off-center characters. Every shot must have dedicated subject tracking (pan left for left-aligned characters, pan right for right-aligned characters, or a vertical split-screen for two-character standoffs).
3. **Zero Tacky Overlays:** Never insert generic meme faces, giant emojis, or clunky preset boxes into serious anime battle edits. Immersion and aesthetic discipline drive viral watch time.
4. **Color Grading as Narrative:** Color grading must shift dynamically to match the character on screen (e.g., golden amber for thunder breathing, electric cyan for lightning Godspeed).

---

## 2. The 4 Stages of Raw Clip Deconstruction

When editing an anime scene:

### Stage 1: Timeline Segmentation
- Break the raw video into distinct narrative acts:
  - **The Hook / Standoff:** Establishing tension, eye contact, subtle environmental movement.
  - **The Buildup / Energy Gathering:** Visible power surge (sparks, dust, charging posture).
  - **The Transformation / Awakening:** Eye flare, pupil constriction, explosive aura emergence.
  - **The Climax / Execution:** Maximum attack momentum, camera acceleration, finishing blow.

### Stage 2: Camera Pan & Scan Framing (16:9 to 9:16)
In vertical 9:16 video (`1080x1920`):
- **Left Subject Focus (e.g. Zenitsu):** `transform: translate(${-180 + panOffset}px, 0px) scale(1.65)`
- **Right Subject Focus (e.g. Killua):** `transform: translate(${180 + panOffset}px, 0px) scale(1.65)`
- **Center Focus (Close-ups):** `transform: translate(0px, 0px) scale(1.85)`
- **Dual Standoff Split:** Dual stacked viewport or rapid alternating cuts on the beat (`every 12–24 frames`).

### Stage 3: Audio Reactive Velocity (Speed Ramping)
Velocity editing manipulates the local playback rate between keyframes:
- **Fast-Snap on Beat:** Accelerate to `1.5x–2.0x` for 6–10 frames right on the kick or cowbell.
- **Slow-Motion Linger:** Decelerate to `0.5x–0.7x` during hair movement, particle drift, or lightning arcing.
- **Impact Snap:** 1 frame of zero motion (hard freeze) on the exact peak transient, immediately releasing into explosive speed.

### Stage 4: Visual Impact Toolkit
- **Negative Invert Strobe:** Single-frame `filter: invert(1)` or high-contrast black & white flash on major 808 bass drops.
- **Rotational Trauma Shake:**
  $$\text{angle} = \sin(\text{frame} \times 0.8) \times \text{decay} \times 2.5^\circ$$
  $$\text{offsetX} = \cos(\text{frame} \times 1.2) \times \text{decay} \times 24\text{px}$$
  $$\text{offsetY} = \sin(\text{frame} \times 1.5) \times \text{decay} \times 18\text{px}$$
- **Chromatic Aberration (RGB Split):** Separate red and blue channels on transient peaks to simulate lens distortion under high energy.
- **Directional Speedlines:** Subtle SVG or canvas radial lines centered on the character's eye line.

---

## 3. Cinematic Anime Typography

Typography in elite anime edits must feel like high-end broadcast anime titles:
- **Font Stack:** Modern geometric grotesque (`Cinzel`, `Montserrat`, `Syne`, or `Impact`) paired with authentic Japanese Kanji.
- **Kerning & Tracking:** Wide letter spacing (`letterSpacing: '0.28em'`) with smooth expansion during slow-motion segments.
- **Color Sync:** Drop shadows and strokes must match the character's elemental aura (e.g., `#FFD700` golden glow for Zenitsu, `#00E5FF` cyan plasma for Killua).
- **Subtlety:** Keep text anchored to the upper third (`top: 15%`) or lower third (`bottom: 18%`), leaving the center clear for character eyes and action.

---

## 4. Audio Architecture & Transient Synchronization

- Every cut must align with an audio transient (kick drum, cowbell hit, snare snap, or bass drop).
- Sound design layers:
  1. **Background Phonk / Funk Track:** Normalized to `-14 LUFS`.
  2. **Sub-Bass Drops:** 40Hz–80Hz sinewave punch on transformation frames.
  3. **High-Frequency Risers & Whooshes:** White noise sweep peaking 2 frames prior to the cut.
  4. **Elemental Sizzle:** Electrical arc and crackle sounds accompanying lightning bolts.

---

## 5. Verification Checklist

Before rendering any anime edit:
1. [ ] Did you deconstruct every second of the raw clip to identify real character actions?
2. [ ] Are all shots framed to keep character eyes and weapons centered in 9:16?
3. [ ] Does color grading shift authentically to match the character's power element?
4. [ ] Are all impact flashes and camera shakes mathematically decayed with zero linear easing?
5. [ ] Is the composition free of generic meme stickers and canned template overlays?
