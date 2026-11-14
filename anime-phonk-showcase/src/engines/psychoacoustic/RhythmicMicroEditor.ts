/**
 * Rhythmic Micro-Editing Engine (Transient Mapping)
 *
 * Generates rapid 2-frame or 4-frame micro-cuts during buildup phases
 * synchronized to percussion transients (hi-hats, cowbells, snares).
 */

export interface TransientEvent {
  timestampSec: number;
  frequencyBand: 'high_hat' | 'snare' | 'cowbell' | 'sub_808';
  amplitude: number; // 0.0 to 1.0
}

export interface MicroCutPlan {
  frame: number;
  durationFrames: number;
  cutType: 'flash_strobe' | 'zoom_punch' | 'invert_filter' | 'clip_swap';
  audioTrigger: string;
}

export class RhythmicMicroEditor {
  /**
   * Generates micro-cuts leading up to a beat drop.
   * Buildup zone is typically 2.0s to 0.1s prior to the drop.
   */
  public static generateBuildupMicroCuts(
    transients: TransientEvent[],
    dropFrame: number,
    fps: number = 60
  ): MicroCutPlan[] {
    const plans: MicroCutPlan[] = [];
    const buildupStartFrame = Math.max(0, dropFrame - Math.floor(fps * 2.5)); // 2.5s buildup window

    const relevantTransients = transients.filter((t) => {
      const f = Math.round(t.timestampSec * fps);
      return f >= buildupStartFrame && f < dropFrame && t.amplitude >= 0.45;
    });

    for (const t of relevantTransients) {
      const frame = Math.round(t.timestampSec * fps);
      const isLateBuildup = frame >= dropFrame - Math.floor(fps * 0.8); // Final 0.8s: ultra-fast 2-frame cuts

      plans.push({
        frame,
        durationFrames: isLateBuildup ? 2 : 4,
        cutType: isLateBuildup
          ? t.amplitude > 0.8
            ? 'invert_filter'
            : 'zoom_punch'
          : 'clip_swap',
        audioTrigger: `${t.frequencyBand} (amp: ${t.amplitude.toFixed(2)})`,
      });
    }

    return plans.sort((a, b) => a.frame - b.frame);
  }
}
