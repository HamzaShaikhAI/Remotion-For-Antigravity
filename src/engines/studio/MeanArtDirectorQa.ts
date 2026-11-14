/**
 * "Mean Art Director" QA Agent (Hollywood Veteran Critic)
 *
 * Simulates a grumpy, veteran commercial editor who inspects composition telemetry
 * and rejects cheesy typography, excessive screen shakes, or unmotivated cuts.
 */

export interface DirectorReviewMetrics {
  compositionId: string;
  totalVfxScore: number;
  longestSceneSec: number;
  hookSpeedSec: number;
  contrastScore: number; // 0 to 100
}

export interface DirectorVerdict {
  approved: boolean;
  editorialGrade: 'A+' | 'B' | 'C-' | 'REJECT';
  critique: string;
  requiredChanges: string[];
}

export class MeanArtDirectorQa {
  public static critique(metrics: DirectorReviewMetrics): DirectorVerdict {
    const requiredChanges: string[] = [];

    if (metrics.hookSpeedSec > 1.2) {
      requiredChanges.push(`The hook took ${metrics.hookSpeedSec}s. In 2026, the viewer is already watching someone else. Cut to the face before 0.8s!`);
    }

    if (metrics.totalVfxScore > 100) {
      requiredChanges.push(`VFX score is ${metrics.totalVfxScore}. Stop vomiting RGB split and lightning on every beat. Let the audience breathe!`);
    }

    if (metrics.longestSceneSec > 3.5) {
      requiredChanges.push(`You left a shot hanging for ${metrics.longestSceneSec}s. This isn't a French arthouse film. Cut or insert an axial zoom.`);
    }

    if (metrics.contrastScore < 70) {
      requiredChanges.push(`Typography contrast is weak (${metrics.contrastScore}/100). The subtitles blend into the sparks. Add a drop shadow or invert luminance.`);
    }

    const approved = requiredChanges.length === 0;
    let grade: 'A+' | 'B' | 'C-' | 'REJECT' = 'A+';
    if (requiredChanges.length === 1) grade = 'B';
    else if (requiredChanges.length === 2) grade = 'C-';
    else if (requiredChanges.length >= 3) grade = 'REJECT';

    const critique = approved
      ? `Fine. Pacing is sharp, the typography has weight, and the drop actually feels earned. Ship it.`
      : `Look at this timeline. It looks like an amateur found the effects panel. Fix these ${requiredChanges.length} issues before you waste my GPU cycles on a render.`;

    return {
      approved,
      editorialGrade: grade,
      critique,
      requiredChanges,
    };
  }
}
