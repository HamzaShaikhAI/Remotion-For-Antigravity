/**
 * Cross-Platform Aspect Ratio Re-framing Agent
 *
 * Dynamically re-renders and positions typography, character focal bounding boxes,
 * and background letterbox outpainting for 9:16 (Shorts/TikTok/Reels), 1:1 (Square), and 16:9 (Longform).
 */

export interface AspectDimensions {
  width: number;
  height: number;
  aspectRatioLabel: '9:16' | '1:1' | '16:9';
  subtitleSafeMarginPercent: number;
}

export class MultiPlatformReframer {
  public static getDimensions(format: 'vertical' | 'square' | 'widescreen'): AspectDimensions {
    switch (format) {
      case 'square':
        return { width: 1080, height: 1080, aspectRatioLabel: '1:1', subtitleSafeMarginPercent: 10 };
      case 'widescreen':
        return { width: 1920, height: 1080, aspectRatioLabel: '16:9', subtitleSafeMarginPercent: 5 };
      case 'vertical':
      default:
        return { width: 1080, height: 1920, aspectRatioLabel: '9:16', subtitleSafeMarginPercent: 18 };
    }
  }
}
