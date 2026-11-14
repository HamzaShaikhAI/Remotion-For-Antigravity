export type AspectRatioName = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';

export interface AspectPreset {
  name: AspectRatioName;
  width: number;
  height: number;
  fps: number;
  safePadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  recommendedFontScale: number;
}

export const ASPECT_PRESETS: Record<AspectRatioName, AspectPreset> = {
  '16:9': {
    name: '16:9',
    width: 1920,
    height: 1080,
    fps: 30,
    safePadding: { top: 60, bottom: 80, left: 80, right: 80 },
    recommendedFontScale: 1.0,
  },
  '9:16': {
    name: '9:16',
    width: 1080,
    height: 1920,
    fps: 60,
    safePadding: { top: 120, bottom: 280, left: 50, right: 100 }, // Safe zone for TikTok / Shorts UI buttons
    recommendedFontScale: 1.15,
  },
  '1:1': {
    name: '1:1',
    width: 1080,
    height: 1080,
    fps: 30,
    safePadding: { top: 60, bottom: 60, left: 60, right: 60 },
    recommendedFontScale: 0.95,
  },
  '4:5': {
    name: '4:5',
    width: 1080,
    height: 1350,
    fps: 30,
    safePadding: { top: 80, bottom: 100, left: 60, right: 60 },
    recommendedFontScale: 1.05,
  },
  '21:9': {
    name: '21:9',
    width: 2560,
    height: 1080,
    fps: 30,
    safePadding: { top: 60, bottom: 60, left: 160, right: 160 },
    recommendedFontScale: 1.1,
  },
};

export function detectAspectRatio(width: number, height: number): AspectRatioName {
  const ratio = width / height;
  if (ratio > 2.0) return '21:9';
  if (ratio > 1.5) return '16:9';
  if (ratio > 0.9 && ratio < 1.1) return '1:1';
  if (ratio > 0.7 && ratio <= 0.9) return '4:5';
  return '9:16';
}
