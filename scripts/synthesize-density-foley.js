/**
 * scripts/synthesize-density-foley.js
 * Pure Node.js 44.1 kHz 16-Bit Mono PCM Micro-Timed SFX Generator
 * Calibrated to 1.20 SFX hits/sec (one tactile sound every 25 frames @ 30 FPS)
 * 
 * 1. PaperStyleEngine: 19 cues across 480 frames (16s @ 30 FPS) -> public/audio/paper_foley_480f.wav
 * 2. RicksClipsSecondDrawShowcase: 68 cues across 1,684 frames (56.13s @ 30 FPS) -> public/audio/western_foley_1684f.wav
 */

const fs = require('fs');
const path = require('path');

function synthesizePreset(preset, sampleRate = 44100) {
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
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 35.0);
        const freq = 1200 * Math.exp(-t * 45.0) + 220;
        samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.9;
      }
      break;
    }
    case 'whoosh_fast': {
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
    case 'bell_ding': {
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 4.5);
        const fundamental = Math.sin(2 * Math.PI * 1760 * t);
        const harmonic1 = Math.sin(2 * Math.PI * 3520 * t) * 0.35;
        const harmonic2 = Math.sin(2 * Math.PI * 5280 * t) * 0.12;
        const shimmer = Math.sin(2 * Math.PI * 880 * t) * 0.2;
        samples[i] = (fundamental + harmonic1 + harmonic2 + shimmer) * env * 0.75;
      }
      break;
    }
    case 'servo_whirr': {
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const env = Math.sin(Math.PI * (t / durationSec));
        const freq = 480 + Math.sin(2 * Math.PI * 35 * t) * 120;
        const buzz = (rng() * 2 - 1) * 0.15;
        samples[i] = (Math.sin(2 * Math.PI * freq * t) * 0.7 + buzz) * env * 0.6;
      }
      break;
    }
    default: {
      for (let i = 0; i < numSamples; i++) {
        samples[i] = (rng() * 2 - 1) * 0.1;
      }
    }
  }

  return samples;
}

