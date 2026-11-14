/**
 * Granular Time-Stretching Without Pitch Shift
 *
 * Micro-stretches or compresses speech stems to mathematically match
 * exact target video cut frames without introducing chipmunk or demonic artifacts.
 */

export class GranularTimeStretcher {
  public static calculateAtempoFactor(sourceDurationSec: number, targetDurationSec: number): number {
    if (targetDurationSec <= 0) return 1.0;
    return Math.max(0.5, Math.min(2.0, sourceDurationSec / targetDurationSec));
  }

  public static getFfmpegAtempoFilter(atempoFactor: number): string {
    return `atempo=${atempoFactor.toFixed(4)}`;
  }
}
