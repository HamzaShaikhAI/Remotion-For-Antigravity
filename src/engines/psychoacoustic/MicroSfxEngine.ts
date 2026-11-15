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
  | 'servo_whirr'
  | 'camera_shutter'
  | 'keyboard_keystroke'
  | 'space_laser'
  | 'sword_clash'
  | 'heavy_bass_drop'
  | 'glitch_burst'
  | 'cinematic_riser'
  | 'tape_stop'
  | 'bubble_pop'
  | 'electric_spark'
  | 'coin_pickup'
  | 'cinematic_boom'
  | 'ui_toggle'
  | 'countdown_beep';

export interface SfxCue {
  timeSec?: number;
  frame?: number;
  preset?: MicroSfxPreset;
  sfx?: MicroSfxPreset;
  volume?: number; // 0.0 to 1.0 (default 0.8)
  gain?: number;
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
    if (preset === 'camera_shutter') durationSec = 0.22;
    if (preset === 'keyboard_keystroke') durationSec = 0.06;
    if (preset === 'space_laser') durationSec = 0.28;
    if (preset === 'sword_clash') durationSec = 0.45;
    if (preset === 'heavy_bass_drop') durationSec = 0.85;
    if (preset === 'glitch_burst') durationSec = 0.18;
    if (preset === 'cinematic_riser') durationSec = 1.20;
    if (preset === 'tape_stop') durationSec = 0.55;
    if (preset === 'bubble_pop') durationSec = 0.14;
    if (preset === 'electric_spark') durationSec = 0.16;
    if (preset === 'coin_pickup') durationSec = 0.35;
    if (preset === 'cinematic_boom') durationSec = 1.40;
    if (preset === 'ui_toggle') durationSec = 0.08;
    if (preset === 'countdown_beep') durationSec = 0.12;

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
      case 'camera_shutter': {
        // Mirror flip + curtain slide + latch click
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const click1 = Math.exp(-t * 120.0) * Math.sin(2 * Math.PI * 2800 * t);
          const slide = t > 0.04 && t < 0.16 ? (rng() * 2 - 1) * Math.sin(Math.PI * ((t - 0.04) / 0.12)) * 0.4 : 0;
          const click2 = t > 0.14 ? Math.exp(-(t - 0.14) * 90.0) * Math.sin(2 * Math.PI * 3400 * (t - 0.14)) : 0;
          samples[i] = (click1 * 0.7 + slide + click2 * 0.8) * 0.9;
        }
        break;
      }
      case 'keyboard_keystroke': {
        // Crisp tactile mechanical switch click
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 110.0);
          const t1 = Math.sin(2 * Math.PI * 3800 * t);
          const t2 = Math.sin(2 * Math.PI * 2900 * t) * 0.5;
          const noise = (rng() * 2 - 1) * 0.25;
          samples[i] = (t1 + t2 + noise) * env * 0.85;
        }
        break;
      }
      case 'space_laser': {
        // Downward exponential frequency modulation sweep
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 12.0);
          const freq = 3600 * Math.exp(-t * 22.0) + 180;
          const tone = Math.sin(2 * Math.PI * freq * t);
          samples[i] = Math.tanh(tone * 1.8) * env * 0.85;
        }
        break;
      }
      case 'sword_clash': {
        // Metallic blade collision with high harmonic ring
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 7.5);
          const noise = t < 0.015 ? (rng() * 2 - 1) * 0.8 : 0;
          const ring =
            Math.sin(2 * Math.PI * 2200 * t) * 0.45 +
            Math.sin(2 * Math.PI * 3350 * t) * 0.35 +
            Math.sin(2 * Math.PI * 5400 * t) * 0.2;
          samples[i] = (ring + noise) * env * 0.9;
        }
        break;
      }
      case 'heavy_bass_drop': {
        // Deep sub-bass 808 drop
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 3.8);
          const freq = 120 * Math.exp(-t * 4.2) + 36;
          const sub = Math.sin(2 * Math.PI * freq * t);
          samples[i] = Math.tanh(sub * 1.5) * env * 0.95;
        }
        break;
      }
      case 'glitch_burst': {
        // Bitcrushed stepped noise
        let holdVal = 0;
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.sin(Math.PI * (t / durationSec));
          if (i % 8 === 0) holdVal = rng() * 2 - 1;
          samples[i] = holdVal * env * 0.75;
        }
        break;
      }
      case 'cinematic_riser': {
        // Exponential tension pitch and noise riser
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const prog = t / durationSec;
          const env = Math.pow(prog, 1.8);
          const freq = 120 + Math.pow(prog, 2.4) * 1680;
          const tone = Math.sin(2 * Math.PI * freq * t);
          const noise = (rng() * 2 - 1) * 0.35;
          samples[i] = (tone * 0.65 + noise * 0.35) * env * 0.85;
        }
        break;
      }
      case 'tape_stop': {
        // Pitch dive and friction brake
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const prog = t / durationSec;
          const speed = Math.max(0.01, 1 - Math.pow(prog, 1.5));
          const freq = (320 + Math.sin(2 * Math.PI * 4 * t) * 50) * speed;
          const noise = (rng() * 2 - 1) * 0.15;
          samples[i] = (Math.sin(2 * Math.PI * freq * t) * 0.7 + noise) * speed * 0.8;
        }
        break;
      }
      case 'bubble_pop': {
        // Watery resonant pop
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 40.0);
          const freq = 600 + Math.sin(2 * Math.PI * 30.0 * t) * 400 + (t < 0.04 ? 800 * (1 - t / 0.04) : 0);
          samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.9;
        }
        break;
      }
      case 'electric_spark': {
        // Sharp erratic high-voltage crackle
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 24.0);
          const spark = rng() > 0.82 ? (rng() * 2 - 1) * 0.95 : 0;
          const highTone = Math.sin(2 * Math.PI * 5800 * t) * 0.3;
          samples[i] = (spark + highTone) * env * 0.85;
        }
        break;
      }
      case 'coin_pickup': {
        // Classic retro 8-bit double chime
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          let freq = 988; // B5
          let env = Math.exp(-t * 8.0);
          if (t >= 0.07) {
            freq = 1318.5; // E6
            env = Math.exp(-(t - 0.07) * 9.0);
          }
          const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.6 : -0.6;
          samples[i] = square * env * 0.8;
        }
        break;
      }
      case 'cinematic_boom': {
        // Massive 45Hz sub boom with initial impact click
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 2.8);
          const freq = 85 * Math.exp(-t * 8.0) + 38;
          const click = t < 0.012 ? (rng() * 2 - 1) * 0.8 : 0;
          const sub = Math.sin(2 * Math.PI * freq * t);
          samples[i] = (Math.tanh(sub * 1.6) * 0.85 + click) * env * 0.95;
        }
        break;
      }
      case 'ui_toggle': {
        // Subtle clean modern UI switch
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.exp(-t * 70.0);
          const tone = Math.sin(2 * Math.PI * 2600 * t) * 0.6 + Math.sin(2 * Math.PI * 1800 * t) * 0.4;
          samples[i] = tone * env * 0.8;
        }
        break;
      }
      case 'countdown_beep': {
        // Studio standard 1000Hz sync tone
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          const env = Math.sin(Math.PI * (t / durationSec));
          const tone = Math.sin(2 * Math.PI * 1000 * t);
          samples[i] = tone * env * 0.85;
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
    totalDurationSecOrFrames: number,
    outputPathOrFps?: string | number,
    sampleRateOrPath?: number | string
  ): string {
    let fps = 60;
    let outputPath = 'public/audio/synthesized_sfx.wav';
    let sampleRate = 44100;
    let totalDurationSec = totalDurationSecOrFrames;

    if (typeof outputPathOrFps === 'number') {
      fps = outputPathOrFps;
      totalDurationSec = totalDurationSecOrFrames / fps;
      if (typeof sampleRateOrPath === 'string') {
        outputPath = sampleRateOrPath;
      }
    } else if (typeof outputPathOrFps === 'string') {
      outputPath = outputPathOrFps;
      if (typeof sampleRateOrPath === 'number') {
        sampleRate = sampleRateOrPath;
      }
    }

    const totalSamples = Math.floor(sampleRate * totalDurationSec);
    const masterBuffer = new Float32Array(totalSamples);

    for (const cue of cues) {
      let timeSec = cue.timeSec;
      if (timeSec === undefined && cue.frame !== undefined) {
        timeSec = cue.frame / fps;
      }
      if (timeSec === undefined) timeSec = 0;
      const startIdx = Math.floor(timeSec * sampleRate);
      if (startIdx >= totalSamples) continue;

      const preset = cue.preset || cue.sfx || 'mechanical_click';
      const vol = cue.volume ?? cue.gain ?? 0.8;
      const sfxSamples = this.synthesizePreset(preset, sampleRate);

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
