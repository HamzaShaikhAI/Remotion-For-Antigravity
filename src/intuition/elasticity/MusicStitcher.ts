export interface MusicStitchPlan {
  originalDurationSec: number;
  targetDurationSec: number;
  buildupLoopCount: number;
  dropTimeTargetSec: number;
  stretchRatio: number;
}

/**
 * Dynamic Music Stitching & Buildup Extension Engine
 * Extends the introductory buildup of a music track using seamless bar-aligned looping,
 * aligning the beat drop to the climax without butchering the narrative video edit.
 */
export function calculateMusicStitchPlan(
  audioDurationSec: number,
  targetVideoDurationSec: number,
  naturalDropTimeSec: number = 15.0,
  barDurationSec: number = 1.714 // 140 BPM, 4 beats per bar
): MusicStitchPlan {
  const diff = targetVideoDurationSec - audioDurationSec;
  let loopsNeeded = 0;

  if (targetVideoDurationSec > naturalDropTimeSec * 1.5) {
    // We need to extend the pre-drop buildup
    const neededPreDrop = targetVideoDurationSec * 0.45;
    const extraTime = Math.max(0, neededPreDrop - naturalDropTimeSec);
    loopsNeeded = Math.ceil(extraTime / barDurationSec);
  }

  const effectiveDrop = naturalDropTimeSec + loopsNeeded * barDurationSec;

  return {
    originalDurationSec: audioDurationSec,
    targetDurationSec: targetVideoDurationSec,
    buildupLoopCount: loopsNeeded,
    dropTimeTargetSec: parseFloat(effectiveDrop.toFixed(2)),
    stretchRatio: parseFloat((targetVideoDurationSec / audioDurationSec).toFixed(3)),
  };
}
