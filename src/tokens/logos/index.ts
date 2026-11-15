export * from './catalog.ts';
export * from './BrandLogo.tsx';

import { LOGO_DEFINITIONS, BrandLogoName } from './catalog.ts';

/**
 * Get all available logos in a specific category
 */
export function getLogosByCategory(category: string): BrandLogoName[] {
  return Object.values(LOGO_DEFINITIONS)
    .filter((icon) => icon.category === category)
    .map((icon) => icon.name as BrandLogoName);
}

/**
 * Search logos by query
 */
export function searchLogos(query: string): BrandLogoName[] {
  const q = query.toLowerCase();
  return Object.values(LOGO_DEFINITIONS)
    .filter((icon) => icon.name.toLowerCase().includes(q) || icon.category.toLowerCase().includes(q))
    .map((icon) => icon.name as BrandLogoName);
}
