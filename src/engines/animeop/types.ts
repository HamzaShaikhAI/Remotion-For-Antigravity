/**
 * Types & Timing Contracts for Anime Opening & J-Pop Idol Rock Music Video Engine (Engine XXVI)
 * Calibrated for 175 BPM high-energy J-Pop idol rock at 24.00 FPS anime cinematic framerate.
 */

export interface AnimeOpBeatTiming {
  bpm: number; // 175 BPM
  fps: number; // 24.00 FPS
  secondsPerBeat: number; // ~0.3428s
  framesPerBeat: number; // ~8.228 frames
  framesPerBar: number; // ~32.91 frames (4 beats)
}

export const ANIME_OP_175BPM: AnimeOpBeatTiming = {
  bpm: 175,
  fps: 24,
  secondsPerBeat: 60 / 175, // 0.342857
  framesPerBeat: 24 * (60 / 175), // 8.22857
  framesPerBar: 24 * (60 / 175) * 4, // 32.91428
};

export type AnimePixelAction = 'ready' | 'run' | 'dance' | 'wave' | 'crouch';

export interface AnimeKineticLyricLine {
  id: string;
  japanese: string;
  english?: string;
  startFrame: number;
  durationFrames: number;
  type: 'title' | 'kanji-slam' | 'subtitle' | 'glitch-bar' | 'ready';
  kanjiImpactChar?: string;
  color?: string;
}

export const ANIME_OP_LYRICS: AnimeKineticLyricLine[] = [
  {
    id: 'ready',
    japanese: 'READY?',
    startFrame: 0,
    durationFrames: 72,
    type: 'ready',
    color: '#ffffff',
  },
  {
    id: 'title-open',
    japanese: 'SPARKLING IDOL RUN!',
    english: 'スパークリング・アイドル・ラン',
    startFrame: 72,
    durationFrames: 140,
    type: 'title',
    color: '#facc15',
  },
  {
    id: 'verse-1',
    japanese: 'この瞬間を、',
    english: 'THIS MOMENT',
    startFrame: 380,
    durationFrames: 90,
    type: 'subtitle',
    color: '#ffffff',
  },
  {
    id: 'kanji-todoke',
    japanese: '届け！',
    startFrame: 470,
    durationFrames: 70,
    type: 'kanji-slam',
    kanjiImpactChar: '届',
    color: '#ffffff',
  },
  {
    id: 'kanji-shissou',
    japanese: '全力疾走！',
    startFrame: 540,
    durationFrames: 80,
    type: 'kanji-slam',
    kanjiImpactChar: '疾',
    color: '#ffffff',
  },
  {
    id: 'chorus-run',
    japanese: 'RUN!',
    startFrame: 660,
    durationFrames: 120,
    type: 'title',
    color: '#facc15',
  },
  {
    id: 'glitch-sparkling',
    japanese: 'SPARKLING!!',
    startFrame: 780,
    durationFrames: 90,
    type: 'glitch-bar',
    color: '#ffffff',
  },
  {
    id: 'end-card',
    japanese: 'SPARKLING IDOL RUN!',
    english: 'THANKS FOR WATCHING',
    startFrame: 870,
    durationFrames: 90,
    type: 'title',
    color: '#facc15',
  },
];
