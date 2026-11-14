// src/assets/brand/index.ts
import React from 'react';

export const BrandAssets = {
  claudeStar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23D97706"><path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>`,
  github: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230F172A"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  vercel: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M12 1l11 21H1z"/></svg>`,
  react: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" fill="%2306B6D4"><circle cx="0" cy="0" r="2.05" fill="%2306B6D4"/><g stroke="%2306B6D4" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
  nodejs: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 288" fill="%2322C55E"><path d="M128 0l128 74v148l-128 74L0 222V74l128-74z"/></svg>`,
  terminalCursor: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="%2322C55E"><rect width="10" height="14" rx="2"/></svg>`,
  verifiedCheck: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%232563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

export type BrandAssetKey = keyof typeof BrandAssets;

export const renderBrandIcon = (
  key: BrandAssetKey,
  size: number = 32,
  style?: React.CSSProperties
): React.ReactElement => {
  return React.createElement('img', {
    src: BrandAssets[key],
    alt: `${String(key)} brand asset`,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    },
  });
};

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
  const numericSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 32;
  return renderBrandIcon(name, numericSize, { ...style });
};
