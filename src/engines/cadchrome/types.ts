/**
 * Types & Geometry Contracts for Precision Industrial CAD & Liquid Chrome 3D Engine (Engine XXV)
 * Deconstructed from Amani Studio's viral Dieter Rams CAD-to-Chrome brand identity.
 */

export type CadPhase = 'blueprint' | 'materialize' | 'macro-orbit' | 'lockup';

export interface CadDimensionCalipers {
  label: string; // "20", "gap 2", "R 10"
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset: number;
  arrowDirection?: 'horizontal' | 'vertical' | 'radial';
}

export interface CadRadiusCallout {
  label: string; // "- r 2.4", "r 8", "R 10"
  centerX: number;
  centerY: number;
  radius: number;
  angleDeg: number;
  arcSweepDeg?: number;
}

export interface CadAngleCallout {
  label: string; // "45°"
  originX: number;
  originY: number;
  radius: number;
  startAngleDeg: number;
  endAngleDeg: number;
}

export interface CadBlueprintData {
  title: string;
  gridSize: number; // e.g. 20x20
  dimensions: CadDimensionCalipers[];
  radii: CadRadiusCallout[];
  angles: CadAngleCallout[];
}

export const AMANI_BLUEPRINT_DATA: CadBlueprintData = {
  title: 'grid 20 × 20',
  gridSize: 20,
  dimensions: [
    { label: '20', x1: 220, y1: 260, x2: 220, y2: 740, offset: -60, arrowDirection: 'vertical' },
    { label: '20', x1: 260, y1: 800, x2: 820, y2: 800, offset: 40, arrowDirection: 'horizontal' },
    { label: 'gap 2', x1: 535, y1: 345, x2: 575, y2: 385, offset: 0, arrowDirection: 'radial' },
  ],
  radii: [
    { label: '- r 2.4', centerX: 320, centerY: 700, radius: 60, angleDeg: 225 },
    { label: 'R 10', centerX: 780, centerY: 260, radius: 240, angleDeg: 45, arcSweepDeg: 90 },
    { label: 'r 8', centerX: 780, centerY: 260, radius: 190, angleDeg: 15 },
  ],
  angles: [
    { label: '45°', originX: 780, originY: 260, radius: 100, startAngleDeg: 180, endAngleDeg: 225 },
  ],
};
