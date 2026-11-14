import React from 'react';

export interface ContrastAdaptiveTypographyProps {
  children: React.ReactNode;
  backgroundLuminance?: number; // 0.0 (pitch black) - 1.0 (bright white flash)
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
}

/**
 * Contrast-Adaptive Typography Engine
 * Dynamically samples local background luminance: applies heavy black drop-shadows
 * over bright white lightning flashes and strips them over dark backdrops for a sleek,
 * modern cinematic aesthetic.
 */
export const ContrastAdaptiveTypography: React.FC<ContrastAdaptiveTypographyProps> = ({
  children,
  backgroundLuminance = 0.2,
  textColor = '#FFFFFF',
  fontSize = 54,
  fontFamily = 'Montserrat, sans-serif',
  style,
}) => {
  // If background is bright (e.g. lightning flash > 0.65), heavily reinforce shadow & stroke
  const isBright = backgroundLuminance > 0.6;

  const shadow = isBright
    ? '0 0 20px rgba(0,0,0,1.0), 0 4px 18px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9)'
    : '0 2px 8px rgba(0,0,0,0.6)';

  const stroke = isBright ? '2.5px #000000' : '1px rgba(0,0,0,0.4)';

  return (
    <div
      style={{
        color: textColor,
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: 900,
        textShadow: shadow,
        WebkitTextStroke: stroke,
        transition: 'text-shadow 0.05s ease-out',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
