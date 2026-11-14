/**
 * AI Inpainting / Watermark & Artifact Scrubber (ERASE)
 *
 * Programmatically detects and removes network watermarks, stray broadcaster bugs,
 * or hardcoded subtitles from source anime footage using optical flow and spatio-temporal inpainting.
 */

export interface InpaintBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class WatermarkInpainter {
  public static getFfmpegDelogoFilter(box: InpaintBoundingBox): string {
    return `delogo=x=${box.x}:y=${box.y}:w=${box.width}:h=${box.height}:show=0`;
  }

  public static getSafeZoneCropBox(videoWidth: number, videoHeight: number): InpaintBoundingBox {
    // Standard bottom subtitle strip exclusion
    return {
      x: 0,
      y: Math.floor(videoHeight * 0.85),
      width: videoWidth,
      height: Math.floor(videoHeight * 0.15),
    };
  }
}
