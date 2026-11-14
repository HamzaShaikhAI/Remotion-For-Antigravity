/**
 * Action-Axis Continuity Tracker (180-Degree Rule Enforcement)
 *
 * Prevents viewer disorientation by auditing character vectors, gaze direction,
 * and attack vectors across consecutive cuts.
 */

export interface SceneVector {
  clipId: string;
  startFrame: number;
  endFrame: number;
  character: string;
  screenSide: 'left' | 'right' | 'center';
  motionVector: 'left_to_right' | 'right_to_left' | 'neutral_axial';
  shotType: 'close_up' | 'medium' | 'wide_clash' | 'insert';
}

export interface AxisViolation {
  previousClip: string;
  currentClip: string;
  frame: number;
  reason: string;
  suggestedFix: string;
}

export class ActionAxisContinuityTracker {
  private registeredScenes: SceneVector[] = [];

  public registerScene(scene: SceneVector): void {
    this.registeredScenes.push(scene);
    this.registeredScenes.sort((a, b) => a.startFrame - b.startFrame);
  }

  public auditContinuity(): { isValid: boolean; violations: AxisViolation[] } {
    const violations: AxisViolation[] = [];

    for (let i = 1; i < this.registeredScenes.length; i++) {
      const prev = this.registeredScenes[i - 1];
      const curr = this.registeredScenes[i];

      // If same character flips screen side between consecutive cuts without a wide or neutral shot
      if (
        prev.character === curr.character &&
        prev.screenSide !== 'center' &&
        curr.screenSide !== 'center' &&
        prev.screenSide !== curr.screenSide &&
        curr.shotType !== 'wide_clash'
      ) {
        violations.push({
          previousClip: prev.clipId,
          currentClip: curr.clipId,
          frame: curr.startFrame,
          reason: `180-Degree Rule Violation: ${prev.character} was positioned on the ${prev.screenSide} in ${prev.clipId}, but abruptly appears on the ${curr.screenSide} in ${curr.clipId}.`,
          suggestedFix: `Insert an axial neutral shot (e.g. wide_clash or head-on stare) between frames ${prev.endFrame} and ${curr.startFrame}, or mirror the clip horizontally.`,
        });
      }

      // If opposing attacks suddenly face the same direction (e.g., both attacking left-to-right)
      if (
        prev.character !== curr.character &&
        prev.motionVector !== 'neutral_axial' &&
        curr.motionVector !== 'neutral_axial' &&
        prev.motionVector === curr.motionVector &&
        curr.shotType !== 'wide_clash'
      ) {
        violations.push({
          previousClip: prev.clipId,
          currentClip: curr.clipId,
          frame: curr.startFrame,
          reason: `Attack Vector Collision: Both ${prev.character} and ${curr.character} are charging ${prev.motionVector.replace(/_/g, ' ')}. It appears they are running parallel rather than clashing.`,
          suggestedFix: `Flip motion vector of ${curr.character} using horizontal transform (scaleX: -1) to maintain opposing kinetic vectors.`,
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }
}
