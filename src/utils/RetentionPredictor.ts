/**
 * Pre-Publish Retention Simulator (The "Swipe-Predictor")
 *
 * Analyzes timeline cuts and pacing against viral short-form retention heuristics
 * (1.5s hook, pacing fatigue limit of 3.5s, drop payoff <= 8s).
 * Predicts Average Percentage Viewed (APV) and blocks renders that risk immediate swiping.
 */

export interface TimelineCut {
  frame: number;
  type: 'action-cut' | 'beat-drop' | 'vfx-heavy';
  label?: string;
}

export interface RetentionAnalysisResult {
  isSafeToRender: boolean;
  predictedAPV: string;
  swipeRiskScore: number;
  warnings: string[];
  tightenedCuts?: TimelineCut[];
}

/**
 * Analyzes timeline cuts against short-form video retention heuristics.
 */
export function analyzeRetentionRisk(
  cuts: TimelineCut[],
  totalFrames: number,
  fps: number = 60
): RetentionAnalysisResult {
  let swipeRiskScore = 0;
  const warnings: string[] = [];

  // Sort cuts chronologically
  const sortedCuts = [...cuts].sort((a, b) => a.frame - b.frame);

  // 1. The "1.5-Second Hook" Rule
  const firstCut = sortedCuts.find((c) => c.frame > 0);
  if (!firstCut || firstCut.frame > fps * 1.5) {
    swipeRiskScore += 45;
    const cutSec = firstCut ? (firstCut.frame / fps).toFixed(2) : 'none';
    warnings.push(
      `CRITICAL: First cut happens after 1.5 seconds (${cutSec}s). 70% of viewers will swipe away before seeing it.`
    );
  }

  // 2. The "Pacing Fatigue" Rule (No clip should linger longer than 3.5 seconds without a visual change)
  for (let i = 1; i < sortedCuts.length; i++) {
    const framesBetween = sortedCuts[i].frame - sortedCuts[i - 1].frame;
    if (framesBetween > fps * 3.5) {
      swipeRiskScore += 20;
      warnings.push(
        `WARNING: Scene at frame ${sortedCuts[i - 1].frame} lingers for ${(framesBetween / fps).toFixed(1)}s. Audience retention will drop here.`
      );
    }
  }

  // Check tail lingering (from last cut to end of video)
  if (sortedCuts.length > 0) {
    const lastCut = sortedCuts[sortedCuts.length - 1];
    const tailFrames = totalFrames - lastCut.frame;
    if (tailFrames > fps * 4.0) {
      swipeRiskScore += 15;
      warnings.push(
        `WARNING: Final scene lingers for ${(tailFrames / fps).toFixed(1)}s without a cut before completion.`
      );
    }
  }

  // 3. The "Drop Payoff" Rule
  const beatDrop = sortedCuts.find((c) => c.type === 'beat-drop');
  if (beatDrop && beatDrop.frame > fps * 8) {
    swipeRiskScore += 15;
    warnings.push(
      `WARNING: The beat drop happens too late (${(beatDrop.frame / fps).toFixed(1)}s). Gen-Z attention spans require the payoff earlier.`
    );
  } else if (!beatDrop && totalFrames > fps * 10) {
    swipeRiskScore += 10;
    warnings.push(`NOTICE: Video exceeds 10s but has no registered 'beat-drop' climax event.`);
  }

  const predictedAPV = Math.max(0, 130 - swipeRiskScore); // Target APV > 100%

  return {
    isSafeToRender: swipeRiskScore < 50,
    predictedAPV: `${predictedAPV}%`,
    swipeRiskScore,
    warnings,
    tightenedCuts: autoTightenPacing(sortedCuts, totalFrames, fps),
  };
}

/**
 * Programmatically tightens cuts to resolve retention warnings.
 */
export function autoTightenPacing(
  cuts: TimelineCut[],
  totalFrames: number,
  fps: number = 60
): TimelineCut[] {
  const result: TimelineCut[] = [];
  const maxGap = Math.floor(fps * 2.8); // Cap max scene length to 2.8s for short-form virality
  const hookCutFrame = Math.floor(fps * 0.8); // 0.8s hook cut

  // Ensure 0.8s initial hook cut exists
  const firstCut = cuts.find((c) => c.frame > 0);
  if (!firstCut || firstCut.frame > fps * 1.5) {
    result.push({ frame: hookCutFrame, type: 'action-cut', label: 'auto-hook-cut' });
  }

  for (const cut of cuts) {
    // If the gap to the current cut is too wide, inject an action-cut midway
    const lastFrame = result.length > 0 ? result[result.length - 1].frame : 0;
    if (cut.frame - lastFrame > maxGap) {
      const midFrame = Math.floor(lastFrame + (cut.frame - lastFrame) / 2);
      result.push({ frame: midFrame, type: 'action-cut', label: 'auto-pacing-tighten' });
    }
    result.push(cut);
  }

  // Sort and deduplicate
  return result
    .sort((a, b) => a.frame - b.frame)
    .filter((cut, idx, arr) => idx === 0 || cut.frame - arr[idx - 1].frame >= Math.floor(fps * 0.4));
}
