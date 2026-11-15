import React from 'react';

/**
 * REA Studio Visual Asset & Gradient Engine
 * 21 comprehensive categories of visual tokens, procedural gradients,
 * glassmorphic shaders, tactile textures, HUD overlays, and motion assets.
 */

// 1. Chromatic Meshes
export const chromaticMeshes = {
  oysterDawn: 'radial-gradient(circle at 18% 22%, rgba(245, 158, 130, 0.45) 0%, transparent 45%), radial-gradient(circle at 82% 16%, rgba(186, 215, 233, 0.40) 0%, transparent 40%), radial-gradient(circle at 35% 75%, rgba(209, 231, 214, 0.35) 0%, transparent 42%), radial-gradient(circle at 78% 70%, rgba(216, 207, 235, 0.45) 0%, transparent 50%), #F7F4EE',
  cyberpunkObsidian: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(236, 72, 153, 0.22) 0%, transparent 45%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.20) 0%, transparent 50%), #05070A',
  emeraldAurora: 'radial-gradient(circle at 15% 30%, rgba(16, 185, 129, 0.30) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(52, 211, 153, 0.25) 0%, transparent 40%), radial-gradient(circle at 50% 85%, rgba(6, 78, 59, 0.50) 0%, transparent 50%), #021B14',
  solarFlare: 'radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.45) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(239, 68, 68, 0.35) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(234, 179, 8, 0.30) 0%, transparent 40%), #180905',
  deepAbyss: 'radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.25) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.20) 0%, transparent 50%), #030712'
};

// 2. Radial Halos & Vignettes
export const radialHalos = {
  volumetricCenter: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
  goldenRadiance: 'radial-gradient(circle at 50% 35%, rgba(245, 158, 11, 0.30) 0%, rgba(217, 119, 6, 0.10) 45%, transparent 75%)',
  cyanBeacon: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.12) 40%, transparent 70%)',
  vignetteHeavy: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.75) 100%)',
  vignetteSubtle: 'radial-gradient(circle at 50% 50%, transparent 65%, rgba(0, 0, 0, 0.40) 100%)'
};

// 3. Linear Metallic Foils
export const linearMetals = {
  liquidChrome: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 25%, #94A3B8 50%, #475569 52%, #CBD5E1 75%, #FFFFFF 100%)',
  champagneGold: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 30%, #D97706 70%, #B45309 100%)',
  brushedTitanium: 'linear-gradient(180deg, #64748B 0%, #475569 35%, #334155 70%, #1E293B 100%)',
  roseGold: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 30%, #FB7185 70%, #BE123C 100%)',
  stealthTungsten: 'linear-gradient(135deg, #334155 0%, #1E293B 50%, #0F172A 100%)'
};

// 4. Conic Sweeps & Vortexes
export const conicSweeps = {
  radarScan: 'conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.45) 0deg, transparent 90deg, transparent 360deg)',
  prismaticSweep: 'conic-gradient(from 0deg at 50% 50%, #EF4444 0deg, #F59E0B 60deg, #10B981 120deg, #06B6D4 180deg, #6366F1 240deg, #EC4899 300deg, #EF4444 360deg)',
  goldAuraVortex: 'conic-gradient(from 45deg at 50% 50%, rgba(245, 158, 11, 0.6) 0deg, transparent 120deg, rgba(234, 179, 8, 0.4) 240deg, transparent 360deg)'
};

// 5. Glassmorphism Shaders
export const glassmorphism = {
  visionOSLight: {
    background: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(28px) saturate(190%)',
    WebkitBackdropFilter: 'blur(28px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
  },
  obsidianTerminal: {
    background: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    border: '1px solid rgba(51, 65, 85, 0.7)',
    boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  milkyFrosted: {
    background: 'rgba(248, 250, 252, 0.45)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)'
  }
};

// 6. Neumorphism Surfaces
export const neumorphism = {
  softExtrudedLight: {
    backgroundColor: '#E6EBF0',
    borderRadius: 24,
    boxShadow: '12px 12px 24px #C4C9CF, -12px -12px 24px #FFFFFF'
  },
  softPressedLight: {
    backgroundColor: '#E6EBF0',
    borderRadius: 24,
    boxShadow: 'inset 8px 8px 16px #C4C9CF, inset -8px -8px 16px #FFFFFF'
  },
  obsidianExtrudedDark: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    boxShadow: '10px 10px 22px #0B1120, -10px -10px 22px #31415B'
  }
};

