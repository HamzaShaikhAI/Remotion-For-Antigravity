/**
 * Procedural Studio Background Music Synthesizer
 * Generates 10 diverse, high-production music tracks across multiple genres
 * (Phonk, Synthwave, Lo-Fi, Cinematic Drone, Tech Pulse, Western Standoff, etc.)
 * Output: public/audio/music_library/*.wav & music-catalog.json
 */

import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

function createWavHeader(numSamples, numChannels = 1, sampleRate = 44100, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = (numSamples * numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

function softClip(x) {
  if (x > 1.0) return (2 / Math.PI) * Math.atan(x);
  if (x < -1.0) return (2 / Math.PI) * Math.atan(x);
  return x;
}

function noteToFreq(note) {
  const noteMap = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };
  const match = note.match(/^([A-G][b#]?)(-?\d+)$/);
  if (!match) return 440;
  const name = match[1];
  const oct = parseInt(match[2], 10);
  const semitones = noteMap[name] + (oct + 1) * 12;
  return 440 * Math.pow(2, (semitones - 69) / 12);
}

// Sound generators
function synthKick(t, dur = 0.25) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const freq = 140 * Math.exp(-p * 18) + 38;
  const env = Math.exp(-p * 7);
  return Math.sin(2 * Math.PI * freq * t) * env;
}

function synth808(t, freq = 45, dur = 0.45) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const f = freq * (1 + 0.5 * Math.exp(-p * 20));
  const env = Math.pow(1 - p, 0.7);
  const raw = Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t);
  return Math.tanh(raw * 2.2) * 0.75 * env;
}

function synthSnare(t, dur = 0.22) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const noise = (Math.random() * 2 - 1) * Math.exp(-p * 9);
  const tone = Math.sin(2 * Math.PI * (210 - p * 60) * t) * Math.exp(-p * 14);
  return (noise * 0.7 + tone * 0.5);
}

function synthClap(t, dur = 0.25) {
  if (t < 0 || t > dur) return 0;
  let val = 0;
  const bursts = [0.0, 0.012, 0.024, 0.038];
  for (const b of bursts) {
    if (t >= b) {
      const dt = t - b;
      const env = Math.exp(-dt * 32);
      val += (Math.random() * 2 - 1) * env * 0.45;
    }
  }
  return val;
}

function synthHiHat(t, closed = true, dur = 0.06) {
  const d = closed ? 0.05 : 0.22;
  if (t < 0 || t > d) return 0;
  const p = t / d;
  const noise = (Math.random() * 2 - 1);
  const env = Math.exp(-p * (closed ? 28 : 9));
  // High pass simulation
  return noise * env * 0.4;
}

function synthCowbell(t, freq = 840, dur = 0.2) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const env = Math.exp(-p * 12);
  const f1 = freq;
  const f2 = freq * 1.51;
  const sq1 = Math.sign(Math.sin(2 * Math.PI * f1 * t));
  const sq2 = Math.sign(Math.sin(2 * Math.PI * f2 * t));
  return (sq1 + sq2) * 0.3 * env;
}

function synthPluck(t, freq, dur = 0.35) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const env = Math.exp(-p * 10);
  const raw = Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(4 * Math.PI * freq * t);
  return raw * env;
}

function synthRhodes(t, freq, dur = 1.0) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const env = Math.exp(-p * 3.5);
  const harmonics = [
    Math.sin(2 * Math.PI * freq * t) * 1.0,
    Math.sin(4 * Math.PI * freq * t) * 0.4 * Math.exp(-p * 5),
    Math.sin(6 * Math.PI * freq * t) * 0.15 * Math.exp(-p * 8),
    Math.sin(8 * Math.PI * freq * t) * 0.08 * Math.exp(-p * 12),
  ];
  const bell = Math.sin(2 * Math.PI * freq * 5.2 * t) * 0.2 * Math.exp(-p * 16);
  return (harmonics.reduce((a, b) => a + b, 0) + bell) * env * 0.6;
}

