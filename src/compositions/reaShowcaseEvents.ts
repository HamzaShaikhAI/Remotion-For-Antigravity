import { SfxCue } from '../engines/psychoacoustic/MicroSfxEngine.ts';

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
export const ACT1_FRAMES_PER_CHAR = 3; // 47 chars * 3 = 141 frames (ends at frame 156)
export const ACT1_ENTER_FRAME = 180;
export const ACT1_PIPELINE_CARD_FRAMES = [200, 220, 240, 260] as const;

export const ACT2_ENGINE_COUNT = 11;
export const ACT2_STEP_FRAMES = Math.floor(600 / ACT2_ENGINE_COUNT); // 54 frames per card

export const ACT3_DEMO_FULL_TEXT = 'KINETIC HYBRID 2.5D HIGH-RETENTION MASTER STORY';
export const ACT3_TYPE_START = 1110;
export const ACT3_TYPE_END = 1300;

export const ACT4_CI_COMMANDS = [
  { cmd: '> npx tsc --noEmit', result: '✔ 0 TypeScript errors', execFrame: 1738, passFrame: 1750 },
  { cmd: '> rea motion-lint', result: '✔ 294/294 files compliant with MOTION.md', execFrame: 1798, passFrame: 1810 },
  { cmd: '> rea audit-polish', result: '✔ 0 overflow warnings · 1.20 hits/s audio verified', execFrame: 1858, passFrame: 1870 },
  { cmd: '> rea lambda-render --multi-region', result: '✔ ap-south-1 → us-east-1 failover ready (<3s cold start)', execFrame: 1918, passFrame: 1930 },
] as const;
export const ACT4_PASS_BADGE_FRAME = 1995;

export const ACT5_BENTO_TILE_COUNT = 12;
export const ACT5_BENTO_START_POP = 2265;
export const ACT5_BENTO_STAGGER = 8;
export const ACT5_CTA_LOCKUP_FRAME = 2385;

/**
 * Generates an event-locked SfxCue[] timeline aligned 1:1 with every visual animation frame.
 */
export function buildReaShowcaseSfxTimeline(): SfxCue[] {
  const cues: SfxCue[] = [];

  // 1. Act 1: Keystroke clicks synced to every character reveal
  for (let i = 0; i < ACT1_PROMPT_TEXT.length; i += 2) {
    cues.push({
      frame: ACT1_TYPE_START + i * ACT1_FRAMES_PER_CHAR,
      sfx: 'mechanical_click',
      gain: 0.28 + (i % 3) * 0.04,
    });
  }

  // 2. Act 1: ENTER key slam + 4 Pipeline cards cascade
  cues.push({ frame: ACT1_ENTER_FRAME, sfx: 'impact_thud', gain: 0.72 });
  ACT1_PIPELINE_CARD_FRAMES.forEach((cardFrame, idx) => {
    cues.push({ frame: cardFrame, sfx: 'card_pop', gain: 0.58 + idx * 0.03 });
    cues.push({ frame: cardFrame + 6, sfx: 'bell_ding', gain: 0.24 });
  });

  // 3. Act 2: 11 Certified Engines 3D Coverflow transitions
  for (let i = 0; i < ACT2_ENGINE_COUNT; i++) {
    const slideFrame = ACT_BOUNDARIES.ACT2_ENGINES_START + i * ACT2_STEP_FRAMES;
    cues.push({ frame: slideFrame, sfx: 'whoosh_fast', gain: 0.45 });
    cues.push({ frame: slideFrame + 10, sfx: 'card_pop', gain: 0.52 });
  }

  // 4. Act 3: SafeTextContainer live typing + settle
  const charStep = (ACT3_TYPE_END - ACT3_TYPE_START) / ACT3_DEMO_FULL_TEXT.length;
  for (let i = 0; i < ACT3_DEMO_FULL_TEXT.length; i += 2) {
    cues.push({
      frame: Math.round(ACT3_TYPE_START + i * charStep),
      sfx: 'mechanical_click',
      gain: 0.24,
    });
  }
  cues.push({ frame: ACT3_TYPE_END + 5, sfx: 'paper_slide', gain: 0.55 });

  // 5. Act 4: CI Terminal command executions & green checkmark snaps
  ACT4_CI_COMMANDS.forEach((item) => {
    cues.push({ frame: item.execFrame, sfx: 'mechanical_click', gain: 0.36 });
    cues.push({ frame: item.passFrame, sfx: 'bell_ding', gain: 0.50 });
  });
  cues.push({ frame: ACT4_PASS_BADGE_FRAME, sfx: 'card_pop', gain: 0.68 });

  // 6. Act 5: 12-tile Bento Matrix staggered pop-in + CTA lockup
  for (let tile = 0; tile < ACT5_BENTO_TILE_COUNT; tile++) {
    cues.push({
      frame: ACT5_BENTO_START_POP + tile * ACT5_BENTO_STAGGER,
      sfx: 'card_pop',
      gain: 0.46 + (tile % 3) * 0.04,
    });
  }
  cues.push({ frame: ACT5_CTA_LOCKUP_FRAME, sfx: 'impact_thud', gain: 0.78 });
  cues.push({ frame: ACT5_CTA_LOCKUP_FRAME + 6, sfx: 'bell_ding', gain: 0.55 });

  return cues.sort((a, b) => (a.frame ?? 0) - (b.frame ?? 0));
}
