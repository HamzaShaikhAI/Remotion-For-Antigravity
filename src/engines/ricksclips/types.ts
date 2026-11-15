/**
 * Types & Contracts for RicksClips Hybrid 2.5D Western Storytelling Engine (Engine XXVIII)
 * Calibrated for 1080x1920 9:16 vertical shorts, 30.00 FPS, 56.13s duration.
 */

export type RicksClipsExpression =
  | 'neutral'
  | 'confident'
  | 'smug'
  | 'thinking'
  | 'shocked'
  | 'knockout';

export type WesternCostume = {
  hatColor: string;
  hatBandColor: string;
  vestColor: string;
  shirtColor: string;
  hasMustache: boolean;
  hasStraw: boolean;
  hasPoncho: boolean;
  hasBandolier: boolean;
  hasHolster: boolean;
};

export type CameraShotType =
  | 'DUTCH_BULLET'
  | 'STREET_STANDOFF'
  | 'CLOSEUP_SMUG'
  | 'THINKING_PUDDLE'
  | 'DOUBLE_KNOCKOUT'
  | 'SALOON_TABLE'
  | 'TELEGRAPH_MOONLIGHT';

export interface RicksClipsCaption {
  text: string;
  startFrame: number;
  durationFrames: number;
}

export const RICKSCLIPS_CAPTIONS: RicksClipsCaption[] = [
  { text: 'The golden', startFrame: 0, durationFrames: 24 },
  { text: 'rule', startFrame: 24, durationFrames: 22 },
  { text: 'of Wild West', startFrame: 46, durationFrames: 28 },
  { text: 'duels', startFrame: 74, durationFrames: 25 },
  { text: 'was to never', startFrame: 99, durationFrames: 26 },
  { text: 'draw first.', startFrame: 125, durationFrames: 35 },
  { text: 'even', startFrame: 160, durationFrames: 24 },
  { text: 'the deadliest', startFrame: 184, durationFrames: 30 },
  { text: 'gunslingers', startFrame: 214, durationFrames: 32 },
  { text: 'knew this.', startFrame: 246, durationFrames: 30 },
  { text: 'Because', startFrame: 276, durationFrames: 22 },
  { text: 'the second draw', startFrame: 298, durationFrames: 34 },
  { text: 'almost always', startFrame: 332, durationFrames: 32 },
  { text: 'wins.', startFrame: 364, durationFrames: 36 },
  { text: 'is that', startFrame: 400, durationFrames: 25 },
  { text: 'a trick?', startFrame: 425, durationFrames: 30 },
  { text: 'No, it is', startFrame: 455, durationFrames: 28 },
  { text: 'pure biology.', startFrame: 483, durationFrames: 34 },
  { text: 'When you decide', startFrame: 517, durationFrames: 32 },
  { text: 'to draw first,', startFrame: 549, durationFrames: 35 },
  { text: 'your brain', startFrame: 584, durationFrames: 24 },
  { text: 'has to think.', startFrame: 608, durationFrames: 32 },
  { text: 'reaction time', startFrame: 640, durationFrames: 34 },
  { text: 'is an involuntary', startFrame: 674, durationFrames: 36 },
  { text: 'reflex.', startFrame: 710, durationFrames: 32 },
  { text: 'the exact', startFrame: 742, durationFrames: 26 },
  { text: 'moment', startFrame: 768, durationFrames: 24 },
  { text: 'he moves,', startFrame: 792, durationFrames: 28 },
  { text: 'you react 21ms', startFrame: 820, durationFrames: 35 },
  { text: 'faster.', startFrame: 855, durationFrames: 32 },
  { text: 'in a duel,', startFrame: 887, durationFrames: 30 },
  { text: 'thinking', startFrame: 917, durationFrames: 26 },
  { text: 'gets you killed.', startFrame: 943, durationFrames: 38 },
  { text: 'So the next time', startFrame: 981, durationFrames: 36 },
  { text: 'you are tempted', startFrame: 1017, durationFrames: 35 },
  { text: 'never', startFrame: 1052, durationFrames: 25 },
  { text: 'be the one', startFrame: 1077, durationFrames: 30 },
  { text: 'to pull first.', startFrame: 1107, durationFrames: 35 },
  { text: 'Think before', startFrame: 1142, durationFrames: 32 },
  { text: 'you draw', startFrame: 1174, durationFrames: 30 },
  { text: 'anything.', startFrame: 1204, durationFrames: 35 },
  { text: 'and you might', startFrame: 1239, durationFrames: 30 },
  { text: 'survive.', startFrame: 1269, durationFrames: 45 },
];
