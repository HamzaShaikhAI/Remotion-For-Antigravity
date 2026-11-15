import React from 'react';
import { LOGO_DEFINITIONS, BrandLogoName } from './catalog.ts';

export interface BrandLogoProps {
  name: BrandLogoName | string;
  size?: number | string;
  color?: string;
  glow?: boolean;
  glowColor?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Universal, zero-overhead vector logo component for Remotion animations.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  size = 32,
  color,
  glow = false,
  glowColor,
  style = {},
  className = '',
}) => {
  const icon = LOGO_DEFINITIONS[name as BrandLogoName] || LOGO_DEFINITIONS['github'];
  const finalColor = color || icon.color;
  const pixelSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 32;

  const glowStyle: React.CSSProperties = glow
    ? {
        filter: `drop-shadow(0 0 12px ${glowColor || finalColor})`,
      }
    : {};

  return (
    <svg
      viewBox={icon.viewBox}
      width={pixelSize}
      height={pixelSize}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        fill: finalColor,
        color: finalColor,
        flexShrink: 0,
        ...glowStyle,
        ...style,
      }}
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.path }}
    />
  );
};
