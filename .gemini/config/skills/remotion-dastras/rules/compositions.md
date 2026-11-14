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

---

## 5. Architectural Rules for 10+ Minute & Long-Form Videos (> 120 Seconds)

When total runtime exceeds 120 seconds (`durationInFrames > 120 * fps`), single-pass Chromium rendering risks Out-Of-Memory (OOM) crashes. Adhere strictly to the three long-form architectural rules:

### Rule 1: Manifest-Driven Multi-Act Setup in `src/Root.tsx`
Every act or chapter must be registered both inside the master `<Series>` and as its own standalone `<Composition>` inside a `<Folder name="Render-Segments">` using a single source-of-truth `ACTS_MANIFEST`:

```tsx
import { Composition, Folder, Series } from 'remotion';

export const ACTS_MANIFEST = [
  { id: 'Act1Paradox', component: Act1Paradox, durationInFrames: 777 },
  { id: 'Act2Proxy', component: Act2Proxy, durationInFrames: 753 },
  { id: 'Act3Compiler', component: Act3Compiler, durationInFrames: 857 },
  { id: 'Act4Batching', component: Act4Batching, durationInFrames: 647 },
  { id: 'Act5Conformance', component: Act5Conformance, durationInFrames: 658 },
  { id: 'Act6Mission', component: Act6Mission, durationInFrames: 480 },
] as const;

export const MasterDocumentary: React.FC = () => (
  <Series>
    {ACTS_MANIFEST.map(({ id, component: Comp, durationInFrames }) => (
      <Series.Sequence key={id} durationInFrames={durationInFrames}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

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

### Rule 2: Bound Every `<Audio>` in a Tight `<Sequence>`
Never mount audio elements at frame 0 if they trigger at a later frame. Always wrap them in an explicit sequence:
```tsx
// Good: Remotion unloads PCM audio buffer immediately after 30 frames
<Sequence from={420} durationInFrames={30}>
  <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
</Sequence>

// Bad: Keeps audio buffer in Chromium memory for the entire act
<Audio src={staticFile('sfx/pop.wav')} startFrom={420} />
```

### Rule 3: Cap Concurrency on Local Machines (`--concurrency=2`)
Always render long-form acts using `rea render-long --auto [out.mp4]` (or `rea render-long Act1,Act2... [out.mp4]`). REA automatically caps Chromium concurrency to `--concurrency=2`, rendering each Act in complete process isolation, flushing RAM between acts, and stitching them losslessly with bundled FFmpeg in seconds.