// 7. Tactile Paper Textures
export const paperTextures = {
  recycledParchment: {
    backgroundColor: '#F7F4EE',
    backgroundImage: `radial-gradient(rgba(40, 30, 20, 0.08) 1px, transparent 0)`,
    backgroundSize: '24px 24px'
  },
  blueprintGrid: {
    backgroundColor: '#0F172A',
    backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.12) 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  },
  isometricGrid: {
    backgroundColor: '#0B1120',
    backgroundImage: `linear-gradient(30deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(150deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px)`,
    backgroundSize: '48px 28px'
  }
};

// 8. Halftone Dot Matrices
export const halftoneMatrices = {
  classicMangaDots: {
    backgroundImage: 'radial-gradient(circle, #000000 20%, transparent 20%)',
    backgroundSize: '16px 16px'
  },
  popArtCyanDots: {
    backgroundImage: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 25%, transparent 25%)',
    backgroundSize: '12px 12px'
  },
  phosphorRgbMatrix: {
    backgroundImage: 'linear-gradient(90deg, rgba(255,0,0,0.06) 0px, rgba(0,255,0,0.06) 2px, rgba(0,0,255,0.06) 4px, transparent 6px)',
    backgroundSize: '6px 100%'
  }
};

// 9. Scanlines & CRT Displays
export const scanlinesCrt = {
  horizontalScanlines: {
    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none' as const
  },
  retroArcadeCrt: {
    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5))',
    backgroundSize: '100% 6px',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)'
  }
};

// 10. Film Grain & Analog Noise
export const filmGrainOverlays = {
  analog35mmGrain: {
    opacity: 0.04,
    mixBlendMode: 'multiply' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  },
  vcrGlitchNoise: {
    opacity: 0.08,
    mixBlendMode: 'overlay' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05 0.95' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
  }
};

// 11. HUD Reticles & Crosshairs
export const hudReticles = {
  tacticalTarget: (size = 120, color = '#38BDF8') => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill={color} />
      <line x1="50" y1="2" x2="50" y2="18" stroke={color} strokeWidth="2" />
      <line x1="50" y1="82" x2="50" y2="98" stroke={color} strokeWidth="2" />
      <line x1="2" y1="50" x2="18" y2="50" stroke={color} strokeWidth="2" />
      <line x1="82" y1="50" x2="98" y2="50" stroke={color} strokeWidth="2" />
    </svg>
  ),
  cornerBrackets: (width = 240, height = 140, color = '#38BDF8') => (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path d={`M 0 24 L 0 0 L 24 0`} stroke={color} strokeWidth="3" />
      <path d={`M ${width - 24} 0 L ${width} 0 L ${width} 24`} stroke={color} strokeWidth="3" />
      <path d={`M 0 ${height - 24} L 0 ${height} L 24 ${height}`} stroke={color} strokeWidth="3" />
      <path d={`M ${width - 24} ${height} L ${width} ${height} L ${width} ${height - 24}`} stroke={color} strokeWidth="3" />
    </svg>
  )
};

// 12. Vector Badges & Stamps
export const vectorBadges = {
  verifiedPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 14px',
    borderRadius: 999,
    background: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.45)',
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.04em'
  },
  goldAwardStamp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 18px',
    borderRadius: 999,
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)',
    border: '1.5px solid #F59E0B',
    color: '#FDE68A',
    fontSize: 15,
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)'
  }
};

// 13. Lower Thirds
export const lowerThirds = {
  broadcastBar: {
    width: '100%',
    padding: '16px 28px',
    background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 75%, transparent 100%)',
    borderLeft: '6px solid #38BDF8',
    backdropFilter: 'blur(16px)'
  },
  minimalFloatingCard: {
    padding: '18px 24px',
    borderRadius: 16,
    background: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0 16px 40px -8px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  }
};

// 14. Callout Banners
export const calloutBanners = {
  warningRibbon: {
    padding: '12px 20px',
    borderRadius: 12,
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1.5px solid #EF4444',
    color: '#FCA5A5',
    fontWeight: 700
  },
  editorialQuoteCard: {
    padding: '24px 32px',
    borderRadius: 16,
    borderLeft: '4px solid #F59E0B',
    background: 'rgba(247, 244, 238, 0.95)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
  }
};

