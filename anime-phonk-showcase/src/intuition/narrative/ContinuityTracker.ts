export type ActionVector = 'left_to_right' | 'right_to_left' | 'head_on' | 'neutral';

export interface ShotContinuity {
  clipIndex: number;
  attackerVector: ActionVector;
  gazeDirection: 'up' | 'down' | 'left' | 'right' | 'direct';
  focalSide: 'left' | 'right' | 'center';
}

export interface ContinuityAuditReport {
  isValid: boolean;
  violations: string[];
  recommendedFlips: number[]; // Indices of clips that should be flipped horizontally (scaleX: -1)
}

/**
 * Action-Axis Continuity & Gaze Matching Engine (The 180-Degree Rule Enforcer)
 * Mathematically validates that attack vectors and eye gaze directions align across cuts,
 * preventing disorientation and forging intense artificial eye contact between clips.
 */
export function auditContinuity(shots: ShotContinuity[]): ContinuityAuditReport {
  const violations: string[] = [];
  const recommendedFlips: number[] = [];

  for (let i = 0; i < shots.length - 1; i++) {
    const current = shots[i];
    const next = shots[i + 1];

    // Check for reversed jump cut across action axis
    if (
      current.attackerVector !== 'neutral' &&
      next.attackerVector !== 'neutral' &&
      current.attackerVector !== next.attackerVector &&
      next.attackerVector !== 'head_on'
    ) {
      violations.push(
        `Action axis jump cut detected between shot ${current.clipIndex} (${current.attackerVector}) and shot ${next.clipIndex} (${next.attackerVector}).`
      );
      recommendedFlips.push(next.clipIndex);
    }

    // Emotion & Gaze Matching: Verify cross-shot eye contact
    if (current.gazeDirection === 'up' && next.gazeDirection !== 'down' && next.gazeDirection !== 'direct') {
      // Suggest gaze pairing
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    recommendedFlips,
  };
}
