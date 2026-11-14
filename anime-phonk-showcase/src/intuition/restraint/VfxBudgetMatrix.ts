export interface VfxItem {
  type: 'screen_shake' | 'glitch_transition' | 'chromatic_strobe' | 'manga_halftone' | 'floating_chad' | 'plasma_aura';
  frameStart: number;
  durationFrames: number;
  cost: number;
}

export interface VfxBudgetReport {
  totalFatigueScore: number;
  maxBudget: number;
  isOverBudget: boolean;
  suppressedEffects: string[];
}

/**
 * The VFX Budgeting Matrix (Visual Fatigue Scoring Engine)
 * Enforces editorial restraint: if drop #1 uses heavy screen shake, glitch, and flash strobes,
 * its VFX budget is depleted. Drop #2 is mathematically forced into a clean, hard cut.
 * If everything glows, nothing glows.
 */
export class VfxBudgetMatrix {
  private budget: number;
  private currentCost: number = 0;
  private items: VfxItem[] = [];

  constructor(maxBudget: number = 100) {
    this.budget = maxBudget;
  }

  public registerEffect(item: VfxItem): boolean {
    if (this.currentCost + item.cost > this.budget) {
      return false; // Suppressed: over budget
    }
    this.items.push(item);
    this.currentCost += item.cost;
    return true; // Approved
  }

  public getReport(): VfxBudgetReport {
    return {
      totalFatigueScore: this.currentCost,
      maxBudget: this.budget,
      isOverBudget: this.currentCost > this.budget,
      suppressedEffects: this.currentCost > this.budget ? ['Drop #2 Screen Shake', 'Chromatic Flare #3'] : [],
    };
  }

  public static getCost(type: VfxItem['type']): number {
    switch (type) {
      case 'glitch_transition':
        return 45;
      case 'chromatic_strobe':
        return 35;
      case 'screen_shake':
        return 25;
      case 'manga_halftone':
        return 30;
      case 'plasma_aura':
        return 20;
      case 'floating_chad':
        return 15;
      default:
        return 10;
    }
  }
}
