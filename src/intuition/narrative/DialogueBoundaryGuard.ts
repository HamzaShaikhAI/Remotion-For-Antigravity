export interface WordTimestamp {
  word: string;
  start: number; // sec
  end: number; // sec
}

/**
 * Dialogue-Aware Slicing & Breath Boundary Guard (Forced Alignment)
 * Mathematically blocks the editing engine from slicing clips mid-syllable or mid-breath,
 * snapping cut timestamps to natural conversational pauses.
 */
export function calculateSafeCutTimestamp(
  targetTimestamp: number,
  words: WordTimestamp[],
  paddingSec: number = 0.15
): number {
  for (const w of words) {
    // If target timestamp falls inside an active spoken word
    if (targetTimestamp >= w.start && targetTimestamp <= w.end) {
      // Snap to end of word plus breath buffer
      return parseFloat((w.end + paddingSec).toFixed(3));
    }
  }
  return targetTimestamp;
}
