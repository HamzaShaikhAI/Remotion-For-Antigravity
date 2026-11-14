/**
 * Dopamine Wave Sequencer & Syncopated Pacing Engine
 *
 * Structures timeline edits across 3 distinct dopamine spikes:
 * 1. The Hook (0.0s - 1.2s): Shock visual or polarizing premise.
 * 2. The False Drop (10.0s - 14.0s): Buildup that deceptively resets tension.
 * 3. The True Climax (22.0s - 28.0s): Full 808 drop with freeze-frame & GigaChad badge.
 */

export interface DopamineSpike {
  name: 'the_hook' | 'the_false_drop' | 'the_true_climax';
  targetStartSec: number;
  targetDurationSec: number;
  dopamineIndexScore: number; // 0 to 100
  pacingOffsetFrames: number; // -3 to +3 frames for syncopated off-beat tension
}

export class DopamineWaveSequencer {
  public static calculateWaveStructure(totalDurationSec: number = 30.0, fps: number = 60): DopamineSpike[] {
    const falseDropSec = Number((totalDurationSec * 0.4).toFixed(1)); // ~12s in a 30s video
    const trueClimaxSec = Number((totalDurationSec * 0.78).toFixed(1)); // ~23.4s in a 30s video

    return [
      {
        name: 'the_hook',
        targetStartSec: 0.0,
        targetDurationSec: 1.2,
        dopamineIndexScore: 88,
        pacingOffsetFrames: 0,
      },
      {
        name: 'the_false_drop',
        targetStartSec: falseDropSec,
        targetDurationSec: 2.5,
        dopamineIndexScore: 72,
        pacingOffsetFrames: -3, // Cut 3 frames early to subvert rhythm
      },
      {
        name: 'the_true_climax',
        targetStartSec: trueClimaxSec,
        targetDurationSec: 4.5,
        dopamineIndexScore: 98,
        pacingOffsetFrames: 0, // Land dead-center on the beat
      },
    ];
  }
}
