# REA v2.0.0-rc.1 (Version 2 Pre-release) 🚀

**Remotion Engine for Antigravity (REA)** — Enterprise-Grade Autonomous Motion Graphics, Procedural Sound Design, Dual-Engine Voiceover, and FFmpeg Multimedia Engine for Google Antigravity 2.0 AI Agents.

---

## 🌟 What's New in Version 2 Pre-release (`v2.0.0-rc.1`)

### 1. 🎙️ Dual-Engine AI Voiceover (`rea voice`)
- **Native Google Gemini 3.8 Flash TTS Integration (`--provider=gemini`):**
  - Powered by the official `@google/genai` SDK using `gemini-3.8-flash-tts`.
  - Directly streams 24 kHz mono 16-bit PCM WAV audio (`RIFF` header) without transcode overhead.
  - Delivery style annotations via `--style="..."` (e.g. `warm documentary narrator`, `calm sci-fi AI`).
  - Strict verbatim synthesis guarantees: directional cues reside in annotations, never read aloud in narration.
- **Zero-Key Neural Edge TTS (Default Fallback):**
  - Instant high-clarity voiceover generation with zero API keys required.
  - Seamless offline and local-first agent workflows.
- **Automated Duration Telemetry:**
  - Integrated `ffprobe` duration calculation outputting exact frame counts for 30fps and 60fps compositions with a 15-frame breathing buffer (`durationInFrames = frames + 15`).

### 2. 👥 Multi-Speaker Conversational Dialogue Synthesis (`--dialogue=dialogue.json`)
- Turn-by-turn conversational audio synthesis for podcasts, interviews, and audiograms.
- Accepts structured JSON defining up to 2 distinct speakers (e.g., `Alex` & `Maya`) with individual voices and emotional delivery styles.
- Powers reactive waveform visualizations in compositions like `ViralAudiogram`.

### 3. 🔊 Pure Node.js Procedural Sound Design (`rea sfx`)
- 100% dependency-free 44.1 kHz 16-bit mono PCM WAV audio synthesis written directly in Node.js buffer math.
- Instant generation of essential UI motion sound effects:
  - `whoosh`: Exponential frequency sweep (200 Hz → 800 Hz) with parabolic attack/decay envelope.
  - `pop`: Fast sine transient (400 Hz → 120 Hz) with rapid decay.
  - `riser`: Low-to-high tension sweep (100 Hz → 1200 Hz) over 1.5 seconds.
  - `typewriter`: Crisp 2.4 kHz click transient for terminal and code walkthroughs.

### 4. 📰 Vox-Style Editorial Guardrails (`rules/vox-editorial.md` & `rea validate-script`)
- Algorithmic script validator enforcing journalistic pacing:
  - Syllable density target: **3.8 – 4.5 syllables per second**.
  - Automated ban on cliché conversational fillers (*"In today's fast-paced digital world..."*, *"Let's dive in..."*).
  - Remotion scene duration sync with dedicated breathing buffers.

### 5. 🛡️ Antigravity 2.0 Lifecycle Pre-Render Hook (`rea hook pre-render`)
- Intercepts autonomous agent render execution to verify that all `staticFile()` assets exist on disk before Chromium workers launch, preventing costly render timeouts.

### 6. 🌐 KeplerBridge Flagship Documentary Showcase
- Full 6-Act Vox-style interactive documentary composition exploring DirectX 12 emulation on legacy Kepler GPUs with dark grid paper, bytecode translation diagrams, and dynamic benchmark data callouts.

### 7. 🎬 Chunked Segment Rendering for Long-Form Videos (`rea render-long`)
- Production-grade architecture for videos exceeding 120 seconds (`durationInFrames > 120 * fps`).
- Auto-detects Acts from `ACTS_MANIFEST` in `src/Root.tsx` (`rea render-long --auto`).
- Compiles each Act in isolated Chromium processes with `--concurrency=2` into `.rea-chunks/`, flushing RAM between acts to prevent Out-Of-Memory (OOM) crashes.
- Stitches segments at 300x+ speed using bundled FFmpeg concat demuxer without transcode quality loss.

---

## 📦 Installation & Upgrade

```bash
# Clone the repository
git clone https://github.com/HamzaShaikhAI/Remotion-For-Antigravity.git
cd Remotion-For-Antigravity

# Install dependencies & deploy skill globally
npm install
node bin/rea-cli.js install-skill
```

---

## 🚀 Quick Start Example

```bash
# Generate broadcast voiceover with Gemini 3.8 Flash TTS
export GEMINI_API_KEY="your-api-key"
rea voice "Enterprise agents compile motion graphics without render crashes." public/audio/voice.wav --provider=gemini --voice=Charon --style="warm documentary narrator"

# Synthesize accompanying motion sound effects
rea sfx whoosh public/sfx/whoosh.wav
rea sfx pop public/sfx/pop.wav

# Render your composition
rea render CodeWalkthroughReel out-vertical.mp4
```
