# Pre-Edit Deep Inspection, Audience Psychology & Viral Strategy Rules

This rule defines the mandatory pre-edit workflow for the **Remotion Engine for Antigravity (REA)**. Before authoring Remotion composition code, slicing clips, or initiating a video render, an agent **MUST** execute this comprehensive inspection and planning protocol.

---

## 1. The Pre-Edit Mandatory Gate (No Code Without Inspection)

An editor who starts coding before understanding the raw footage produces broken framing, ignored characters, and failed pacing. Therefore, every editing task must begin with deep media telemetry and viral audience modeling:

```
[Raw Video & Audio] 
        ↓
[1. Deep Telemetry & Scene Deconstruction] 
        ↓
[2. Audio Transient & 808 Drop Alignment] 
        ↓
[3. Audience Psychology & Viral Retention Plan] 
        ↓
[4. High-CTR SEO, GEO & Title/Tag Strategy] 
        ↓
[5. Remotion Architecture Blueprint & Aura Freeze Map]
        ↓
[Compilation & Verification]
```

---

## 2. Stage-by-Stage Execution Protocol

### Stage 1: Raw Footage Telemetry & Scene Breakdown
1. **Stream & Codec Audit:** Probe dimensions, framerate, duration, pixel format, and audio tracks via `rea probe <file>`.
2. **Frame-by-Frame Subject Analysis:** 
   - Never assume character locations. Detect where the characters stand across the 16:9 canvas.
   - For duels/standoffs: Map character positions (e.g. Character A left, Character B right) to avoid the $2.66\times$ vertical cropping trap.
3. **Scene Cut & Movement Catalog:**
   - Catalog all major scene boundaries with millisecond timestamps.
   - Identify visual peaks: power surges, eye flares, weapon draws, elemental clashes, and finisher attacks.

### Stage 2: Audio Spectrum & Transient Peak Alignment
1. **BPM & Rhythm Cadence:** Determine track tempo (e.g., 75–80 BPM slowed phonk, 130 BPM drift phonk).
2. **Frequency Spectrum Isolation:**
   - Sub-bass 808s (20Hz–120Hz): Drives camera trauma shake, chromatic aberration, and impact pulses.
   - Cowbell / Snare transients: Drives micro-punches and speedline bursts.
   - Breath / Silence moments: Drives pre-drop desaturation and tension freezing.
3. **Sub-Millisecond Beat Drop Offset:** Calculate exact audio `startFrom` frame offsets in Remotion so the song's primary monster drop lands precisely at the composition's visual transformation frame.

### Stage 3: Audience Psychology & Retention Architecture
1. **The 0.8-Second Hook:** Viewers decide to stay or scroll within 800 milliseconds. The first frame must present immediate contrast, recognizable character silhouettes, and kinetic motion.
2. **Tension Arc & Dopamine Release:**
   - Maintain building tension through escalating scene cuts.
   - Insert a 0.2s–0.4s **Pre-Drop Breath** (sudden audio high-pass cutoff + monochrome drain).
   - Deliver explosive dopamine release on the beat drop via **Aura Freeze-Frames**, negative color strobe, and bass-reactive aura badges.
3. **Target Duration:** For short-form clips with rich 30s raw source material, target **25 to 40 seconds (1,500 to 2,400 frames @ 60fps)**. Shortening raw battle footage to under 15 seconds rushes character development and erases climax arcs.
4. **Seamless Replay Loop:** Design the final 12–18 frames with a matching whip-pan or zoom that seamlessly snaps into Frame 0, achieving 120%+ average watch time.

### Stage 4: High-CTR Metadata, SEO & GEO Optimization
Every edit must be paired with high-converting discovery metadata:
- **Title Formula:** `[High Emotion Hook] + [Character 1 vs Character 2] + [Aura / Power Element]`
  - *Example:* `GODSPEED vs THUNDER GOD ⚡ Who Has More Aura? (Zenitsu vs Killua)`
- **Description Keyword Clustering:** Include semantic search keywords targeting YouTube Shorts, TikTok, and Instagram search algorithms.
- **Localized GEO Tags:** Targeted geo-hashtags for regional phonk communities (e.g. `#brazilianphonk`, `#animeedits`, `#phonkmusic`, `#demonslayer`, `#hxh`).

---

## 3. CLI Command: `rea plan`

Execute the automated pre-edit protocol with a single command:
```bash
rea plan <raw-video.mp4> [audio-track.mp3] [--mood=aggressive|dark|velocity]
```
This command inspects streams, samples keyframes, computes scene cuts, analyzes audio RMS energy, calculates drop timestamps, generates SEO/GEO metadata, and outputs a complete execution blueprint before rendering.
