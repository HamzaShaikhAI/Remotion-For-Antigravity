import fs from 'fs';
import path from 'path';

export type ImpactPreset = 'sub-boom' | 'bass-drop-808' | 'explosion-thud' | 'electric-arc';

/**
 * Procedural Impact SFX Generator (AudioLDM Mathematical Emulation)
 * Generates broadcast-quality 44.1 kHz WAV files for cinematic impacts, sub-bass explosions,
 * and electrical discharges without any external sound libraries.
 */
export function generateImpactSfxSamples(
  preset: ImpactPreset,
  sampleRate: number = 44100
): Float32Array {
  let duration = 1.0;
  let total = 0;

  switch (preset) {
    case 'sub-boom': {
      duration = 2.2;
      total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const t = i / sampleRate;
        const pitchEnv = 70 * Math.exp(-t * 2.8) + 24; // Sweeps 94Hz down to 24Hz sub-bass
        const ampEnv = Math.exp(-t * 1.8);
        const subSine = Math.sin(2 * Math.PI * pitchEnv * t);
        const rumbleNoise = (pseudoRandom(i, 401) * 2 - 1) * Math.exp(-t * 4) * 0.15;
        samples[i] = Math.tanh((subSine + rumbleNoise) * 2.2) * ampEnv * 0.95;
      }
      return samples;
    }

    case 'bass-drop-808': {
      duration = 1.5;
      total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const t = i / sampleRate;
        const pitchEnv = 140 * Math.exp(-t * 14) + 38; // Punchy Memphis 808 transient
        const ampEnv = Math.exp(-t * 2.6);
        const distortion = Math.tanh(Math.sin(2 * Math.PI * pitchEnv * t) * 3.0);
        samples[i] = distortion * ampEnv * 0.9;
      }
      return samples;
    }

    case 'explosion-thud': {
      duration = 1.8;
      total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const t = i / sampleRate;
        const pitchEnv = 180 * Math.exp(-t * 8) + 30;
        const sub = Math.sin(2 * Math.PI * pitchEnv * t) * Math.exp(-t * 2.2);
        const blast = (pseudoRandom(i, 777) * 2 - 1) * Math.exp(-t * 6.5) * 0.6;
        samples[i] = Math.tanh((sub + blast) * 1.8) * 0.92;
      }
      return samples;
    }

    case 'electric-arc': {
      duration = 0.8;
      total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const t = i / sampleRate;
        const freq = 1200 + Math.sin(t * 80) * 800;
        const buzz = (t * freq) % 1 > 0.5 ? 1 : -1;
        const sparkNoise = (pseudoRandom(i, 333) * 2 - 1) * 0.4;
        const ampEnv = Math.exp(-t * 5.0);
        samples[i] = Math.tanh((buzz * 0.4 + sparkNoise) * 2.0) * ampEnv * 0.8;
      }
      return samples;
    }

    default:
      throw new Error(`Unknown impact preset: ${preset}`);
  }
}

function pseudoRandom(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed) * 43758.5453;
  return x - Math.floor(x);
}

export function writeWavFile(outPath: string, samples: Float32Array, sampleRate: number = 44100): void {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const buffer = Buffer.alloc(44 + samples.length * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }

  fs.writeFileSync(outPath, buffer);
}
