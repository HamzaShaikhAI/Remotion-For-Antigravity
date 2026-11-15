import React from 'react';

/**
 * REA Studio Typography Presets & Style Engine
 * 21+ distinct typographic design styles engineered specifically for Remotion video compositions.
 * Designed to work seamlessly with SafeTextContainer to eliminate viewport overflow.
 */

export type TypographyPresetName =
  | 'swissIndustrial'
  | 'playfairEditorial'
  | 'cyberpunkTerminal'
  | 'phonkStreet'
  | 'visionOSGlass'
  | 'paperCutout'
  | 'retroArcade8Bit'
  | 'bauhausMinimal'
  | 'y2kAcid'
  | 'luxuryPrestige'
  | 'comicMangaPop'
  | 'monospaceBrutalist'
  | 'neumorphicSoft'
  | 'kurzgesagtExplainer'
  | 'subseaTelemetry'
  | 'westernOutlaw'
  | 'animeOpeningIdol'
  | 'liquidChromeEmblem'
  | 'nordicFrost'
  | 'vapourwaveAesthetic'
  | 'holographicPrism';

export interface TypographyStyleDefinition {
  name: TypographyPresetName;
  displayName: string;
  category: 'Modern & Clean' | 'Editorial & Luxury' | 'Cyber & Technical' | 'Dynamic & Street' | 'Thematic & Retro';
  fontFamily: string;
  fontWeight: React.CSSProperties['fontWeight'];
  letterSpacing: string;
  lineHeight: number | string;
  textTransform?: React.CSSProperties['textTransform'];
  style: React.CSSProperties;
  description: string;
}

