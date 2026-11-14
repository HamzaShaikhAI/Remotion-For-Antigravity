export interface MvdReport {
  rawDurationSec: number;
  choreographyDensityScore: number; // 0 - 100
  recommendedDurationSec: number;
  rationale: string;
  allow15sShortCut: boolean;
}

/**
 * Minimum Viable Duration (MVD) Calculator
 * Analyzes choreographic complexity and narrative weight to prevent rich 45-second
 * anime combat sequences from being squeezed into over-caffeinated 15-second cuts.
 */
export function calculateMinimumViableDuration(
  rawDurationSec: number,
  actionBeatsCount: number,
  hasDialogueDialogue: boolean = true
): MvdReport {
  // Score continuous choreography density
  const beatsPerSecond = actionBeatsCount / Math.max(1, rawDurationSec);
  let densityScore = Math.min(100, Math.floor(beatsPerSecond * 120));

  if (hasDialogueDialogue) {
    densityScore += 15;
  }

  // If density is high (> 60), allocate at least 25-40 seconds
  let recommended = 15.0;
  let allow15 = true;
  let rationale = 'Low density; suitable for rapid 15s TikTok edit.';

  if (densityScore >= 70 || rawDurationSec >= 25.0) {
    recommended = Math.max(28.0, Math.min(rawDurationSec, 45.0));
    allow15 = false;
    rationale = `High choreographic density (${densityScore}/100) and rich narrative arc. Expanding timeline to ${recommended.toFixed(1)}s to preserve build-up and climax.`;
  }

  return {
    rawDurationSec,
    choreographyDensityScore: densityScore,
    recommendedDurationSec: parseFloat(recommended.toFixed(1)),
    rationale,
    allow15sShortCut: allow15,
  };
}
