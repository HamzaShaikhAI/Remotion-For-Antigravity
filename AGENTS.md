# Agent Architecture & Governance Rules (AGENTS.md)

This file defines the mandatory engineering standards and execution policies for AI agents working in this repository.

---

## 1. Tooling Directives
- **Remotion CLI Commands:** Never execute standard `npx remotion ...` commands directly. Always use the project's native `rea` CLI tool (`bin/rea-cli.js`).
- **Video Cutting & Trimming:** Always use `rea cut <in.mp4> <start> <duration> [out.mp4] [--normalize]` to leverage Remotion's isolated cross-platform FFmpeg engine without quality loss.
- **Media Telemetry:** Before modifying or cutting unknown video or audio files, run `rea probe <file>` to inspect codecs, framerate, and audio channels.

---

## 2. Deterministic Rendering Rules
- **No Math.random():** Remotion renders frames concurrently and out-of-order. Never introduce `Math.random()` inside render loops or React component bodies. Always derive particle states and positions deterministically using `frame`, `useVideoConfig()`, and particle index offsets.
- **Spring Over Linear:** All motion scaling, transitions, and translation coordinates must use Remotion's `spring()` physics or `interpolate()` curves. Never use linear CSS transitions.
- **Asset Access:** All assets in `public/` must be referenced using `staticFile('filename.ext')`. Direct path strings or relative imports (`../public/img.png`) are strictly forbidden.

---

## 3. Plugin Architecture Standards
- Modular visual plugins must reside in `src/plugins/<plugin-name>/` with an `index.tsx` component and an `index.ts` re-export.
- Plugins must not introduce unmanaged DOM side effects or window timers (`setInterval`, `setTimeout`).
- In Remotion Studio preview mode, interactive listeners (e.g. mouse physics) must clean up event listeners on unmount.

---

## 4. Pre-Render Validation Gate
- Always run `rea validate` before initiating a video render.
- The `hooks/pre-render.json` lifecycle hook intercepts all `run_command` executions matching `rea render` to verify that all assets and entry points are intact before Chromium workers are launched.
