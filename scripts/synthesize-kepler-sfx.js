/**
 * scripts/synthesize-kepler-sfx.js
 * Synthesizes:
 * public/audio/kepler_hardware_event_locked_sfx.wav
 * Aligned 1:1 with KeplerBridgeHardwareShowcase keyframes.
 */

const fs = require('fs');
const path = require('path');
const { MicroSfxEngine } = require('../src/engines/psychoacoustic/MicroSfxEngine');
const {
  buildKeplerShowcaseSfxTimeline,
  KEPLER_TOTAL_FRAMES,
  KEPLER_FPS,
} = require('../src/compositions/keplerShowcaseEvents');

const sampleRate = 44100;

function createWavBuffer(samples, sampleRate = 44100) {
  const numSamples = samples.length;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * 2;
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
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    buffer.writeInt16LE(Math.round(val), offset);
    offset += 2;
  }
  return buffer;
}

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('⚡ Synthesizing frame-exact KeplerBridge hardware showcase SFX timeline...');
const cues = buildKeplerShowcaseSfxTimeline();
console.log(`   Generated ${cues.length} frame-accurate audio cues across ${KEPLER_TOTAL_FRAMES} frames.`);

const totalDurationSec = KEPLER_TOTAL_FRAMES / KEPLER_FPS;
const totalSamples = Math.floor(sampleRate * totalDurationSec);
const masterBuffer = new Float32Array(totalSamples);

for (const cue of cues) {
  let timeSec = cue.timeSec;
  if (timeSec === undefined && cue.frame !== undefined) {
    timeSec = cue.frame / KEPLER_FPS;
  }
  if (timeSec === undefined) timeSec = 0;
  const startIdx = Math.floor(timeSec * sampleRate);
  if (startIdx >= totalSamples) continue;

  const preset = cue.preset || cue.sfx || 'mechanical_click';
  const vol = cue.volume ?? cue.gain ?? 0.8;
  const sfxSamples = MicroSfxEngine.synthesizePreset(preset, sampleRate);

  for (let i = 0; i < sfxSamples.length; i++) {
    const targetIdx = startIdx + i;
    if (targetIdx < totalSamples) {
      masterBuffer[targetIdx] += sfxSamples[i] * vol;
    }
  }
}

// Master limiter
for (let i = 0; i < totalSamples; i++) {
  masterBuffer[i] = Math.tanh(masterBuffer[i] * 1.15);
}

const wavPath = path.join(outDir, 'kepler_hardware_event_locked_sfx.wav');
fs.writeFileSync(wavPath, createWavBuffer(masterBuffer, sampleRate));
console.log(`✔ Written event-locked foley WAV to: ${wavPath} (${fs.statSync(wavPath).size} bytes)`);
