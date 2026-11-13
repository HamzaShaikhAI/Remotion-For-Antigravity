# REA Plugin Catalog & Usage Guide

This document defines the custom modular plugins available in the **Remotion Engine for Antigravity (REA)** repository. When writing React compositions, the Antigravity agent must import components directly from these local plugin paths.

---

## 1. rea-particles (`NeonEmbers`)
Provides procedurally generated, glowing neon sparks and floating embers with optional interactive mouse physics.

* **Import path:** `import { NeonEmbers } from '../plugins/rea-particles';`
* **Props:**
  * `count` (number, default: `50`): Total number of particles rendered in the container.
  * `interactive` (boolean, default: `true`): Enables real-time cursor repulsion physics inside the Remotion Studio preview.
* **Best Used For:** Ambient cyberpunk backgrounds, sci-fi HUD overlays, and depth layering behind text or UI cards.
* **Example Usage:**
  ```tsx
  <AbsoluteFill style={{ backgroundColor: '#050814' }}>
    <NeonEmbers count={70} interactive={true} />
  </AbsoluteFill>
  ```

---

## 2. rea-transitions (`GlitchTransition`)
Applies digital channel-shifting, scanline clip-paths, and cybernetic chromatic aberration to wrapper children.

* **Import path:** `import { GlitchTransition } from '../plugins/rea-transitions';`
* **Props:**
  * `intensity` (number, default: `1`): Multiplier controlling the pixel jitter and color channel separation offset.
* **Best Used For:** Scene intros, high-speed cuts between HUD sequences, and glitch impacts (natively triggers during the first 15 frames of the component mount).
* **Example Usage:**
  ```tsx
  <GlitchTransition intensity={1.5}>
    <SceneAgentConsole />
  </GlitchTransition>
  ```

---

## 3. rea-typography (`KineticSplitText`)
Splits plain text strings into individual character spans, animating them with staggered spring physics and rotation.

* **Import path:** `import { KineticSplitText } from '../plugins/rea-typography';`
* **Props:**
  * `text` (string, Required): The string content to split and animate.
  * `delayPerLetter` (number, default: `2`): Frame stagger delay between sequential letters.
  * `style` (React.CSSProperties, optional): Container font styling (`fontSize`, `fontWeight`, `color`, etc.).
* **Best Used For:** Cinematic titles, dynamic branding openers, and high-impact hero headers.
* **Example Usage:**
  ```tsx
  <KineticSplitText
    text="DASTRAS OS v2.0"
    delayPerLetter={3}
    style={{
      fontSize: '64px',
      fontFamily: 'Poppins, system-ui',
      color: '#00f5ff',
      fontWeight: 800,
    }}
  />
  ```

---

## 4. rea-mockups (`BrowserMockup`)
Vector-crisp browser containers, smartphones, and terminal frames for software product showcases.

* **Import path:** `import { BrowserMockup } from '../plugins/rea-mockups';`
* **Props:**
  * `title` (string, default: `'Antigravity Studio'`): Header window title.
  * `url` (string, default: `'https://antigravity.google.dev'`): URL bar string.
  * `children` (ReactNode): Content to embed inside the browser frame.
* **Example Usage:**
  ```tsx
  <BrowserMockup title="Agent Swarm Dashboard" url="https://antigravity.google.dev">
    <DashboardContent />
  </BrowserMockup>
  ```

---

## 5. rea-captions (`AnimatedCaptions`)
Kinetic word-by-word subtitle display with active timestamp synchronization.

* **Import path:** `import { AnimatedCaptions } from '../plugins/rea-captions';`
* **Props:**
  * `words` (CaptionWord[]): Array of `{ word, startInFrames, endInFrames }`.
  * `activeColor` (string, default: `'#00f5ff'`): Glowing highlight color for the active spoken word.
  * `inactiveColor` (string, default: `'#94a3b8'`): Color for upcoming and previous words.
  * `fontSize` (number, default: `42`).
* **Example Usage:**
  ```tsx
  <AnimatedCaptions
    words={transcription}
    activeColor="#00f5ff"
    inactiveColor="#64748b"
  />
  ```
