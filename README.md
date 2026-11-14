# Remotion Engine for Antigravity (REA)

<div align="center">

![Antigravity Remotion Banner](https://img.shields.io/badge/Antigravity-2.0_Ready-00f5ff?style=for-the-badge&logo=google&logoColor=white)
![Release](https://img.shields.io/badge/Release-v2.0.0--rc.1_(Pre--release)-00f5ff?style=for-the-badge&logo=github&logoColor=white)
![Remotion](https://img.shields.io/badge/Remotion-v4.0+-blueviolet?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Typing-blue?style=for-the-badge&logo=typescript&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Bundled_Zero--Config-green?style=for-the-badge&logo=ffmpeg&logoColor=white)
![Dual TTS](https://img.shields.io/badge/Dual_TTS-Gemini_3.8_+_Edge_TTS-ff5722?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

<br/>

**The Autonomous Motion Graphics, Procedural Sound Synthesis, AI Voiceover & Multimedia Video Editing Engine for Google Antigravity 2.0 AI Agents.**

*Generate, animate, narrate, synthesize sound, trim, loudness-normalize, and render production-grade React videos directly from autonomous AI prompts.*

<br/>

[![REA Hero Showcase Preview](assets/rea-demo.gif)](assets/rea-hero-poster.jpeg)

*Live Showcase: 10-second autonomous motion graphic rendered entirely by Antigravity using REA.*  
*Click preview above to view high-resolution 4K poster frame.*

</div>

---

## 📌 Executive Summary & Architectural Overview

Traditional coding agents are restricted to generating static HTML/CSS, text files, or terminal scripts. **REA (Remotion Engine for Antigravity)** expands Google Antigravity 2.0 into an **autonomous video director, animator, sound designer, and post-production editor**.

REA bridges the gap between programmatic React motion design and AI agents through a unified native CLI (`bin/rea-cli.js`), an isolated bundled FFmpeg compositor, deterministic physics primitives, pure Node.js procedural sound synthesis, dual-provider neural voiceover, and memory-safe chunked multi-act rendering.

```
                      ┌──────────────────────────────────────┐
                      │   Google Antigravity 2.0 AI Agent    │
                      └──────────────────┬───────────────────┘
                                         │
                    Prompt: "Build a 10-minute Vox documentary"
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          REA CLI Orchestrator         │
                      │            (bin/rea-cli.js)           │
                      └────────┬─────────┬─────────┬─────────┘
                               │         │         │
            ┌──────────────────┴┐   ┌────┴───┐   ┌─┴────────────────┐
            │ Remotion Engine   │   │ Pre-   │   │  Bundled FFmpeg  │
            │   (React 18)      │   │ Render │   │  (Zero-Config)   │
            └─────────┬─────────┘   │ Gate   │   └─┬────────────────┘
                      │             └────────┘     │
        ┌─────────────┴──────────┐        ┌────────┴───────────────┐
        │  src/plugins/          │        │  Lossless Trimming     │
        │  • rea-particles       │        │  EBU R128 Loudness     │
        │  • rea-transitions     │        │  Stream Telemetry      │
        │  • rea-typography      │        │  Still & GIF Render    │
        │  • rea-captions        │        │  Lossless Concat       │
        │  • rea-mockups         │        └────────────────────────┘
        └─────────────┬──────────┘
                      │
        ┌─────────────┴────────────────────────────────────────────┐
        │  Audio, Voice & Long-Form Rendering Architecture         │
        │  • Gemini 3.8 Flash TTS & Zero-Key Edge TTS Dual Engine  │
        │  • Multi-Speaker 2-Person Dialogue Synthesis             │
        │  • Pure Node.js 44.1 kHz PCM WAV Procedural SFX          │
        │  • Vox Journalistic Editorial Guardrails Validator       │
        │  • Chunked Act-by-Act Long-Form Rendering (rea render-long) │
        └──────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start & Global Skill Installation

REA installs as an autonomous system skill inside Google Antigravity across Windows, macOS, and Linux:

```bash
# 1. Clone repository
git clone https://github.com/HamzaShaikhAI/Remotion-For-Antigravity.git
cd Remotion-For-Antigravity

# 2. Install dependencies (Bundles Remotion + FFmpeg + Google GenAI SDK)
npm install

# 3. Deploy skill globally into ~/.gemini/config/skills/remotion-dastras
node bin/rea-cli.js install-skill
```

Once installed, Google Antigravity detects REA directives, rules, and CLI tools automatically in every new agent turn.

---

## 🛠️ Unified CLI Command Reference

Execute all operations via `rea <command>` (or `node bin/rea-cli.js <command>`):

### 🎙️ 1. Audio, Sound Design & Dual-Provider Voiceover

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`install-skill`** | `rea install-skill` | Automatically deploys bundled skill globally into `~/.gemini/config/skills/remotion-dastras`. |
| **`sfx`** | `rea sfx <whoosh\|pop\|riser\|typewriter> [out.wav]` | Synthesizes broadcast 44.1 kHz 16-bit PCM WAV sound effects directly into `public/sfx/` with zero external dependencies. |
| **`voice`** | `rea voice "<text>" [out.wav] [--provider=gemini\|edge] [--voice=...] [--style="..."]` | Dual-engine voiceover: broadcast Google Gemini 3.8 Flash TTS (`gemini-3.8-flash-tts`) or zero-key Edge TTS. Calculates exact Remotion frame counts. |
| **`voice (dialogue)`** | `rea voice --dialogue=script.json [out.wav] [--provider=gemini]` | Synthesizes conversational 2-person dialogues for podcasts and audiograms with turn-by-turn speaker annotations. |
| **`validate-script`** | `rea validate-script <text \| file.txt>` | Audits voiceover scripts against `rules/vox-editorial.md` for syllable density (3.8–4.5/sec) and bans cliché filler phrases. |

### 🎬 2. Remotion Studio & Rendering Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`init`** | `rea init <project-name>` | Scaffolds a new TypeScript-enabled Remotion workspace with full REA integration. |
| **`add`** | `rea add <plugin-name>` | Injects modular visual plugins (`rea-particles`, `rea-transitions`, `rea-typography`, `rea-captions`, `rea-mockups`). |
| **`preview`** | `rea preview` | Launches live interactive Remotion Studio at `http://localhost:3000`. |
| **`render`** | `rea render <comp-id> [out.mp4]` | Runs pre-flight audit and compiles high-definition video via Chromium workers. |
| **`render-long`** | `rea render-long <Comp1,Comp2..\|--auto> [out.mp4]` | Memory-safe chunked rendering for long-form videos (> 120s); flushes Chromium RAM between segments and losslessly concatenates with bundled FFmpeg. |
| **`validate`**| `rea validate [comp-id]` | Audits `src/Root.tsx`, `public/` directory, and all `staticFile()` imports. |
| **`list-plugins`** | `rea list-plugins` | Displays the catalog of available visual plugins. |
| **`hook`** | `rea hook pre-render` | Intercepts agent tool calls before render execution to prevent runtime failures. |

### ✂️ 3. Multimedia & FFmpeg Editing Commands (Bundled Engine)

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`cut`** | `rea cut <in.mp4> <start> <dur> [out.mp4] [--normalize]` | Slices raw video with frame-level accuracy using stream copy (zero quality loss); pass `--normalize` for EBU R128 loudness normalization (`-16 LUFS`). |
| **`probe`** | `rea probe <media-file>` | Deep telemetry inspection of video/audio streams, duration, resolution, codecs, and framerate. |
| **`audio`** | `rea audio <in.mp4> [out.mp3]` | Extracts crystal-clear MP3 audio tracks from any video container. |
| **`still`** | `rea still <comp-id> [out.jpeg] [--frame=N]` | Renders a high-resolution still frame poster at any exact timestamp. |
| **`gif`** | `rea gif <comp-id> [out.gif] [--fps=15]` | Compiles an optimized animated GIF for documentation or social sharing. |

---

## 🧠 Architectural Deep Dives

### 1. Dual-Provider AI Voice Engine & Multi-Speaker Dialogue
REA gives Antigravity agents broadcast-ready vocal narration:
- **Google Gemini 3.8 Flash TTS (`--provider=gemini`):** Direct RIFF 24 kHz mono 16-bit PCM WAV audio generation using the official `@google/genai` SDK. Supports delivery style annotations (`--style="..."`) and multi-speaker 2-person dialogues (`--dialogue=dialogue.json`).
- **Zero-Key Edge TTS (Default Fallback):** Instant neural voice synthesis with zero API keys required, ideal for offline and local-first workflows.

#### Curated Gemini 3.8 Flash TTS Voices
| Video Aesthetic | Curated Voice | Recommended `--style` Delivery Flag | Vocal Character |
| :--- | :--- | :--- | :--- |
| **Vox / Documentary** | `Charon` / `Rasalgethi` | `"warm, authoritative, measured documentary narrator"` | Informative, clear, grounded |
| **Cyberpunk / Sci-Fi** | `Orus` / `Alnilam` | `"calm, futuristic, slightly resonant AI system voice"` | Firm, deep, cinematic |
| **Tech / SaaS Launch** | `Zephyr` / `Puck` | `"energetic, upbeat, modern product keynote"` | Bright, enthusiastic, crisp |
| **Storytelling / Explainer** | `Sulafat` / `Aoede` | `"warm, inviting, conversational storyteller"` | Warm, breezy, natural |

#### Multi-Speaker 2-Person Dialogue Format (`dialogue.json`)
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
      "text": "Did Antigravity just compile a ten-minute motion documentary without a single render crash?"
    },
    {
      "speaker": "Maya",
      "style": "calm, confident systems architect",
      "text": "Every frame. The chunked segment pipeline flushed Chromium's memory between every single act."
    }
  ]
}
```
Synthesize with:
```bash
rea voice --dialogue=dialogue.json public/audio/podcast-dialogue.wav
```

---

### 2. Pure Node.js Procedural Sound Design (`rea sfx`)
Traditional tools require Python, NumPy, or third-party audio packages. REA generates broadcast-quality 44.1 kHz 16-bit PCM WAV sound effects entirely in Node.js buffer mathematics:

```bash
rea sfx whoosh public/sfx/whoosh.wav      # Exponential frequency sweep (200 Hz -> 800 Hz)
rea sfx pop public/sfx/pop.wav            # Sharp sine transient with parabolic decay
rea sfx riser public/sfx/riser.wav        # Tension-building frequency ramp (100 Hz -> 1200 Hz)
rea sfx typewriter public/sfx/type.wav    # Crisp 2.4 kHz terminal key transient
```
Mount in Remotion components with tight sequence wrapping:
```tsx
<Sequence from={30} durationInFrames={30}>
  <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
</Sequence>
```

---

### 3. Chunked Segment Rendering for 10+ Minute Videos (`rea render-long`)
When compositions exceed 120 seconds (`durationInFrames > 120 * fps`), single-pass Chromium rendering risks Out-Of-Memory (OOM) crashes on local workstations.

REA enforces a **Manifest-Driven Architecture** in `src/Root.tsx`:

```tsx
import { Composition, Folder, Series } from 'remotion';

// 1. Single source of truth for audio-locked Act durations
export const ACTS_MANIFEST = [
  { id: 'Act1Paradox', component: Act1Paradox, durationInFrames: 777 },
  { id: 'Act2Proxy', component: Act2Proxy, durationInFrames: 753 },
  { id: 'Act3Compiler', component: Act3Compiler, durationInFrames: 857 },
  { id: 'Act4Batching', component: Act4Batching, durationInFrames: 647 },
  { id: 'Act5Conformance', component: Act5Conformance, durationInFrames: 658 },
  { id: 'Act6Mission', component: Act6Mission, durationInFrames: 480 },
] as const;

// 2. Master composition for Remotion Studio preview
export const MasterDocumentary: React.FC = () => (
  <Series>
    {ACTS_MANIFEST.map(({ id, component: Comp, durationInFrames }) => (
      <Series.Sequence key={id} durationInFrames={durationInFrames}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

// 3. Register both the master preview and isolated chunk targets
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MasterDocumentary"
      component={MasterDocumentary}
      durationInFrames={ACTS_MANIFEST.reduce((s, a) => s + a.durationInFrames, 0)}
      fps={30}
      width={1920}
      height={1080}
    />
    <Folder name="Render-Segments">
      {ACTS_MANIFEST.map(({ id, component, durationInFrames }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={durationInFrames}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </Folder>
  </>
);
```

Render seamlessly with automatic segment discovery:
```bash
# Auto-detects all Acts from ACTS_MANIFEST and stitches losslessly:
rea render-long --auto final-documentary.mp4

# Or specify custom segments manually:
rea render-long Act1Paradox,Act2Proxy,Act3Compiler final-documentary.mp4
```

---

### 4. Vox Journalistic Editorial Guardrails (`rules/vox-editorial.md`)
REA enforces strict pacing and language standards for documentary scripts:
- **Syllable Density Target:** 3.8 to 4.5 syllables per second.
- **Banned Cliché Dictionary:** Automatically flags conversational fluff (*"In today's fast-paced digital world..."*, *"Let's dive in..."*, *"It goes without saying..."*).
- **Exact Duration Locking:** `rea voice` telemetry calculates target frame counts at 30fps and 60fps, adding an automatic `+15` frame dwell buffer so animations never cut off mid-sentence.

Audit any script via CLI:
```bash
rea validate-script "Modern GPU architectures face an unexpected planned obsolescence barrier."
```

---

## 🎨 Supported Animation Styles & Production Showcases

REA natively supports an expansive library of motion graphic aesthetics:

### 1. 🌆 Cyberpunk Sci-Fi HUD & Telemetry
- **Description:** Hi-tech futuristic interface with differential multi-ring gyroscopes, typewriter telemetry, scanning laser beams, and glowing neon embers.
- **Key Techniques:** Concentric SVG rings rotating at differential speeds (`frame * 2.2`, `-frame * 3.1`), `NeonEmbers` particle fields, and `GlitchTransition`.
- **Composition:** `cyber-hud-test/out-cyberpunk.mp4` (10s @ 30fps, 1920×1080).

### 2. 🍏 Minimalist Apple-Keynote SaaS Product Promo
- **Description:** Light-slate executive software launch video with 3D tilted glassmorphic dashboards, live ticking metrics, and kinetic typography.
- **Key Techniques:** 3D CSS perspective transforms (`perspective(1000px) rotateX(...) rotateY(...)`), high-damping `spring()` physics, SVG revenue curves drawing dynamically via `strokeDashoffset`, and `KineticSplitText`.
- **Composition:** `saas-launch-promo/out-saas.mp4` (12s @ 30fps, 1920×1080).

### 3. 📰 Vox-Style Editorial Documentary (KeplerBridge 6-Act Showcase)
- **Description:** 6-Act technical documentary detailing how open-source developers unlocked DirectX 12 Agility SDK capabilities on legacy NVIDIA Kepler hardware.
- **Key Techniques:** Tactile grid paper with subtle film grain, dual-node bytecode translation diagrams, interactive benchmark bar races across 86 PC games, and audio-locked scene durations.
- **Composition:** `keplerbridge-vox-doc/final-keplerbridge-documentary.mp4` (6 Acts, 4,172 frames @ 30fps, 1920×1080).

### 4. 📱 Vertical Social Shorts & Reels
- **Description:** High-velocity vertical video format (9:16) with spring-animated annotation badges and dynamic focal zooms.
- **Key Techniques:** Smooth camera pan/zoom (`scale: 1.35`), dimmed context layers (`opacity: 0.3`), and animated code terminal typing.
- **Composition:** `code-walkthrough-reel/out-vertical.mp4` (10s @ 30fps, 1080×1920).

### 5. 🎙️ Viral Podcast Audiogram
- **Description:** Obsidian-dark audiogram with an audio-reactive 48-bar radial spectrum visualizer, bouncing active-word subtitle pills, and waveform rings.
- **Key Techniques:** Deterministic radial sine/cosine oscillators (`Math.sin(frame * 0.2 + i)`), spring-scaled subtitle highlight pills (`#00f5ff`), and multi-speaker dialogue integration.
- **Composition:** `viral-audiogram/out-audiogram.mp4` (8s @ 30fps, 1080×1080).

### 6. 🎬 Commercial Video Editing & Loudness Normalization
- **Description:** Frame-accurate video cutting, stream-copy trimming, and broadcast EBU R128 audio normalization (`-16 LUFS`).
- **Key Techniques:** Bundled FFmpeg zero-loss cutting via `rea cut --normalize`, automated audio track extraction (`rea audio`), and deep telemetry probing (`rea probe`).

---

## 🚨 Top 10 Issues & Solutions (Troubleshooting Guide)

### 1. Chromium Out-Of-Memory (OOM) on Videos Longer Than 2 Minutes
- **Symptom:** Render process crashes silently or reports `Error: Page crashed!` during frame compilation.
- **Cause:** Headless Chromium accumulates canvas bitmaps and audio PCM buffers across thousands of unmanaged frames.
- **Solution:** Use the chunked rendering pipeline `rea render-long --auto [out.mp4]`. Decompose your video into modular Acts in `src/Root.tsx` under `ACTS_MANIFEST`. REA renders each Act in complete isolation with `--concurrency=2`, flushes RAM between acts, and losslessly stitches them via FFmpeg.

### 2. Audio Desynchronization & Mid-Sentence Cutoffs
- **Symptom:** Visual transitions occur before the voiceover finished speaking.
- **Cause:** Hardcoding guessed scene durations instead of locking them to actual speech lengths.
- **Solution:** Always generate audio **first** using `rea voice`. Read the exact frame count printed by `rea voice` and apply the `+15` frame dwell buffer: `<Series.Sequence durationInFrames={exactVoiceFrames + 15}>`.

### 3. Missing `staticFile()` Assets Breaking Headless Renders
- **Symptom:** Chromium hangs on black frames or fails with `Asset not found in public/`.
- **Cause:** Referencing local files via relative file paths (`../../public/image.png`) instead of `staticFile('image.png')`.
- **Solution:** Always import `staticFile` from `remotion`. Run `rea validate [comp-id]` before rendering. The REA lifecycle hook (`rea hook pre-render`) automatically intercepts and blocks broken render commands before Chromium launches.

### 4. Circular Export Errors in React Plugins (Error #130)
- **Symptom:** `Element type is invalid: expected a string or a class/function but got: undefined.`
- **Cause:** Barrel file `src/plugins/<plugin>/index.ts` containing self-referential `export * from './index'`.
- **Solution:** Ensure all plugin barrel files explicitly reference the component file: `export * from './index.tsx'`.

### 5. Non-Deterministic Frame Jitter During Concurrent Renders
- **Symptom:** Particle bursts, flicker, or elements jump erratically between frames in the rendered MP4.
- **Cause:** Using `Math.random()` inside React render components. Remotion renders frames out-of-order across multi-threaded workers.
- **Solution:** Never use `Math.random()`. Derive all pseudorandom positions deterministically from the current frame and item index: `((frame * 17 + index * 31) % 100) / 100`.

### 6. Unmanaged Audio Buffer Leaks in Multi-Scene Compositions
- **Symptom:** High RAM consumption and audio crackling on multi-scene timelines.
- **Cause:** Mounting `<Audio>` elements at frame 0 with `startFrom={420}` instead of wrapping them in `<Sequence>`.
- **Solution:** Always enclose sound effects in a tight sequence: `<Sequence from={420} durationInFrames={30}><Audio ... /></Sequence>` so Remotion unloads the PCM buffer immediately after playback.

### 7. PowerShell String Escaping Issues on Windows
- **Symptom:** CLI voice or sfx commands fail with `Unexpected token in expression`.
- **Cause:** Double quotes and special characters interpreted by PowerShell before reaching Node.js.
- **Solution:** Pass arguments inside single quotes or use dedicated script files: `rea voice "My narration script" out.mp3`.

### 8. Large Video Files Bloating Git Version History
- **Symptom:** Git repositories become slow to clone; GitHub rejects commits exceeding 100 MB.
- **Cause:** Staging compiled `.mp4`, `.mov`, or raw audio files in Git commits.
- **Solution:** Commit only source code, configs, still poster frames (`.jpeg`), and lightweight preview GIFs. Ensure `.gitignore` ignores `*.mp4`, `*.mov`, `*.wav`, `*.mp3`, and `.rea-chunks/`.

### 9. Google Gemini TTS Quota Exceeded or Missing API Key
- **Symptom:** `Error: GEMINI_API_KEY environment variable is required for Gemini TTS.`
- **Cause:** Calling `--provider=gemini` without having an active API key exported.
- **Solution:** Export your key with `export GEMINI_API_KEY="..."`, or omit the flag to use REA's built-in zero-key Edge TTS default (`--provider=edge`), which works 100% free with no configuration.

### 10. Missing Host FFmpeg Installation
- **Symptom:** `ffmpeg: command not found` when attempting media trimming or probe operations.
- **Cause:** Host system does not have FFmpeg installed on its system PATH.
- **Solution:** REA automatically resolves the bundled cross-platform FFmpeg executable bundled with `@remotion/renderer`. All `rea cut`, `rea probe`, `rea audio`, and `rea render-long` operations work out of the box without installing system FFmpeg.

---

## ❓ Frequently Asked Questions (FAQs)

#### Q1: Does REA require a GPU or hardware acceleration to render videos?
**A:** No. REA compiles videos headlessly using Remotion's CPU-based SwiftShader software rasterizer. While hardware acceleration can speed up rendering on systems with dedicated GPUs, REA runs reliably on standard cloud instances, GitHub Actions runners, and laptops without a discrete GPU.

#### Q2: Can I use REA completely free without paying for API keys?
**A:** Yes! REA is built around a **Zero-Key First Principle**:
- Audio voiceovers default to zero-key neural Edge TTS (`--provider=edge`).
- Sound design synthesis (`rea sfx`) runs 100% locally via pure Node.js PCM math.
- FFmpeg video cutting, probing, and rendering run locally without external APIs.
The Google Gemini 3.8 Flash TTS provider is an optional broadcast-grade enhancement.

#### Q3: What is the maximum video length REA can render?
**A:** With the chunked segment renderer (`rea render-long`), there is no technical upper limit. Long-form documentaries of 10 minutes, 30 minutes, or longer render smoothly by breaking the video into 30–90 second Acts in `src/Root.tsx`, keeping Chromium memory usage capped under 3 GB throughout the render.

#### Q4: How does REA guarantee deterministic video rendering?
**A:** Remotion renders frames concurrently across multiple Chromium workers. If components rely on `Math.random()`, wall-clock timers (`Date.now()`), or unmanaged async state, frames flicker. REA enforces deterministic mathematical formulas where every visual coordinate, scale, and opacity is a pure mathematical function of `frame` and `fps`.

#### Q5: Can I add custom visual plugins to REA?
**A:** Absolutely. Create a new directory under `src/plugins/<my-plugin>/` containing an `index.tsx` component and an `index.ts` re-export. Once created, run `rea list-plugins` to verify registration, and import the plugin directly into your compositions.

#### Q6: How does REA handle audio loudness compliance for broadcast and social media?
**A:** Passing the `--normalize` flag to `rea cut` applies an EBU R128 two-pass loudness filter (`loudnorm=I=-16:TP=-1.5:LRA=11`). This sets the integrated loudness to `-16 LUFS` with a maximum true peak of `-1.5 dBFS`, conforming to YouTube, Spotify, and broadcast streaming standards.

#### Q7: Can REA render vertical videos for TikTok, YouTube Shorts, and Instagram Reels?
**A:** Yes. Specify `width={1080}` and `height={1920}` in your composition in `src/Root.tsx`. REA includes dedicated responsive templates and typography plugins optimized for vertical mobile viewports.

---

## 🤝 Community, Contributing & Governance

We welcome contributions from developers, motion designers, and AI researchers!

### Development Workflow
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feat/my-new-plugin
   ```
2. Follow strict REA architectural standards:
   - Zero `Math.random()` inside React render bodies.
   - All motion scaled with `spring()` physics or `interpolate()`.
   - All static assets referenced strictly via `staticFile()`.
3. Verify test suite and pre-flight audits:
   ```bash
   npm test
   node bin/rea-cli.js validate
   ```
4. Submit a Pull Request with verifiable render evidence (poster stills or GIF previews).

---

## 🌐 GEO-SEO & AI Agent Discoverability

REA is engineered for seamless search and discovery across modern AI coding agents, enterprise developer search engines, and programmatic multimedia tooling:

- **Target Domains:** Programmatic Video Generation, AI Agent Video Direction, React Motion Graphics, Autonomous Video Post-Production, Remotion Automation, Headless FFmpeg Processing.
- **Regional Developer Hubs:** United States (San Francisco, Seattle, New York), Europe (London, Berlin, Amsterdam, Zurich), Asia-Pacific (Bengaluru, Singapore, Tokyo, Sydney).
- **Core Integrations:** Google Antigravity 2.0, Remotion v4, Google Gemini Live / Flash, Edge TTS, FFmpeg, React 18, TypeScript.

---

## 📄 License & Author

- **Author:** [Hamza Shaikh](https://github.com/HamzaShaikhAI)
- **License:** [MIT License](LICENSE) — free for personal, commercial, and enterprise applications.
- **Project Repository:** [https://github.com/HamzaShaikhAI/Remotion-For-Antigravity](https://github.com/HamzaShaikhAI/Remotion-For-Antigravity)
