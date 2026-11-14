export interface DocEntry {
  title: string;
  signature: string;
  description: string;
  example: string;
  bestPractices: string[];
}

export const REMOTION_DOCS_INDEX: Record<string, DocEntry> = {
  spring: {
    title: "spring()",
    signature: "spring({ frame: number, fps: number, config?: SpringConfig, delay?: number }): number",
    description: "Calculates physics-based spring animation values deterministically from the current frame.",
    example: `const scale = spring({
  frame,
  fps,
  config: { damping: 12, mass: 0.5, stiffness: 100 },
});`,
    bestPractices: [
      "Never use linear CSS transitions; always prefer spring() for UI entrance animations.",
      "Lower damping (< 10) creates elastic bounciness; higher damping (> 15) creates smooth, cinematic deceleration.",
      "Zero Math.random(); derive all motion from the input frame number.",
    ],
  },
  interpolate: {
    title: "interpolate()",
    signature: "interpolate(input: number, inputRange: number[], outputRange: number[], options?: InterpolateOptions): number",
    description: "Maps an input value (usually frame) from an input range to an output range with optional clamping.",
    example: `const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});`,
    bestPractices: [
      "Always set extrapolateLeft: 'clamp' and extrapolateRight: 'clamp' to avoid coordinate drift.",
      "Use easing functions like Easing.bezier() inside options for non-linear speed ramps.",
    ],
  },
  sequence: {
    title: "<Sequence>",
    signature: "<Sequence from={number} durationInFrames={number} layout={'none' | 'absolute-fill'}>",
    description: "Shifts the time container of its children so frame 0 starts at 'from'.",
    example: `<Sequence from={30} durationInFrames={90}>
  <SceneTwo />
</Sequence>`,
    bestPractices: [
      "Inside a Sequence, useCurrentFrame() starts at 0 when the parent timeline reaches 'from'.",
      "Use layout='none' if you are positioning children manually with custom flex or grid styles.",
    ],
  },
  staticfiles: {
    title: "staticFile()",
    signature: "staticFile(relativePath: string): string",
    description: "Resolves a relative asset path located in the public/ folder to a valid URL in both dev preview and production renders.",
    example: `import { staticFile } from 'remotion';
<Audio src={staticFile('audio/phonk.mp3')} />
<Img src={staticFile('images/logo.png')} />`,
    bestPractices: [
      "Never import files directly from public/ using relative strings like '../public/image.png'.",
      "Always pass asset paths relative to public/ (e.g. staticFile('sfx/clash.wav')).",
    ],
  },
  usevideoconfig: {
    title: "useVideoConfig()",
    signature: "useVideoConfig(): { width: number, height: number, fps: number, durationInFrames: number, id: string }",
    description: "Hook providing metadata about the enclosing Composition.",
    example: `const { width, height, fps, durationInFrames } = useVideoConfig();`,
    bestPractices: [
      "Use width and height to build fully responsive layouts that adapt dynamically to 16:9, 9:16, or 1:1 ratios.",
    ],
  },
  paths: {
    title: "SVG Path Drawing",
    signature: "strokeDasharray={length} strokeDashoffset={dashOffset}",
    description: "Animates SVG stroke reveals using strokeDashoffset interpolation.",
    example: `const dashOffset = interpolate(frame, [0, 45], [1000, 0], { extrapolateRight: 'clamp' });
<path d="..." strokeDasharray={1000} strokeDashoffset={dashOffset} />`,
    bestPractices: [
      "Use SelfDrawingSvgPath from src/engines/diagramming for zero-config SVG self-drawing paths.",
    ],
  },
};

export class RemotionDocsLookup {
  public static query(term: string): DocEntry | null {
    const key = term.toLowerCase().replace(/[^a-z]/g, '');
    for (const [k, v] of Object.entries(REMOTION_DOCS_INDEX)) {
      if (k.includes(key) || key.includes(k) || v.title.toLowerCase().includes(key)) {
        return v;
      }
    }
    return null;
  }
}
