import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type VFXBudgetState = {
  currentBudget: number; // Starts at 100
  spend: (cost: number, frame: number) => boolean;
  canAfford: (cost: number, frame: number) => boolean;
};

const VFXBudgetContext = createContext<VFXBudgetState | null>(null);

export interface ScheduledVFX {
  frame: number;
  cost: number;
  effectName?: string;
}

/**
 * Deterministically calculates budget remaining at any given frame.
 * Formula: budget regenerates at +0.5 per frame elapsed, capped at 100.
 */
export function calculateBudgetAtFrame(
  spends: ScheduledVFX[],
  targetFrame: number,
  initialBudget: number = 100,
  regenRate: number = 0.5
): number {
  let budget = initialBudget;
  let lastFrame = 0;

  const pastSpends = [...spends]
    .filter((s) => s.frame <= targetFrame)
    .sort((a, b) => a.frame - b.frame);

  for (const s of pastSpends) {
    const elapsed = s.frame - lastFrame;
    budget = Math.min(100, budget + elapsed * regenRate);
    if (budget >= s.cost) {
      budget -= s.cost;
    }
    lastFrame = s.frame;
  }

  // Regenerate from last spend up to targetFrame
  const finalElapsed = targetFrame - lastFrame;
  budget = Math.min(100, budget + finalElapsed * regenRate);

  return Math.min(100, Math.max(0, budget));
}

export const VFXBudgetProvider: React.FC<{
  children: React.ReactNode;
  initialBudget?: number;
  regenRate?: number;
}> = ({ children, initialBudget = 100, regenRate = 0.5 }) => {
  const [budgetHistory, setBudgetHistory] = useState<Array<{ frame: number; budget: number }>>([
    { frame: 0, budget: initialBudget },
  ]);

  const spend = useCallback(
    (cost: number, currentFrame: number): boolean => {
      let approved = false;
      setBudgetHistory((prev) => {
        const last = prev[prev.length - 1];
        // Regenerate budget over time (restraint allows hype to rebuild)
        const framesPassed = Math.max(0, currentFrame - last.frame);
        const regeneratedBudget = Math.min(100, last.budget + framesPassed * regenRate);

        if (regeneratedBudget >= cost) {
          approved = true;
          return [...prev, { frame: currentFrame, budget: regeneratedBudget - cost }];
        }
        approved = false;
        return prev;
      });
      return approved;
    },
    [regenRate]
  );

  const canAfford = useCallback(
    (cost: number, currentFrame: number): boolean => {
      const last = budgetHistory[budgetHistory.length - 1];
      const framesPassed = Math.max(0, currentFrame - last.frame);
      const regeneratedBudget = Math.min(100, last.budget + framesPassed * regenRate);
      return regeneratedBudget >= cost;
    },
    [budgetHistory, regenRate]
  );

  const contextValue = useMemo(
    () => ({
      currentBudget: budgetHistory[budgetHistory.length - 1].budget,
      spend,
      canAfford,
    }),
    [budgetHistory, spend, canAfford]
  );

  return <VFXBudgetContext.Provider value={contextValue}>{children}</VFXBudgetContext.Provider>;
};

export const useVFXBudget = (): VFXBudgetState => {
  const context = useContext(VFXBudgetContext);
  if (!context) {
    // Graceful fallback for components rendered outside of a Provider
    return {
      currentBudget: 100,
      spend: () => true,
      canAfford: () => true,
    };
  }
  return context;
};
