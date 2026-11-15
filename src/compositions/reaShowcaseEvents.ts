import { StudioSfxType } from '../engines/psychoacoustic/StudioFoleyEngine.ts';

export const SHOWCASE_FPS = 60;
export const SHOWCASE_TOTAL_FRAMES = 2700;

export const ACT_BOUNDARIES = {
  ACT1_HOOK_START: 0,
  ACT2_ENGINES_START: 450,
  ACT3_POLISH_START: 1080,
  ACT4_CI_START: 1710,
  ACT5_BENTO_START: 2250,
} as const;

export const ACT1_PROMPT_TEXT = 'rea create "What if the Sun vanished?" --style=auto';
export const ACT1_TYPE_START = 15;
export const ACT1_FRAMES_PER_CHAR = 3;
export const ACT1_ENTER_FRAME = 180;
export const ACT1_PIPELINE_CARD_FRAMES = [200, 220, 240, 260] as const;

export const ACT2_ENGINE_COUNT = 11;
export const ACT2_STEP_FRAMES = Math.floor(600 / ACT2_ENGINE_COUNT); // 54 frames per card

export const ACT3_DEMO_FULL_TEXT = 'KINETIC HYBRID 2.5D HIGH-RETENTION MASTER STORY';
export const ACT3_TYPE_START = 1110;
export const ACT3_TYPE_END = 1260;

export const ACT4_CI_COMMANDS = [
  { cmd: '> npx tsc --noEmit', result: '✔ 0 TypeScript errors', execFrame: 1738, passFrame: 1754 },
  { cmd: '> rea motion-lint', result: '✔ 294/294 files compliant with MOTION.md', execFrame: 1798, passFrame: 1814 },
  { cmd: '> rea audit-polish', result: '✔ 0 overflow warnings · 1.20 hits/s audio verified', execFrame: 1858, passFrame: 1874 },
  { cmd: '> rea lambda-render --multi-region', result: '✔ ap-south-1 → us-east-1 failover ready (<3s cold start)', execFrame: 1918, passFrame: 1934 },
] as const;

export const ACT5_BENTO_TILE_COUNT = 12;
export const ACT5_BENTO_START_POP = 2265;
export const ACT5_BENTO_STAGGER = 8;
export const ACT5_CTA_LOCKUP_FRAME = 2520;

export interface StudioSfxCue {
  frame: number;
  sfx: StudioSfxType;
  gain: number;
}

/**
 * Generates an event-locked StudioSfxCue[] timeline aligned 1:1 with every visual animation frame.
 * Uses warm keycap thocks, velvet air sweeps, and warm marimba/wood UI pops.
 */
