# Remotion Composition Architecture & Lifecycle Rules

This guide defines the architectural standards for creating and maintaining Remotion compositions within the Antigravity REA ecosystem.

---

## 1. Composition Entry Point (`Root.tsx`)

Every REA video project registers compositions inside `src/Root.tsx`. Always define explicit dimensions, frame rates, and durations.

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './compositions/MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Welcome to DASTRAS',
          accentColor: '#38bdf8',
        }}
      />
    </>
  );
};
```

---

## 2. Core Animation Rules

### A. Frame-Driven State
- **Rule:** Never use standard React `useState` or `useEffect` timers (`setTimeout`, `setInterval`) to drive animations.
- **Implementation:** Always drive state using `useCurrentFrame()` and `useVideoConfig()`.

```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const AnimatedCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural spring motion
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  // Smooth opacity interpolation
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      Card Content
    </div>
  );
};
```

### B. Layout with `<AbsoluteFill>`
Always wrap full-canvas scenes in `<AbsoluteFill>`. Avoid absolute positioning without parent coordinate bounding:

```tsx
import { AbsoluteFill } from 'remotion';

export const Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>DASTRAS Motion Graphics</h1>
    </AbsoluteFill>
  );
};
```

---

## 3. Scene Sequencing: `<Sequence>` vs `<Series>`

- Use `<Sequence>` when positioning elements at absolute frame offsets or overlapping layers.
- Use `<Series>` when chaining scenes sequentially one after another without manual frame math.

```tsx
import { Series } from 'remotion';

export const StoryVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <IntroScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <FeatureScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <OutroScene />
      </Series.Sequence>
    </Series>
  );
};
```

---

## 4. Dynamic Data & `calculateMetadata`

When video content depends on external APIs, database entries, or dynamic props, never fetch inside component rendering. Use Remotion's `calculateMetadata` hook function:

```tsx
import { CalculateMetadataFunction } from 'remotion';

type Props = {
  endpointUrl: string;
  data?: any;
};

export const calculateVideoMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const response = await fetch(props.endpointUrl);
  const data = await response.json();

  return {
    durationInFrames: data.scenes.length * 90,
    props: {
      ...props,
      data,
    },
  };
};
```

Register in `Root.tsx`:
```tsx
<Composition
  id="DynamicVideo"
  component={DynamicVideo}
  calculateMetadata={calculateVideoMetadata}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    endpointUrl: 'https://api.example.com/video-spec',
  }}
/>
```
