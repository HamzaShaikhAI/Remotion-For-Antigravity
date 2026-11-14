/**
 * Cinematic Camera Deshaking & Horizon Reframing
 *
 * Removes low-frequency handheld micro-jitter from rip footage while preserving
 * high-velocity cinematic whips and forward impact lunges.
 */

export interface StabilizationProfile {
  shakinessScore: number; // 1 to 10
  smoothingWindowFrames: number;
  zoomCorrectionFactor: number; // 1.0 to 1.10
  preserveImpactKinematics: boolean;
}

export class CinematicStabilizer {
  public static calculateFfmpegVidstabTransform(profile: StabilizationProfile): string {
    const smoothing = profile.smoothingWindowFrames || 30;
    const zoom = profile.zoomCorrectionFactor || 1.04;
    return `vidstabtransform=smoothing=${smoothing}:optzoom=${zoom > 1 ? 1 : 0}:interpol=bicubic`;
  }
}
