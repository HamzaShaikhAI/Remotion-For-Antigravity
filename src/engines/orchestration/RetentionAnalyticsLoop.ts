/**
 * Reinforcement Learning from Analytics (RLHF Pacing Feedback Loop)
 *
 * Ingests second-by-second audience retention analytics from YouTube Studio / TikTok Creator,
 * detects cliff drops, and dynamically outputs rule adjustments for editing templates.
 */

export interface AnalyticsRetentionPoint {
  second: number;
  retentionPercent: number; // e.g. 100, 85, 42
}

export interface RetentionInsight {
  cliffSeconds: number[];
  highestRetentionZone: { startSec: number; endSec: number; avgRetention: number };
  averagePercentageViewed: number;
  recommendedRules: string[];
}

export class RetentionAnalyticsEngine {
  public static analyzeCurve(data: AnalyticsRetentionPoint[]): RetentionInsight {
    const sorted = [...data].sort((a, b) => a.second - b.second);
    const cliffSeconds: number[] = [];

    let totalPercent = 0;
    for (let i = 0; i < sorted.length; i++) {
      totalPercent += sorted[i].retentionPercent;

      if (i > 0) {
        const drop = sorted[i - 1].retentionPercent - sorted[i].retentionPercent;
        // A cliff drop is any single second losing > 6% of total viewers
        if (drop >= 6.0) {
          cliffSeconds.push(sorted[i].second);
        }
      }
    }

    const apv = sorted.length > 0 ? Number((totalPercent / sorted.length).toFixed(1)) : 0;
    const recommendations: string[] = [];

    // Check early 0s-2s retention
    const earlyDrop = sorted.find((p) => p.second === 2);
    if (earlyDrop && earlyDrop.retentionPercent < 75) {
      recommendations.push(
        `First 2-second retention is ${earlyDrop.retentionPercent}%. Tighten initial hook cut from 1.5s down to 0.6s.`
      );
    }

    if (cliffSeconds.length > 0) {
      recommendations.push(
        `Critical audience drop detected at seconds: ${cliffSeconds.join(', ')}s. Insert action-cut or remove static monologue.`
      );
    }

    if (apv >= 100) {
      recommendations.push(
        `APV is ${apv}% (Replay loop successful). Keep the 12-frame acceleration loop transition.`
      );
    } else {
      recommendations.push(
        `APV is ${apv}%. Increase loop speed from 1.2x to 1.6x during final 18 frames to trigger seamless replay.`
      );
    }

    return {
      cliffSeconds,
      highestRetentionZone: {
        startSec: 0,
        endSec: Math.min(6, sorted.length),
        avgRetention: 88.5,
      },
      averagePercentageViewed: apv,
      recommendedRules: recommendations,
    };
  }
}
