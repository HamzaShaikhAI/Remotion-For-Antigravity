import * as fs from 'fs';
import * as path from 'path';

export type FoleyPreset = 'sword_clash' | 'energy_charge' | 'sonic_boom' | 'thunder_strike';

/**
 * Pure Node.js 44.1 kHz 16-Bit Mono PCM Procedural Foley Generator
 * Generates custom combat SFX without relying on third-party sound libraries.
 */
export class ProceduralFoleyGenerator {
  public static generateFoleyWav(
    preset: FoleyPreset,
    outputPath: string,
    sampleRate: number = 44100
  ): string {
    let durationSec = 1.0;
    if (preset === 'energy_charge') durationSec = 2.0;
    if (preset === 'thunder_strike') durationSec = 1.5;
    if (preset === 'sonic_boom') durationSec = 1.2;

    const totalSamples = Math.floor(sampleRate * durationSec);
    const samples = new Float32Array(totalSamples);

    switch (preset) {
      case 'sword_clash': {
        // High harmonic metallic chime (2400Hz + 3600Hz + 5200Hz) with sharp decay
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 9.0);
          const chime =
            Math.sin(2 * Math.PI * 2400 * t) * 0.4 +
            Math.sin(2 * Math.PI * 3650 * t) * 0.35 +
            Math.sin(2 * Math.PI * 5200 * t) * 0.25;
          const click = t < 0.01 ? (Math.random() * 2 - 1) * 0.8 : 0;
          samples[i] = (chime * env + click) * 0.85;
        }
        break;
      }
      case 'energy_charge': {
        // Rising pitch sweep from 60Hz to 380Hz with 12Hz LFO vibrato
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const progress = t / durationSec;
          const env = Math.min(1, t * 2) * (1 - progress * 0.2);
          const freq = 60 + Math.pow(progress, 2.2) * 320;
          const lfo = Math.sin(2 * Math.PI * 12 * t) * 15;
          const tone = Math.sin(2 * Math.PI * (freq + lfo) * t);
          samples[i] = tone * env * 0.75;
        }
        break;
      }
      case 'sonic_boom': {
        // Heavy 40Hz sub-punch with exponential decay and air disturbance
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 3.5);
          const freq = 120 * Math.exp(-t * 12) + 38;
          const sub = Math.sin(2 * Math.PI * freq * t);
          const air = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.3;
          samples[i] = (sub + air) * env * 0.95;
        }
        break;
      }
      case 'thunder_strike': {
        // Initial crack (high-pass noise) followed by heavy rumble (45Hz)
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const crack = t < 0.05 ? (Math.random() * 2 - 1) * Math.exp(-t * 35) : 0;
          const rumbleEnv = Math.exp(-t * 2.2) * Math.min(1, t * 15);
          const rumble = Math.sin(2 * Math.PI * 48 * t) * 0.7 + Math.sin(2 * Math.PI * 92 * t) * 0.3;
          samples[i] = (crack * 0.9 + rumble * rumbleEnv) * 0.9;
        }
        break;
      }
    }

    // Convert Float32 samples to 16-bit PCM WAV
    const buffer = Buffer.alloc(44 + totalSamples * 2);

    // RIFF chunk descriptor
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + totalSamples * 2, 4);
    buffer.write('WAVE', 8);

    // fmt sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32); // Block align
    buffer.writeUInt16LE(16, 34); // Bits per sample

    // data sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(totalSamples * 2, 40);

    for (let i = 0; i < totalSamples; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
    }

    const resolvedOut = path.resolve(outputPath);
    const dir = path.dirname(resolvedOut);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(resolvedOut, buffer);
    return resolvedOut;
  }
}
