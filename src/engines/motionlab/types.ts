/**
 * Types & Schemas for Motion Lab Studio Engine (Engine XXIV)
 * High-polish 3D Glassmorphic Carousel, Bento App Grid, and Mascot Rig.
 */

export type MotionLabCategory = 'video' | 'motion' | '3d' | 'finish';

export type MotionLabVisualType =
  | 'code-editor'
  | 'film-strip'
  | 'spotlight'
  | 'camera-grid'
  | 'bezier-curve'
  | 'anime-stagger'
  | 'turntable'
  | 'design-taste'
  | 'threejs-grid'
  | 'blender-stage'
  | 'blender-mcp'
  | 'anatomy-rig'
  | 'comfyui-graph'
  | 'whisper-wave'
  | 'ffmpeg-funnel'
  | 'mediabunny-player';

export interface MotionLabCard {
  id: string; // e.g. "01"
  index: number; // 1..16
  title: string;
  repo: string;
  subtitle: string;
  category: MotionLabCategory;
  visualType: MotionLabVisualType;
  tag?: string;
  accentColor?: string;
}

export interface ActConfig {
  actNumber: string; // "01 / 04"
  title: string; // "Video"
  category: MotionLabCategory;
  skyTop: string;
  skyBottom: string;
  startFrame: number;
  durationFrames: number;
  featuredCardIndex: number; // 0..3 index within act
}

export interface MascotPose {
  x: number;
  y: number;
  scale: number;
  rotationDeg: number;
  expression: 'star' | 'wink' | 'happy' | 'neutral';
  action: 'idle' | 'jump' | 'turntable' | 'peek';
}

export const MOTION_LAB_CARDS: MotionLabCard[] = [
  // ACT 1: VIDEO (01 - 04)
  {
    id: '01',
    index: 1,
    title: 'HyperFrames',
    repo: 'heygen-com/hyperframes',
    subtitle: 'write HTML, render video, built for agents',
    category: 'video',
    visualType: 'code-editor',
    tag: 'REC',
    accentColor: '#f97316',
  },
  {
    id: '02',
    index: 2,
    title: 'Remotion',
    repo: 'remotion-dev/remotion',
    subtitle: 'build and render video in React',
    category: 'video',
    visualType: 'film-strip',
    accentColor: '#3b82f6',
  },
  {
    id: '03',
    index: 3,
    title: 'Remotion Skills',
    repo: 'remotion-dev/skills',
    subtitle: 'official video skills for agents',
    category: 'video',
    visualType: 'spotlight',
    accentColor: '#8b5cf6',
  },
  {
    id: '04',
    index: 4,
    title: 'OpenMontage',
    repo: 'calesthio/OpenMontage',
    subtitle: 'automated video montage engine',
    category: 'video',
    visualType: 'camera-grid',
    accentColor: '#10b981',
  },

  // ACT 2: MOTION (05 - 08)
  {
    id: '05',
    index: 5,
    title: 'GSAP Skills',
    repo: 'greensock/gsap-skills',
    subtitle: 'official GSAP skills: easing, timelines, scroll',
    category: 'motion',
    visualType: 'bezier-curve',
    tag: 'ease',
    accentColor: '#84cc16',
  },
  {
    id: '06',
    index: 6,
    title: 'Anime.js',
    repo: 'juliangarnier/anime',
    subtitle: 'timelines, easing, complex CSS',
    category: 'motion',
    visualType: 'anime-stagger',
    accentColor: '#ec4899',
  },
  {
    id: '07',
    index: 7,
    title: 'video-shotcraft',
    repo: 'Vincentwei1021/video-shotcraft',
    subtitle: 'cinematic product promos, 124 shot recipes',
    category: 'motion',
    visualType: 'turntable',
    tag: '120 fps',
    accentColor: '#f59e0b',
  },
  {
    id: '08',
    index: 8,
    title: 'Impeccable',
    repo: 'pbakaus/impeccable',
    subtitle: 'design taste, polish, UI aesthetics',
    category: 'motion',
    visualType: 'design-taste',
    accentColor: '#6366f1',
  },

  // ACT 3: 3D (09 - 12)
  {
    id: '09',
    index: 9,
    title: 'Three.js',
    repo: 'mrdoob/three.js',
    subtitle: '3D in the browser, on your GPU',
    category: '3d',
    visualType: 'threejs-grid',
    tag: 'PBR',
    accentColor: '#06b6d4',
  },
  {
    id: '10',
    index: 10,
    title: 'Blender',
    repo: 'blender/blender',
    subtitle: 'models, rigs, materials, geometry',
    category: '3d',
    visualType: 'blender-stage',
    accentColor: '#ea580c',
  },
  {
    id: '11',
    index: 11,
    title: 'Blender MCP',
    repo: 'ahujasid/mcp-for-blender',
    subtitle: 'agentic bridge for Blender',
    category: '3d',
    visualType: 'blender-mcp',
    accentColor: '#14b8a6',
  },
  {
    id: '12',
    index: 12,
    title: 'anatomy',
    repo: 'wheresryan22/anatomy',
    subtitle: 'procedural 3D anatomy and rigging',
    category: '3d',
    visualType: 'anatomy-rig',
    accentColor: '#d946ef',
  },

  // ACT 4: FINISH (13 - 16)
  {
    id: '13',
    index: 13,
    title: 'ComfyUI',
    repo: 'Comfy-Org/ComfyUI',
    subtitle: 'image and video generation pipeline',
    category: 'finish',
    visualType: 'comfyui-graph',
    accentColor: '#a855f7',
  },
  {
    id: '14',
    index: 14,
    title: 'faster-whisper',
    repo: 'SYSTRAN/faster-whisper',
    subtitle: 'captions from audio at 10x speed',
    category: 'finish',
    visualType: 'whisper-wave',
    accentColor: '#0ea5e9',
  },
  {
    id: '15',
    index: 15,
    title: 'FFmpeg',
    repo: 'FFmpeg/FFmpeg',
    subtitle: 'encode, convert and ship the MP4',
    category: 'finish',
    visualType: 'ffmpeg-funnel',
    accentColor: '#eab308',
  },
  {
    id: '16',
    index: 16,
    title: 'Mediabunny',
    repo: 'Vanilagy/mediabunny',
    subtitle: 'read, write, mux, demux audio & video',
    category: 'finish',
    visualType: 'mediabunny-player',
    accentColor: '#f43f5e',
  },
];
