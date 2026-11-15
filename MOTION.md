# REA Motion Design Language & Specification (MOTION.md)

This document defines the studio-wide motion grammar, physics presets, and animation standards for Remotion and React UI components in this repository. All generated motion must strictly adhere to these tokens.

---

## 1. Timing & Duration Tokens

| Token | Duration (s) | Duration (ms) | Target Frame Count (@ 60 FPS) | Semantic Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `dur-instant` | `0.00s` | `0ms` | `0 frames` | Reduced motion, instant snaps |
| `dur-fast` | `0.12s` | `120ms` | `7 frames` | Micro-interactions, button presses, badge reveals |
| `dur-base` | `0.24s` | `240ms` | `14 frames` | Standard UI card reveals, tab switching, tooltips |
| `dur-slow` | `0.40s` | `400ms` | `24 frames` | Page transitions, bottom sheets, macro modals |
| `dur-deliberate`| `0.80s` | `800ms` | `48 frames` | Exploded view disassembly, camera perspective sweep |

---

## 2. Spring Physics Presets

Remotion renders frames deterministically. For all natural movements, spring physics are mandatory over linear curves.

```typescript
import { spring } from 'remotion';

// Usage: spring({ frame, fps, config: tokens.spring.snappy })
```

| Preset Name | Stiffness ($k$) | Damping ($c$) | Mass ($m$) | Overshoot Feel & Physical Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `spring.snappy` | `520` | `36` | `0.8` | Ultra-fast tactile UI feedback, zero perceived latency, crisp settle |
| `spring.sheet` | `380` | `32` | `1.0` | Heavy physical weight, natural drag resistance, gentle settle |
| `spring.cinematic`| `140` | `14` | `0.9` | Broadcast UI cards, 3D tilt reveals, glassmorphic hover |
| `spring.heavyCad` | `90` | `18` | `0.95` | Industrial caliper slides, precision technical measurement lockup |
| `spring.subseaDrone`| `160` | `22` | `1.2` | Fluid underwater resistance, robotic arm articulation, siphon deploy |
| `spring.explode` | `240` | `28` | `1.0` | Mechanical exploded view separation and magnetic re-docking |

---

## 3. Named Bezier Curves (When Tweening Is Required)

When mechanical duration-locking is required (e.g. video timecode bars):
- `--ease-enter`: `cubic-bezier(0.16, 1, 0.3, 1)` (Decelerating punch into view)
- `--ease-exit`: `cubic-bezier(0.7, 0, 0.84, 0)` (Accelerating sharp exit)
- `--ease-emphasis`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Elastic overshoot attention grabber)

---

## 4. Strict Studio Anti-Patterns (Prohibited in CI)

1. **NEVER use `transition: all`:** Always declare explicitly animated properties (`transform`, `opacity`, `filter`).
2. **NEVER animate reflow/layout properties:** Do not animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly. Use `transform: translate3d()` and `transform: scale()` to avoid browser/Chromium layout reflows.
3. **NEVER use raw milliseconds or arbitrary bezier curves:** Always reference tokens (`tokens.duration.*`, `tokens.ease.*`, or CSS `var(--dur-*)`).
4. **NO `Math.random()` in Render Loops:** Derive particle twinkles, noise, and jitter deterministically from `frame` and `useVideoConfig()`.

---

## 5. Accessibility & Reduced Motion

All interactive components must query `useReducedMotion()`. When active:
- Durations collapse to `0.01ms` (instant transitions).
- Spatial displacement transforms collapse to `0` or simple instant opacity cuts.
- Ambient camera loops and continuous turntable spins are halted.
