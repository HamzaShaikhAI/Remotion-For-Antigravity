import { MicroSfxEngine, MicroSfxPreset, SfxCue } from './MicroSfxEngine.ts';

export interface DensityScheduleOptions {
  totalFrames: number;
  fps?: number;
  hitsPerSec?: number;
  presets: MicroSfxPreset[];
  baseVolume?: number;
  startFrame?: number;
}

/**
 * SfxDensityScheduler.ts
 * Deterministic Micro-SFX Cue Generator calibrated for high-dwell retention foley.
 * Standard calibration: 1.20 SFX hits/sec = 1 tactile sound every 25 frames @ 30 FPS.
 * Strictly deterministic (zero Math.random()) for reproducible frame-by-frame rendering.
 */
export class SfxDensityScheduler {
  public static readonly DEFAULT_HITS_PER_SEC = 1.20;
  public static readonly DEFAULT_FPS = 30;

  /**
   * Calculates the exact frame interval between tactile micro-SFX hits
   * @param fps Video framerate (default: 30)
   * @param hitsPerSec Target tactile event rate (default: 1.20 hits/sec)
   * @returns Frame interval (e.g. 25 frames @ 30 FPS)
   */
  public static calculateIntervalFrames(
    fps: number = this.DEFAULT_FPS,
    hitsPerSec: number = this.DEFAULT_HITS_PER_SEC
  ): number {
    return Math.max(1, Math.round(fps / hitsPerSec));
  }

  /**
   * Deterministically schedules an array of SfxCue points across a timeline
   */
  public static scheduleDensityCues(options: DensityScheduleOptions): SfxCue[] {
    const {
      totalFrames,
      fps = this.DEFAULT_FPS,
      hitsPerSec = this.DEFAULT_HITS_PER_SEC,
      presets,
      baseVolume = 0.6,
      startFrame = 0,
    } = options;

    if (!presets || presets.length === 0) {
      throw new Error('SfxDensityScheduler requires at least one MicroSfxPreset.');
    }

    const intervalFrames = this.calculateIntervalFrames(fps, hitsPerSec);
    const cues: SfxCue[] = [];

    let cueIndex = 0;
    for (let currentFrame = startFrame; currentFrame < totalFrames; currentFrame += intervalFrames) {
      // Deterministic pseudo-random seed derived from currentFrame and cueIndex
      const hash = (currentFrame * 1664525 + cueIndex * 1013904223 + 12345) >>> 0;
      const presetIdx = hash % presets.length;
      const selectedPreset = presets[presetIdx];

      // Subtle organic volume dynamics (±10% deterministic variation)
      const volumeVar = ((hash & 0xff) / 255 - 0.5) * 0.12;
      const volume = Math.min(1.0, Math.max(0.1, Number((baseVolume + volumeVar).toFixed(2))));

      const timeSec = Number((currentFrame / fps).toFixed(3));
      cues.push({
        timeSec,
        preset: selectedPreset,
        volume,
      });

      cueIndex++;
    }

    return cues;
  }

  /**
   * Generates tactile 2.5D paper cutout foley cues
   * Presets: paper_slide, card_pop, paper_tear, whoosh_fast, mechanical_click
   * Calibrated: 19 cues across 480 frames @ 30 FPS (1.20 hits/sec)
   */
  public static generatePaperFoleyCues(
    totalFrames: number = 480,
    fps: number = 30,
    baseVolume: number = 0.65
  ): SfxCue[] {
    const paperPresets: MicroSfxPreset[] = [
      'paper_slide',
      'card_pop',
      'paper_tear',
      'whoosh_fast',
      'mechanical_click',
    ];

    return this.scheduleDensityCues({
      totalFrames,
      fps,
      hitsPerSec: 1.20,
      presets: paperPresets,
      baseVolume,
      startFrame: 0,
    });
  }

  /**
   * Generates Western standoff & saloon tactical foley cues
   * Presets: whoosh_fast, impact_thud, card_pop, paper_slide, mechanical_click
   * Calibrated: 68 cues across 1684 frames @ 30 FPS (1.20 hits/sec)
   */
  public static generateWesternFoleyCues(
    totalFrames: number = 1684,
    fps: number = 30,
    baseVolume: number = 0.42
  ): SfxCue[] {
    const westernPresets: MicroSfxPreset[] = [
      'whoosh_fast',
      'impact_thud',
      'card_pop',
      'paper_slide',
      'mechanical_click',
    ];

    return this.scheduleDensityCues({
      totalFrames,
      fps,
      hitsPerSec: 1.20,
      presets: westernPresets,
      baseVolume,
      startFrame: 0,
    });
  }

  /**
   * Generates REA studio architecture tactile micro-SFX cues
   * Presets: mechanical_click, whoosh_fast, card_pop, paper_slide, impact_thud, bell_ding
   * Calibrated: 54 cues across 2700 frames @ 60 FPS (1.20 hits/sec)
   */
  public static generateArchitectureFoleyCues(
    totalFrames: number = 2700,
    fps: number = 60,
    baseVolume: number = 0.58
  ): SfxCue[] {
    const architecturePresets: MicroSfxPreset[] = [
      'mechanical_click',
      'whoosh_fast',
      'card_pop',
      'paper_slide',
      'impact_thud',
      'bell_ding',
    ];

    return this.scheduleDensityCues({
      totalFrames,
      fps,
      hitsPerSec: 1.20,
      presets: architecturePresets,
      baseVolume,
      startFrame: 0,
    });
  }

  /**
   * Synthesizes and writes the multi-track foley WAV file to disk
   */
  public static synthesizeToWav(
    cues: SfxCue[],
    totalFrames: number,
    outputPath: string,
    fps: number = 30,
    sampleRate: number = 44100
  ): string {
    const totalDurationSec = totalFrames / fps;
    return MicroSfxEngine.generateMultiTrackSfx(cues, totalDurationSec, outputPath, sampleRate);
  }
}
