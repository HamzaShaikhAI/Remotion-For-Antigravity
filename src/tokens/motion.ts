/**
 * Studio Motion Design Tokens for REA (Remotion Engine for Antigravity)
 * Derived from MOTION.md architectural specification.
 */

export const motionTokens = {
  duration: {
    instant: 0,
    fast: 0.12, // 120ms
    base: 0.24, // 240ms
    slow: 0.40, // 400ms
    deliberate: 0.80, // 800ms
  },
  durationMs: {
    instant: 0,
    fast: 120,
    base: 240,
    slow: 400,
    deliberate: 800,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    exit: [0.7, 0, 0.84, 0] as const,
    emphasis: [0.34, 1.56, 0.64, 1] as const,
  },
  spring: {
    snappy: { stiffness: 520, damping: 36, mass: 0.8 },
    sheet: { stiffness: 380, damping: 32, mass: 1.0 },
    cinematic: { stiffness: 140, damping: 14, mass: 0.9 },
    heavyCad: { stiffness: 90, damping: 18, mass: 0.95 },
    subseaDrone: { stiffness: 160, damping: 22, mass: 1.2 },
    explode: { stiffness: 240, damping: 28, mass: 1.0 },
  },
} as const;

export type MotionTokens = typeof motionTokens;
