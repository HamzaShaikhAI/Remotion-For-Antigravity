# Anime & Phonk High-Retention Edit Rules (9:16 Vertical Shorts)

This document governs all anime edits, AMVs, velocity reels, and Brazilian phonk short-form compositions in the **Remotion Engine for Antigravity (REA)**. Whenever a user requests an anime, phonk, sigma, or beat-drop edit, execute this exact pipeline.

---

## 1. Mandatory Canvas & Frame Rate
- **Resolution:** Always `1080x1920` (9:16 vertical aspect ratio for YouTube Shorts, Instagram Reels, and TikTok).
- **Framerate:** Always `fps={60}` to ensure razor-sharp camera shakes, velocity zooms, and sub-frame impact flashes.
- **Duration:** Target `480` to `900` frames (`8s` to `15s`) for maximum replay loop retention.

---

## 2. Audio-First Non-Repeating Track Selection (`rea pick-track`)
- **NEVER hardcode or repeat the same phonk song across consecutive edits.**
- Before writing any composition TSX, always run `rea pick-track` to select an unplayed track from `public/music/phonk/` (tracked persistently in `.rea-track-history.json`):
  ```bash
  rea pick-track --mood=aggressive
  ```
  *(Supported moods: `aggressive`, `dark`, `velocity`, `drift`.)*

- Read the CLI stdout carefully to extract:
  1. The copied asset path (e.g., `public/audio/active-phonk.wav` or `public/audio/active-phonk.mp3`).
  2. The **Detected Beat Drop** frame (`triggerFrame={N}` at 60fps).
- Mount the audio track cleanly using `<Audio src={staticFile('audio/active-phonk.wav')} />` (matching the exact extension output by `rea pick-track`).

---

## 3. Pacing & Retention Architecture (3-Phase Timeline)

### Phase A: The 1.5s Hook & Muffled Buildup (`Frame 0` -> `triggerFrame - 1`)
- Start immediately with high-contrast action or an intense character stare—zero slow fades from black.
- Cut between clips or focal crops every `24` to `42` frames (`0.4s`–`0.7s`) using `<Series>`.
- Apply continuous forward camera momentum (`interpolate(localFrame, [0, clipDur], [1.0, 1.16])`) on every buildup shot.
- Optional: Trigger `rea sfx riser public/sfx/riser.wav` ending exactly at `triggerFrame`.

### Phase B: The Beat-Drop Impact (`triggerFrame`)
- Wrap the drop scene inside `<ImpactFreezeFrame>` from `../plugins/rea-impact-freeze`:
  - Pass `triggerFrame={detectedDropFrame}`, `durationInFrames={45}` (0.75s freeze), `mangaContrast={true}`, and `audioSrc={staticFile('audio/active-phonk.wav')}` so sub-bass frequencies (20Hz–120Hz) drive real-time camera shake and zoom punch.
- Layer `<ChadEmojiOverlay>` from `../plugins/rea-chad-overlay` starting at `triggerFrame`:
  - Choose `variant` (`'chad' | 'skull' | 'fire' | 'sigma'`) and a short 2–3 word uppercase caption (e.g., `"COLDEST MOMENT"`, `"ZERO MERCY"`, `"AURA +9999"`).
  - Pass `bassReactive={true}` and `audioSrc={staticFile('audio/active-phonk.wav')}`.
- Layer `<NeonEmbers count={65} interactive={false} />` in the background/foreground for depth.

### Phase C: Seamless Loop Outro (Final 12 Frames)
- In the last 12 frames of the composition, execute a rapid velocity zoom-in (`scale: 1.0 -> 1.55`) or whip-pan transition (`GlitchTransition`) that visually matches Frame 0 so viewers seamlessly loop the Short.

---

## 4. Strict Determinism & Validation
- **Zero `Math.random()`:** All shake offsets, speedlines, and particle trajectories must rely purely on `useCurrentFrame()` and deterministic index trigonometry.
- **Pre-Render Audit:** Always execute `rea validate` and visually inspect `triggerFrame` before running `rea render`.