function synthSawPad(t, freq, dur = 2.0) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const attack = Math.min(1, t / 0.15);
  const release = Math.min(1, (dur - t) / 0.2);
  const env = attack * release;
  // Detuned saws
  const detune1 = freq * 0.996;
  const detune2 = freq * 1.004;
  let val = 0;
  for (let k = 1; k <= 7; k++) {
    val += (Math.sin(2 * Math.PI * (freq * k) * t) / k) * 0.5;
    val += (Math.sin(2 * Math.PI * (detune1 * k) * t) / k) * 0.25;
    val += (Math.sin(2 * Math.PI * (detune2 * k) * t) / k) * 0.25;
  }
  return val * env * 0.35;
}

function synthChiptune(t, freq, dur = 0.18, duty = 0.5) {
  if (t < 0 || t > dur) return 0;
  const p = t / dur;
  const phase = (t * freq) % 1;
  const square = phase < duty ? 1 : -1;
  const env = Math.exp(-p * 8);
  return square * env * 0.4;
}

// Track builder functions
const TRACK_GENERATORS = [
  {
    id: 'phonk_drift_160bpm',
    title: 'Neon Drift 160 (Phonk Master)',
    genre: 'Drift Phonk / Hyper-Action',
    bpm: 160,
    durationSec: 12.0, // 8 bars at 160bpm
    description: 'High-octane Memphis phonk with distorted 808 glides, tuned cowbells, and aggressive syncopated claps.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 160;
      const beatLen = 60 / bpm; // 0.375s
      const sixteenth = beatLen / 4; // 0.09375s
      const barLen = beatLen * 4; // 1.5s
      const cowbellNotes = ['E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'E5', 'B5'].map(noteToFreq);
      const bassNotes = ['E1', 'E1', 'G1', 'E1', 'D1', 'E1', 'A1', 'G1'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Kick & 808 on 1 and 3, plus syncopated punch
        const barPos = t % barLen;
        const kickTimes = [0, beatLen * 1.5, beatLen * 2, beatLen * 3.5];
        for (const kt of kickTimes) {
          const dt = barPos - kt;
          if (dt >= 0 && dt < 0.35) {
            s += synthKick(dt) * 0.95;
            const noteIdx = Math.floor((t / beatLen) % bassNotes.length);
            s += synth808(dt, bassNotes[noteIdx], 0.35) * 1.1;
          }
        }

        // Snare / Clap on 2 and 4
        const snareTimes = [beatLen * 1, beatLen * 3];
        for (const st of snareTimes) {
          const dt = barPos - st;
          if (dt >= 0 && dt < 0.25) {
            s += synthClap(dt) * 0.85;
            s += synthSnare(dt) * 0.4;
          }
        }

        // Hi-hat 16th triplets / rolls
        const hatPos = (t % sixteenth);
        s += synthHiHat(hatPos, true, 0.04) * 0.35;

        // Iconic Phonk Cowbell riff
        const riffBeat = Math.floor((t / (beatLen / 2)) % cowbellNotes.length);
        const dtCow = (t % (beatLen / 2));
        s += synthCowbell(dtCow, cowbellNotes[riffBeat], 0.18) * 0.75;

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'cyberpunk_synthwave_120bpm',
    title: 'Outrun Horizon 120 (Cyberpunk Synthwave)',
    genre: 'Synthwave / Cyberpunk',
    bpm: 120,
    durationSec: 16.0, // 8 bars at 120bpm
    description: 'Pumping four-on-the-floor kick, rolling 16th-note sawtooth bass, and shimmering analog retro pads.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 120;
      const beatLen = 60 / bpm; // 0.5s
      const sixteenth = beatLen / 4; // 0.125s
      const barLen = beatLen * 4; // 2.0s
      const chordRoots = ['A2', 'F2', 'C3', 'G2'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // 4-on-the-floor kick
        const kickPos = t % beatLen;
        s += synthKick(kickPos, 0.28) * 0.9;

        // Gated snare on 2 and 4
        const barPos = t % barLen;
        const snareTimes = [beatLen * 1, beatLen * 3];
        for (const st of snareTimes) {
          const dt = barPos - st;
          if (dt >= 0 && dt < 0.3) {
            s += synthSnare(dt, 0.26) * 0.9;
          }
        }

        // Rolling 16th bass
        const step = Math.floor((t / sixteenth) % 16);
        const chordIdx = Math.floor((t / barLen) % chordRoots.length);
        const root = chordRoots[chordIdx];
        const octShift = (step % 2 === 0) ? 1.0 : 2.0;
        const dtStep = t % sixteenth;
        s += synthPluck(dtStep, root * octShift, 0.11) * 0.7;

        // Open hi-hat on the off-beat
        const offBeat = (t - beatLen * 0.5) % beatLen;
        if (offBeat >= 0 && offBeat < 0.18) {
          s += synthHiHat(offBeat, false, 0.16) * 0.45;
        }

        // Shimmer pad chord
        const chordTime = t % (barLen * 2);
        s += synthSawPad(chordTime, root * 2, barLen * 2) * 0.5;

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'lofi_chillhop_85bpm',
    title: 'Rainy Rhodes 85 (Lo-Fi Study Beat)',
    genre: 'Lo-Fi Chillhop',
    bpm: 85,
    durationSec: 16.94, // 6 bars at 85bpm
    description: 'Warm nostalgic electric piano 7th chords, vinyl crackle, lazy boom-bap rhythm, and gentle bass.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 85;
      const beatLen = 60 / bpm; // ~0.705s
      const barLen = beatLen * 4;

      const chords = [
        ['D3', 'F#3', 'A3', 'C#4'], // Dmaj7
        ['B2', 'D3', 'F#3', 'A3'],   // Bm7
        ['G2', 'B2', 'D3', 'F#3'],   // Gmaj7
        ['A2', 'C#3', 'E3', 'G3']    // A7
      ].map(c => c.map(noteToFreq));

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Vinyl dust crackle
        if (Math.random() < 0.003) {
          s += (Math.random() * 2 - 1) * 0.15;
        }

        // Boom-Bap Kick (slight swing)
        const barPos = t % barLen;
        const kickTimes = [0, beatLen * 1.85, beatLen * 2.6];
        for (const kt of kickTimes) {
          const dt = barPos - kt;
          if (dt >= 0 && dt < 0.3) {
            s += synthKick(dt, 0.25) * 0.7;
          }
        }

        // Rimshot / Snare on 2 and 4
        const snareTimes = [beatLen * 1, beatLen * 3];
        for (const st of snareTimes) {
          const dt = barPos - st;
          if (dt >= 0 && dt < 0.18) {
            s += synthSnare(dt, 0.15) * 0.55;
          }
        }

        // Gentle swung hi-hats
        const hatPos = (t % (beatLen / 2));
        s += synthHiHat(hatPos, true, 0.03) * 0.22;

        // Warm Rhodes Chords
        const chordIdx = Math.floor((t / barLen) % chords.length);
        const dtChord = barPos;
        for (const freq of chords[chordIdx]) {
          s += synthRhodes(dtChord, freq, barLen) * 0.22;
        }

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'cinematic_ambient_drone_45s',
    title: 'Interstellar Deep Field (Cinematic Drone)',
    genre: 'Cinematic Ambient',
    bpm: 60,
    durationSec: 20.0,
    description: 'Sub-bass cosmic drone with evolving filtered harmonics, shimmering high glass overtone, and breathing space.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const root1 = noteToFreq('C1'); // 32.7 Hz
      const root2 = noteToFreq('G1'); // 49 Hz
      const mid = noteToFreq('Eb3');
      const high = noteToFreq('Bb4');

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const lfo1 = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.12 * t);
        const lfo2 = 0.5 + 0.5 * Math.cos(2 * Math.PI * 0.08 * t);

        // Sub rumble
        const sub = Math.sin(2 * Math.PI * root1 * t) * 0.5 + Math.sin(2 * Math.PI * root2 * t) * 0.35;

        // Evolving harmonics
        const texture = Math.sin(2 * Math.PI * mid * t + Math.sin(2 * Math.PI * 2 * t) * 0.5) * lfo1 * 0.25;
        const glass = Math.sin(2 * Math.PI * high * t) * lfo2 * 0.12;

        // Distant pulse
        const pulse = Math.sin(2 * Math.PI * 1.5 * t) * Math.sin(2 * Math.PI * root1 * 2 * t) * 0.15;

        buffer[i] = (sub + texture + glass + pulse) * 0.75;
      }
      return buffer;
    }
  },
  {
    id: 'minimal_tech_pulse_125bpm',
    title: 'Silicon Flow 125 (Clean Tech Pulse)',
    genre: 'Minimal Tech / Corporate Modern',
    bpm: 125,
    durationSec: 15.36, // 8 bars
    description: 'Precise micro-percussion, muted modern plucks, and a steady driving bassline for technical showcases.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 125;
      const beatLen = 60 / bpm; // 0.48s
      const sixteenth = beatLen / 4;
      const barLen = beatLen * 4;
      const scale = ['C4', 'D4', 'Eb4', 'G4', 'Bb4', 'C5'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Modern punch kick
        const kickPos = t % beatLen;
        s += synthKick(kickPos, 0.22) * 0.85;

        // Micro-percussion click on off-beats
        const dtOff = (t - beatLen * 0.5) % beatLen;
        if (dtOff >= 0 && dtOff < 0.08) {
          s += synthHiHat(dtOff, true, 0.02) * 0.4;
        }

        // Arpeggiated tech plucks
        const step = Math.floor((t / sixteenth) % 16);
        const dtPluck = t % sixteenth;
        const note = scale[step % scale.length];
        s += synthPluck(dtPluck, note, 0.14) * 0.45;

        // Deep sine sub on 1
        const barPos = t % barLen;
        if (barPos < 0.4) {
          s += synth808(barPos, noteToFreq('C2'), 0.4) * 0.7;
        }

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'western_standoff_tension_45s',
    title: 'High Noon Reckoning (Western Standoff)',
    genre: 'Cinematic Western Standoff',
    bpm: 72,
    durationSec: 16.66,
    description: 'Eerie whistling lead, heavy heartbeat kick, tremolo strings, and acoustic dust foley.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const whistleNotes = ['D5', 'F5', 'D5', 'A4', 'G4', 'A4', 'D4'].map(noteToFreq);
      const bpm = 72;
      const beatLen = 60 / bpm; // ~0.833s

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Heartbeat double kick
        const hb1 = t % beatLen;
        const hb2 = (t - 0.22) % beatLen;
        if (hb1 >= 0 && hb1 < 0.2) s += synthKick(hb1, 0.18) * 0.8;
        if (hb2 >= 0 && hb2 < 0.2) s += synthKick(hb2, 0.18) * 0.5;

        // Whistling lead melody
        const noteIdx = Math.floor((t / (beatLen * 2)) % whistleNotes.length);
        const dtNote = t % (beatLen * 2);
        const freq = whistleNotes[noteIdx];
        const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 6.5 * t);
        const whistleEnv = Math.sin(Math.PI * Math.min(1, dtNote / (beatLen * 1.8)));
        const whistle = Math.sin(2 * Math.PI * freq * t) * whistleEnv * tremolo * 0.5;

        // Low acoustic drone
        const lowDrone = Math.sin(2 * Math.PI * noteToFreq('D2') * t) * 0.35;

        buffer[i] = (s + whistle + lowDrone);
      }
      return buffer;
    }
  },
  {
    id: 'corporate_upbeat_future_120bpm',
    title: 'Venture Velocity 120 (Future Corporate)',
    genre: 'Commercial Tech / Uplifting',
    bpm: 120,
    durationSec: 16.0,
    description: 'Bright harmonic marimba motifs, crisp clapping snaps, and upbeat motivational drive.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 120;
      const beatLen = 60 / bpm;
      const sixteenth = beatLen / 4;
      const barLen = beatLen * 4;
      const melody = ['E4', 'G#4', 'B4', 'E5', 'B4', 'G#4', 'F#4', 'A4'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Kick on 1 and 3
        const barPos = t % barLen;
        if (barPos < 0.25 || (barPos > beatLen * 2 && barPos < beatLen * 2 + 0.25)) {
          const dt = barPos % (beatLen * 2);
          s += synthKick(dt, 0.2) * 0.8;
        }

        // Snappy finger claps on 2 and 4
        const clapTimes = [beatLen * 1, beatLen * 3];
        for (const ct of clapTimes) {
          const dt = barPos - ct;
          if (dt >= 0 && dt < 0.2) s += synthClap(dt) * 0.75;
        }

        // Bright marimba arpeggio
        const step = Math.floor((t / sixteenth) % melody.length);
        const dtPluck = t % sixteenth;
        s += synthPluck(dtPluck, melody[step], 0.16) * 0.55;

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'arcade_chiptune_adventure_140bpm',
    title: 'Pixel Quest 140 (8-Bit Arcade)',
    genre: 'Chiptune / Retro Arcade',
    bpm: 140,
    durationSec: 13.71, // 8 bars
    description: 'Authentic NES-era square-wave melodic hooks, fast 16th-note arpeggiators, and retro game drums.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 140;
      const beatLen = 60 / bpm;
      const sixteenth = beatLen / 4;
      const leadNotes = ['C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'G5'].map(noteToFreq);
      const bassNotes = ['C3', 'C3', 'A2', 'A2', 'F2', 'F2', 'G2', 'G2'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Retro noise snare on 2 and 4
        const barPos = t % (beatLen * 4);
        const snareTimes = [beatLen * 1, beatLen * 3];
        for (const st of snareTimes) {
          const dt = barPos - st;
          if (dt >= 0 && dt < 0.12) {
            s += (Math.random() * 2 - 1) * Math.exp(-dt * 30) * 0.5;
          }
        }

        // 8-bit square lead
        const step = Math.floor((t / (beatLen / 2)) % leadNotes.length);
        const dtStep = t % (beatLen / 2);
        s += synthChiptune(dtStep, leadNotes[step], 0.18, 0.5) * 0.6;

        // 8-bit triangle bass
        const bassStep = Math.floor((t / beatLen) % bassNotes.length);
        const dtBass = t % beatLen;
        s += synthChiptune(dtBass, bassNotes[bassStep], 0.35, 0.25) * 0.5;

        buffer[i] = s;
      }
      return buffer;
    }
  },
  {
    id: 'subsea_deep_abyss_45s',
    title: 'Bathyal Trench (Subsea Ambient)',
    genre: 'Deep Oceanic / Tension Drone',
    bpm: 50,
    durationSec: 20.0,
    description: 'Subterranean aquatic sonar pings, immense hydrostatic pressure sub-bass, and cavernous resonance.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const sonarFreq = 1600;

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        // Sonar ping every 4.0 seconds
        const pingTime = t % 4.0;
        let ping = 0;
        if (pingTime < 0.6) {
          const env = Math.exp(-pingTime * 6.0);
          ping = Math.sin(2 * Math.PI * sonarFreq * pingTime) * env * 0.3;
        }

        // Hydrostatic deep rumble (35 Hz + 70 Hz)
        const sub = Math.sin(2 * Math.PI * 35 * t) * 0.5 + Math.sin(2 * Math.PI * 70 * t) * 0.3;
        const waterNoise = (Math.random() * 2 - 1) * 0.05 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.2 * t));

        buffer[i] = ping + sub * 0.8 + waterNoise;
      }
      return buffer;
    }
  },
  {
    id: 'liquid_chrome_luxury_110bpm',
    title: 'Verve Platinum 110 (Liquid Chrome Trap)',
    genre: 'Future Trap / High Fashion Luxury',
    bpm: 110,
    durationSec: 17.45, // 8 bars
    description: 'Ultra-crisp trap rolling hi-hats, velvet gliding sub 808, glass bell accents, and luxury swagger.',
    render: (sampleRate, totalSamples) => {
      const buffer = new Float32Array(totalSamples);
      const bpm = 110;
      const beatLen = 60 / bpm;
      const sixteenth = beatLen / 4;
      const barLen = beatLen * 4;
      const bellChords = ['F5', 'Ab5', 'C6', 'Eb6'].map(noteToFreq);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let s = 0;

        // Punchy kick & rolling 808
        const barPos = t % barLen;
        const kickTimes = [0, beatLen * 1.5, beatLen * 2.25];
        for (const kt of kickTimes) {
          const dt = barPos - kt;
          if (dt >= 0 && dt < 0.35) {
            s += synthKick(dt, 0.2) * 0.9;
            s += synth808(dt, noteToFreq('F1'), 0.38) * 1.0;
          }
        }

        // Snappy clap on 2 and 4
        const clapTimes = [beatLen * 1, beatLen * 3];
        for (const ct of clapTimes) {
          const dt = barPos - ct;
          if (dt >= 0 && dt < 0.22) s += synthClap(dt) * 0.85;
        }

        // Trap triplet & rolling hats
        const hatPos = (t % (sixteenth / 2));
        s += synthHiHat(hatPos, true, 0.03) * 0.4;

        // Luxurious glass bell tone on bar start
        if (barPos < 0.6) {
          const chordNote = bellChords[Math.floor((t / barLen) % bellChords.length)];
          s += synthPluck(barPos, chordNote, 0.5) * 0.45;
        }

        buffer[i] = s;
      }
      return buffer;
    }
  }
];

