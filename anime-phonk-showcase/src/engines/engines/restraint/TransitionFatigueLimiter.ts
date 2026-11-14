/**
 * Transition Fatigue Limiter
 *
 * Enforces aesthetic restraint: after any synthetic transition (glitch, whip-pan, warp),
 * the next 3 consecutive cuts MUST be clean, invisible hard cuts.
 */

export interface TransitionEvent {
  frame: number;
  type: 'hard_cut' | 'glitch' | 'whip_pan' | 'zoom_warp';
}

export class TransitionFatigueLimiter {
  public static sanitizeTransitions(transitions: TransitionEvent[]): TransitionEvent[] {
    const sorted = [...transitions].sort((a, b) => a.frame - b.frame);
    let consecutiveHardCutsRequired = 0;

    return sorted.map((t) => {
      if (t.type === 'hard_cut') {
        if (consecutiveHardCutsRequired > 0) {
          consecutiveHardCutsRequired--;
        }
        return t;
      }

      // If synthetic transition requested while under penalty cooldown
      if (consecutiveHardCutsRequired > 0) {
        // Demote to clean hard cut to prevent VFX fatigue
        consecutiveHardCutsRequired--;
        return {
          frame: t.frame,
          type: 'hard_cut',
        };
      }

      // Allow synthetic transition, set 3-cut cooldown
      consecutiveHardCutsRequired = 3;
      return t;
    });
  }
}
