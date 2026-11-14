export interface ColorPalette {
  dominant: string;
  complementary: string;
  analogousA: string;
  analogousB: string;
}

/**
 * Context-Aware Color Harmonization Engine
 * Samples dominant frame colors and maps text, particle embers, and UI badges
 * to complementary chromatic palettes, ensuring overlays look physically embedded
 * rather than pasted on top of the anime footage.
 */
export function harmonizeColorPalette(dominantHex: string): ColorPalette {
  const clean = dominantHex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;

  // Compute complementary color (invert RGB)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;

  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const complementaryHex = `#${toHex(compR)}${toHex(compG)}${toHex(compB)}`;

  // Analogous color shifts
  const analogousAHex = `#${toHex((r + 40) % 255)}${toHex(g)}${toHex((b + 60) % 255)}`;
  const analogousBHex = `#${toHex(r)}${toHex((g + 50) % 255)}${toHex((b + 30) % 255)}`;

  return {
    dominant: `#${clean}`,
    complementary: complementaryHex,
    analogousA: analogousAHex,
    analogousB: analogousBHex,
  };
}
