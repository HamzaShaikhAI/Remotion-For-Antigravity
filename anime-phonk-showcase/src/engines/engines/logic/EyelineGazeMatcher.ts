/**
 * Eyeline & Gaze Matching Vectorization Engine
 *
 * Mathematically validates character eyeline vectors across cuts to ensure
 * reciprocal gaze angles (e.g., Character A at +35° matches Character B at -145°).
 */

export interface GazeVector {
  clipId: string;
  character: string;
  angleDegrees: number; // 0 = right, 90 = top, 180 = left, 270 = bottom
  elevation: 'high_angle' | 'neutral' | 'low_angle';
}

export interface GazeMatchAuditResult {
  isValidReciprocal: boolean;
  angleDiscrepancyDegrees: number;
  perceivedEyeContactScore: number; // 0 to 100
  recommendation: string;
}

export class EyelineGazeMatcher {
  /**
   * Computes whether two consecutive scene gazes form a valid reciprocal eyeline.
   */
  public static auditGazePair(gazeA: GazeVector, gazeB: GazeVector): GazeMatchAuditResult {
    // Exact reciprocal angle is (AngleA + 180) % 360
    const idealReciprocal = (gazeA.angleDegrees + 180) % 360;
    const diff = Math.abs(gazeB.angleDegrees - idealReciprocal);
    const normalizedDiff = Math.min(diff, 360 - diff);

    // Permissible margin of error in cinematic framing is +/- 25 degrees
    const isValid = normalizedDiff <= 25.0;
    const score = Math.max(0, Math.round(100 - (normalizedDiff / 45) * 50));

    let recommendation = 'Eyeline angles match reciprocal gaze axis perfectly.';
    if (!isValid) {
      recommendation = `Broken Eyeline: ${gazeA.character} is looking at ${gazeA.angleDegrees}° while ${gazeB.character} is at ${gazeB.angleDegrees}°. Mirror ${gazeB.clipId} horizontally or select a clip looking toward ${idealReciprocal}°.`;
    }

    return {
      isValidReciprocal: isValid,
      angleDiscrepancyDegrees: Number(normalizedDiff.toFixed(1)),
      perceivedEyeContactScore: score,
      recommendation,
    };
  }
}