function generateMultiTrackSfx(cues, totalDurationSec, outputPath, sampleRate = 44100) {
  const totalSamples = Math.floor(sampleRate * totalDurationSec);
  const masterBuffer = new Float32Array(totalSamples);

  for (const cue of cues) {
    const startIdx = Math.floor(cue.timeSec * sampleRate);
    if (startIdx >= totalSamples) continue;

    const sfxSamples = synthesizePreset(cue.preset, sampleRate);
    const vol = cue.volume ?? 0.8;

    for (let i = 0; i < sfxSamples.length; i++) {
      const targetIdx = startIdx + i;
      if (targetIdx < totalSamples) {
        masterBuffer[targetIdx] += sfxSamples[i] * vol;
      }
    }
  }

  for (let i = 0; i < totalSamples; i++) {
    masterBuffer[i] = Math.tanh(masterBuffer[i] * 0.95);
  }

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

function scheduleDensityCues(options) {
  const {
    totalFrames,
    fps = 30,
    hitsPerSec = 1.20,
    presets,
    baseVolume = 0.6,
    startFrame = 0,
  } = options;

  const intervalFrames = Math.max(1, Math.round(fps / hitsPerSec));
  const cues = [];

  let cueIndex = 0;
  for (let currentFrame = startFrame; currentFrame < totalFrames; currentFrame += intervalFrames) {
    const hash = (currentFrame * 1664525 + cueIndex * 1013904223 + 12345) >>> 0;
    const presetIdx = hash % presets.length;
    const selectedPreset = presets[presetIdx];
    const volumeVar = ((hash & 0xff) / 255 - 0.5) * 0.12;
    const volume = Math.min(1.0, Math.max(0.1, Number((baseVolume + volumeVar).toFixed(2))));
    const timeSec = Number((currentFrame / fps).toFixed(3));

    cues.push({
      timeSec,
      preset: selectedPreset,
      volume,
    });

    cueIndex++;
  }

  return cues;
}

function synthesizeDensityFoley() {
  console.log('🎙️ [REA SfxDensityScheduler] Synthesizing 1.20 hits/sec tactile foley soundscapes...\n');

  const audioDir = path.resolve(__dirname, '../public/audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  // 1. Paper Style Engine (480 frames = 16.0s @ 30fps)
  const paperPresets = ['paper_slide', 'card_pop', 'paper_tear', 'whoosh_fast', 'mechanical_click'];
  const paperCues = scheduleDensityCues({
    totalFrames: 480,
    fps: 30,
    hitsPerSec: 1.20,
    presets: paperPresets,
    baseVolume: 0.65,
  });

  const paperOut = path.join(audioDir, 'paper_foley_480f.wav');
  generateMultiTrackSfx(paperCues, 480 / 30, paperOut, 44100);
  console.log(`✔ Paper Foley generated: ${paperCues.length} cues across 480 frames (16.0s) -> ${paperOut}`);

  // 2. RicksClips Western Standoff & Saloon (1684 frames = 56.13s @ 30fps)
  const westernPresets = ['whoosh_fast', 'impact_thud', 'card_pop', 'paper_slide', 'mechanical_click'];
  const westernCues = scheduleDensityCues({
    totalFrames: 1684,
    fps: 30,
    hitsPerSec: 1.20,
    presets: westernPresets,
    baseVolume: 0.42,
  });

  const westernOut = path.join(audioDir, 'western_foley_1684f.wav');
  generateMultiTrackSfx(westernCues, 1684 / 30, westernOut, 44100);
  console.log(`✔ Western Foley generated: ${westernCues.length} cues across 1,684 frames (56.13s) -> ${westernOut}`);

  // 3. REA System Architecture Showcase (2700 frames = 45.0s @ 60fps)
  const architecturePresets = ['mechanical_click', 'whoosh_fast', 'card_pop', 'paper_slide', 'impact_thud', 'bell_ding'];
  const architectureCues = scheduleDensityCues({
    totalFrames: 2700,
    fps: 60,
    hitsPerSec: 1.20,
    presets: architecturePresets,
    baseVolume: 0.58,
  });

  const architectureOut = path.join(audioDir, 'rea_architecture_foley_2700f.wav');
  generateMultiTrackSfx(architectureCues, 2700 / 60, architectureOut, 44100);
  console.log(`✔ Architecture Foley generated: ${architectureCues.length} cues across 2,700 frames (45.0s) -> ${architectureOut}`);

  // 4. Ambient Electronic / Lo-Fi Studio Underscore (45.0s @ 118 BPM)
  const musicOut = path.join(audioDir, 'rea_architecture_music_45s.wav');
  synthesizeAmbientLoFiScore(45.0, musicOut, 44100);
  console.log(`✔ Ambient Lo-Fi Studio Score synthesized: 45.0s @ 118 BPM -> ${musicOut}`);

  console.log('\n✨ All foley tracks synthesized deterministically with 16-bit 44.1kHz PCM fidelity.');
}

function synthesizeAmbientLoFiScore(durationSec = 45.0, outputPath, sampleRate = 44100) {
  const totalSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(totalSamples);
  const bpm = 118;
  const beatSec = 60 / bpm;
  const barSec = beatSec * 4;

  const chordProgression = [
    { bass: 87.31, freqs: [174.61, 220.00, 261.63, 329.63] }, // Fmaj7
    { bass: 98.00, freqs: [196.00, 246.94, 293.66, 349.23] }, // G7
    { bass: 110.00, freqs: [220.00, 261.63, 329.63, 392.00] }, // Am7
    { bass: 82.41, freqs: [164.81, 196.00, 246.94, 293.66] }, // Em7
  ];

  let seed = 999;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const barIndex = Math.floor(t / barSec) % chordProgression.length;
    const chord = chordProgression[barIndex];
    const tInBar = t % barSec;

    // Warm Rhodes / Pad synth
    const env = Math.exp(-tInBar * 0.45) * 0.28 + 0.12 * Math.sin(Math.PI * (tInBar / barSec));
    let chordTone = 0;
    for (const freq of chord.freqs) {
      const vibrato = Math.sin(2 * Math.PI * 4.5 * t) * 0.8;
      chordTone += Math.sin(2 * Math.PI * (freq + vibrato) * t) * 0.25;
      chordTone += Math.sin(2 * Math.PI * (freq * 2) * t) * 0.08;
    }

    // Sub-bass sine
    const bassEnv = Math.exp(-(t % beatSec) * 2.5) * 0.35 + 0.15;
    const subBass = Math.sin(2 * Math.PI * chord.bass * t) * bassEnv;

    // Soft tape warmth & subtle vinyl air
    const vinyl = (rng() * 2 - 1) * 0.006;

    buffer[i] = (chordTone * env + subBass * 0.4 + vinyl);
  }

  // Master brickwall limiter & soft saturation
  for (let i = 0; i < totalSamples; i++) {
    buffer[i] = Math.tanh(buffer[i] * 1.15) * 0.88;
  }

  // Write WAV
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = totalSamples * 2;
  const wavBuffer = Buffer.alloc(44 + dataSize);

  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(36 + dataSize, 4);
  wavBuffer.write('WAVE', 8);
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16);
  wavBuffer.writeUInt16LE(1, 20);
  wavBuffer.writeUInt16LE(numChannels, 22);
  wavBuffer.writeUInt32LE(sampleRate, 24);
  wavBuffer.writeUInt32LE(byteRate, 28);
  wavBuffer.writeUInt16LE(blockAlign, 32);
  wavBuffer.writeUInt16LE(bitsPerSample, 34);
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    wavBuffer.writeInt16LE(Math.round(val), offset);
    offset += 2;
  }

  fs.writeFileSync(outputPath, wavBuffer);
}

if (require.main === module) {
  synthesizeDensityFoley();
}

module.exports = { synthesizeDensityFoley, scheduleDensityCues, generateMultiTrackSfx, synthesizePreset };