export function buildReaShowcaseStudioSfxTimeline(): StudioSfxCue[] {
  const cues: StudioSfxCue[] = [];

  // 1. Act 1: Warm mechanical keycap thocks synced to typing
  for (let i = 0; i < ACT1_PROMPT_TEXT.length; i += 2) {
    cues.push({
      frame: ACT1_TYPE_START + i * ACT1_FRAMES_PER_CHAR,
      sfx: 'keycap_thock',
      gain: 0.36 + (i % 3) * 0.04,
    });
  }

  // 2. Act 1: ENTER key slam + tactile card snap cascade
  cues.push({ frame: ACT1_ENTER_FRAME, sfx: 'sub_drop', gain: 0.85 });
  cues.push({ frame: ACT1_ENTER_FRAME + 2, sfx: 'card_snap', gain: 0.65 });

  ACT1_PIPELINE_CARD_FRAMES.forEach((cardFrame) => {
    cues.push({ frame: cardFrame, sfx: 'card_snap', gain: 0.60 });
    cues.push({ frame: cardFrame + 8, sfx: 'ui_confirm', gain: 0.38 });
  });

  // Act 1: Data pulse beam traveling down stages 01 -> 02 -> 03 -> 04
  const pulseBeats = [295, 335, 375, 415];
  pulseBeats.forEach((f) => {
    cues.push({ frame: f, sfx: 'ui_confirm', gain: 0.32 });
  });

  // Act 1 -> Act 2 Match-cut zoom transition
  cues.push({ frame: 446, sfx: 'velvet_whoosh', gain: 0.65 });

  // 3. Act 2: 11 Certified Engines 3D Coverflow transitions
  for (let i = 0; i < ACT2_ENGINE_COUNT; i++) {
    const slideFrame = ACT_BOUNDARIES.ACT2_ENGINES_START + i * ACT2_STEP_FRAMES;
    cues.push({ frame: slideFrame, sfx: 'velvet_whoosh', gain: 0.42 });
    cues.push({ frame: slideFrame + 12, sfx: 'card_snap', gain: 0.55 });
  }

  // Act 2 -> Act 3 Match-cut zoom transition
  cues.push({ frame: 1076, sfx: 'velvet_whoosh', gain: 0.65 });

  // 4. Act 3: SafeTextContainer live typing + container morph
  const charStep = (ACT3_TYPE_END - ACT3_TYPE_START) / ACT3_DEMO_FULL_TEXT.length;
  for (let i = 0; i < ACT3_DEMO_FULL_TEXT.length; i += 2) {
    cues.push({
      frame: Math.round(ACT3_TYPE_START + i * charStep),
      sfx: 'keycap_thock',
      gain: 0.30,
    });
  }
  cues.push({ frame: ACT3_TYPE_END + 10, sfx: 'card_snap', gain: 0.58 });

  // Live container width morph pulses
  cues.push({ frame: 1350, sfx: 'velvet_whoosh', gain: 0.38 });
  cues.push({ frame: 1440, sfx: 'ui_confirm', gain: 0.45 });
  cues.push({ frame: 1540, sfx: 'velvet_whoosh', gain: 0.38 });
  cues.push({ frame: 1640, sfx: 'ui_confirm', gain: 0.45 });

  // Act 3 -> Act 4 Match-cut zoom transition
  cues.push({ frame: 1706, sfx: 'velvet_whoosh', gain: 0.65 });

  // 5. Act 4: CI Terminal commands & warm marimba confirm pops
  ACT4_CI_COMMANDS.forEach((item) => {
    cues.push({ frame: item.execFrame, sfx: 'keycap_thock', gain: 0.45 });
    cues.push({ frame: item.passFrame, sfx: 'ui_confirm', gain: 0.58 });
  });

  // Lambda Worker Spawning telemetry & 100% completion
  cues.push({ frame: 1980, sfx: 'card_snap', gain: 0.52 });
  cues.push({ frame: 2060, sfx: 'ui_confirm', gain: 0.52 });
  cues.push({ frame: 2130, sfx: 'sub_drop', gain: 0.78 });

  // Act 4 -> Act 5 Match-cut zoom transition
  cues.push({ frame: 2246, sfx: 'velvet_whoosh', gain: 0.65 });

  // 6. Act 5: 12-tile Bento Matrix staggered pop-in + CTA lockup
  for (let tile = 0; tile < ACT5_BENTO_TILE_COUNT; tile++) {
    cues.push({
      frame: ACT5_BENTO_START_POP + tile * ACT5_BENTO_STAGGER,
      sfx: 'card_snap',
      gain: 0.48 + (tile % 3) * 0.03,
    });
  }

  // Diagonal shimmer sweeps
  cues.push({ frame: 2390, sfx: 'velvet_whoosh', gain: 0.32 });
  cues.push({ frame: 2460, sfx: 'velvet_whoosh', gain: 0.32 });

  // Final CTA lockup and button click
  cues.push({ frame: ACT5_CTA_LOCKUP_FRAME, sfx: 'sub_drop', gain: 0.88 });
  cues.push({ frame: ACT5_CTA_LOCKUP_FRAME + 8, sfx: 'ui_confirm', gain: 0.68 });

  return cues.sort((a, b) => a.frame - b.frame);
}
