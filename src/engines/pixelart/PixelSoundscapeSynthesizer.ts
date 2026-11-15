import fs from 'fs';
import path from 'path';

/**
 * PixelSoundscapeSynthesizer.ts
 * Pure Node.js Atmospheric Procedural Audio Engine for Living Pixel Art
 * Synthesizes a 44.1 kHz 16-bit PCM WAV with rain, water lap, thunder & night insects.
 */

export class PixelSoundscapeSynthesizer {
  /**
   * Pure Node.js 16-bit Mono PCM WAV Writer
   */
  static writeWav(filePath: string, samples: Float32Array, sampleRate: number = 44100): string {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = samples.length * 2;
    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);

    // fmt subchunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);          // Subchunk1Size (16 for PCM)
    buffer.writeUInt16LE(1, 20);           // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22); // NumChannels
    buffer.writeUInt32LE(sampleRate, 24);  // SampleRate
    buffer.writeUInt32LE(byteRate, 28);    // ByteRate
    buffer.writeUInt16LE(blockAlign, 32);  // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);// BitsPerSample

    // data subchunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    // Write 16-bit clamped PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      buffer.writeInt16LE(Math.round(val), offset);
      offset += 2;
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  /**
   * Generates a 10.0-second seamless looping rain & ambient soundscape
   */
  static generateRainAmbientTrack(durationSec: number = 10, sampleRate: number = 44100): Float32Array {
    const totalSamples = Math.floor(durationSec * sampleRate);
    const samples = new Float32Array(totalSamples);

    // Deterministic pseudo-random generator
    let seed = 123456789;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    // Filter state for rain noise (simple 2-pole lowpass/bandpass)
    let lp1 = 0;
    let lp2 = 0;
    let hp1 = 0;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;

      // 1. Continuous Rain Bed (Bandpass-filtered white noise)
      const white = rng() * 2 - 1;
      // Lowpass at ~2.5kHz
      lp1 += 0.22 * (white - lp1);
      lp2 += 0.22 * (lp1 - lp2);
      // Highpass at ~700Hz
      hp1 += 0.08 * (lp2 - hp1);
      const rainNoise = (lp2 - hp1) * 0.16;

      // 2. Individual Rain Drops (Random micro-transients)
      let dropSound = 0;
      if (rng() < 0.00035) {
        // High frequency droplet chirp
        const dropFreq = 1600 + rng() * 1200;
        const dropDecay = Math.exp(-((i % 800) / 120));
        dropSound = Math.sin(2 * Math.PI * dropFreq * t) * dropDecay * 0.09;
      }

      // 3. Lake Water Lapping (Low-mid frequency organic swell)
      const waterMod = Math.sin(2 * Math.PI * 0.2 * t) * 0.5 + 0.5;
      const waterSwell = Math.sin(2 * Math.PI * 110 * t + Math.sin(t * 3) * 0.5) * waterMod * 0.04;

      // 4. Distant Night Crickets / Cicadas (Subtle 4.8kHz ring modulation)
      const cricketCarrier = Math.sin(2 * Math.PI * 4800 * t);
      const cricketChirp = Math.sin(2 * Math.PI * 18 * t) > 0.4 ? 1 : 0;
      const cricketAmp = (Math.sin(2 * Math.PI * 0.6 * t) * 0.5 + 0.5) * cricketChirp * 0.012;
      const cricket = cricketCarrier * cricketAmp;

      // 5. Distant Thunder Rumble (Hits gently around t = 3.5s)
      let thunder = 0;
      if (t >= 3.0 && t <= 7.0) {
        const thunderT = t - 3.0;
        const thunderEnvelope = Math.exp(-thunderT * 0.9) * Math.sin(thunderT * 1.5);
        const thunderNoise = (rng() * 2 - 1) * 0.03;
        const thunderSub = Math.sin(2 * Math.PI * 42 * thunderT) * 0.06;
        thunder = (thunderSub + thunderNoise) * Math.max(0, thunderEnvelope);
      }

      // Sum all layers
      samples[i] = rainNoise + dropSound + waterSwell + cricket + thunder;
    }

    // 6. Seamless Loop Crossfade (50ms equal power at boundary)
    const crossfadeSamples = Math.floor(0.05 * sampleRate);
    for (let i = 0; i < crossfadeSamples; i++) {
      const alpha = i / crossfadeSamples;
      const startIdx = i;
      const endIdx = totalSamples - crossfadeSamples + i;

      const fadeOut = Math.cos(alpha * (Math.PI / 2));
      const fadeIn = Math.sin(alpha * (Math.PI / 2));

      samples[startIdx] = samples[startIdx] * fadeIn + samples[endIdx] * fadeOut;
    }

    return samples;
  }

  /**
   * Synthesizes and writes the track to disk
   */
  static synthesizeToPath(outPath: string, durationSec: number = 10): string {
    const samples = this.generateRainAmbientTrack(durationSec, 44100);
    this.writeWav(outPath, samples, 44100);
    return outPath;
  }
}
