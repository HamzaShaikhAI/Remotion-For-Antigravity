const fs = require('fs');
const path = require('path');

// --- 1. Narrative Logic & Continuity ---
function buildSemanticSceneGraph(durationSec = 30.0) {
  const t = durationSec;
  return {
    clipDuration: durationSec,
    microStoryArc: 'Standoff Tension -> Aura Escalation -> Breathing Inhale -> Dragon Climax -> Cold Sheathe',
    nodes: [
      {
        phase: 'HOOK_TAUNT',
        startTime: 0.0,
        endTime: parseFloat((t * 0.12).toFixed(2)),
        emotionalCharge: 0.45,
        focalCharacter: 'Zenitsu & Killua',
        actionSummary: 'Standoff stare with electric tension and confrontation dialogue.',
        recommendedPacing: 'sustained-shot',
      },
      {
        phase: 'POWER_UP',
        startTime: parseFloat((t * 0.12).toFixed(2)),
        endTime: parseFloat((t * 0.42).toFixed(2)),
        emotionalCharge: 0.75,
        focalCharacter: 'Killua (Godspeed Charge)',
        actionSummary: 'Aura ignition, yellow and cyan lightning sparks erupt.',
        recommendedPacing: 'fast-cuts',
      },
      {
        phase: 'TENSION_INHALE',
        startTime: parseFloat((t * 0.42).toFixed(2)),
        endTime: parseFloat((t * 0.48).toFixed(2)),
        emotionalCharge: 0.2,
        focalCharacter: 'Zenitsu (Sword Draw Stance)',
        actionSummary: 'Total silence, eye close-up, pre-drop suspense pause (Breathing Room).',
        recommendedPacing: 'inhale-pause',
      },
      {
        phase: 'CLASH_STRIKE',
        startTime: parseFloat((t * 0.48).toFixed(2)),
        endTime: parseFloat((t * 0.82).toFixed(2)),
        emotionalCharge: 1.0,
        focalCharacter: 'Flaming Thunder God Dragon vs. Godspeed Dash',
        actionSummary: 'Explosive clash, 808 drop, manga screentone freeze, high-speed blade exchange.',
        recommendedPacing: 'velocity-ramp',
      },
      {
        phase: 'AFTERMATH_REVELATION',
        startTime: parseFloat((t * 0.82).toFixed(2)),
        endTime: t,
        emotionalCharge: 0.6,
        focalCharacter: 'Zenitsu Sheathing Blade',
        actionSummary: 'Blade clicks shut, dissipating lightning smoke, Chad aura lock.',
        recommendedPacing: 'sustained-shot',
      },
    ],
  };
}

// --- 2. Timeline Elasticity: Minimum Viable Duration ---
function calculateMinimumViableDuration(rawDurationSec, actionBeatsCount, hasDialogue = true) {
  const beatsPerSecond = actionBeatsCount / Math.max(1, rawDurationSec);
  let densityScore = Math.min(100, Math.floor(beatsPerSecond * 120));
  if (hasDialogue) densityScore += 15;

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

// --- 3. Aesthetic Restraint: VFX Budgeting Matrix ---
class VfxBudgetMatrix {
  constructor(maxBudget = 100) {
    this.budget = maxBudget;
    this.currentCost = 0;
    this.items = [];
  }

  registerEffect(type, cost = 25) {
    if (this.currentCost + cost > this.budget) {
      return false; // Suppressed due to fatigue limit
    }
    this.items.push({ type, cost });
    this.currentCost += cost;
    return true; // Approved
  }

  getReport() {
    return {
      totalFatigueScore: this.currentCost,
      maxBudget: this.budget,
      isOverBudget: this.currentCost > this.budget,
      suppressedCount: Math.max(0, Math.floor((this.currentCost - this.budget) / 25)),
    };
  }
}

// --- 4. Viral Prediction: Pre-Publish Retention Simulation ---
function simulateRetentionCurve(durationSec = 30.0, has08sHook = true, hasInhalePause = true, dropSec = 14.5) {
  const curve = [];
  const swipeRiskSeconds = [];
  let currentRetention = 100.0;

  for (let s = 0; s <= durationSec; s++) {
    let decayRate = 1.2;
    let risk = 'low';

    if (s <= 2) {
      decayRate = has08sHook ? 0.8 : 3.8;
    } else if (s >= 4 && s <= 8) {
      decayRate = 1.6;
    } else if (Math.abs(s - dropSec) <= 1.5) {
      decayRate = hasInhalePause ? 0.3 : 2.5;
    } else if (s > dropSec && s <= dropSec + 5) {
      decayRate = -0.5;
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
    });
  }

  const avg = curve.reduce((acc, p) => acc + p.predictedRetention, 0) / curve.length;
  const apv = parseFloat(avg.toFixed(1));

  let potential = 'Average';
  if (apv >= 90) potential = 'Viral Breakout';
  else if (apv >= 78) potential = 'High Growth';
  else if (apv < 60) potential = 'Graveyard Risk';

  return {
    overallApv: apv,
    viralPotential: potential,
    swipeRiskSeconds,
    curve,
  };
}

// --- 5. Viral Hooks: Curiosity Gap Generator ---
function generateCuriosityGapHooks(charA = 'Zenitsu', charB = 'Killua', climaxSec = 24) {
  return [
    {
      title: `${charB}'s Godspeed was undefeated... until 0:${climaxSec} 💀`,
      lowerThirdCaption: 'WAIT FOR THE REACTION',
      debateAngle: 'Pits Hunter x Hunter scaling directly against Demon Slayer breathing forms.',
      ctrScore: 94,
    },
    {
      title: `Who actually had more AURA in this clash? (Don't lie)`,
      lowerThirdCaption: 'COMMENT WHO WON',
      debateAngle: 'Forces immediate comment debate, spiking algorithmic engagement.',
      ctrScore: 91,
    },
    {
      title: `Bro thought he was safe after the first dodge... ⚡`,
      lowerThirdCaption: 'LOOK AT HIS EYES',
      debateAngle: 'Curiosity gap: forces viewer to rewatch frame-by-frame for hidden details.',
      ctrScore: 88,
    },
  ];
}

// --- 6. Multi-Platform Pacing Forks ---
function getPlatformForks(fps = 60) {
  return [
    {
      platform: 'tiktok',
      durationFrames: 15 * fps,
      durationSec: 15.0,
      pacingStyle: 'hyper_kinetic',
      hookCutSpeed: 0.4,
      vfxBudget: 120,
      targetLufs: -14.0,
    },
    {
      platform: 'youtube_shorts',
      durationFrames: 30 * fps,
      durationSec: 30.0,
      pacingStyle: 'narrative_arc',
      hookCutSpeed: 0.8,
      vfxBudget: 90,
      targetLufs: -14.0,
    },
    {
      platform: 'instagram_reels',
      durationFrames: 20 * fps,
      durationSec: 20.0,
      pacingStyle: 'aesthetic_polish',
      hookCutSpeed: 0.6,
      vfxBudget: 80,
      targetLufs: -14.0,
    },
  ];
}

const flawlessLogic = require('./logic/flawless-logic');

module.exports = {
  buildSemanticSceneGraph,
  calculateMinimumViableDuration,
  VfxBudgetMatrix,
  simulateRetentionCurve,
  generateCuriosityGapHooks,
  getPlatformForks,
  validateCut: flawlessLogic.validateCut,
  loadClipMeta: flawlessLogic.loadClipMeta,
  validateSequence: flawlessLogic.validateSequence,
};
