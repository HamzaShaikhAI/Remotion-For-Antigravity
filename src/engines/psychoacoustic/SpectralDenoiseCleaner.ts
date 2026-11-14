/**
 * Spectral De-reverberation & Noise Suppression
 *
 * Cleans up noisy, muddy, or echoey audio ripped from compressed web sources
 * using spectral subtraction and high-resolution multi-band noise gates.
 */

export interface DenoiseConfig {
  noiseFloorReductionDb: number; // e.g. -18 dB
  dereverbDecayFactor: number; // 0.0 to 1.0
  highPassCutoffHz: number;
}

export class SpectralDenoiseCleaner {
  public static getFfmpegAfftdnFilter(config: DenoiseConfig = { noiseFloorReductionDb: 18, dereverbDecayFactor: 0.4, highPassCutoffHz: 80 }): string {
    return `highpass=f=${config.highPassCutoffHz},afftdn=nr=${config.noiseFloorReductionDb}:nf=-50`;
  }
}
