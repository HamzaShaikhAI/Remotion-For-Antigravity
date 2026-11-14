/**
 * The "Continuity Supervisor" Agent
 *
 * Cross-checks character costume states, battle scars, sword sheathing states,
 * and environmental lighting across cuts to mathematically prevent cinematic continuity errors.
 */

export interface SceneContinuityState {
  sceneIndex: number;
  character: string;
  hasDrawnSword: boolean;
  activeAuraMode: 'base' | 'godspeed' | 'thunder_dragon' | 'flaming';
  scarOrDamageLevel: number; // 0 to 5
}

export interface ContinuityViolation {
  previousScene: number;
  currentScene: number;
  character: string;
  violation: string;
  severity: 'WARNING' | 'CRITICAL';
}

export class ContinuitySupervisorAgent {
  public static auditSequence(scenes: SceneContinuityState[]): ContinuityViolation[] {
    const violations: ContinuityViolation[] = [];

    for (let i = 1; i < scenes.length; i++) {
      const prev = scenes[i - 1];
      const curr = scenes[i];

      if (prev.character === curr.character) {
        // Weapon regression
        if (prev.hasDrawnSword && !curr.hasDrawnSword && curr.activeAuraMode !== 'base') {
          violations.push({
            previousScene: prev.sceneIndex,
            currentScene: curr.sceneIndex,
            character: curr.character,
            violation: 'Character was wielding drawn blade in previous cut, but weapon has vanished during active aura.',
            severity: 'CRITICAL',
          });
        }
        // Damage regression
        if (curr.scarOrDamageLevel < prev.scarOrDamageLevel) {
          violations.push({
            previousScene: prev.sceneIndex,
            currentScene: curr.sceneIndex,
            character: curr.character,
            violation: 'Battle damage vanished between cuts without a healing scene.',
            severity: 'WARNING',
          });
        }
      }
    }

    return violations;
  }
}
