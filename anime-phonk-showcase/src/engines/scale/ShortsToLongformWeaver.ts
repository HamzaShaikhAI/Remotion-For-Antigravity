/**
 * Automated Shorts-to-Longform Weaver
 *
 * Automatically concatenates top-performing weekly vertical short-form battle edits
 * into an episodic 5-minute widescreen or split-screen YouTube compilation master.
 */

export interface CompilationAct {
  actIndex: number;
  clipPath: string;
  characterTitle: string;
  durationFrames: number;
}

export class ShortsToLongformWeaver {
  public static calculateTotalCompilationFrames(acts: CompilationAct[], transitionFrames: number = 24): number {
    return acts.reduce((acc, act) => acc + act.durationFrames, 0) + (acts.length - 1) * transitionFrames;
  }
}