async function main() {
  const outDir = path.resolve(process.cwd(), 'public/audio/music_library');
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`🎵 Synthesizing 10 High-Production Background Music Tracks into public/audio/music_library/...`);
  const catalog = [];

  for (const item of TRACK_GENERATORS) {
    const totalSamples = Math.floor(item.durationSec * SAMPLE_RATE);
    const floatSamples = item.render(SAMPLE_RATE, totalSamples);

    // Apply fade-in (0.05s) and fade-out (0.15s) to guarantee zero audio clicking at endpoints
    const fadeInSamples = Math.floor(0.05 * SAMPLE_RATE);
    const fadeOutSamples = Math.floor(0.15 * SAMPLE_RATE);

    const int16Buffer = Buffer.alloc(totalSamples * 2);

    for (let i = 0; i < totalSamples; i++) {
      let amp = floatSamples[i];

      if (i < fadeInSamples) {
        amp *= (i / fadeInSamples);
      } else if (i > totalSamples - fadeOutSamples) {
        amp *= ((totalSamples - i) / fadeOutSamples);
      }

      // Soft clip to prevent harsh distortion
      const clipped = softClip(amp);
      const val = Math.max(-32767, Math.min(32767, Math.floor(clipped * 32767)));
      int16Buffer.writeInt16LE(val, i * 2);
    }

    const header = createWavHeader(totalSamples, 1, SAMPLE_RATE, 16);
    const fullWav = Buffer.concat([header, int16Buffer]);

    const filePath = path.join(outDir, `${item.id}.wav`);
    fs.writeFileSync(filePath, fullWav);

    const relPath = `public/audio/music_library/${item.id}.wav`;
    const staticPath = `audio/music_library/${item.id}.wav`;
    console.log(`✔ [${item.genre}] ${item.title} -> ${item.id}.wav (${(fullWav.length / 1024).toFixed(1)} KB)`);

    catalog.push({
      id: item.id,
      title: item.title,
      genre: item.genre,
      bpm: item.bpm,
      durationSec: item.durationSec,
      description: item.description,
      staticPath,
      relPath
    });
  }

  const catalogPath = path.join(outDir, 'music-catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`\n🎉 Generated all 10 background music tracks! Catalog written to ${catalogPath}`);
}

main().catch(err => {
  console.error('Fatal error generating music tracks:', err);
  process.exit(1);
});
