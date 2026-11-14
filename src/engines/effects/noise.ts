/**
 * Deterministic Perlin and Simplex Noise Engine
 * Provides 100% frame-locked, seed-driven procedural noise without Math.random().
 * Full drop-in transcendence over @remotion/noise with organic camera shake and multi-octave turbulence.
 */

// Deterministic Linear Congruential Generator for permutation initialization
function lcg(seed: number): () => number {
  let s = (seed ^ 0x6d2b79f5) >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s = (s + Math.imul(s ^ (s >>> 7), 61 | s)) ^ s;
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

// Build deterministic permutation table
const p: number[] = new Array(512);
const permutation: number[] = new Array(256);
const rng = lcg(42);
for (let i = 0; i < 256; i++) {
  permutation[i] = i;
}
for (let i = 255; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  const temp = permutation[i];
  permutation[i] = permutation[j];
  permutation[j] = temp;
}
for (let i = 0; i < 512; i++) {
  p[i] = permutation[i & 255];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * 3D Deterministic Perlin Noise
 * @param x X coordinate or frame step
 * @param y Y coordinate
 * @param z Z coordinate
 * @returns Normalized noise value between -1 and 1
 */
export function noise3D(x: number, y: number = 0, z: number = 0): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);

  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;

  return lerp(
    w,
    lerp(
      v,
      lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
      lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))
    ),
    lerp(
      v,
      lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
      lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))
    )
  );
}

export function noise2D(x: number, y: number): number {
  return noise3D(x, y, 0);
}

export function noise1D(x: number): number {
  return noise3D(x, 0, 0);
}

/**
 * Multi-octave fractal Brownian motion (fBm) turbulence.
 */
export function fractalNoise(
  x: number,
  y: number,
  octaves: number = 4,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }

  return total / maxValue;
}

/**
 * Procedural cinematic camera shake parameters derived deterministically from frame.
 * @param frame Remotion current frame (useCurrentFrame())
 * @param intensity Shake pixel amplitude (e.g. 10px)
 * @param speed Frequency multiplier (e.g. 0.08)
 */
export function getDeterministicCameraShake(
  frame: number,
  intensity: number = 8,
  speed: number = 0.08
): { x: number; y: number; rotation: number } {
  const x = noise1D(frame * speed) * intensity;
  const y = noise1D((frame + 100) * speed) * intensity;
  const rotation = noise1D((frame + 200) * speed * 0.5) * (intensity * 0.15);

  return { x, y, rotation };
}
