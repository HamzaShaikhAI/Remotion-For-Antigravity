/**
 * Temporal Super-Resolution Upscaling (Real-ESRGAN / Anime-4K)
 *
 * Remasters 720p/1080p source anime clips into high-bitrate 4K (2160x3840)
 * with edge-directed super-resolution, removing compression artifacts before cutting.
 */

export interface SuperResolutionConfig {
  scaleFactor: 2 | 4;
  model: 'realesr-animevideov3' | 'realesrgan-x4plus' | 'anime4k-hd';
  denoiseStrength: number; // 0.0 to 1.0
  tileDimension?: number;
}

export interface UpscaleResult {
  sourcePath: string;
  outputPath: string;
  originalResolution: [number, number];
  targetResolution: [number, number];
  modelUsed: string;
  processingTimeMs: number;
}

export class TemporalSuperResolution {
  public static calculateTargetResolution(width: number, height: number, scale: 2 | 4): [number, number] {
    return [width * scale, height * scale];
  }

  public static getCommandFlags(config: SuperResolutionConfig): string[] {
    const flags = ['-s', String(config.scaleFactor), '-m', config.model];
    if (config.denoiseStrength > 0) {
      flags.push('-n', String(config.denoiseStrength));
    }
    if (config.tileDimension) {
      flags.push('-t', String(config.tileDimension));
    }
    return flags;
  }
}
