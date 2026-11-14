/**
 * Harmonic Key Matching (Camelot Wheel DSP Engine)
 *
 * Analyzes audio musical pitch and harmonic keys to guarantee that transitional risers,
 * sub drops, and secondary phonk stems match or complement the active track's root key.
 */

export interface CamelotCode {
  number: number; // 1 to 12
  letter: 'A' | 'B'; // A = Minor, B = Major
}

export class CamelotKeyMatcher {
  private static readonly KEY_MAP: Record<string, CamelotCode> = {
    'Abm': { number: 1, letter: 'A' },
    'B': { number: 1, letter: 'B' },
    'Ebm': { number: 2, letter: 'A' },
    'Gb': { number: 2, letter: 'B' },
    'Bbm': { number: 3, letter: 'A' },
    'Db': { number: 3, letter: 'B' },
    'Fm': { number: 4, letter: 'A' },
    'Ab': { number: 4, letter: 'B' },
    'Cm': { number: 5, letter: 'A' },
    'Eb': { number: 5, letter: 'B' },
    'Gm': { number: 6, letter: 'A' },
    'Bb': { number: 6, letter: 'B' },
    'Dm': { number: 7, letter: 'A' },
    'F': { number: 7, letter: 'B' },
    'Am': { number: 8, letter: 'A' },
    'C': { number: 8, letter: 'B' },
    'Em': { number: 9, letter: 'A' },
    'G': { number: 9, letter: 'B' },
    'Bm': { number: 10, letter: 'A' },
    'D': { number: 10, letter: 'B' },
    'F#m': { number: 11, letter: 'A' },
    'A': { number: 11, letter: 'B' },
    'C#m': { number: 12, letter: 'A' },
    'E': { number: 12, letter: 'B' },
  };

  public static getCamelot(keyName: string): CamelotCode | null {
    return this.KEY_MAP[keyName] || null;
  }

  public static isHarmonicallyCompatible(codeA: CamelotCode, codeB: CamelotCode): boolean {
    if (codeA.letter === codeB.letter) {
      const diff = Math.abs(codeA.number - codeB.number);
      return diff === 0 || diff === 1 || diff === 11;
    }
    // Relative major/minor switch
    return codeA.number === codeB.number;
  }
}
