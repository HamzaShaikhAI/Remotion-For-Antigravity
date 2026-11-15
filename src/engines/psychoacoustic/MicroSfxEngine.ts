import * as fs from 'fs';
import * as path from 'path';

export type MicroSfxPreset =
  | 'paper_slide'
  | 'paper_tear'
  | 'card_pop'
  | 'whoosh_fast'
  | 'impact_thud'
  | 'mechanical_click'
  | 'water_drip'
  | 'bell_ding'
  | 'vinyl_crackle'
  | 'servo_whirr';

export interface SfxCue {
  timeSec: number;
  preset: MicroSfxPreset;
  volume?: number; // 0.0 to 1.0 (default 0.8)
}

/**
 * MicroSfxEngine.ts
 * Pure Node.js 44.1 kHz 16-Bit Mono PCM Micro-Timed SFX Generator
 * Synthesizes and mixes multi-track sound effects directly onto visual keyframe timelines.
 */
export class MicroSfxEngine {
  /**
   * Synthesizes raw Float32 samples for a single sound effect preset
   */
  static synthesizePreset(preset: MicroSfxPreset, sampleRate: number = 44100): Float32Array {
    let durationSec = 0.2;
    if (preset === 'paper_slide') durationSec = 0.22;
    if (preset === 'paper_tear') durationSec = 0.35;
    if (preset === 'card_pop') durationSec = 0.12;
    if (preset === 'whoosh_fast') durationSec = 0.18;
    if (preset === 'impact_thud') durationSec = 0.45;
    if (preset === 'mechanical_click') durationSec = 0.08;
    if (preset === 'water_drip') durationSec = 0.15;
    if (preset === 'bell_ding') durationSec = 0.85;
    if (preset === 'vinyl_crackle') durationSec = 0.25;
    if (preset === 'servo_whirr') durationSec = 0.40;

    const numSamples = Math.floor(sampleRate * durationSec);
    const samples = new Float32Array(numSamples);

    let seed = 42;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    switch (preset) {
      case 'paper_slide': {
        // Bandpass noise sweep simulating paper sliding across cardboard
        let lp = 0;
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.sin(Math.PI * (t / durationSec));
          const noise = rng() * 2 - 1;
          lp += 0.18 * (noise - lp);
          samples[i] = lp * env * 0.75;
        }
        break;
      }
      case 'paper_tear': {
        // High-frequency gritty crackle simulating paper tearing
        let lp = 0;
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 8.0) * Math.sin(t * 40);
          const noise = rng() * 2 - 1;
          lp += 0.45 * (noise - lp);
          const crackle = rng() > 0.85 ? (rng() * 2 - 1) * 0.9 : 0;
          samples[i] = (lp * 0.4 + crackle) * Math.abs(env) * 0.85;
        }
        break;
      }
      case 'card_pop': {
        // Resonant acoustic pop with fast pitch drop
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 35.0);
          const freq = 1200 * Math.exp(-t * 45.0) + 220;
          samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.9;
        }
        break;
      }
      case 'whoosh_fast': {
        // Aerodynamic frequency-swept noise
        let lp = 0;
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const prog = t / durationSec;
          const env = Math.sin(Math.PI * prog);
          const centerFreq = 400 + Math.sin(Math.PI * prog) * 1800;
          const coeff = Math.min(0.8, Math.max(0.05, (centerFreq * 2) / sampleRate));
          const noise = rng() * 2 - 1;
          lp += coeff * (noise - lp);
          samples[i] = lp * env * 0.8;
        }
        break;
      }
      case 'impact_thud': {
        // Heavy 55Hz sub-punch with initial transient click
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 6.5);
          const freq = 140 * Math.exp(-t * 22.0) + 52;
          const sub = Math.sin(2 * Math.PI * freq * t);
          const click = t < 0.008 ? (rng() * 2 - 1) * 0.8 : 0;
          samples[i] = (sub * 0.85 + click) * env * 0.95;
        }
        break;
      }
      case 'mechanical_click': {
        // Dual-transient sharp relay click
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env1 = Math.exp(-t * 90.0);
          const env2 = t > 0.018 ? Math.exp(-(t - 0.018) * 75.0) : 0;
          const tone1 = Math.sin(2 * Math.PI * 3200 * t) * env1;
          const tone2 = Math.sin(2 * Math.PI * 2400 * (t - 0.018)) * env2;
          samples[i] = (tone1 * 0.6 + tone2 * 0.4) * 0.85;
        }
        break;
      }
      case 'water_drip': {
        // Downward acoustic water droplet chirp
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 28.0);
          const freq = 2200 * Math.exp(-t * 18.0) + 750;
          samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.85;
        }
        break;
      }
      case 'bell_ding': {
        // Pure harmonic brass chime
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 3.8);
          const tone =
            Math.sin(2 * Math.PI * 2400 * t) * 0.5 +
            Math.sin(2 * Math.PI * 3600 * t) * 0.3 +
            Math.sin(2 * Math.PI * 4800 * t) * 0.2;
          samples[i] = tone * env * 0.8;
        }
        break;
      }
      case 'vinyl_crackle': {
        // Lo-fi dust and crackle burst
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.sin(Math.PI * (t / durationSec));
          const pop = rng() > 0.92 ? (rng() * 2 - 1) * 0.7 : (rng() * 2 - 1) * 0.08;
          samples[i] = pop * env * 0.6;
        }
        break;
      }
      case 'servo_whirr': {
        // PWM modulated mechanical motor sweep
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const prog = t / durationSec;
          const env = Math.sin(Math.PI * prog);
          const freq = 320 + Math.sin(prog * Math.PI) * 280;
          const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
          const lfo = Math.sin(2 * Math.PI * 24 * t) * 0.3;
          samples[i] = (square + lfo) * env * 0.5;
        }
        break;
      }
    }

    return samples;
  }

  /**
   * Generates and mixes a multi-cue SFX soundscape directly into a single 44.1 kHz WAV file
   */
  static generateMultiTrackSfx(
    cues: SfxCue[],
    totalDurationSec: number,
    outputPath: string,
    sampleRate: number = 44100
  ): string {
    const totalSamples = Math.floor(sampleRate * totalDurationSec);
    const masterBuffer = new Float32Array(totalSamples);

    for (const cue of cues) {
      const startIdx = Math.floor(cue.timeSec * sampleRate);
      if (startIdx >= totalSamples) continue;

      const sfxSamples = this.synthesizePreset(cue.preset, sampleRate);
      const vol = cue.volume ?? 0.8;

      for (let i = 0; i < sfxSamples.length; i++) {
        const targetIdx = startIdx + i;
        if (targetIdx < totalSamples) {
          masterBuffer[targetIdx] += sfxSamples[i] * vol;
        }
      }
    }

    // Master limiting / soft clipping to prevent distortion
    for (let i = 0; i < totalSamples; i++) {
      masterBuffer[i] = Math.tanh(masterBuffer[i] * 0.95);
    }

    // Write WAV header and samples
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = totalSamples * 2;
    const buffer = Buffer.alloc(44 + dataSize);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    let offset = 44;
    for (let i = 0; i < totalSamples; i++) {
      const s = Math.max(-1, Math.min(1, masterBuffer[i]));
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      buffer.writeInt16LE(Math.round(val), offset);
      offset += 2;
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    return outputPath;
  }
}
