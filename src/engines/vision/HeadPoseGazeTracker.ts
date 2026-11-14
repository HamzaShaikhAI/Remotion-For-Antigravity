/**
 * 3D Head Pose Estimation & Gaze Redirection
 *
 * Tracks pitch, yaw, and roll angles of character faces across scene cuts,
 * enforcing mathematical eye contact and eyeline opposition across 180° battle cuts.
 */

export interface HeadPoseEuler {
  yawDeg: number; // Left (-) to Right (+)
  pitchDeg: number; // Down (-) to Up (+)
  rollDeg: number; // Tilt
}

export class HeadPoseGazeTracker {
  public static validateBattleEyelines(charAPose: HeadPoseEuler, charBPose: HeadPoseEuler): boolean {
    // If Char A is looking right (yaw > 0), Char B must be looking left (yaw < 0)
    return (charAPose.yawDeg > 0 && charBPose.yawDeg < 0) || (charAPose.yawDeg < 0 && charBPose.yawDeg > 0);
  }

  public static getRecommendedHorizontalFlip(targetPose: HeadPoseEuler, expectedLookingRight: boolean): boolean {
    const isCurrentlyLookingRight = targetPose.yawDeg > 0;
    return isCurrentlyLookingRight !== expectedLookingRight;
  }
}
