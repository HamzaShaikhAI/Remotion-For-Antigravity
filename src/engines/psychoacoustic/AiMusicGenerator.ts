import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface SoundtrackMetadata {
  prompt: string;
  durationSec: number;
  bpm: number;
  engine: 'ace-step-1.5' | 'procedural-synthesizer' | 'api-webhook';
  dropOffsetSec: number;
  transients: number[]; // Frame numbers at 60 FPS for downbeats
  generatedAt: string;
  status: 'success' | 'simulated';
  audioPath: string;
}

export class AiMusicGenerator {
  /**
   * Generates or synthesizes a bespoke soundtrack matched to video timing and tempo.
   * Supports ACE-Step 1.5 local/API integration with automatic fallback to procedural synthesis.
   */
  public static async generateSoundtrack(
    prompt: string,
    durationSec: number = 30,
    bpm: number = 128,
    outPath: string = 'public/audio/custom_soundtrack.mp3'
  ): Promise<SoundtrackMetadata> {
    console.log(`🎵 [REA Music Engine] Synthesizing custom soundtrack...`);
    console.log(`   Prompt: "${prompt}"`);
    console.log(`   Parameters: ${durationSec}s duration @ ${bpm} BPM`);

    const resolvedPath = path.resolve(process.cwd(), outPath);
    const parentDir = path.dirname(resolvedPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // 1. Detect ACE-Step 1.5 Engine (Local GGUF/Quantized under 4GB or CLI bridge)
    let engineUsed: 'ace-step-1.5' | 'procedural-synthesizer' | 'api-webhook' = 'procedural-synthesizer';
    const aceStepBinary = process.env.ACESTEP_BIN || 'acestep';
    const aceStepModel = process.env.ACESTEP_MODEL_PATH;

    let generatedWithAceStep = false;
    if (aceStepModel && fs.existsSync(aceStepModel)) {
      try {
        console.log(`⚡ [REA Music] Detected ACE-Step 1.5 weights at: ${aceStepModel}`);
        execSync(
          `"${aceStepBinary}" --model "${aceStepModel}" --prompt "${prompt}" --duration ${durationSec} --bpm ${bpm} --out "${resolvedPath}"`,
          { stdio: 'pipe' }
        );
        generatedWithAceStep = true;
        engineUsed = 'ace-step-1.5';
        console.log(`✔ [REA Music] Successfully generated audio using ACE-Step 1.5!`);
      } catch (err: any) {
        console.warn(`⚠ [REA Music] ACE-Step execution fallback triggered: ${err.message}`);
      }
    }

    // 2. High-Fidelity Procedural Audio Synthesizer (Zero-dependency fallback)
    // Generates a rich, harmonic musical bed with an 808 sub-bass drop, chord arpeggios, and rhythmic beats
    if (!generatedWithAceStep) {
      console.log(`🎹 [REA Music] Utilizing REA Harmonic Sound Engine to synthesize ${durationSec}s @ ${bpm} BPM...`);
      const sampleRate = 44100;
      const numSamples = Math.floor(sampleRate * durationSec);
      const buffer = Buffer.alloc(44 + numSamples * 2);

      // Standard PCM WAV Header
      buffer.write('RIFF', 0);
      buffer.writeUInt32LE(36 + numSamples * 2, 4);
      buffer.write('WAVE', 8);
      buffer.write('fmt ', 12);
      buffer.writeUInt32LE(16, 16);
      buffer.writeUInt16LE(1, 20); // PCM
      buffer.writeUInt16LE(1, 22); // mono
      buffer.writeUInt32LE(sampleRate, 24);
      buffer.writeUInt32LE(sampleRate * 2, 28);
      buffer.writeUInt16LE(2, 32);
      buffer.writeUInt16LE(16, 34);
      buffer.write('data', 36);
      buffer.writeUInt32LE(numSamples * 2, 40);

      const beatPeriod = 60 / bpm;
      const dropTime = Math.min(12, durationSec * 0.4); // 808 drop point

      // Harmonic chords (Root, minor 3rd, 5th, octave)
      const baseFreq = 55; // A1 bass note (55 Hz)

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const beatProgress = (t % beatPeriod) / beatPeriod;

        // 808 Sub-bass kick on each downbeat
        const kickEnv = Math.exp(-beatProgress * 12);
        const kickFreq = 65 * Math.exp(-beatProgress * 8) + 38;
        const kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv;

        // Ambient atmospheric synth pad
        const padChord =
          Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.15 +
          Math.sin(2 * Math.PI * baseFreq * 2.4 * t) * 0.12 +
          Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.1;

        // High-frequency hi-hat sizzle on off-beats
        const hatEnv = Math.exp(-((beatProgress + 0.5) % 1) * 30);
        const hat = (Math.random() * 2 - 1) * hatEnv * 0.08;

        // 808 Sub drop expansion past dropTime
        const dropMultiplier = t >= dropTime ? 1.4 : 0.6;
        const subBass = t >= dropTime ? Math.sin(2 * Math.PI * 45 * t) * 0.35 : 0;

        let sampleVal = (kick * 0.5 + padChord * 0.3 + hat + subBass) * dropMultiplier;
        sampleVal = Math.max(-1, Math.min(1, sampleVal));
        buffer.writeInt16LE(Math.floor(sampleVal * 32767), 44 + i * 2);
      }

      // Write temp wav then convert to target format if .mp3
      const tempWav = resolvedPath.replace(/\.mp3$/, '.wav');
      fs.writeFileSync(tempWav, buffer);

      if (resolvedPath.endsWith('.mp3')) {
        try {
          const ffmpeg = path.resolve('bin', 'ffmpeg', 'ffmpeg.exe');
          const ffmpegCmd = fs.existsSync(ffmpeg) ? `"${ffmpeg}"` : 'ffmpeg';
          execSync(`${ffmpegCmd} -y -i "${tempWav}" -b:a 192k "${resolvedPath}"`, { stdio: 'ignore' });
          if (fs.existsSync(tempWav)) fs.unlinkSync(tempWav);
        } catch {
          // If ffmpeg mp3 encoding is unavailable, keep the valid wav container
          fs.writeFileSync(resolvedPath, buffer);
        }
      } else {
        fs.writeFileSync(resolvedPath, buffer);
      }
    }

    // 3. Calculate Transients & Downbeat Frame Offsets (for Remotion Visual Locking)
    const fps = 60;
    const beatPeriod = 60 / bpm;
    const totalBeats = Math.floor(durationSec / beatPeriod);
    const transients: number[] = [];
    for (let b = 0; b < totalBeats; b++) {
      transients.push(Math.round(b * beatPeriod * fps));
    }

    const dropOffsetSec = Math.min(12, durationSec * 0.4);

    const metadata: SoundtrackMetadata = {
      prompt,
      durationSec,
      bpm,
      engine: engineUsed,
      dropOffsetSec,
      transients,
      generatedAt: new Date().toISOString(),
      status: 'success',
      audioPath: path.relative(process.cwd(), resolvedPath).replace(/\\/g, '/'),
    };

    // Save companion metadata file for Remotion visualization components
    const metaPath = `${resolvedPath}.meta.json`;
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

    console.log(`✔ Soundtrack successfully compiled and saved to: ${resolvedPath}`);
    console.log(`✔ Metadata & beat transient map saved to: ${metaPath}`);
    console.log(`   Engine: ${engineUsed} | Total Downbeats: ${transients.length}`);

    return metadata;
  }
}
