/**
 * Facial Emotion Recognition (FER) Micro-Sync
 *
 * Scans video frames for micro-expressions (eyebrow flare, pupil dilation, teeth grit,
 * smirk) and mathematically locks dramatic axial zoom punches onto the peak emotional frame.
 */

export interface EmotionFrameTelemetry {
  frame: number;
  dominantEmotion: 'rage' | 'smirk' | 'shock' | 'focus' | 'despair';
  intensity: number; // 0.0 to 1.0
  pupilExpansionFactor: number;
  eyebrowTension: number;
}

export class FacialEmotionMicroSync {
  public static findClimaxEmotionFrame(frames: EmotionFrameTelemetry[]): EmotionFrameTelemetry | null {
    if (frames.length === 0) return null;
    return frames.reduce((prev, curr) => (curr.intensity > prev.intensity ? curr : prev));
  }

  public static calculateZoomPunchScale(emotion: EmotionFrameTelemetry): number {
    switch (emotion.dominantEmotion) {
      case 'rage':
        return 1.0 + emotion.intensity * 0.35; // Sharp punch-in
      case 'smirk':
        return 1.0 + emotion.intensity * 0.18; // Subtle menacing crawl
      case 'shock':
        return 1.0 - emotion.intensity * 0.15; // Whiplash pull-back
      default:
        return 1.15;
    }
  }
}
