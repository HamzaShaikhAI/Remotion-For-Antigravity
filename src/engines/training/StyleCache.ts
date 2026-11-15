import fs from 'fs';
import path from 'path';

export interface StyleBlueprint {
  name: string;
  archetype: 'tech' | 'paper-2.5d' | 'saas' | 'cinematic' | 'abstract' | 'kurzgesagt' | 'motion-lab' | 'cad-chrome' | 'anime-op' | 'robotics' | 'ricksclips' | 'gsap-lab' | 'pixel-art';
  springPhysics: {
    damping: number;
    stiffness: number;
    mass?: number;
  };
  fpsThrottle?: number;
  typography: {
    fontPrimary: string;
    fontAccent?: string;
    headlineWeight: number;
    letterSpacing?: number;
  };
  safeZones: {
    bottomClearancePx: number;
    rightMarginPx: number;
  };
  palette: {
    background: string;
    surface: string;
    border?: string;
    shadow?: string;
    accentColor?: string;
  };
  certifiedGrade: 'A+' | 'A';
  cachedAt: string;
}

const BUILTIN_STYLES: Record<string, StyleBlueprint> = {
  'tech-claude': {
    name: 'tech-claude',
    archetype: 'tech',
    springPhysics: { damping: 11, stiffness: 220, mass: 0.8 },
    typography: {
      fontPrimary: "'Inter', -apple-system, sans-serif",
      fontAccent: "'Playfair Display', serif",
      headlineWeight: 900,
      letterSpacing: 2,
    },
    safeZones: { bottomClearancePx: 280, rightMarginPx: 140 },
    palette: {
      background: '#090A0F',
      surface: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      accentColor: '#D97757',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'paper-2.5d': {
    name: 'paper-2.5d',
    archetype: 'paper-2.5d',
    springPhysics: { damping: 10, stiffness: 200, mass: 1.0 },
    fpsThrottle: 16,
    typography: {
      fontPrimary: "'Inter', sans-serif",
      fontAccent: 'monospace',
      headlineWeight: 900,
    },
    safeZones: { bottomClearancePx: 240, rightMarginPx: 80 },
    palette: {
      background: '#E4DFD5',
      surface: '#FAF7F2',
      border: '6px solid #EF4444',
      shadow: '8px 8px 0px #0F172A',
      accentColor: '#EF4444',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'cinematic-editorial': {
    name: 'cinematic-editorial',
    archetype: 'cinematic',
    springPhysics: { damping: 14, stiffness: 120, mass: 1.0 },
    typography: {
      fontPrimary: "'Inter', sans-serif",
      fontAccent: "'Georgia', serif",
      headlineWeight: 800,
    },
    safeZones: { bottomClearancePx: 200, rightMarginPx: 80 },
    palette: {
      background: '#0D0E15',
      surface: '#181A24',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      accentColor: '#38BDF8',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'kurzgesagt': {
    name: 'kurzgesagt',
    archetype: 'kurzgesagt',
    springPhysics: { damping: 14, stiffness: 180, mass: 0.9 },
    typography: {
      fontPrimary: "'Fredoka', 'Fredoka One', 'Comfortaa', -apple-system, sans-serif",
      fontAccent: "'Fredoka', -apple-system, sans-serif",
      headlineWeight: 700,
      letterSpacing: 4,
    },
    safeZones: { bottomClearancePx: 180, rightMarginPx: 120 },
    palette: {
      background: '#081d2c',
      surface: 'rgba(6, 20, 40, 0.62)',
      border: '1.5px solid rgba(255, 255, 255, 0.14)',
      shadow: '0 12px 36px rgba(0, 0, 0, 0.55)',
      accentColor: '#22d3ee',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'motion-lab': {
    name: 'motion-lab',
    archetype: 'motion-lab',
    springPhysics: { damping: 14, stiffness: 140, mass: 0.9 },
    typography: {
      fontPrimary: "'Plus Jakarta Sans', -apple-system, sans-serif",
      fontAccent: "'SF Mono', Menlo, Consolas, monospace",
      headlineWeight: 900,
      letterSpacing: -1,
    },
    safeZones: { bottomClearancePx: 220, rightMarginPx: 70 },
    palette: {
      background: '#b8b2e8',
      surface: 'rgba(255, 255, 255, 0.42)',
      border: '1.5px solid rgba(255, 255, 255, 0.75)',
      shadow: '0 36px 80px rgba(80, 50, 110, 0.25)',
      accentColor: '#f97316',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'cad-chrome': {
    name: 'cad-chrome',
    archetype: 'cad-chrome',
    springPhysics: { damping: 18, stiffness: 90, mass: 0.95 },
    typography: {
      fontPrimary: "'Plus Jakarta Sans', -apple-system, sans-serif",
      fontAccent: "'SF Mono', Menlo, Consolas, monospace",
      headlineWeight: 800,
      letterSpacing: -1.5,
    },
    safeZones: { bottomClearancePx: 200, rightMarginPx: 100 },
    palette: {
      background: '#05070a',
      surface: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: '0 24px 48px rgba(0, 0, 0, 0.85)',
      accentColor: '#ffffff',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'anime-op': {
    name: 'anime-op',
    archetype: 'anime-op',
    springPhysics: { damping: 11, stiffness: 180, mass: 0.8 },
    typography: {
      fontPrimary: "'Impact', 'Arial Black', sans-serif",
      fontAccent: "'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
      headlineWeight: 900,
      letterSpacing: 4,
    },
    safeZones: { bottomClearancePx: 140, rightMarginPx: 60 },
    palette: {
      background: '#dc2626',
      surface: '#fef3c7',
      border: '4px solid #000000',
      shadow: '8px 8px 0px #000000',
      accentColor: '#facc15',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'robotics': {
    name: 'robotics',
    archetype: 'robotics',
    springPhysics: { damping: 22, stiffness: 160, mass: 1.2 },
    typography: {
      fontPrimary: "'SF Mono', 'Courier New', monospace",
      fontAccent: "'Impact', 'Arial Black', sans-serif",
      headlineWeight: 900,
      letterSpacing: 1.5,
    },
    safeZones: { bottomClearancePx: 90, rightMarginPx: 40 },
    palette: {
      background: '#f8fafc',
      surface: '#ffffff',
      border: '1.5px solid #e2e8f0',
      shadow: '0 2px 6px rgba(0,0,0,0.03)',
      accentColor: '#ea580c',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'ricksclips': {
    name: 'ricksclips',
    archetype: 'ricksclips',
    springPhysics: { damping: 14, stiffness: 220, mass: 0.85 },
    typography: {
      fontPrimary: "'Montserrat', 'Impact', sans-serif",
      fontAccent: "'Arial Black', sans-serif",
      headlineWeight: 900,
      letterSpacing: 1.5,
    },
    safeZones: { bottomClearancePx: 260, rightMarginPx: 60 },
    palette: {
      background: '#ca8a04',
      surface: '#fef3c7',
      border: '5px solid #09090b',
      shadow: '0 8px 24px rgba(0,0,0,0.4)',
      accentColor: '#dc2626',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'gsap-lab': {
    name: 'gsap-lab',
    archetype: 'gsap-lab',
    springPhysics: { damping: 14, stiffness: 160, mass: 0.9 },
    typography: {
      fontPrimary: "'Plus Jakarta Sans', -apple-system, sans-serif",
      fontAccent: "'JetBrains Mono', 'Fira Code', monospace",
      headlineWeight: 900,
      letterSpacing: -1,
    },
    safeZones: { bottomClearancePx: 120, rightMarginPx: 60 },
    palette: {
      background: '#fdfbf7',
      surface: '#ffffff',
      border: '1.5px solid #e7e0d3',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      accentColor: '#ea580c',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
  'pixel-art': {
    name: 'pixel-art',
    archetype: 'pixel-art',
    springPhysics: { damping: 12, stiffness: 200, mass: 0.9 },
    fpsThrottle: 12,
    typography: {
      fontPrimary: "'JetBrains Mono', 'Courier New', monospace",
      fontAccent: "'Press Start 2P', monospace",
      headlineWeight: 800,
      letterSpacing: 1.0,
    },
    safeZones: { bottomClearancePx: 120, rightMarginPx: 60 },
    palette: {
      background: '#090b10',
      surface: '#111520',
      border: '1px solid #1e2638',
      shadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
      accentColor: '#f97316',
    },
    certifiedGrade: 'A+',
    cachedAt: new Date().toISOString(),
  },
};

export class StyleCache {
  private static cacheDir = path.resolve(process.cwd(), 'src/styles');

  /**
   * Retrieves a pre-certified style blueprint by name (built-in or from cache directory).
   */
  static getStyleBlueprint(name: string): StyleBlueprint {
    if (BUILTIN_STYLES[name]) {
      return BUILTIN_STYLES[name];
    }

    const customPath = path.join(this.cacheDir, `${name}.style.json`);
    if (fs.existsSync(customPath)) {
      try {
        return JSON.parse(fs.readFileSync(customPath, 'utf-8'));
      } catch (err: any) {
        console.warn(`⚠️ Failed to parse custom style "${name}": ${err.message}. Falling back to "tech-claude".`);
      }
    }

    return BUILTIN_STYLES['tech-claude'];
  }

  static load(name: string): StyleBlueprint {
    return this.getStyleBlueprint(name);
  }

  /**
   * Saves a newly fine-tuned AST and physics configuration into the reusable style cache.
   */
  static saveStyleBlueprint(blueprint: StyleBlueprint): string {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    const targetPath = path.join(this.cacheDir, `${blueprint.name}.style.json`);
    fs.writeFileSync(targetPath, JSON.stringify(blueprint, null, 2));
    console.log(`💾 [StyleCache] Reusable style blueprint saved: ${blueprint.name} -> ${targetPath}`);
    return targetPath;
  }

  static save(blueprint: StyleBlueprint): string {
    return this.saveStyleBlueprint(blueprint);
  }

  /**
   * Lists all available certified style blueprints.
   */
  static listAvailableStyles(): string[] {
    const custom: string[] = [];
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir).filter((f) => f.endsWith('.style.json'));
      custom.push(...files.map((f) => f.replace(/\.style\.json$/, '')));
    }
    return Array.from(new Set([...Object.keys(BUILTIN_STYLES), ...custom]));
  }
}
