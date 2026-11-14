import React from 'react';

export type CinematicLutPreset = 'cyberpunk-neon' | 'matrix-green' | 'vintage-bleach' | 'midnight-phonk' | 'crimson-rage';

export interface ColorGradeLUTProps {
  children: React.ReactNode;
  lut?: CinematicLutPreset;
  intensity?: number; // 0.0 - 1.0 (default 1.0)
  style?: React.CSSProperties;
}

/**
 * Cinematic 3D LUT & Dynamic Color Grading Engine
 * Applies mood-adaptive cinematic color grading matrices directly to footage,
 * shifting visual temperature and contrast to amplify Phonk/anime aesthetics.
 */
export const ColorGradeLUT: React.FC<ColorGradeLUTProps> = ({
  children,
  lut = 'cyberpunk-neon',
  intensity = 1.0,
  style,
}) => {
  let filterString = '';

  switch (lut) {
    case 'cyberpunk-neon':
      filterString = `contrast(${100 + 35 * intensity}%) saturate(${100 + 45 * intensity}%) hue-rotate(${15 * intensity}deg)`;
      break;
    case 'matrix-green':
      filterString = `contrast(${100 + 40 * intensity}%) sepia(${50 * intensity}%) hue-rotate(${80 * intensity}deg) saturate(${100 + 20 * intensity}%)`;
      break;
    case 'vintage-bleach':
      filterString = `contrast(${100 + 50 * intensity}%) saturate(${100 - 40 * intensity}%) brightness(${100 - 5 * intensity}%)`;
      break;
    case 'midnight-phonk':
      filterString = `contrast(${100 + 45 * intensity}%) brightness(${100 - 10 * intensity}%) saturate(${100 + 30 * intensity}%)`;
      break;
    case 'crimson-rage':
      filterString = `contrast(${100 + 40 * intensity}%) sepia(${40 * intensity}%) hue-rotate(${320 * intensity}deg) saturate(${100 + 60 * intensity}%)`;
      break;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        filter: filterString,
        transition: 'filter 0.1s ease-out',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
