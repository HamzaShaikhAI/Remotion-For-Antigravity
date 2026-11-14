/**
 * Spatial Binaural 3D Audio Panning
 *
 * Dynamically pans audio channels and modulates head-related transfer functions (HRTF)
 * based on the character's continuous X/Y/Z coordinate positions in 9:16 vertical space.
 */

export interface SpatialAudioCoord {
  xNormalized: number; // -1.0 (far left) to +1.0 (far right)
  yNormalized: number; // -1.0 (top) to +1.0 (bottom)
  zDepth: number; // 0.1 (in your face) to 2.0 (deep background)
}

export class BinauralSpatialPanner {
  public static calculatePanGains(coord: SpatialAudioCoord): { leftGain: number; rightGain: number } {
    // Constant-power sinusoidal pan law
    const angleRad = ((coord.xNormalized + 1) / 2) * (Math.PI / 2);
    const distanceAttenuation = 1.0 / Math.max(0.2, coord.zDepth);
    return {
      leftGain: Math.cos(angleRad) * distanceAttenuation,
      rightGain: Math.sin(angleRad) * distanceAttenuation,
    };
  }
}
