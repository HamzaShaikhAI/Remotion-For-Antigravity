# Official Remotion Mastery & Architecture Standards

This rule instructs Google Antigravity agents on writing idiomatic, high-performance, and mathematically deterministic Remotion code matching and exceeding upstream standards.

---

## 1. Golden Rules of Deterministic Rendering
Remotion renders video frames concurrently and out-of-order across multi-core Chromium worker processes.

- **NEVER use non-deterministic state:**
  - ❌ `Math.random()`
  - ❌ `Date.now()` or `new Date()`
  - ❌ `performance.now()`
  - ❌ `window.setInterval` or `window.setTimeout`
  - ❌ Unmanaged React state or external mutations during frame render
- **ALWAYS derive state strictly from `frame` and `fps`:**
  - ✅ Derive pseudo-random particle locations using deterministic seed functions: `(index * 9301 + 49297) % 233280 / 233280`.
  - ✅ Derive all motion coordinates from `useCurrentFrame()` and `useVideoConfig()`.

---

## 2. Idiomatic Motion Physics (Spring Over Linear)
Never animate coordinates using raw linear CSS transitions. Always use Remotion's native `spring()` or `interpolate()`.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Snappy UI entry
const scale = spring({
  frame,
  fps,
  config: {
    damping: 14,
    mass: 0.8,
    stiffness: 100,
  },
});
```

---

## 3. Interpolation Curves & Clamping
When mapping `frame` to opacity, rotation, or translation:
- Always specify explicit `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` to prevent coordinate explosion.

```tsx
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

---

## 4. Asset Access & Zero-Config FFmpeg
- Never reference assets via raw file system paths or relative web paths like `../public/image.png`.
- Always import `staticFile` from `remotion`:
  ```tsx
  import { staticFile } from 'remotion';
  <Img src={staticFile('branding/logo.png')} />
  <Audio src={staticFile('audio/active-phonk.mp3')} volume={0.85} />
  ```

---

## 5. Composition Layout & Responsive Dimensions
- Always use `useVideoConfig()` to retrieve dynamic `width` and `height`.
- Wrap scene layers in `<AbsoluteFill>`:
  ```tsx
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    {/* Scene content */}
  </AbsoluteFill>
  ```
