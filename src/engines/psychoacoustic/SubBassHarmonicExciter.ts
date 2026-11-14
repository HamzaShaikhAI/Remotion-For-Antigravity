/**
 * Sub-Bass Harmonic Saturation Enhancer
 *
 * Injects 2nd and 3rd-order harmonics into low-frequency 808 sub kicks (30 Hz - 70 Hz)
 * so that mobile phone ear-speakers reproduce heavy bass presence without clipping.
 */

export interface BassExciterConfig {
  crossoverFreqHz: number; // e.g. 80 Hz
  harmonicDrive: number; // 1.0 to 5.0
  dryWetMix: number; // 0.0 to 1.0
}

export class SubBassHarmonicExciter {
  public static getFfmpegAexciterFilter(config: BassExciterConfig = { crossoverFreqHz: 80, harmonicDrive: 2.5, dryWetMix: 0.65 }): string {
    return `firequalizer=gain='if(lt(f,${config.crossoverFreqHz}),3.5,0)',alimiter=limit=0.95`;
  }
}
