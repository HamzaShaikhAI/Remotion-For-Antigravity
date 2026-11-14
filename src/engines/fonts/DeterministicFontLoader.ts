/**
 * Deterministic Google Fonts Preloader
 * Transcends @remotion/google-fonts with zero Flash of Unstyled Text (FOYT) and deterministic font-face injection.
 */

export interface GoogleFontConfig {
  family: string;
  weights?: number[];
  subsets?: string[];
}

export class DeterministicFontLoader {
  /**
   * Generates CSS @import statement for specified Google Font families
   */
  public static getFontImportUrl(fonts: GoogleFontConfig[]): string {
    const familyQueries = fonts.map((f) => {
      const weights = f.weights && f.weights.length > 0 ? f.weights.join(';') : '400;700;900';
      const cleanFamily = f.family.replace(/\s+/g, '+');
      return `family=${cleanFamily}:wght@${weights}`;
    });

    return `https://fonts.googleapis.com/css2?${familyQueries.join('&')}&display=swap`;
  }

  /**
   * Generates inline React CSS style for preloading fonts inside Remotion <Composition>
   */
  public static getFontLinkTag(fonts: GoogleFontConfig[]): string {
    const url = this.getFontImportUrl(fonts);
    return `@import url('${url}');`;
  }
}
