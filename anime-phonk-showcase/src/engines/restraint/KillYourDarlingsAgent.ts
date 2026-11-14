/**
 * "Kill Your Darlings" Subagent (Brutal Editorial Critic)
 *
 * Scans candidate clips in the timeline. If a clip has flashy VFX but violates
 * narrative pacing or causes viewer disorientation, it is ruthlessly pruned.
 */

export interface CandidateClip {
  clipId: string;
  durationFrames: number;
  vfxScore: number; // 0 to 100
  narrativeRelevanceScore: number; // 0 to 100
  pacingFatigueRisk: boolean;
}

export interface PruneDecision {
  clipId: string;
  action: 'keep' | 'prune' | 'trim';
  reason: string;
}

export class KillYourDarlingsAgent {
  public static critiqueTimeline(clips: CandidateClip[], targetDurationFrames: number): PruneDecision[] {
    let currentTotalFrames = clips.reduce((sum, c) => sum + c.durationFrames, 0);

    return clips.map((clip) => {
      // If clip is flashy but narrative score is poor (< 40) and we are over budget
      if (clip.vfxScore > 80 && clip.narrativeRelevanceScore < 40) {
        return {
          clipId: clip.clipId,
          action: 'prune',
          reason: `Kill Your Darlings: "${clip.clipId}" has high visual hype (${clip.vfxScore}), but near-zero narrative relevance (${clip.narrativeRelevanceScore}). Pruned to protect story flow.`,
        };
      }

      // If clip causes pacing fatigue (> 3.5s linger)
      if (clip.pacingFatigueRisk && clip.durationFrames > 210) {
        return {
          clipId: clip.clipId,
          action: 'trim',
          reason: `Pacing violation: Trimmed "${clip.clipId}" by 40% to preserve velocity.`,
        };
      }

      return {
        clipId: clip.clipId,
        action: 'keep',
        reason: 'Clip passes narrative coherence and pacing thresholds.',
      };
    });
  }
}