export const TYPOGRAPHY_PRESETS: Record<TypographyPresetName, TypographyStyleDefinition> = {
  swissIndustrial: {
    name: 'swissIndustrial',
    displayName: 'Swiss Industrial Clean',
    category: 'Modern & Clean',
    fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1.05,
    textTransform: 'uppercase',
    description: 'High-density, bold geometric sans-serif engineered for maximum mobile dwell and instant readability.',
    style: {
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      fontWeight: 900,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
      textTransform: 'uppercase',
      color: '#FFFFFF',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.45)'
    }
  },

  playfairEditorial: {
    name: 'playfairEditorial',
    displayName: 'Playfair Editorial Serif',
    category: 'Editorial & Luxury',
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    description: 'Authoritative high-fashion editorial serif with graceful italic cadence and warm tone.',
    style: {
      fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      color: '#0F172A',
      fontStyle: 'normal'
    }
  },

  cyberpunkTerminal: {
    name: 'cyberpunkTerminal',
    displayName: 'Cyberpunk HUD Terminal',
    category: 'Cyber & Technical',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontWeight: 700,
    letterSpacing: '0.08em',
    lineHeight: 1.25,
    textTransform: 'uppercase',
    description: 'High-tech terminal telemetry with neon cyan glow and terminal tracking.',
    style: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontWeight: 700,
      letterSpacing: '0.08em',
      lineHeight: 1.25,
      textTransform: 'uppercase',
      color: '#38BDF8',
      textShadow: '0 0 12px rgba(56, 189, 248, 0.75), 0 0 24px rgba(56, 189, 248, 0.35)'
    }
  },

  phonkStreet: {
    name: 'phonkStreet',
    displayName: 'Phonk Street Drift',
    category: 'Dynamic & Street',
    fontFamily: "'Impact', 'Arial Black', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.02em',
    lineHeight: 0.95,
    textTransform: 'uppercase',
    description: 'Aggressive street drift aesthetic with intense 6px black stroke and bright yellow punch.',
    style: {
      fontFamily: "'Impact', 'Arial Black', sans-serif",
      fontWeight: 900,
      letterSpacing: '0.02em',
      lineHeight: 0.95,
      textTransform: 'uppercase',
      color: '#FACC15',
      WebkitTextStroke: '6px #000000',
      textShadow: '6px 6px 0px #000000'
    }
  },

  visionOSGlass: {
    name: 'visionOSGlass',
    displayName: 'VisionOS Frosted Glass',
    category: 'Modern & Clean',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
    fontWeight: 600,
    letterSpacing: '-0.03em',
    lineHeight: 1.2,
    description: 'Luminous Apple VisionOS frosted typography with soft specular highlight.',
    style: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.72) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
    }
  },

  paperCutout: {
    name: 'paperCutout',
    displayName: 'Tactile Paper Cutout',
    category: 'Thematic & Retro',
    fontFamily: "'Rockwell', 'Courier New', serif",
    fontWeight: 800,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
    description: 'Handcrafted stop-motion paper cutout letterforms with stamped tactile edge.',
    style: {
      fontFamily: "'Rockwell', 'Courier New', serif",
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.1,
      color: '#FBF8F1',
      textShadow: '3px 4px 0px rgba(40, 30, 20, 0.85)',
      filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.4))'
    }
  },

  retroArcade8Bit: {
    name: 'retroArcade8Bit',
    displayName: '8-Bit Retro Arcade',
    category: 'Thematic & Retro',
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    fontWeight: 900,
    letterSpacing: '0.04em',
    lineHeight: 1.4,
    textTransform: 'uppercase',
    description: 'Pixel-perfect 1980s arcade gaming typography with crisp stepped drop shadow.',
    style: {
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      fontWeight: 900,
      letterSpacing: '0.04em',
      lineHeight: 1.4,
      textTransform: 'uppercase',
      color: '#4ADE80',
      textShadow: '4px 4px 0px #064E3B, 8px 8px 0px #022C22'
    }
  },

  bauhausMinimal: {
    name: 'bauhausMinimal',
    displayName: 'Bauhaus Geometric Modern',
    category: 'Modern & Clean',
    fontFamily: "'Futura', 'Century Gothic', 'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    letterSpacing: '0.12em',
    lineHeight: 1.1,
    textTransform: 'uppercase',
    description: 'Constructivist geometric forms with wide track kerning and primary color balance.',
    style: {
      fontFamily: "'Futura', 'Century Gothic', 'Plus Jakarta Sans', sans-serif",
      fontWeight: 800,
      letterSpacing: '0.12em',
      lineHeight: 1.1,
      textTransform: 'uppercase',
      color: '#EF4444',
      borderLeft: '8px solid #3B82F6',
      paddingLeft: 16
    }
  },

  y2kAcid: {
    name: 'y2kAcid',
    displayName: 'Y2K Acid Chrome',
    category: 'Dynamic & Street',
    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 1.0,
    textTransform: 'uppercase',
    description: 'Psychedelic metallic chrome with multi-stop specular sheen and alien edge.',
    style: {
      fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 1.0,
      textTransform: 'uppercase',
      background: 'linear-gradient(180deg, #A855F7 0%, #EC4899 50%, #EAB308 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 0.75))'
    }
  },

  luxuryPrestige: {
    name: 'luxuryPrestige',
    displayName: 'Luxury Prestige Gold',
    category: 'Editorial & Luxury',
    fontFamily: "'Cinzel', 'Didot', 'Bodoni MT', serif",
    fontWeight: 700,
    letterSpacing: '0.18em',
    lineHeight: 1.25,
    textTransform: 'uppercase',
    description: 'High-jewelry gold foil typography with micro-refined kerning and high status.',
    style: {
      fontFamily: "'Cinzel', 'Didot', 'Bodoni MT', serif",
      fontWeight: 700,
      letterSpacing: '0.18em',
      lineHeight: 1.25,
      textTransform: 'uppercase',
      background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #F59E0B 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 4px 16px rgba(217, 119, 6, 0.35)'
    }
  },

  comicMangaPop: {
    name: 'comicMangaPop',
    displayName: 'Comic Manga Pop-Art',
    category: 'Dynamic & Street',
    fontFamily: "'Bangers', 'Impact', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.04em',
    lineHeight: 0.95,
    textTransform: 'uppercase',
    description: 'Explosive comic book impact with thick black contour and sunny pop shadow.',
    style: {
      fontFamily: "'Bangers', 'Impact', sans-serif",
      fontWeight: 900,
      letterSpacing: '0.04em',
      lineHeight: 0.95,
      textTransform: 'uppercase',
      color: '#FFFFFF',
      WebkitTextStroke: '5px #000000',
      textShadow: '6px 6px 0px #F97316'
    }
  },

  monospaceBrutalist: {
    name: 'monospaceBrutalist',
    displayName: 'Monospace Brutalist Code',
    category: 'Cyber & Technical',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    description: 'Raw developer terminal code block typography with stark monochromatic contrast.',
    style: {
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      color: '#F8FAFC',
      backgroundColor: '#0F172A',
      padding: '4px 12px',
      borderRadius: 6,
      border: '1px solid #334155'
    }
  },

  neumorphicSoft: {
    name: 'neumorphicSoft',
    displayName: 'Neumorphic Soft Emboss',
    category: 'Modern & Clean',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    description: 'Dual-shadow extruded physical UI typography emerging from the background plane.',
    style: {
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      color: '#E2E8F0',
      textShadow: '-3px -3px 6px rgba(255, 255, 255, 0.8), 3px 3px 6px rgba(148, 163, 184, 0.6)'
    }
  },

  kurzgesagtExplainer: {
    name: 'kurzgesagtExplainer',
    displayName: 'Kurzgesagt Friendly Explainer',
    category: 'Modern & Clean',
    fontFamily: "'Nunito', 'Quicksand', 'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    letterSpacing: '-0.01em',
    lineHeight: 1.15,
    description: 'Rounded, approachable educational typography with soft pill backing and punchy clarity.',
    style: {
      fontFamily: "'Nunito', 'Quicksand', 'Plus Jakarta Sans', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
      color: '#0F172A',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
    }
  },

  subseaTelemetry: {
    name: 'subseaTelemetry',
    displayName: 'Subsea Deep Telemetry',
    category: 'Cyber & Technical',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: 600,
    letterSpacing: '0.14em',
    lineHeight: 1.3,
    textTransform: 'uppercase',
    description: 'Subterranean marine research HUD style with phosphorescent aqua glow.',
    style: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontWeight: 600,
      letterSpacing: '0.14em',
      lineHeight: 1.3,
      textTransform: 'uppercase',
      color: '#2DD4BF',
      textShadow: '0 0 10px rgba(45, 212, 191, 0.85), 0 0 20px rgba(45, 212, 191, 0.4)'
    }
  },

  westernOutlaw: {
    name: 'westernOutlaw',
    displayName: 'Western Outlaw Woodcut',
    category: 'Thematic & Retro',
    fontFamily: "'Rye', 'Playfair Display', Georgia, serif",
    fontWeight: 900,
    letterSpacing: '0.06em',
    lineHeight: 1.05,
    textTransform: 'uppercase',
    description: 'Weathered frontier typography with spurred serif authority and dusty brass patina.',
    style: {
      fontFamily: "'Rye', 'Playfair Display', Georgia, serif",
      fontWeight: 900,
      letterSpacing: '0.06em',
      lineHeight: 1.05,
      textTransform: 'uppercase',
      color: '#F59E0B',
      WebkitTextStroke: '4px #451A03',
      textShadow: '5px 5px 0px #1E120A'
    }
  },

  animeOpeningIdol: {
    name: 'animeOpeningIdol',
    displayName: 'Anime Opening High-Energy',
    category: 'Dynamic & Street',
    fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif",
    fontWeight: 900,
    letterSpacing: '-0.02em',
    lineHeight: 0.95,
    textTransform: 'uppercase',
    description: 'Dynamic kinetic J-animation title styling with 8-degree forward tilt and radiant glow.',
    style: {
      fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif",
      fontWeight: 900,
      letterSpacing: '-0.02em',
      lineHeight: 0.95,
      textTransform: 'uppercase',
      transform: 'skewX(-8deg)',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 14px rgba(255, 107, 107, 0.55))'
    }
  },

  liquidChromeEmblem: {
    name: 'liquidChromeEmblem',
    displayName: 'Liquid Chrome Specular',
    category: 'Editorial & Luxury',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 1.0,
    textTransform: 'uppercase',
    description: 'Photorealistic fluid silver chrome with high-contrast reflection horizon line.',
    style: {
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 1.0,
      textTransform: 'uppercase',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 45%, #334155 50%, #94A3B8 55%, #FFFFFF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.8))'
    }
  },

  nordicFrost: {
    name: 'nordicFrost',
    displayName: 'Nordic Glacial Frost',
    category: 'Modern & Clean',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 300,
    letterSpacing: '0.22em',
    lineHeight: 1.3,
    textTransform: 'uppercase',
    description: 'Subtle Scandinavian minimalism with crystalline ice glow and wide ethereal breathing.',
    style: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontWeight: 300,
      letterSpacing: '0.22em',
      lineHeight: 1.3,
      textTransform: 'uppercase',
      color: '#E0F2FE',
      textShadow: '0 0 14px rgba(186, 230, 253, 0.85)'
    }
  },

  vapourwaveAesthetic: {
    name: 'vapourwaveAesthetic',
    displayName: '1984 Vapourwave Sunset',
    category: 'Thematic & Retro',
    fontFamily: "'Playfair Display', 'Brush Script MT', cursive, serif",
    fontWeight: 800,
    letterSpacing: '0.08em',
    lineHeight: 1.15,
    description: 'Nostalgic 80s mall aesthetic with hot magenta and cyan gradient split.',
    style: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 800,
      letterSpacing: '0.08em',
      lineHeight: 1.15,
      fontStyle: 'italic',
      background: 'linear-gradient(180deg, #FF71CE 0%, #01CDFE 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 12px rgba(255, 113, 206, 0.6))'
    }
  },

  holographicPrism: {
    name: 'holographicPrism',
    displayName: 'Holographic Prism Rainbow',
    category: 'Dynamic & Street',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    textTransform: 'uppercase',
    description: 'Prismatic iridescent foil with shimmering multi-wavelength color shift.',
    style: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 900,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, #F43F5E, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B, #F43F5E)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 16px rgba(139, 92, 246, 0.45))'
    }
  }
};

/**
 * Retrieve a typography preset by name, optionally merging custom style overrides.
 */
export function getTypographyPreset(
  presetName: TypographyPresetName,
  overrides?: React.CSSProperties
): React.CSSProperties {
  const preset = TYPOGRAPHY_PRESETS[presetName] || TYPOGRAPHY_PRESETS.swissIndustrial;
  return {
    ...preset.style,
    ...overrides
  };
}

/**
 * List all available typography preset names and their metadata.
 */
export function listTypographyPresets(): TypographyStyleDefinition[] {
  return Object.values(TYPOGRAPHY_PRESETS);
}
