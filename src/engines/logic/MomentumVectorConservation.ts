/**
 * Momentum & Vector Conservation Engine
 *
 * Enforces continuity of motion velocity and direction across cuts.
 * If Scene A moves left-to-right at 45 px/frame, Scene B must maintain consistent momentum.
 */

export interface MotionVelocityVector {
  clipId: string;
  speedPixelsPerFrame: number;
  direction: 'left_to_right' | 'right_to_left' | 'top_to_bottom' | 'bottom_to_top' | 'axial_zoom';
}

export interface MomentumAuditResult {
  isConserved: boolean;
  momentumLossPercent: number;
  flowScore: number; // 0 to 100
  warning?: string;
}

export class MomentumVectorConservation {
  public static auditCut(
    vectorA: MotionVelocityVector,
    vectorB: MotionVelocityVector
  ): MomentumAuditResult {
    // If direction abruptly reverses without an axial zoom or clash stop
    if (vectorA.direction !== vectorB.direction && vectorB.direction !== 'axial_zoom') {
      const opposingDirections =
        (vectorA.direction === 'left_to_right' && vectorB.direction === 'right_to_left') ||
        (vectorA.direction === 'right_to_left' && vectorB.direction === 'left_to_right');

      if (opposingDirections) {
        return {
          isConserved: false,
          momentumLossPercent: 100,
          flowScore: 25,
          warning: `Opposing Vector Clash: ${vectorA.clipId} was moving ${vectorA.direction.replace(/_/g, ' ')}, but ${vectorB.clipId} abruptly reverses to ${vectorB.direction.replace(/_/g, ' ')}. Breaks kinetic flow.`,
        };
      }
    }

    const speedDiff = Math.abs(vectorA.speedPixelsPerFrame - vectorB.speedPixelsPerFrame);
    const speedRatio = Math.max(vectorA.speedPixelsPerFrame, vectorB.speedPixelsPerFrame) > 0
      ? speedDiff / Math.max(vectorA.speedPixelsPerFrame, vectorB.speedPixelsPerFrame)
      : 0;

    const loss = Math.min(100, Math.round(speedRatio * 100));
    const flowScore = Math.max(0, 100 - loss);

    return {
      isConserved: loss <= 35,
      momentumLossPercent: loss,
      flowScore,
    };
  }
}
