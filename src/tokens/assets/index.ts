/**
 * REA Master Studio Asset Registry
 * Unifies 515+ Vector Brand & Tech Logos, 131+ Studio-Grade Sound Effects,
 * 10 High-Production Background Music Tracks, 21 Typography Presets,
 * and 21 Categories of Gradients, Glass Shaders, and Overlays.
 */

import { LOGO_DEFINITIONS, BrandLogoName, BrandLogo, getLogosByCategory, searchLogos } from '../logos';
import { TYPOGRAPHY_PRESETS, TypographyPresetName, getTypographyPreset, listTypographyPresets } from '../typography';
import * as gradients from '../gradients';

export interface AssetLibrarySummary {
  logosCount: number;
  sfxCount: number;
  musicTracksCount: number;
  typographyPresetsCount: number;
  gradientCategoriesCount: number;
  categories: {
    logos: string[];
    typography: string[];
    gradients: string[];
  };
}

export function getAssetLibraryStats(): AssetLibrarySummary {
  const logosCount = Object.keys(LOGO_DEFINITIONS).length;
  const sfxCount = 131; // 131 procedural WAV files in public/sfx/library/
  const musicTracksCount = 10; // 10 procedural WAV tracks in public/audio/music_library/
  const typographyPresetsCount = Object.keys(TYPOGRAPHY_PRESETS).length;
  const gradientCategoriesCount = gradients.visualAssetCategories.length;

  return {
    logosCount,
    sfxCount,
    musicTracksCount,
    typographyPresetsCount,
    gradientCategoriesCount,
    categories: {
      logos: [
        'AI & Machine Learning',
        'Video Editing & Creative Design',
        'Frameworks & Libraries',
        'Programming Languages',
        'Cloud & DevOps',
        'Databases & Storage',
        'Social Media & Video Platforms',
        'Hardware & Architecture',
        'Gaming & Game Engines',
        'Crypto & Web3',
        'Developer & HUD Icons'
      ],
      typography: [
        'Modern & Clean',
        'Editorial & Luxury',
        'Cyber & Technical',
        'Dynamic & Street',
        'Thematic & Retro'
      ],
      gradients: [...gradients.visualAssetCategories]
    }
  };
}

// Re-export sub-systems for unified imports
export * from '../logos';
export * from '../typography';
export * from '../gradients';
