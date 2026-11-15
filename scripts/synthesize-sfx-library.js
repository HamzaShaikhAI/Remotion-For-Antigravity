/**
 * scripts/synthesize-sfx-library.js
 * Generates:
 * 1. public/audio/rea_showcase_event_locked_sfx.wav (Frame-exact event-locked showcase foley)
 * 2. public/sfx/library/ (50+ high-craft 44.1kHz 16-bit WAV procedural sound effects library)
 * 3. public/sfx/library/sfx-catalog.json (Structured searchable catalog)
 */

const fs = require('fs');
const path = require('path');
const { MicroSfxEngine } = require('../src/engines/psychoacoustic/MicroSfxEngine');
const {
  buildReaShowcaseSfxTimeline,
  SHOWCASE_TOTAL_FRAMES,
  SHOWCASE_FPS,
} = require('../src/compositions/reaShowcaseEvents');

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

// ---------------------------------------------------------------------------
// 1. Synthesize Showcase Event-Locked Track
// ---------------------------------------------------------------------------
function synthesizeShowcaseTrack() {
  console.log('🎬 Synthesizing 1:1 visual-synced showcase foley bed...');
  const cues = buildReaShowcaseSfxTimeline();
  const audioDir = path.resolve(__dirname, '../public/audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  const outPath = path.join(audioDir, 'rea_showcase_event_locked_sfx.wav');
  MicroSfxEngine.generateMultiTrackSfx(cues, SHOWCASE_TOTAL_FRAMES, SHOWCASE_FPS, outPath);
  console.log(`✔ Generated ${cues.length} frame-locked SFX cues -> ${outPath}`);
}

// ---------------------------------------------------------------------------
// 2. Synthesize 50+ Procedural Sound Library
// ---------------------------------------------------------------------------
function synthesizeComprehensiveLibrary() {
  console.log('\n📦 Synthesizing 50+ procedural sound effects library...');
  const libDir = path.resolve(__dirname, '../public/sfx/library');
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

  const catalog = [];

  let seed = 12345;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const soundDefinitions = [
    // UI & Interaction
    { id: 'ui_button_click', cat: 'UI & Interaction', dur: 0.05, desc: 'Sharp micro tactile click for button presses', fn: (t) => Math.exp(-t * 120) * (Math.sin(2 * Math.PI * 3200 * t) * 0.7 + Math.sin(2 * Math.PI * 4800 * t) * 0.3) },
    { id: 'ui_toggle_switch', cat: 'UI & Interaction', dur: 0.08, desc: 'Clean modern toggle on/off switch', fn: (t) => Math.exp(-t * 70) * (Math.sin(2 * Math.PI * 2600 * t) * 0.6 + Math.sin(2 * Math.PI * 1800 * t) * 0.4) },
    { id: 'ui_card_pop', cat: 'UI & Interaction', dur: 0.12, desc: 'Resonant acoustic pop for card reveals and badge reveals', fn: (t) => Math.exp(-t * 35) * Math.sin(2 * Math.PI * (1200 * Math.exp(-t * 45) + 220) * t) },
    { id: 'ui_modal_open', cat: 'UI & Interaction', dur: 0.18, desc: 'Smooth ascending whoosh-pop for modal dialog entrance', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (300 + Math.pow(t / d, 2) * 800) * t) },
    { id: 'ui_modal_close', cat: 'UI & Interaction', dur: 0.16, desc: 'Soft descending pop for modal exit', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (900 - Math.pow(t / d, 2) * 600) * t) },
    { id: 'ui_tab_switch', cat: 'UI & Interaction', dur: 0.06, desc: 'Subtle high-frequency tab navigation click', fn: (t) => Math.exp(-t * 100) * Math.sin(2 * Math.PI * 3400 * t) },
    { id: 'ui_tooltip_pop', cat: 'UI & Interaction', dur: 0.09, desc: 'Quick buoyant bubble tick for hover states', fn: (t) => Math.exp(-t * 45) * Math.sin(2 * Math.PI * (1600 * Math.exp(-t * 50) + 400) * t) },
    { id: 'ui_mechanical_click', cat: 'UI & Interaction', dur: 0.08, desc: 'Double-transient relay switch click', fn: (t) => {
      const e1 = Math.exp(-t * 90);
      const e2 = t > 0.018 ? Math.exp(-(t - 0.018) * 75) : 0;
      return (Math.sin(2 * Math.PI * 3200 * t) * e1 * 0.6 + Math.sin(2 * Math.PI * 2400 * (t - 0.018)) * e2 * 0.4);
    }},
    { id: 'ui_notification_chime', cat: 'UI & Interaction', dur: 0.45, desc: 'Harmonic two-tone notification chime', fn: (t) => {
      const e1 = Math.exp(-t * 8);
      const e2 = t > 0.1 ? Math.exp(-(t - 0.1) * 9) : 0;
      return Math.sin(2 * Math.PI * 880 * t) * e1 * 0.4 + (t > 0.1 ? Math.sin(2 * Math.PI * 1320 * (t - 0.1)) * e2 * 0.5 : 0);
    }},
    { id: 'ui_counter_tick', cat: 'UI & Interaction', dur: 0.04, desc: 'Rapid telemetry counter tick for number scrollers', fn: (t) => Math.exp(-t * 140) * Math.sin(2 * Math.PI * 4200 * t) },

    // Motion & Transitions
    { id: 'whoosh_fast', cat: 'Motion & Transitions', dur: 0.18, desc: 'High-speed directional whip whoosh', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * (400 + Math.sin(Math.PI * (t / d)) * 1800) * t) },
    { id: 'whoosh_cinematic', cat: 'Motion & Transitions', dur: 0.45, desc: 'Heavy cinematic transition swoosh', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * (200 + Math.sin(Math.PI * (t / d)) * 900) * t) * 1.2 },
    { id: 'whoosh_subtle', cat: 'Motion & Transitions', dur: 0.14, desc: 'Soft organic air flutter for small UI cards', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * 0.6 },
    { id: 'whip_pan', cat: 'Motion & Transitions', dur: 0.22, desc: 'Aggressive camera whip pan whoosh', fn: (t, d) => Math.pow(Math.sin(Math.PI * (t / d)), 1.5) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 1200 * t) },
    { id: 'glitch_swoosh', cat: 'Motion & Transitions', dur: 0.25, desc: 'Digital distortion swept transition', fn: (t, d) => {
      const noise = rng() > 0.7 ? (rng() * 2 - 1) : 0;
      return Math.sin(Math.PI * (t / d)) * (Math.sin(2 * Math.PI * 800 * t) * 0.4 + noise * 0.6);
    }},
    { id: 'air_slice', cat: 'Motion & Transitions', dur: 0.15, desc: 'Sharp razor air cut', fn: (t, d) => Math.exp(-t * 15) * Math.sin(2 * Math.PI * (2800 * Math.exp(-t * 20) + 400) * t) },
    { id: 'zoom_in_whoosh', cat: 'Motion & Transitions', dur: 0.28, desc: 'Rising frequency suction whoosh into focus', fn: (t, d) => Math.pow(t / d, 2) * Math.sin(2 * Math.PI * (200 + Math.pow(t / d, 3) * 1400) * t) },
    { id: 'zoom_out_whoosh', cat: 'Motion & Transitions', dur: 0.28, desc: 'Dropping frequency whoosh pulling back', fn: (t, d) => Math.pow(1 - t / d, 2) * Math.sin(2 * Math.PI * (1600 - Math.pow(t / d, 2) * 1300) * t) },

    // Impacts & Hits
    { id: 'impact_thud', cat: 'Impacts & Hits', dur: 0.45, desc: 'Heavy 55Hz sub punch with initial transient click', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * (140 * Math.exp(-t * 22) + 52) * t);
      const click = t < 0.008 ? (rng() * 2 - 1) * 0.8 : 0;
      return (sub * 0.85 + click) * Math.exp(-t * 6.5);
    }},
    { id: 'heavy_impact', cat: 'Impacts & Hits', dur: 0.65, desc: 'Massive trailer hit with sub-bass rumble', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * (180 * Math.exp(-t * 18) + 42) * t);
      const crack = t < 0.015 ? (rng() * 2 - 1) * 0.9 : 0;
      return Math.tanh((sub * 0.85 + crack) * 1.5) * Math.exp(-t * 4.5);
    }},
    { id: 'sub_bass_drop', cat: 'Impacts & Hits', dur: 0.90, desc: 'Sub-bass 808 frequency dive (120Hz -> 36Hz)', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * (120 * Math.exp(-t * 4.2) + 36) * t) * 1.6) * Math.exp(-t * 3.5) },
    { id: 'cinematic_boom', cat: 'Impacts & Hits', dur: 1.40, desc: 'Deep atmospheric cinematic sub boom', fn: (t) => Math.sin(2 * Math.PI * (85 * Math.exp(-t * 6) + 38) * t) * Math.exp(-t * 2.8) },
    { id: 'kick_thud', cat: 'Impacts & Hits', dur: 0.28, desc: 'Tight acoustic punchy kick hit', fn: (t) => Math.sin(2 * Math.PI * (160 * Math.exp(-t * 32) + 48) * t) * Math.exp(-t * 12) },
    { id: 'punch_impact', cat: 'Impacts & Hits', dur: 0.35, desc: 'Crisp physical strike impact', fn: (t) => (Math.sin(2 * Math.PI * 180 * t) * 0.6 + (rng() * 2 - 1) * 0.4) * Math.exp(-t * 10) },
    { id: 'anvil_strike', cat: 'Impacts & Hits', dur: 0.55, desc: 'Heavy metallic anvil strike with ringing overtone', fn: (t) => {
      const ring = Math.sin(2 * Math.PI * 1480 * t) * 0.4 + Math.sin(2 * Math.PI * 2960 * t) * 0.3;
      const thud = Math.sin(2 * Math.PI * 110 * t) * 0.5;
      return (ring + thud) * Math.exp(-t * 6);
    }},
    { id: 'glass_hit', cat: 'Impacts & Hits', dur: 0.30, desc: 'High metallic glass tap resonance', fn: (t) => (Math.sin(2 * Math.PI * 3400 * t) * 0.5 + Math.sin(2 * Math.PI * 5100 * t) * 0.4) * Math.exp(-t * 14) },

    // Paper & Artisan 2.5D
    { id: 'paper_slide', cat: 'Paper & Artisan', dur: 0.22, desc: 'Smooth cardstock paper sliding across mat', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * 0.7 },
    { id: 'paper_tear', cat: 'Paper & Artisan', dur: 0.35, desc: 'Gritty organic paper tear crackle', fn: (t) => {
      const crackle = rng() > 0.85 ? (rng() * 2 - 1) * 0.9 : (rng() * 2 - 1) * 0.15;
      return crackle * Math.exp(-t * 8.0);
    }},
    { id: 'card_shuffle', cat: 'Paper & Artisan', dur: 0.40, desc: 'Rapid flutter of poker deck card edges', fn: (t) => (Math.sin(2 * Math.PI * 65 * t) > 0 ? (rng() * 2 - 1) * 0.6 : 0) * Math.exp(-t * 3) },
    { id: 'page_flip', cat: 'Paper & Artisan', dur: 0.25, desc: 'Quick tactile book or magazine page turn', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 450 * t) },
    { id: 'stamp_press', cat: 'Paper & Artisan', dur: 0.20, desc: 'Rubber stamp ink impression on paper', fn: (t) => (Math.sin(2 * Math.PI * 130 * t) * 0.7 + (rng() * 2 - 1) * 0.3) * Math.exp(-t * 18) },
    { id: 'pencil_sketch', cat: 'Paper & Artisan', dur: 0.30, desc: 'Graphite pencil stroke friction', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 1400 * t) * 0.5 },

    // Digital & Sci-Fi
    { id: 'digital_glitch', cat: 'Digital & Sci-Fi', dur: 0.18, desc: 'Bitcrushed stepped noise glitch pulse', fn: (t, d) => (Math.floor(rng() * 5) / 2 - 1) * Math.sin(Math.PI * (t / d)) },
    { id: 'cyber_beep', cat: 'Digital & Sci-Fi', dur: 0.08, desc: 'Clean high-pitch HUD confirmation chirp', fn: (t) => Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 40) },
    { id: 'telemetry_chirp', cat: 'Digital & Sci-Fi', dur: 0.12, desc: 'Fast dual frequency data transmission chirp', fn: (t) => (Math.sin(2 * Math.PI * 1800 * t) * 0.5 + Math.sin(2 * Math.PI * 2800 * t) * 0.5) * Math.exp(-t * 30) },
    { id: 'laser_blaster', cat: 'Digital & Sci-Fi', dur: 0.28, desc: 'Sci-fi blaster laser discharge', fn: (t) => Math.sin(2 * Math.PI * (3400 * Math.exp(-t * 22) + 220) * t) * Math.exp(-t * 12) },
    { id: 'matrix_scan', cat: 'Digital & Sci-Fi', dur: 0.35, desc: 'High frequency sonar scan line pulse', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (800 + Math.sin(2 * Math.PI * 18 * t) * 400) * t) },
    { id: 'servo_whirr', cat: 'Digital & Sci-Fi', dur: 0.40, desc: 'Precision robotic actuator servo motor whirr', fn: (t, d) => {
      const freq = 320 + Math.sin((t / d) * Math.PI) * 280;
      return (Math.sin(2 * Math.PI * freq * t) > 0 ? 0.7 : -0.7) * Math.sin(Math.PI * (t / d)) * 0.6;
    }},
    { id: 'data_stream', cat: 'Digital & Sci-Fi', dur: 0.30, desc: 'Rapid packet telemetry streaming tick stream', fn: (t) => (t % 0.03 < 0.008 ? Math.sin(2 * Math.PI * 3000 * t) * 0.7 : 0) },
    { id: 'sonar_ping', cat: 'Digital & Sci-Fi', dur: 0.85, desc: 'Subsea acoustic sonar ping with long reverberant decay', fn: (t) => Math.sin(2 * Math.PI * 1420 * t) * Math.exp(-t * 3.5) },

    // Anime & Action
    { id: 'sword_clash', cat: 'Anime & Action', dur: 0.45, desc: 'Heavy katana blade collision with ringing harmonic', fn: (t) => {
      const ring = Math.sin(2 * Math.PI * 2200 * t) * 0.45 + Math.sin(2 * Math.PI * 3350 * t) * 0.35;
      const noise = t < 0.015 ? (rng() * 2 - 1) * 0.8 : 0;
      return (ring + noise) * Math.exp(-t * 7.5);
    }},
    { id: 'sword_slice', cat: 'Anime & Action', dur: 0.24, desc: 'High-speed katana air slice', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (1800 * Math.exp(-t * 14) + 600) * t) },
    { id: 'katana_sheathe', cat: 'Anime & Action', dur: 0.32, desc: 'Tactile metallic scabbard blade sheathe click', fn: (t) => {
      const friction = t < 0.22 ? (rng() * 2 - 1) * 0.25 * Math.sin(2 * Math.PI * 2400 * t) : 0;
      const click = t >= 0.22 ? Math.exp(-(t - 0.22) * 80) * Math.sin(2 * Math.PI * 3600 * (t - 0.22)) * 0.85 : 0;
      return friction + click;
    }},
    { id: 'thunder_strike', cat: 'Anime & Action', dur: 0.75, desc: 'Sharp lightning bolt strike with sub roll', fn: (t) => {
      const crack = t < 0.025 ? (rng() * 2 - 1) * 0.95 : 0;
      const roll = (rng() * 2 - 1) * Math.sin(2 * Math.PI * 60 * t) * 0.7;
      return (crack + roll) * Math.exp(-t * 4);
    }},
    { id: 'lightning_flash', cat: 'Anime & Action', dur: 0.35, desc: 'High voltage electrical arc discharge', fn: (t) => (rng() > 0.8 ? (rng() * 2 - 1) * 0.9 : 0) * Math.exp(-t * 9) },
    { id: 'aura_charge', cat: 'Anime & Action', dur: 0.60, desc: 'Rising energy aura hum', fn: (t, d) => Math.pow(t / d, 1.5) * (Math.sin(2 * Math.PI * (80 + Math.pow(t / d, 2) * 440) * t) + (rng() * 2 - 1) * 0.2) },
    { id: 'energy_blast', cat: 'Anime & Action', dur: 0.50, desc: 'Shockwave pulse discharge', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * (280 * Math.exp(-t * 12) + 65) * t) * 1.8) * Math.exp(-t * 5) },

    // Retro & Gaming
    { id: 'coin_pickup', cat: 'Retro & Gaming', dur: 0.35, desc: 'Classic 8-bit double chime coin grab', fn: (t) => {
      const f = t < 0.07 ? 988 : 1318.5;
      const env = t < 0.07 ? Math.exp(-t * 8) : Math.exp(-(t - 0.07) * 9);
      return (Math.sin(2 * Math.PI * f * t) > 0 ? 0.6 : -0.6) * env;
    }},
    { id: 'jump_beep', cat: 'Retro & Gaming', dur: 0.16, desc: '8-bit pitch-rising player jump', fn: (t, d) => (Math.sin(2 * Math.PI * (220 + (t / d) * 880) * t) > 0 ? 0.6 : -0.6) * Math.sin(Math.PI * (t / d)) },
    { id: 'power_up', cat: 'Retro & Gaming', dur: 0.45, desc: 'Arpeggiated 8-bit power-up fan-fare', fn: (t) => {
      const notes = [440, 554, 659, 880];
      const step = Math.min(3, Math.floor(t / 0.10));
      const f = notes[step];
      return (Math.sin(2 * Math.PI * f * t) > 0 ? 0.55 : -0.55) * Math.exp(-(t % 0.10) * 12);
    }},
    { id: 'pixel_hit', cat: 'Retro & Gaming', dur: 0.12, desc: 'Chiptune noise damage impact', fn: (t) => (rng() * 2 - 1) * Math.exp(-t * 30) },
    { id: 'game_over_beep', cat: 'Retro & Gaming', dur: 0.60, desc: 'Descending 8-bit game over sequence', fn: (t) => {
      const notes = [659, 622, 587, 554];
      const step = Math.min(3, Math.floor(t / 0.14));
      const f = notes[step];
      return (Math.sin(2 * Math.PI * f * t) > 0 ? 0.5 : -0.5) * Math.exp(-(t % 0.14) * 8);
    }},
    { id: 'health_regen', cat: 'Retro & Gaming', dur: 0.38, desc: 'Warm ascending chime pulses', fn: (t) => Math.sin(2 * Math.PI * (523 + t * 600) * t) * Math.exp(-t * 6) },

    // Cinematic & Ambient
    { id: 'bell_ding', cat: 'Cinematic & Ambient', dur: 0.85, desc: 'Pure harmonic brass chime for success notifications', fn: (t) => {
      const e = Math.exp(-t * 4.5);
      return (Math.sin(2 * Math.PI * 1760 * t) + Math.sin(2 * Math.PI * 3520 * t) * 0.35 + Math.sin(2 * Math.PI * 5280 * t) * 0.12) * e * 0.75;
    }},
    { id: 'cinematic_riser', cat: 'Cinematic & Ambient', dur: 1.20, desc: 'Exponential tension building riser', fn: (t, d) => Math.pow(t / d, 1.8) * Math.sin(2 * Math.PI * (120 + Math.pow(t / d, 2.4) * 1680) * t) * 0.85 },
    { id: 'tape_stop', cat: 'Cinematic & Ambient', dur: 0.55, desc: 'Vinyl friction turntable brake', fn: (t, d) => Math.max(0.01, 1 - Math.pow(t / d, 1.5)) * Math.sin(2 * Math.PI * 320 * (1 - t / d) * t) * 0.8 },
    { id: 'vinyl_crackle', cat: 'Cinematic & Ambient', dur: 0.40, desc: 'Analog vinyl dust and subtle crackle', fn: (t, d) => (rng() > 0.90 ? (rng() * 2 - 1) * 0.6 : (rng() * 2 - 1) * 0.05) * Math.sin(Math.PI * (t / d)) },
    { id: 'countdown_beep', cat: 'Cinematic & Ambient', dur: 0.12, desc: 'Standard 1000Hz reference sync beep', fn: (t, d) => Math.sin(2 * Math.PI * 1000 * t) * Math.sin(Math.PI * (t / d)) * 0.8 },
    { id: 'water_drip', cat: 'Cinematic & Ambient', dur: 0.15, desc: 'Acoustic water droplet chirp', fn: (t) => Math.sin(2 * Math.PI * (2200 * Math.exp(-t * 18) + 750) * t) * Math.exp(-t * 28) },
    { id: 'clock_tick', cat: 'Cinematic & Ambient', dur: 0.05, desc: 'Precision mechanical clock tick', fn: (t) => (Math.sin(2 * Math.PI * 2800 * t) * 0.5 + (rng() * 2 - 1) * 0.5) * Math.exp(-t * 110) },
    { id: 'camera_shutter', cat: 'Cinematic & Ambient', dur: 0.22, desc: 'SLR camera shutter actuation', fn: (t) => (Math.exp(-t * 120) * Math.sin(2 * Math.PI * 2800 * t) * 0.7 + (t > 0.14 ? Math.exp(-(t - 0.14) * 90) * Math.sin(2 * Math.PI * 3400 * (t - 0.14)) * 0.8 : 0)) },
  ];

  for (const def of soundDefinitions) {
    const numSamples = Math.floor(sampleRate * def.dur);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      samples[i] = def.fn(t, def.dur);
    }

    // Soft clip
    for (let i = 0; i < numSamples; i++) {
      samples[i] = Math.tanh(samples[i] * 0.95);
    }

    const wavBuf = createWavBuffer(samples, sampleRate);
    const filePath = path.join(libDir, `${def.id}.wav`);
    fs.writeFileSync(filePath, wavBuf);

    catalog.push({
      id: def.id,
      category: def.cat,
      filename: `${def.id}.wav`,
      durationSec: def.dur,
      description: def.desc,
      relPath: `public/sfx/library/${def.id}.wav`,
    });
  }

  // Save catalog JSON
  const catalogPath = path.join(libDir, 'sfx-catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify({ totalCount: catalog.length, categories: [...new Set(catalog.map(c => c.category))], items: catalog }, null, 2));

  console.log(`✔ Successfully synthesized ${catalog.length} studio-grade SFX WAV files into: ${libDir}`);
  console.log(`✔ Catalog index generated at: ${catalogPath}`);
}

if (require.main === module) {
  synthesizeShowcaseTrack();
  synthesizeComprehensiveLibrary();
}

module.exports = { synthesizeShowcaseTrack, synthesizeComprehensiveLibrary };