// 15. Geometric Frames & Borders
export const geometricFrames = {
  bentoCard: {
    borderRadius: 24,
    border: '1px solid rgba(226, 232, 240, 0.7)',
    background: '#FFFFFF',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden' as const
  },
  cyberChamferBorder: {
    borderRadius: '12px 0 12px 0',
    border: '1.5px solid #38BDF8',
    background: '#0F172A',
    boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
  }
};

// 16. Particle Emitters & Dust Presets
export const particlePresets = {
  goldenEmbers: {
    colors: ['#F59E0B', '#FBBF24', '#FDE68A', '#EF4444'],
    count: 36,
    speed: 1.2,
    sizeRange: [2, 6] as [number, number]
  },
  cyberSparks: {
    colors: ['#38BDF8', '#818CF8', '#C084FC', '#FFFFFF'],
    count: 48,
    speed: 2.0,
    sizeRange: [1, 4] as [number, number]
  },
  floatingDustMotes: {
    colors: ['rgba(255, 255, 255, 0.6)', 'rgba(245, 245, 245, 0.3)'],
    count: 24,
    speed: 0.4,
    sizeRange: [2, 5] as [number, number]
  }
};

// 17. Dividers & Rules
export const dividersRules = {
  glowingLaserRule: {
    height: 2,
    width: '100%',
    background: 'linear-gradient(90deg, transparent 0%, #38BDF8 50%, transparent 100%)',
    boxShadow: '0 0 12px #38BDF8'
  },
  subtleEditorialLine: {
    height: 1,
    width: '100%',
    background: 'linear-gradient(90deg, transparent 0%, rgba(100, 116, 139, 0.3) 50%, transparent 100%)'
  }
};

// 18. Data Gauges & Telemetry Meters
export const dataGauges = {
  circularProgress: (percent: number, size = 100, color = '#38BDF8', bg = '#1E293B') => {
    const radius = 40;
    const circ = 2 * Math.PI * radius;
    const strokeDash = circ * (percent / 100);
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke={bg} strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${strokeDash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800">
          {Math.round(percent)}%
        </text>
      </svg>
    );
  }
};

// 19. Button Presets
export const buttonPresets = {
  visionOSButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: 999,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.85) 100%)',
    color: '#0F172A',
    fontWeight: 800,
    fontSize: 16,
    boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.9)'
  },
  neonCyberButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: 12,
    background: '#0F172A',
    border: '1.5px solid #38BDF8',
    color: '#38BDF8',
    fontWeight: 800,
    fontSize: 16,
    boxShadow: '0 0 20px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.15)'
  }
};

// 20. Cinematic Mattes & Aspect Ratios
export const cinematicMats = {
  letterbox239: {
    topBar: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '12%',
      backgroundColor: '#000000',
      zIndex: 90
    },
    bottomBar: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: '12%',
      backgroundColor: '#000000',
      zIndex: 90
    }
  },
  roundedImaxGate: {
    position: 'absolute' as const,
    inset: 20,
    borderRadius: 36,
    border: '12px solid #000000',
    pointerEvents: 'none' as const,
    zIndex: 90
  }
};

// 21. Sticker Cutouts & Die-Cuts
export const stickerCutouts = {
  dieCutWhiteStroke: {
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 0 4px #FFFFFF)',
    transform: 'rotate(-3deg)'
  },
  translucentTapeStrip: {
    height: 28,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(4px)',
    transform: 'rotate(-4deg)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }
};

/**
 * Summary registry for all 21 categories
 */
export const visualAssetCategories = [
  'chromaticMeshes',
  'radialHalos',
  'linearMetals',
  'conicSweeps',
  'glassmorphism',
  'neumorphism',
  'paperTextures',
  'halftoneMatrices',
  'scanlinesCrt',
  'filmGrainOverlays',
  'hudReticles',
  'vectorBadges',
  'lowerThirds',
  'calloutBanners',
  'geometricFrames',
  'particlePresets',
  'dividersRules',
  'dataGauges',
  'buttonPresets',
  'cinematicMats',
  'stickerCutouts'
] as const;

export type VisualAssetCategory = typeof visualAssetCategories[number];
