/**
 * Engine XXX: Living Animated Pixel Art Studio Engine Types
 * Based on Claude Fable 5.2 Pixel Art Animation Paradigm
 */

export interface PixelArtConfig {
  gridWidth: number;          // Native pixel grid width (e.g. 386)
  gridHeight: number;         // Native pixel grid height (e.g. 512)
  renderScale: number;        // Upscale factor (2x = 772x1024)
  fps: number;                // Strict 12 FPS loop clock
  paletteCount: number;       // Max ~100 sampled colors
  aspectRatio: string;        // Preserved source ratio (386:512)
}

export interface SliderControls {
  motionIntensity: number;    // Global animation rate & speed (0.0 - 2.0, default 1.0)
  environmentalMotion: number;// Rain density, wind branch sway, water chop (0.0 - 2.0, default 1.0)
  ambientEffects: number;     // Lantern pulse, shoji glow, firefly mist (0.0 - 2.0, default 1.0)
}

export interface RainParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  depth: number;
}

export interface SplashRing {
  x: number;
  y: number;
  phase: number;
}

export interface FireflyParticle {
  x: number;
  y: number;
  orbitRadius: number;
  freq: number;
  phase: number;
}

export interface PixelArtSceneProps {
  baseImageSrc?: string;
  sliders?: Partial<SliderControls>;
  isExporting?: boolean;
  recordingSeconds?: number;
  showControls?: boolean;
}
