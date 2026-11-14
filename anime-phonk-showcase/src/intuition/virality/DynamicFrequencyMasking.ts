export interface FrequencyMaskCommand {
  startTimeSec: number;
  durationSec: number;
  frequencyCenterHz: number; // e.g. 2500Hz (vocal presence)
  bandwidthHz: number; // e.g. 2000Hz (covers 1.5kHz - 3.5kHz)
  gainDb: number; // e.g. -6dB scoop
  ffmpegFilter: string;
}

/**
 * Dynamic Audio Frequency Masking Engine (TrackSpacer Vocal Scoop)
 * Scoops out 1kHz-4kHz vocal presence frequencies from the Phonk instrumental
 * only while characters speak, allowing voices to cut through cleanly without
 * sacrificing overall music volume or sub-bass pressure.
 */
export function calculateVocalScoopFilter(
  dialogueRanges: Array<{ start: number; duration: number }>
): FrequencyMaskCommand[] {
  return dialogueRanges.map((range) => {
    return {
      startTimeSec: range.start,
      durationSec: range.duration,
      frequencyCenterHz: 2500,
      bandwidthHz: 2000,
      gainDb: -6.0,
      ffmpegFilter: `equalizer=f=2500:t=q:w=1.2:g=-6:enable='between(t,${range.start.toFixed(2)},${(range.start + range.duration).toFixed(2)})'`,
    };
  });
}
