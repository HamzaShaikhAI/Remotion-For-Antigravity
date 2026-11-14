import React from 'react';
import { staticFile } from 'remotion';

/**
 * Guaranteed Brand Asset Registry (Strict Vector Mapping)
 * Prevents AI hallucinations and missing emoji characters by providing
 * verified, mathematically exact SVGs for Claude, terminals, and platform verification.
 */
export const BrandAssets = {
  claudeStar: 'assets/brand/claude-starburst.svg',
  terminalCursor: 'assets/brand/terminal-cursor.svg',
  verifiedCheck: 'assets/brand/verified-check.svg',
  anthropicLogo: 'assets/brand/anthropic.svg',
} as const;

export type BrandAssetKey = keyof typeof BrandAssets;

export interface BrandIconProps {
  name: BrandAssetKey;
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
  alt?: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = 32,
  style = {},
  className = '',
  alt = '',
}) => {
  const assetPath = BrandAssets[name];
  if (!assetPath) {
    console.warn(`[BrandAssets] Requested unverified brand asset key: "${name}"`);
    return null;
  }

  const src = staticFile(assetPath);

  return (
    <img
      src={src}
      alt={alt || name}
      className={className}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};
