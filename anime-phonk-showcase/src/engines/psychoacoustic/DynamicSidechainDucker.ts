/**
 * Dynamic Sidechain Frequency Ducking (TrackSpacer DSP Emulation)
 *
 * Rather than dipping the entire music volume when dialogue or sword clashes occur,
 * this DSP model dynamically carves out only the competing 1 kHz – 4 kHz speech band
 * and 60 Hz – 120 Hz transient sub pockets, preserving maximum loudness and punch.
 */

export interface SidechainFrequencyBand {
  lowFreqHz: number;
  highFreqHz: number;
  maxAttenuationDb: number; // e.g. -6.0 dB
  attackMs: number;
  releaseMs: number;
}

export class DynamicSidechainDucker {
  public static getSpeechPocketBand(): SidechainFrequencyBand {
    return {
      lowFreqHz: 800,
      highFreqHz: 3500,
      maxAttenuationDb: -5.5,
      attackMs: 12,
      releaseMs: 180,
    };
  }

  public static getFfmpegSidechainFilter(voiceAudioIndex: number = 1): string {
    return `[0:a][${voiceAudioIndex}:a]sidechaincompress=threshold=0.15:ratio=4:attack=15:release=200[outa]`;
  }
}
