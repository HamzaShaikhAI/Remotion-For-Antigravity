/**
 * Retention Predictor & Swipe Risk Analyzer (CommonJS / Node Runtime)
 * Used by bin/rea-cli.js and Remotion Pre-Render Gate
 */

function analyzeRetentionRisk(cuts = [], totalFrames = 1800, fps = 60) {
  let swipeRiskScore = 0;
  const warnings = [];

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

  // 3. The "Drop Payoff" Rule
  const beatDrop = sortedCuts.find((c) => c.type === 'beat-drop');
  if (beatDrop && beatDrop.frame > fps * 8) {
    swipeRiskScore += 15;
    warnings.push(
      `WARNING: The beat drop happens too late (${(beatDrop.frame / fps).toFixed(1)}s). Gen-Z attention spans require the payoff earlier.`
    );
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

function autoTightenPacing(cuts = [], totalFrames = 1800, fps = 60) {
  const result = [];
  const maxGap = Math.floor(fps * 2.8);
  const hookCutFrame = Math.floor(fps * 0.8);

  const firstCut = cuts.find((c) => c.frame > 0);
  if (!firstCut || firstCut.frame > fps * 1.5) {
    result.push({ frame: hookCutFrame, type: 'action-cut', label: 'auto-hook-cut' });
  }

  for (const cut of cuts) {
    const lastFrame = result.length > 0 ? result[result.length - 1].frame : 0;
    if (cut.frame - lastFrame > maxGap) {
      const midFrame = Math.floor(lastFrame + (cut.frame - lastFrame) / 2);
      result.push({ frame: midFrame, type: 'action-cut', label: 'auto-pacing-tighten' });
    }
    result.push(cut);
  }

  return result
    .sort((a, b) => a.frame - b.frame)
    .filter((cut, idx, arr) => idx === 0 || cut.frame - arr[idx - 1].frame >= Math.floor(fps * 0.4));
}

module.exports = {
  analyzeRetentionRisk,
  autoTightenPacing,
};
