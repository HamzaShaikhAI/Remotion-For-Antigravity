/**
 * Multi-Track Dialogue Intercut & Breath Removal
 *
 * Scans audio speech tracks to remove dead air and unwanted mic breaths
 * while deliberately preserving intentional cinematic suspense gasps before beat clashing.
 */

export interface SpeechSegment {
  startSec: number;
  endSec: number;
  isCinematicInhale: boolean;
  rmsVolumeDb: number;
}

export class DialogueBreathCleaner {
  public static filterUnwantedSilence(segments: SpeechSegment[], minPauseThresholdSec: number = 0.25): SpeechSegment[] {
    return segments.filter((s) => s.isCinematicInhale || (s.endSec - s.startSec) >= minPauseThresholdSec);
  }

  public static getSilenceremoveFfmpegFilter(): string {
    return 'silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB:detection=peak';
  }
}
