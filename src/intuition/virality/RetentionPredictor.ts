export interface RetentionPoint {
  second: number;
  predictedRetention: number; // Percentage (e.g. 100%, 88%, 74%)
  swipeRisk: 'low' | 'medium' | 'high';
  actionFactor: string;
}

export interface RetentionSimulationReport {
  overallApv: number; // Average Percentage Viewed (target > 85%)
  viralPotential: 'Viral Breakout' | 'High Growth' | 'Average' | 'Graveyard Risk';
  swipeRiskSeconds: number[];
  remediationSuggestions: string[];
  curve: RetentionPoint[];
}

/**
 * Pre-Publish Retention Simulation Engine (The Predictor)
 * Simulates second-by-second viewer drop-off graphs based on pacing, contrast velocity,
 * and audio transitions to flag "Swipe Risk" zones before rendering final MP4s.
 */
export function simulateRetentionCurve(
  durationSec: number = 30.0,
  has08sHook: boolean = true,
  hasInhalePause: boolean = true,
  dropTimestampSec: number = 14.5
): RetentionSimulationReport {
  const curve: RetentionPoint[] = [];
  const swipeRiskSeconds: number[] = [];
  const suggestions: string[] = [];

  let currentRetention = 100.0;

  for (let s = 0; s <= durationSec; s++) {
    let decayRate = 1.2; // Base decay per second
    let risk: RetentionPoint['swipeRisk'] = 'low';
    let factor = 'Normal progression';

    // Second 0-2: The Hook Window
    if (s <= 2) {
      decayRate = has08sHook ? 0.8 : 3.8;
      factor = has08sHook ? 'Strong visual hook active' : 'Weak hook: High swipe risk';
    }
    // Mid-Buildup Window (Seconds 4-8): Viewer impatience
    else if (s >= 4 && s <= 8) {
      decayRate = 1.6;
      factor = 'Pacing buildup';
    }
    // The Inhale Pause Window
    else if (Math.abs(s - dropTimestampSec) <= 1.5) {
      decayRate = hasInhalePause ? 0.3 : 2.5; // Inhale increases retention!
      factor = hasInhalePause ? 'Breathing room tension inhale' : 'Unrelenting audio fatigue';
    }
    // Beat Drop Payoff
    else if (s > dropTimestampSec && s <= dropTimestampSec + 5) {
      decayRate = -0.5; // Slight re-watch bump!
      factor = 'Beat-drop climax payoff';
    }

    currentRetention = Math.max(20, currentRetention - decayRate);
    if (decayRate > 2.0) {
      risk = 'high';
      swipeRiskSeconds.push(s);
    } else if (decayRate > 1.4) {
      risk = 'medium';
    }

    curve.push({
      second: s,
      predictedRetention: parseFloat(currentRetention.toFixed(1)),
      swipeRisk: risk,
      actionFactor: factor,
    });
  }

  // Calculate Average Percentage Viewed
  const avg = curve.reduce((acc, p) => acc + p.predictedRetention, 0) / curve.length;
  const apv = parseFloat(avg.toFixed(1));

  let potential: RetentionSimulationReport['viralPotential'] = 'Average';
  if (apv >= 90) potential = 'Viral Breakout';
  else if (apv >= 78) potential = 'High Growth';
  else if (apv < 60) potential = 'Graveyard Risk';

  if (swipeRiskSeconds.length > 0) {
    suggestions.push(`High swipe risk detected at seconds: ${swipeRiskSeconds.slice(0, 3).join(', ')}s. Insert high-velocity cut or sound effect.`);
  }
  if (!hasInhalePause) {
    suggestions.push('Add a 1.2s Breathing Room inhale prior to drop to spike anticipation.');
  }

  return {
    overallApv: apv,
    viralPotential: potential,
    swipeRiskSeconds,
    remediationSuggestions: suggestions,
    curve,
  };
}
