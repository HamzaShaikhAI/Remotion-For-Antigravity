/**
 * Semantic Object Permanence Engine
 *
 * Tracks item states (e.g. unbroken -> cracked -> shattered).
 * Once an item is damaged or broken at timeline frame F, any clip where the item
 * is undamaged is permanently blacklisted from future insertion.
 */

export interface TrackedItemState {
  itemId: string; // e.g. "zenitsu_nichirin_blade", "killua_yo_yo", "akaza_arm"
  state: 'intact' | 'damaged' | 'shattered' | 'lost';
  introducedAtFrame: number;
}

export class ObjectPermanenceTracker {
  private itemStates: Map<string, TrackedItemState> = new Map();

  public registerItemState(item: TrackedItemState): void {
    const existing = this.itemStates.get(item.itemId);
    if (!existing || item.introducedAtFrame < existing.introducedAtFrame) {
      this.itemStates.set(item.itemId, item);
    }
  }

  public validateClipInclusion(
    itemId: string,
    proposedClipState: 'intact' | 'damaged' | 'shattered',
    proposedFrame: number
  ): { isPermitted: boolean; reason?: string } {
    const currentState = this.itemStates.get(itemId);
    if (!currentState) {
      return { isPermitted: true };
    }

    // If item was already shattered earlier in the timeline, it cannot be intact later
    if (
      proposedFrame > currentState.introducedAtFrame &&
      (currentState.state === 'shattered' || currentState.state === 'damaged') &&
      proposedClipState === 'intact'
    ) {
      return {
        isPermitted: false,
        reason: `Object Permanence Violation: ${itemId} was marked as '${currentState.state}' at frame ${currentState.introducedAtFrame}. It cannot appear '${proposedClipState}' at frame ${proposedFrame}.`,
      };
    }

    return { isPermitted: true };
  }
}
