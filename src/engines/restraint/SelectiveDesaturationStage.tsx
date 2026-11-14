import React from 'react';
import { AbsoluteFill } from 'remotion';

export interface SelectiveDesaturationProps {
  backgroundContent: React.ReactNode;
  characterForeground: React.ReactNode;
  backgroundDesaturationPercent?: number; // default 40%
  accentTintHex?: string;
}

/**
 * Selective Desaturation (Color Restraint Stage)
 *
 * Restrains background saturation by 40% while preserving characters
 * in vibrant color, yielding high-budget cinematic separation.
 */
export const SelectiveDesaturationStage: React.FC<SelectiveDesaturationProps> = ({
  backgroundContent,
  characterForeground,
  backgroundDesaturationPercent = 40,
  accentTintHex = '#00f5ff',
}) => {
  const bgSaturation = Math.max(0, (100 - backgroundDesaturationPercent) / 100);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 1. Desaturated Cinematic Background Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: `saturate(${bgSaturation}) contrast(1.1) brightness(0.85)`,
        }}
      >
        {backgroundContent}
      </div>

      {/* 2. Color-Pure Character Foreground Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))',
        }}
      >
        {characterForeground}
      </div>
    </AbsoluteFill>
  );
};
