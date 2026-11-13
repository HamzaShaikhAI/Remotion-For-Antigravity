# Remotion Engine for Antigravity (REA)

<div align="center">

![Antigravity Remotion Banner](https://img.shields.io/badge/Antigravity-2.0_Ready-00f5ff?style=for-the-badge&logo=google&logoColor=white)
![Remotion](https://img.shields.io/badge/Remotion-v4.0+-blueviolet?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Typing-blue?style=for-the-badge&logo=typescript&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Bundled_Zero--Config-green?style=for-the-badge&logo=ffmpeg&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

<br/>

**The Autonomous Motion Graphics, Video Editing & Multimedia Engine for Google Antigravity 2.0 Agents.**

*Generate, animate, trim, normalize, and render high-production React video graphics directly from your AI agent terminal.*

</div>

---

## 🌟 Why REA?

Traditional coding agents are confined to generating static web code, CLI scripts, or plain text. **REA (Remotion Engine for Antigravity)** transforms Google Antigravity into an **autonomous video director, animator, and video editor**.

- **Autonomous Agent Tooling:** Controlled entirely through the custom `rea` CLI tool (`bin/rea-cli.js`), eliminating manual human editing friction.
- **Zero-Config Bundled FFmpeg:** Slices, trims, normalizes, probes, and transcodes raw multimedia files using Remotion's isolated compositor binaries without requiring global FFmpeg or Windows PATH configuration.
- **Deterministic Rendering Guarantee:** Strictly prohibits `Math.random()` across all render loops, enforcing frame-accurate, reproducible multithreaded rendering.
- **Physics-Driven Motion:** Powered by Remotion's `spring()` physics and `interpolate()` curves—never linear CSS transitions.
- **Pre-Render Governance Gates:** Antigravity 2.0 lifecycle hooks (`pre-render.json`) automatically audit assets, compositions, and `staticFile()` imports before Chromium workers are launched.

---

## 🏛 Architecture & Global Agent Configuration

REA mirrors the native Antigravity global configuration layout so any developer can clone the repository and have the agent immediately recognize its custom toolchains:

```
antigravity-remotion-skills/
│
├── .gemini/
│   └── config/
│       └── skills/
│           └── remotion-dastras/        # Native Agent Skill Folder
│               ├── SKILL.md             # Core System Prompt & Agent Directives
│               ├── rules/               # Deep Knowledge Base Rules
│               │   ├── compositions.md  # Composition Layout & Frame Math
│               │   ├── images.md        # Asset Ingest & staticFile Rules
│               │   ├── rea-plugins.md   # REA Visual Plugin Documentation
│               │   ├── multimedia.md    # Lossless Trimming & Audio Normalization
│               │   ├── captions.md      # Word-by-Word Subtitle Synchronization
│               │   └── transparent-and-gif.md # Alpha Transparencies & GIFs
│               └── hooks/
│                   └── pre-render.json  # Antigravity 2.0 Lifecycle Interceptor
│
├── bin/
│   └── rea-cli.js                       # Autonomous CLI Orchestrator (v1.2.0)
│
├── src/plugins/                         # Reusable Visual Plugin Library
│   ├── rea-particles/                   # Procedural Neon Embers with Mouse Physics
│   ├── rea-transitions/                 # Glitch, Chromatic Aberration & Wipes
│   ├── rea-typography/                  # KineticSplitText & Typewriter Engines
│   ├── rea-captions/                    # Bouncy Spring Subtitles with Highlight Pills
│   └── rea-mockups/                     # Browser, Terminal & Mobile Mockup Frames
│
├── package.json                         # Workspace Dependencies
└── README.md                            # Comprehensive Architectural Guide
```

---

## ⚡ REA CLI Reference Manual

The `rea` CLI is the unified entrypoint for both human developers and autonomous AI agents:

```bash
node bin/rea-cli.js <command> [arguments...]
# Or link globally: npm link
rea <command> [arguments...]
```

### 🎬 Remotion Studio & Rendering Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`init`** | `rea init <project-name>` | Scaffolds a new TypeScript-enabled Remotion workspace with full REA integration. |
| **`add`** | `rea add <plugin-name>` | Injects modular visual plugins (`rea-particles`, `rea-transitions`, `rea-typography`, `rea-captions`, `rea-mockups`). |
| **`preview`** | `rea preview` | Launches live interactive Remotion Studio at `http://localhost:3000`. |
| **`validate`**| `rea validate [comp-id]` | Audits `src/Root.tsx`, `public/` directory, and all `staticFile()` imports. |
| **`render`** | `rea render <comp-id> [out.mp4]` | Runs pre-flight audit and compiles high-definition video via Chromium workers. |
| **`list-plugins`** | `rea list-plugins` | Displays the catalog of available visual plugins. |
| **`hook`** | `rea hook pre-render` | Intercepts agent tool calls before render execution to prevent runtime failures. |

### ✂️ Multimedia & FFmpeg Editing Commands (Bundled Engine)

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`cut`** | `rea cut <in.mp4> <start> <dur> [out.mp4] [--normalize]` | Slices raw video with frame-level accuracy using stream copy (zero quality loss); pass `--normalize` for EBU R128 loudness normalization (`-16 LUFS`). |
| **`probe`** | `rea probe <media-file>` | Deep telemetry inspection of video/audio streams, duration, resolution, codecs, and framerate. |
| **`audio`** | `rea audio <in.mp4> [out.mp3]` | Extracts crystal-clear MP3 audio tracks from any video container. |
| **`still`** | `rea still <comp-id> [out.jpeg] [--frame=N]` | Renders a high-resolution still frame poster at any exact timestamp. |
| **`gif`** | `rea gif <comp-id> [out.gif] [--fps=15]` | Compiles an optimized animated GIF for documentation or social sharing. |

---

## 🎨 Supported Animation Styles & Production Showcase

REA natively supports a comprehensive library of motion graphic aesthetics and video styles:

### 1. 🌆 Cyberpunk Sci-Fi HUD & Telemetry
- **Description:** Hi-tech futuristic interface with differential multi-ring gyroscopes, typewriter telemetry, scanning laser beams, and glowing neon embers.
- **Key Techniques:** Concentric SVG rings rotating at differential speeds (`frame * 2.2`, `-frame * 3.1`), `NeonEmbers` particle fields, and `GlitchTransition`.
- **Showcase:** `cyber-hud-test/out-cyberpunk.mp4` (10s @ 30fps, 1920×1080).

### 2. 🍏 Minimalist Apple-Keynote SaaS Product Promo
- **Description:** Light-slate executive software launch video with 3D tilted glassmorphic dashboards, live ticking metrics, and kinetic typography.
- **Key Techniques:** 3D CSS perspective transforms (`perspective(1000px) rotateX(...) rotateY(...)`), high-damping `spring()` physics, SVG revenue curves drawing dynamically via `strokeDashoffset`, and `KineticSplitText`.
- **Showcase:** `saas-launch-promo/out-saas.mp4` (12s @ 30fps, 1920×1080).

### 3. 📰 Vox-Style Editorial Documentary Motion Graphics
- **Description:** Tactile newsprint aesthetic with bold highlighter-yellow callout boxes, brutalist borders, and animated data maps.
- **Key Techniques:** Zero-`Math.random()` deterministic film grain using SVG `<feTurbulence seed={(frame * 17 + 29) % 100}>`, transatlantic cable paths drawing via `interpolate()`, and spring-popping latency telemetry badges (`58.2 ms`).
- **Showcase:** `vox-cables/out-documentary.mp4` (8s @ 30fps, 1920×1080).

### 4. 📱 YouTube Shorts & Reels Vertical Code Walkthroughs (9:16)
- **Description:** Mobile-first technical reels designed for developer audience retention on YouTube Shorts, Instagram Reels, and TikTok.
- **Key Techniques:** Sleek macOS dark terminal, character-by-character typewriter code generation with blinking cursor, spring camera zoom (`1.35x`) and pan, selective code dimming (`opacity: 0.3`), and floating architectural callout badges.
- **Showcase:** `code-walkthrough-reel/out-vertical.mp4` (10s @ 30fps, 1080×1920).

### 5. 🎙 High-Retention Social Podcast Audiograms (1:1 Square)
- **Description:** Square social audiograms featuring a 48-bar radial audio spectrum visualizer and word-by-word synced subtitles.
- **Key Techniques:** Polar coordinate radial bars oscillating via layered trigonometric frame waves ($$Math.sin(frame \cdot 0.2 + i)$$), pulsating center dB meter (`-14.5 dB`), and `rea-captions` with bouncy spring scaling (`1.18x`) and electric cyan (`#00F5FF`) highlight pills.
- **Showcase:** `viral-audiogram/out-audiogram.mp4` (8s @ 30fps, 1080×1080).

### 6. 🎬 Multi-Scene Narrative Anime & Story Films
- **Description:** Complete cinematic narrative film pipeline editing raw generative video clips into structured multi-act movies.
- **Key Techniques:** Lossless batch trimming with `rea cut`, continuous monotonic audio/video stream concatenation, 2.35:1 anamorphic letterbox black bars, dynamic Act chapter markers, and bilingual subtitles (English & Hindi).
- **Showcase:** `pokevypar-edit/out-pokevypar-final.mp4` (79s, 1,896 frames @ 24fps, 1280×720).

---

## 🧩 Built-in REA Visual Plugin Catalog

```tsx
// 1. Procedural Cyberpunk Neon Embers
import { NeonEmbers } from '../plugins/rea-particles';
<NeonEmbers count={60} />

// 2. Glitch & Chromatic Channel Transition
import { GlitchTransition } from '../plugins/rea-transitions';
<GlitchTransition intensity={1.5}>
  <SceneContent />
</GlitchTransition>

// 3. Staggered Kinetic Split Character Typography
import { KineticSplitText } from '../plugins/rea-typography';
<KineticSplitText text="AUTONOMOUS AGENTS" delayPerLetter={2} />

// 4. Kinetic Word-by-Word Captions with Bouncy Highlight Pills
import { AnimatedCaptions } from '../plugins/rea-captions';
<AnimatedCaptions words={captionData} activeColor="#00f5ff" />

// 5. Clean Browser & Application Mockup Frames
import { BrowserMockup } from '../plugins/rea-mockups';
<BrowserMockup url="https://antigravity.google.dev">
  <Dashboard />
</BrowserMockup>
```

---

## 📜 The Deterministic Rendering Laws (AGENTS.md)

All agents operating in this repository adhere strictly to the following mandatory standards:

1. **Zero `Math.random()` Inside Render Loops:**
   Because Remotion renders frames out-of-order across parallel Chromium workers, `Math.random()` causes severe visual tearing and non-deterministic frames. All animations, particle drifts, and film grain seeds are derived mathematically using `frame`, `useVideoConfig()`, and trigonometric offsets.
2. **Spring Physics Over Linear CSS Transitions:**
   Linear CSS transitions fail to calculate sub-frame velocities accurately during frame-by-frame rendering. All transitions, scaling, and movements must use Remotion's `spring()` physics or `interpolate()` easing curves.
3. **Asset Governance via `staticFile()`:**
   Direct path strings (`../public/img.png`) break when bundled in production. All static assets must reside in `public/` and be referenced using `staticFile('asset.png')`.
4. **Pre-Render Interceptor Gate:**
   The `hooks/pre-render.json` lifecycle hook monitors all `rea render` and `remotion render` invocations, aborting immediately if missing assets or syntax violations are discovered.

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- Node.js 18.0.0 or higher
- Windows, macOS, or Linux (cross-platform compatible)

### Setup
```bash
# 1. Clone repository
git clone https://github.com/HamzaShaikhAI/Remotion-For-Antigravity.git
cd Remotion-For-Antigravity

# 2. Install workspace dependencies
npm install

# 3. Initialize a new project with the REA CLI
node bin/rea-cli.js init my-motion-project
cd my-motion-project

# 4. Add desired visual plugins
node ../bin/rea-cli.js add rea-typography
node ../bin/rea-cli.js add rea-transitions

# 5. Launch Remotion Studio Preview
node ../bin/rea-cli.js preview

# 6. Validate and Compile Video
node ../bin/rea-cli.js validate MainVideo
node ../bin/rea-cli.js render MainVideo out.mp4
```

---

## 🤖 Antigravity 2.0 Agent Workflow

When asking Google Antigravity to create a video:

```
User Prompt: "Create a 10-second vertical reel explaining Docker containers with terminal typing and zoom."
       │
       ▼
1. Agent generates Implementation Plan Artifact (.md)
       │
       ▼
2. Agent executes: rea init docker-reel
       │
       ▼
3. Agent writes deterministic React components in src/compositions/
       │
       ▼
4. Pre-Render Gatekeeper runs: rea validate
       │
       ▼
5. Agent renders asynchronously: rea render DockerReel out-vertical.mp4
       │
       ▼
6. Agent audits output via: rea probe out-vertical.mp4
       │
       ▼
7. Deliverable returned with embedded preview poster frame!
```

---

## 📄 License

Distributed under the **MIT License**. Created for the **Google Antigravity & AI Agent Ecosystem**.
Developed by **Hamza Shaikh** ([@HamzaShaikhAI](https://github.com/HamzaShaikhAI)).
