// src/engines/kurzgesagt/types.ts

export interface NebulaBlob {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  radius: number; // in pixels
  color: string; // rgba or hex
  opacity: number;
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  depth: 0.12 | 0.35 | 0.6;
  isSparkle: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
}

export interface SunGranule {
  id: number;
  angle: number; // radians
  distance: number; // normalized 0 to 1 radius
  size: number;
  driftSpeed: number;
  phase: number;
}

export interface MascotProps {
  x?: number;
  y?: number;
  scale?: number;
  targetLookAt?: { x: number; y: number } | null;
  lookAtCamera?: boolean;
  costume?: 'astronaut' | 'pirate' | 'sunglasses';
  antennaBlinkRate?: number;
  squashStretch?: number;
  idleBobIntensity?: number;
  ambientFrame?: number;
}

export interface EarthRenderProps {
  radius?: number;
  tiltRad?: number;
  spinDegPerSec?: number;
  sunPosition?: { x: number; y: number };
  darknessProgress?: number; // 0 (full day) to 1 (full night)
  temperatureC?: number; // 15 down to -70
  frostProgress?: number; // 0 to 1
  frame?: number;
}

export interface CaptionPillProps {
  text: string;
  color?: '#8fd8e6' | '#ffd98a' | '#f8fafc' | string;
  letterSpacing?: number;
  entranceProgress?: number;
  style?: React.CSSProperties;
}

export interface DualClock {
  ambientFrame: number;
  storyFrame: number;
}
