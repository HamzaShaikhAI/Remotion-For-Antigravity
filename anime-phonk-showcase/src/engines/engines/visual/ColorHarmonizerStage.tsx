import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';

export interface ColorPalette {
  dominant: string;
  complementary: string;
  accentGlow: string;
  textShadow: string;
  backgroundGrade: string;
}

/**
 * Calculates a harmonic complementary or triadic color scheme from a dominant hex code.
 */
export function deriveHarmonizedPalette(dominantHex: string): ColorPalette {
  // Normalize hex
  const cleanHex = dominantHex.replace('#', '').toLowerCase();
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map((c) => c + c).join('') : cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // Derive complementary RGB
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;

  const dominantRgb = `rgb(${r}, ${g}, ${b})`;
  const compRgb = `rgb(${compR}, ${compG}, ${compB})`;

  return {
    dominant: `#${cleanHex}`,
    complementary: `rgb(${compR}, ${compG}, ${compB})`,
    accentGlow: `rgba(${compR}, ${compG}, ${compB}, 0.65)`,
    textShadow: `0 0 24px rgba(${compR}, ${compG}, ${compB}, 0.8), 0 4px 12px rgba(0, 0, 0, 0.95)`,
    backgroundGrade: `radial-gradient(ellipse at 50% 50%, rgba(${r}, ${g}, ${b}, 0.12) 0%, rgba(2, 2, 5, 0.98) 75%)`,
  };
}

export const ColorHarmonizerStage: React.FC<{
  dominantHex: string;
  children: (palette: ColorPalette) => React.ReactNode;
}> = ({ dominantHex, children }) => {
  const palette = useMemo(() => deriveHarmonizedPalette(dominantHex), [dominantHex]);

  return (
    <AbsoluteFill style={{ background: palette.backgroundGrade }}>
      {children(palette)}
    </AbsoluteFill>
  );
};
