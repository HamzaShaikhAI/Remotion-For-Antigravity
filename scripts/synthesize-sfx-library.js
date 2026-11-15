/**
 * scripts/synthesize-sfx-library.js
 * Generates:
 * 1. public/audio/rea_showcase_event_locked_sfx.wav (Frame-exact event-locked showcase foley)
 * 2. public/sfx/library/ (130+ high-craft 44.1kHz 16-bit WAV procedural sound effects library)
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
// 1. Synthesize Event-Locked Showcase Foley
// ---------------------------------------------------------------------------
function synthesizeEventLockedBed() {
  console.log('⚡ Synthesizing 105-cue event-locked showcase audio bed...');
  const cues = buildReaShowcaseSfxTimeline();
  const audioDir = path.resolve(__dirname, '../public/audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  const outPath = path.join(audioDir, 'rea_showcase_event_locked_sfx.wav');
  MicroSfxEngine.generateMultiTrackSfx(cues, SHOWCASE_TOTAL_FRAMES, SHOWCASE_FPS, outPath);
  console.log(`✔ Generated ${cues.length} frame-locked SFX cues -> ${outPath}`);
}

// ---------------------------------------------------------------------------
// 2. Synthesize 130+ Massive Procedural Sound Effects Library
// ---------------------------------------------------------------------------
function synthesizeComprehensiveLibrary() {
  console.log('\n📦 Synthesizing 130+ procedural sound effects library...');
  const libDir = path.resolve(__dirname, '../public/sfx/library');
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

  const catalog = [];

  let seed = 12345;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const soundDefinitions = [
    // 1. UI & Interaction (15 sounds)
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
    { id: 'ui_soft_tap', cat: 'UI & Interaction', dur: 0.05, desc: 'Soft organic fingertip tap for touchscreen UI', fn: (t) => Math.exp(-t * 80) * Math.sin(2 * Math.PI * 850 * t) * 0.7 },
    { id: 'ui_menu_select', cat: 'UI & Interaction', dur: 0.07, desc: 'Polished glass dropdown item selection', fn: (t) => Math.exp(-t * 60) * (Math.sin(2 * Math.PI * 1800 * t) * 0.6 + Math.sin(2 * Math.PI * 2700 * t) * 0.4) },
    { id: 'ui_slider_tick', cat: 'UI & Interaction', dur: 0.03, desc: 'Micro haptic notch for range sliders', fn: (t) => Math.exp(-t * 180) * Math.sin(2 * Math.PI * 4800 * t) },
    { id: 'ui_swipe_click', cat: 'UI & Interaction', dur: 0.09, desc: 'Fluid horizontal carousel swipe tick', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * 0.4 + Math.exp(-t * 40) * Math.sin(2 * Math.PI * 1200 * t) * 0.5 },
    { id: 'ui_delete_trash', cat: 'UI & Interaction', dur: 0.14, desc: 'Subtle snap-crunch for item deletion', fn: (t) => Math.exp(-t * 30) * (rng() * 2 - 1) * 0.5 + Math.exp(-t * 50) * Math.sin(2 * Math.PI * 600 * t) * 0.5 },

    // 2. Motion & Transitions (12 sounds)
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
    { id: 'vortex_swirl', cat: 'Motion & Transitions', dur: 0.40, desc: 'Whirling vortex transition for 3D card spins', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (350 + Math.sin(2 * Math.PI * 8 * t) * 150) * t) },
    { id: 'laser_swoosh', cat: 'Motion & Transitions', dur: 0.22, desc: 'Energy beam sweeping across viewport', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.tanh(Math.sin(2 * Math.PI * (1800 * Math.exp(-t * 8) + 300) * t) * 1.5) },
    { id: 'reverse_suction', cat: 'Motion & Transitions', dur: 0.35, desc: 'Reverse atmospheric intake before impact drop', fn: (t, d) => Math.pow(t / d, 3) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 450 * t) },
    { id: 'kinetic_whip', cat: 'Motion & Transitions', dur: 0.16, desc: 'Snappy kinetic spring whip for text reveals', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (Math.sin(2 * Math.PI * 2200 * t) * 0.5 + (rng() * 2 - 1) * 0.5) },

    // 3. Impacts & Hits (12 sounds)
    { id: 'impact_thud', cat: 'Impacts & Hits', dur: 0.45, desc: 'Heavy 55Hz sub punch with initial transient click', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * (140 * Math.exp(-t * 22) + 52) * t);
      const click = t < 0.008 ? (rng() * 2 - 1) * 0.8 : 0;
      return (sub * 0.85 + click) * Math.exp(-t * 7.5);
    }},
    { id: 'impact_anvil_strike', cat: 'Impacts & Hits', dur: 0.55, desc: 'Metallic industrial anvil collision with high ring', fn: (t) => {
      const ring = Math.sin(2 * Math.PI * 1850 * t) * 0.5 + Math.sin(2 * Math.PI * 3200 * t) * 0.3;
      const thud = Math.sin(2 * Math.PI * 90 * t) * 0.4;
      return (ring + thud) * Math.exp(-t * 6.5);
    }},
    { id: 'impact_bass_drop', cat: 'Impacts & Hits', dur: 0.85, desc: 'Deep 808 sub-bass drop sliding to 36Hz', fn: (t) => {
      const freq = 130 * Math.exp(-t * 4.5) + 36;
      return Math.tanh(Math.sin(2 * Math.PI * freq * t) * 1.6) * Math.exp(-t * 3.5);
    }},
    { id: 'impact_cardboard_box', cat: 'Impacts & Hits', dur: 0.20, desc: 'Thick cardboard package drop on floor', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * (220 * Math.exp(-t * 30) + 75) * t);
      return sub * Math.exp(-t * 18);
    }},
    { id: 'impact_wood_stomp', cat: 'Impacts & Hits', dur: 0.25, desc: 'Solid hardwood boot impact for western/street scenes', fn: (t) => {
      const freq = 180 * Math.exp(-t * 25) + 65;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 14);
    }},
    { id: 'impact_kick_drum', cat: 'Impacts & Hits', dur: 0.32, desc: 'Acoustic punchy kick drum transient', fn: (t) => {
      const click = t < 0.006 ? (rng() * 2 - 1) : 0;
      const freq = 160 * Math.exp(-t * 28) + 48;
      return (Math.sin(2 * Math.PI * freq * t) * 0.9 + click * 0.4) * Math.exp(-t * 9.5);
    }},
    { id: 'impact_metal_door_slam', cat: 'Impacts & Hits', dur: 0.60, desc: 'Heavy vault door slam with reverberant ring', fn: (t) => {
      const thud = Math.sin(2 * Math.PI * 65 * t) * 0.7;
      const clank = Math.sin(2 * Math.PI * 720 * t) * 0.3 + Math.sin(2 * Math.PI * 1450 * t) * 0.2;
      return (thud + clank) * Math.exp(-t * 5.0);
    }},
    { id: 'impact_glass_tap', cat: 'Impacts & Hits', dur: 0.22, desc: 'Clean crystal wine glass tap ping', fn: (t) => {
      return (Math.sin(2 * Math.PI * 2650 * t) * 0.7 + Math.sin(2 * Math.PI * 4100 * t) * 0.3) * Math.exp(-t * 12);
    }},
    { id: 'impact_ceramic_thump', cat: 'Impacts & Hits', dur: 0.18, desc: 'Ceramic mug placed on stone table', fn: (t) => {
      return (Math.sin(2 * Math.PI * 340 * t) * 0.6 + Math.sin(2 * Math.PI * 1150 * t) * 0.4) * Math.exp(-t * 22);
    }},
    { id: 'impact_seismic_shock', cat: 'Impacts & Hits', dur: 1.10, desc: 'Rumbling earthquake seismic tremor impact', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * 38 * t) + Math.sin(2 * Math.PI * 44 * t) * 0.5;
      const noise = (rng() * 2 - 1) * 0.2;
      return Math.tanh((sub + noise) * 1.5) * Math.exp(-t * 2.2);
    }},
    { id: 'impact_boxing_punch', cat: 'Impacts & Hits', dur: 0.24, desc: 'Heavy leather boxing glove punch on jaw', fn: (t) => {
      const noise = t < 0.02 ? (rng() * 2 - 1) * 0.7 : 0;
      const body = Math.sin(2 * Math.PI * (280 * Math.exp(-t * 25) + 80) * t);
      return (body + noise) * Math.exp(-t * 15);
    }},
    { id: 'impact_gavel_strike', cat: 'Impacts & Hits', dur: 0.35, desc: 'Authoritative wooden courtroom gavel strike', fn: (t) => {
      return (Math.sin(2 * Math.PI * 420 * t) * 0.6 + Math.sin(2 * Math.PI * 980 * t) * 0.4) * Math.exp(-t * 16);
    }},

    // 4. Bell & Chimes (10 sounds)
    { id: 'bell_ding', cat: 'Bell & Chimes', dur: 0.85, desc: 'Pure 2100Hz crystalline success bell ding', fn: (t) => {
      return (Math.sin(2 * Math.PI * 2100 * t) * 0.65 + Math.sin(2 * Math.PI * 4200 * t) * 0.25 + Math.sin(2 * Math.PI * 6300 * t) * 0.1) * Math.exp(-t * 3.8);
    }},
    { id: 'bell_cash_register', cat: 'Bell & Chimes', dur: 0.50, desc: 'Vintage mechanical cash register cha-ching bell', fn: (t) => {
      const e1 = Math.exp(-t * 12);
      const e2 = t > 0.06 ? Math.exp(-(t - 0.06) * 5) : 0;
      return (Math.sin(2 * Math.PI * 1800 * t) * e1 * 0.4 + (t > 0.06 ? Math.sin(2 * Math.PI * 2800 * (t - 0.06)) * e2 * 0.6 : 0));
    }},
    { id: 'bell_elevator_ping', cat: 'Bell & Chimes', dur: 0.90, desc: 'Modern hotel elevator floor arrival chime', fn: (t) => {
      return (Math.sin(2 * Math.PI * 784 * t) * 0.5 + Math.sin(2 * Math.PI * 1175 * t) * 0.5) * Math.exp(-t * 3.2);
    }},
    { id: 'bell_triangle_ping', cat: 'Bell & Chimes', dur: 0.70, desc: 'Bright orchestral brass triangle ping', fn: (t) => {
      return (Math.sin(2 * Math.PI * 3450 * t) * 0.5 + Math.sin(2 * Math.PI * 5200 * t) * 0.3 + Math.sin(2 * Math.PI * 6900 * t) * 0.2) * Math.exp(-t * 4.5);
    }},
    { id: 'bell_glockenspiel', cat: 'Bell & Chimes', dur: 0.60, desc: 'Whimsical high glockenspiel mallet hit', fn: (t) => {
      return (Math.sin(2 * Math.PI * 1760 * t) * 0.7 + Math.sin(2 * Math.PI * 3520 * t) * 0.3) * Math.exp(-t * 5.2);
    }},
    { id: 'bell_marimba_c5', cat: 'Bell & Chimes', dur: 0.35, desc: 'Warm wooden marimba mallet strike (C5 523Hz)', fn: (t) => {
      return (Math.sin(2 * Math.PI * 523.25 * t) * 0.8 + Math.sin(2 * Math.PI * 1046.5 * t) * 0.2) * Math.exp(-t * 9.0);
    }},
    { id: 'bell_church_tower', cat: 'Bell & Chimes', dur: 1.40, desc: 'Deep brass church tower bell resonance', fn: (t) => {
      return (Math.sin(2 * Math.PI * 220 * t) * 0.6 + Math.sin(2 * Math.PI * 440 * t) * 0.3 + Math.sin(2 * Math.PI * 660 * t) * 0.1) * Math.exp(-t * 1.8);
    }},
    { id: 'bell_wind_chime', cat: 'Bell & Chimes', dur: 0.80, desc: 'Gentle bamboo & aluminum wind chime flutter', fn: (t) => {
      const c1 = Math.sin(2 * Math.PI * 1480 * t) * Math.exp(-t * 4.5);
      const c2 = t > 0.12 ? Math.sin(2 * Math.PI * 2240 * (t - 0.12)) * Math.exp(-(t - 0.12) * 5) : 0;
      return (c1 + c2) * 0.5;
    }},
    { id: 'bell_meditation_bowl', cat: 'Bell & Chimes', dur: 1.80, desc: 'Singing Tibetan meditation bowl sustain', fn: (t) => {
      return (Math.sin(2 * Math.PI * 432 * t) * 0.7 + Math.sin(2 * Math.PI * 864 * t) * 0.3) * Math.exp(-t * 1.4);
    }},
    { id: 'bell_achievement_fanfare', cat: 'Bell & Chimes', dur: 0.75, desc: 'Three-tone ascending achievement chime', fn: (t) => {
      let freq = 523; // C5
      let env = Math.exp(-t * 6);
      if (t >= 0.12 && t < 0.24) { freq = 659; env = Math.exp(-(t - 0.12) * 6); }
      if (t >= 0.24) { freq = 784; env = Math.exp(-(t - 0.24) * 4); }
      return Math.sin(2 * Math.PI * freq * t) * env * 0.65;
    }},

    // 5. Paper & Artisan Foley (10 sounds)
    { id: 'paper_slide', cat: 'Paper & Artisan Foley', dur: 0.22, desc: 'Friction rustle of cardstock sliding on desk', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * (600 + Math.sin(2 * Math.PI * 15 * t) * 300) * t) * 0.85 },
    { id: 'paper_tear', cat: 'Paper & Artisan Foley', dur: 0.28, desc: 'Crisp fibrous tear of heavy paper', fn: (t) => Math.exp(-t * 10) * (rng() * 2 - 1) * (0.6 + Math.sin(2 * Math.PI * 120 * t) * 0.4) },
    { id: 'card_shuffle', cat: 'Paper & Artisan Foley', dur: 0.40, desc: 'Rapid riffle shuffle of playing cards', fn: (t) => {
      const click = Math.sin(2 * Math.PI * 45 * t) > 0.8 ? (rng() * 2 - 1) * 0.8 : 0;
      return (click + (rng() * 2 - 1) * 0.2) * Math.sin(Math.PI * (t / 0.4));
    }},
    { id: 'parchment_rustle', cat: 'Paper & Artisan Foley', dur: 0.30, desc: 'Dry vintage parchment texture rustle', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * 0.5 },
    { id: 'book_page_flip', cat: 'Paper & Artisan Foley', dur: 0.18, desc: 'Quick snap of a textbook page turning', fn: (t) => Math.exp(-t * 22) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 950 * t) },
    { id: 'sticker_peel', cat: 'Paper & Artisan Foley', dur: 0.24, desc: 'Sticky adhesive peeling off paper backing', fn: (t, d) => Math.pow(t / d, 1.5) * (rng() * 2 - 1) * 0.65 },
    { id: 'sticker_place', cat: 'Paper & Artisan Foley', dur: 0.10, desc: 'Firm adhesive slap onto surface', fn: (t) => Math.exp(-t * 60) * (Math.sin(2 * Math.PI * 450 * t) * 0.6 + (rng() * 2 - 1) * 0.4) },
    { id: 'pencil_sketch', cat: 'Paper & Artisan Foley', dur: 0.15, desc: 'Graphite pencil drawing a quick hatched line', fn: (t) => Math.sin(2 * Math.PI * 180 * t) * (rng() * 2 - 1) * 0.4 },
    { id: 'ruler_slap', cat: 'Paper & Artisan Foley', dur: 0.14, desc: 'Plastic drafting ruler snapping against cutting mat', fn: (t) => Math.exp(-t * 70) * Math.sin(2 * Math.PI * 1600 * t) },
    { id: 'receipt_print', cat: 'Paper & Artisan Foley', dur: 0.35, desc: 'Thermal receipt printer stepper motor chatter', fn: (t) => {
      const step = Math.sin(2 * Math.PI * 120 * t) > 0.6 ? 0.7 : -0.7;
      return step * Math.exp(-t * 4);
    }},

    // 6. Sci-Fi & Digital (12 sounds)
    { id: 'space_laser', cat: 'Sci-Fi & Digital', dur: 0.28, desc: 'Downward exponential frequency modulation sweep', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * (3600 * Math.exp(-t * 22) + 180) * t) * 1.8) * Math.exp(-t * 12) * 0.85 },
    { id: 'electric_spark', cat: 'Sci-Fi & Digital', dur: 0.16, desc: 'Sharp erratic high-voltage crackle', fn: (t) => (rng() > 0.82 ? (rng() * 2 - 1) * 0.95 : 0 + Math.sin(2 * Math.PI * 5800 * t) * 0.3) * Math.exp(-t * 24) * 0.85 },
    { id: 'glitch_burst', cat: 'Sci-Fi & Digital', dur: 0.18, desc: 'Bitcrushed stepped noise burst', fn: (t) => {
      const step = Math.floor(t * 16);
      return (Math.sin(step * 37) > 0 ? 0.7 : -0.7) * Math.exp(-t * 15);
    }},
    { id: 'forcefield_hum', cat: 'Sci-Fi & Digital', dur: 0.50, desc: 'Resonant electromagnetic shield barrier hum', fn: (t) => Math.sin(2 * Math.PI * 120 * t) * Math.sin(2 * Math.PI * 8 * t) * 0.7 },
    { id: 'teleport_zap', cat: 'Sci-Fi & Digital', dur: 0.38, desc: 'Ascending quantum teleportation phase shift', fn: (t, d) => Math.sin(2 * Math.PI * (200 + Math.pow(t / d, 2) * 4200) * t) * Math.sin(Math.PI * (t / d)) },
    { id: 'hologram_flicker', cat: 'Sci-Fi & Digital', dur: 0.22, desc: 'High-frequency holographic emitter flicker', fn: (t) => Math.sin(2 * Math.PI * 3600 * t) * (rng() > 0.3 ? 0.8 : 0) * Math.exp(-t * 10) },
    { id: 'scanner_beam', cat: 'Sci-Fi & Digital', dur: 0.40, desc: 'Optical biometric CAD scanner beam sweep', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (1200 + Math.sin(2 * Math.PI * 6 * t) * 400) * t) },
    { id: 'data_transmit_pulse', cat: 'Sci-Fi & Digital', dur: 0.12, desc: 'Ultra-fast packet transmit data burst', fn: (t) => Math.sin(2 * Math.PI * 2800 * t) * Math.exp(-t * 55) },
    { id: 'warp_drive_charge', cat: 'Sci-Fi & Digital', dur: 0.65, desc: 'Low-frequency sub-bass gravitational warp spool', fn: (t, d) => Math.tanh(Math.sin(2 * Math.PI * (45 + Math.pow(t / d, 2) * 220) * t) * 1.5) * Math.pow(t / d, 1.2) },
    { id: 'robot_servo_whirr', cat: 'Sci-Fi & Digital', dur: 0.35, desc: 'Precision industrial robotic joint actuator whirr', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (Math.sin(2 * Math.PI * (550 + Math.sin(2 * Math.PI * 30 * t) * 80) * t) * 0.7 + (rng() * 2 - 1) * 0.2) },
    { id: 'cyber_shield_hit', cat: 'Sci-Fi & Digital', dur: 0.30, desc: 'Plasma projectile ricocheting off energy shield', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * (2400 * Math.exp(-t * 18) + 120) * t) * 1.8) * Math.exp(-t * 9) },
    { id: 'emp_blast', cat: 'Sci-Fi & Digital', dur: 0.50, desc: 'Electromagnetic pulse wave wiping out systems', fn: (t, d) => Math.exp(-t * 5) * (Math.sin(2 * Math.PI * 60 * t) * 0.6 + (rng() * 2 - 1) * (1 - t / d) * 0.4) },

    // 7. Anime & Action (10 sounds)
    { id: 'sword_clash', cat: 'Anime & Action', dur: 0.45, desc: 'Metallic blade collision with high harmonic ring', fn: (t) => {
      const ring = Math.sin(2 * Math.PI * 2200 * t) * 0.45 + Math.sin(2 * Math.PI * 3350 * t) * 0.35 + Math.sin(2 * Math.PI * 5400 * t) * 0.2;
      const noise = t < 0.015 ? (rng() * 2 - 1) * 0.8 : 0;
      return (ring + noise) * Math.exp(-t * 7.5) * 0.9;
    }},
    { id: 'blade_draw_sheath', cat: 'Anime & Action', dur: 0.35, desc: 'Polished katana blade sliding from wooden scabbard', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (1600 + (t / d) * 1200) * t) * 0.8 },
    { id: 'anime_power_aura', cat: 'Anime & Action', dur: 0.60, desc: 'Dragonball/Zenitsu electric aura surge', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (80 + Math.sin(2 * Math.PI * 25 * t) * 40) * t) * 1.2 },
    { id: 'sonic_boom', cat: 'Anime & Action', dur: 0.70, desc: 'Mach 3 supersonic barrier fracture', fn: (t) => {
      const crack = t < 0.01 ? (rng() * 2 - 1) : 0;
      const sub = Math.sin(2 * Math.PI * (180 * Math.exp(-t * 15) + 40) * t);
      return Math.tanh((sub * 1.5 + crack) * 1.4) * Math.exp(-t * 4.5);
    }},
    { id: 'lightning_strike', cat: 'Anime & Action', dur: 0.55, desc: 'Zenitsu Thunderclap flash strike', fn: (t) => {
      const bolt = rng() > 0.65 ? (rng() * 2 - 1) * 0.9 : 0;
      const rumble = Math.sin(2 * Math.PI * 65 * t);
      return (bolt + rumble * 0.5) * Math.exp(-t * 6.5);
    }},
    { id: 'anime_flash_step', cat: 'Anime & Action', dur: 0.16, desc: 'Instantaneous teleport flash step vanish', fn: (t) => Math.exp(-t * 30) * Math.sin(2 * Math.PI * (3400 * Math.exp(-t * 40) + 600) * t) },
    { id: 'punch_impact_heavy', cat: 'Anime & Action', dur: 0.30, desc: 'Anime gut punch shockwave impact', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * (220 * Math.exp(-t * 20) + 55) * t) * 2.0) * Math.exp(-t * 11) },
    { id: 'anime_eye_glint', cat: 'Anime & Action', dur: 0.22, desc: 'Sharp sparkle sound as eyes light up before attack', fn: (t) => Math.exp(-t * 20) * (Math.sin(2 * Math.PI * 3800 * t) * 0.6 + Math.sin(2 * Math.PI * 7600 * t) * 0.4) },
    { id: 'energy_blast_burst', cat: 'Anime & Action', dur: 0.48, desc: 'Charged ki sphere release', fn: (t, d) => Math.sin(Math.PI * (t / d)) * Math.sin(2 * Math.PI * (600 - (t / d) * 450) * t) * 1.2 },
    { id: 'blade_wind_vacuum', cat: 'Anime & Action', dur: 0.32, desc: 'Vacuum wind blade slicing atmosphere', fn: (t, d) => Math.pow(Math.sin(Math.PI * (t / d)), 2) * (rng() * 2 - 1) * 0.8 },

    // 8. Retro & Gaming 8-Bit (10 sounds)
    { id: 'coin_pickup', cat: 'Retro & Gaming', dur: 0.35, desc: 'Classic retro 8-bit double chime (B5 to E6)', fn: (t) => {
      let freq = 988; // B5
      let env = Math.exp(-t * 8.0);
      if (t >= 0.07) { freq = 1318.5; env = Math.exp(-(t - 0.07) * 9.0); }
      const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.6 : -0.6;
      return square * env * 0.8;
    }},
    { id: 'retro_jump', cat: 'Retro & Gaming', dur: 0.22, desc: 'Classic Mario style 8-bit jump sweep', fn: (t) => {
      const freq = 150 + t * 1800;
      const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5;
      return square * Math.exp(-t * 7);
    }},
    { id: 'retro_powerup', cat: 'Retro & Gaming', dur: 0.45, desc: 'Ascending 8-bit arpeggiated power-up fan', fn: (t) => {
      const notes = [330, 392, 494, 587, 659];
      const idx = Math.min(notes.length - 1, Math.floor(t / 0.08));
      const square = Math.sin(2 * Math.PI * notes[idx] * t) > 0 ? 0.5 : -0.5;
      return square * (1 - t / 0.45);
    }},
    { id: 'retro_game_over', cat: 'Retro & Gaming', dur: 0.60, desc: 'Descending 8-bit sad game over melody', fn: (t) => {
      const notes = [440, 392, 349, 311];
      const idx = Math.min(notes.length - 1, Math.floor(t / 0.14));
      const square = Math.sin(2 * Math.PI * notes[idx] * t) > 0 ? 0.5 : -0.5;
      return square * (1 - t / 0.6);
    }},
    { id: 'retro_laser_pew', cat: 'Retro & Gaming', dur: 0.16, desc: 'Arcade space invaders laser pew', fn: (t) => {
      const freq = 1800 * Math.exp(-t * 25);
      const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.55 : -0.55;
      return square * Math.exp(-t * 18);
    }},
    { id: 'retro_explosion_bitcrush', cat: 'Retro & Gaming', dur: 0.40, desc: 'Bitcrushed white noise boom for boss kill', fn: (t) => {
      const noise = (rng() * 2 - 1) > 0 ? 0.7 : -0.7;
      return noise * Math.exp(-t * 7.5);
    }},
    { id: 'retro_health_heart', cat: 'Retro & Gaming', dur: 0.25, desc: 'Heart pickup health restore ping', fn: (t) => {
      const freq = t < 0.1 ? 659 : 880;
      const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5;
      return square * Math.exp(-t * 8);
    }},
    { id: 'retro_level_complete', cat: 'Retro & Gaming', dur: 0.55, desc: 'Cheerful 8-bit level victory fanfare', fn: (t) => {
      const notes = [523, 659, 784, 1046];
      const idx = Math.min(notes.length - 1, Math.floor(t / 0.12));
      const square = Math.sin(2 * Math.PI * notes[idx] * t) > 0 ? 0.55 : -0.55;
      return square * (1 - t / 0.55);
    }},
    { id: 'retro_teleport_blip', cat: 'Retro & Gaming', dur: 0.18, desc: 'Quick pitch-gliding arcade blip', fn: (t) => {
      const freq = 300 + Math.sin(2 * Math.PI * 30 * t) * 800;
      return (Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5) * Math.exp(-t * 14);
    }},
    { id: 'retro_dialogue_blip', cat: 'Retro & Gaming', dur: 0.04, desc: 'Animal Crossing / Pokemon text character typewriter blip', fn: (t) => {
      const square = Math.sin(2 * Math.PI * 750 * t) > 0 ? 0.4 : -0.4;
      return square * Math.exp(-t * 80);
    }},

    // 9. Cinematic & Atmospheric (10 sounds)
    { id: 'cinematic_boom', cat: 'Cinematic & Atmospheric', dur: 1.40, desc: 'Massive 45Hz sub boom with initial impact click', fn: (t) => {
      const env = Math.exp(-t * 2.8);
      const freq = 85 * Math.exp(-t * 8.0) + 38;
      const click = t < 0.012 ? (rng() * 2 - 1) * 0.8 : 0;
      const sub = Math.sin(2 * Math.PI * freq * t);
      return (Math.tanh(sub * 1.6) * 0.85 + click) * env * 0.95;
    }},
    { id: 'cinematic_riser', cat: 'Cinematic & Atmospheric', dur: 1.20, desc: 'Exponential tension building riser to drop', fn: (t, d) => {
      const prog = t / d;
      const freq = 80 + Math.pow(prog, 2.8) * 1400;
      const noise = (rng() * 2 - 1) * Math.pow(prog, 2) * 0.4;
      return (Math.sin(2 * Math.PI * freq * t) * 0.7 + noise) * Math.pow(prog, 1.5) * 0.9;
    }},
    { id: 'tape_stop', cat: 'Cinematic & Atmospheric', dur: 0.55, desc: 'Analog tape deck motor pitch dive and brake', fn: (t, d) => {
      const prog = t / d;
      const speed = Math.max(0.01, 1 - Math.pow(prog, 1.5));
      const freq = (320 + Math.sin(2 * Math.PI * 4 * t) * 50) * speed;
      const noise = (rng() * 2 - 1) * 0.15;
      return (Math.sin(2 * Math.PI * freq * t) * 0.7 + noise) * speed * 0.8;
    }},
    { id: 'vinyl_crackle', cat: 'Cinematic & Atmospheric', dur: 0.60, desc: 'Organic vintage 33 RPM gramophone surface crackle', fn: (t) => {
      const pop = rng() > 0.96 ? (rng() * 2 - 1) * 0.75 : 0;
      const hiss = (rng() * 2 - 1) * 0.08;
      return (pop + hiss) * 0.7;
    }},
    { id: 'cinematic_braam', cat: 'Cinematic & Atmospheric', dur: 1.50, desc: 'Hans Zimmer Inception style brass braam', fn: (t) => {
      const sub = Math.sin(2 * Math.PI * 55 * t);
      const brass = Math.sin(2 * Math.PI * 110 * t) * 0.5 + Math.sin(2 * Math.PI * 165 * t) * 0.3;
      return Math.tanh((sub + brass) * 2.2) * Math.exp(-t * 2.0);
    }},
    { id: 'heartbeat_sub', cat: 'Cinematic & Atmospheric', dur: 0.40, desc: 'Organic low-pass anatomical heartbeat lub-dub', fn: (t) => {
      const e1 = Math.exp(-t * 18);
      const e2 = t > 0.16 ? Math.exp(-(t - 0.16) * 18) : 0;
      return (Math.sin(2 * Math.PI * 48 * t) * e1 + (t > 0.16 ? Math.sin(2 * Math.PI * 52 * (t - 0.16)) * e2 : 0)) * 0.85;
    }},
    { id: 'deep_ocean_drone', cat: 'Cinematic & Atmospheric', dur: 1.20, desc: 'Subsea abyssal ambient drone', fn: (t) => {
      return (Math.sin(2 * Math.PI * 38 * t) * 0.6 + Math.sin(2 * Math.PI * 76 * t) * 0.4) * 0.8;
    }},
    { id: 'glass_shimmer_chime', cat: 'Cinematic & Atmospheric', dur: 0.80, desc: 'Ethereal high harmonic shimmer for dream sequences', fn: (t) => {
      return (Math.sin(2 * Math.PI * 2800 * t) * 0.4 + Math.sin(2 * Math.PI * 3600 * t) * 0.3 + Math.sin(2 * Math.PI * 4400 * t) * 0.3) * Math.exp(-t * 4);
    }},
    { id: 'clock_ticking_tension', cat: 'Cinematic & Atmospheric', dur: 0.30, desc: 'Ticking mechanical grandfather clock pendulum', fn: (t) => {
      const tick = Math.exp(-t * 60) * Math.sin(2 * Math.PI * 1200 * t);
      return tick * 0.75;
    }},
    { id: 'subliminal_drop_swell', cat: 'Cinematic & Atmospheric', dur: 0.90, desc: 'Reverse bass swell pulling downward', fn: (t, d) => {
      return Math.sin(2 * Math.PI * (40 + Math.pow(t / d, 2) * 50) * t) * Math.pow(t / d, 1.8);
    }},

    // 10. Camera & Media Hardware (8 sounds)
    { id: 'camera_shutter', cat: 'Camera & Media', dur: 0.22, desc: 'Mirror flip + curtain slide + latch click', fn: (t) => {
      const click1 = Math.exp(-t * 120.0) * Math.sin(2 * Math.PI * 2800 * t);
      const slide = t > 0.04 && t < 0.16 ? (rng() * 2 - 1) * Math.sin(Math.PI * ((t - 0.04) / 0.12)) * 0.4 : 0;
      const click2 = t > 0.14 ? Math.exp(-(t - 0.14) * 90.0) * Math.sin(2 * Math.PI * 3400 * (t - 0.14)) : 0;
      return (click1 * 0.7 + slide + click2 * 0.8) * 0.9;
    }},
    { id: 'film_advance_motor', cat: 'Camera & Media', dur: 0.28, desc: 'Mechanical 35mm film advance motor winding', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (Math.sin(2 * Math.PI * 340 * t) * 0.5 + (rng() * 2 - 1) * 0.3) },
    { id: 'camera_flash_pop', cat: 'Camera & Media', dur: 0.18, desc: 'High-voltage strobe capacitor discharge pop', fn: (t) => Math.exp(-t * 30) * (rng() * 2 - 1) * Math.sin(2 * Math.PI * 3200 * t) },
    { id: 'lens_autofocus_seek', cat: 'Camera & Media', dur: 0.16, desc: 'Ultrasonic lens autofocus micromotor step', fn: (t) => Math.sin(2 * Math.PI * 850 * t) * (Math.floor(t * 40) % 2 === 0 ? 0.6 : 0) },
    { id: 'projector_shutter_chatter', cat: 'Camera & Media', dur: 0.35, desc: 'Vintage 24fps film projector rotating shutter click', fn: (t) => (Math.sin(2 * Math.PI * 24 * t) > 0.5 ? 0.7 : -0.7) * Math.exp(-t * 5) },
    { id: 'cassette_tape_insert', cat: 'Camera & Media', dur: 0.25, desc: 'Cassette tape mechanism locking into slot', fn: (t) => Math.exp(-t * 40) * Math.sin(2 * Math.PI * 950 * t) },
    { id: 'clapperboard_snap', cat: 'Camera & Media', dur: 0.12, desc: 'Crisp studio clapperboard stick snap', fn: (t) => Math.exp(-t * 90) * Math.sin(2 * Math.PI * 1800 * t) },
    { id: 'studio_spotlight_on', cat: 'Camera & Media', dur: 0.18, desc: 'Heavy tungsten studio spotlight switch thunk', fn: (t) => Math.exp(-t * 35) * Math.sin(2 * Math.PI * 320 * t) },

    // 11. Mechanical & Industrial (10 sounds)
    { id: 'mechanical_gear_click', cat: 'Mechanical & Industrial', dur: 0.08, desc: 'Precision steel watch escapement gear click', fn: (t) => Math.exp(-t * 110) * Math.sin(2 * Math.PI * 3400 * t) },
    { id: 'hydraulic_hiss', cat: 'Mechanical & Industrial', dur: 0.32, desc: 'High pressure pneumatic piston release hiss', fn: (t, d) => Math.sin(Math.PI * (t / d)) * (rng() * 2 - 1) * 0.7 },
    { id: 'metal_latch_snap', cat: 'Mechanical & Industrial', dur: 0.14, desc: 'Heavy flight case latch clicking shut', fn: (t) => Math.exp(-t * 70) * (Math.sin(2 * Math.PI * 1400 * t) * 0.7 + Math.sin(2 * Math.PI * 2800 * t) * 0.3) },
    { id: 'ratchet_wrench_click', cat: 'Mechanical & Industrial', dur: 0.06, desc: 'Mechanic ratchet socket wrench click', fn: (t) => Math.exp(-t * 120) * Math.sin(2 * Math.PI * 4100 * t) },
    { id: 'industrial_relay_switch', cat: 'Mechanical & Industrial', dur: 0.10, desc: 'Industrial control cabinet heavy relay engagement', fn: (t) => Math.exp(-t * 50) * Math.sin(2 * Math.PI * 650 * t) },
    { id: 'typewriter_keystroke', cat: 'Mechanical & Industrial', dur: 0.06, desc: 'Cast iron typewriter typebar striking ribbon', fn: (t) => Math.exp(-t * 95) * (Math.sin(2 * Math.PI * 2200 * t) * 0.6 + (rng() * 2 - 1) * 0.4) },
    { id: 'typewriter_bell_return', cat: 'Mechanical & Industrial', dur: 0.30, desc: 'Typewriter line return bell ding', fn: (t) => Math.exp(-t * 12) * Math.sin(2 * Math.PI * 2900 * t) },
    { id: 'engine_crank_pulse', cat: 'Mechanical & Industrial', dur: 0.25, desc: 'Combustion engine piston ignition pulse', fn: (t) => Math.tanh(Math.sin(2 * Math.PI * 95 * t) * 1.6) * Math.exp(-t * 14) },
    { id: 'pneumatic_drill_tap', cat: 'Mechanical & Industrial', dur: 0.08, desc: 'High-speed pneumatic tool impact tap', fn: (t) => Math.exp(-t * 80) * Math.sin(2 * Math.PI * 1850 * t) },
    { id: 'vault_wheel_turn', cat: 'Mechanical & Industrial', dur: 0.22, desc: 'Heavy brass bank vault combination dial turn', fn: (t) => Math.exp(-t * 40) * Math.sin(2 * Math.PI * 1100 * t) },

    // 12. Cartoon & Fun FX (12 sounds)
    { id: 'bubble_pop', cat: 'Cartoon & Fun FX', dur: 0.14, desc: 'Watery resonant cartoon soap bubble pop', fn: (t) => {
      const freq = 600 + Math.sin(2 * Math.PI * 30.0 * t) * 400 + (t < 0.04 ? 800 * (1 - t / 0.04) : 0);
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 40.0) * 0.9;
    }},
    { id: 'cork_pop', cat: 'Cartoon & Fun FX', dur: 0.18, desc: 'Champagne bottle pressurized wooden cork pop', fn: (t) => {
      const freq = 1100 * Math.exp(-t * 40) + 160;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 22);
    }},
    { id: 'cartoon_boing', cat: 'Cartoon & Fun FX', dur: 0.40, desc: 'Elastic bouncy bedspring boing', fn: (t, d) => {
      const freq = 180 + Math.sin(2 * Math.PI * 14 * t) * 80;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 6.0);
    }},
    { id: 'cartoon_slip_whistle', cat: 'Cartoon & Fun FX', dur: 0.35, desc: 'Comedic banana peel slide whistle pitch drop', fn: (t, d) => {
      const freq = 1800 - Math.pow(t / d, 2) * 1200;
      return Math.sin(2 * Math.PI * freq * t) * Math.sin(Math.PI * (t / d));
    }},
    { id: 'cartoon_gulp', cat: 'Cartoon & Fun FX', dur: 0.20, desc: 'Comedic throat swallow gulp', fn: (t) => {
      const freq = 420 * Math.exp(-t * 16) + 180;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 15);
    }},
    { id: 'water_drip', cat: 'Cartoon & Fun FX', dur: 0.15, desc: 'Resonant cavern water drop ping', fn: (t) => {
      const freq = 1800 * Math.exp(-t * 30) + 650;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 25);
    }},
    { id: 'squeaky_toy', cat: 'Cartoon & Fun FX', dur: 0.16, desc: 'Rubber duck squeak toy press', fn: (t) => {
      const freq = 1600 + Math.sin(2 * Math.PI * 40 * t) * 600;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 18);
    }},
    { id: 'cartoon_head_bonk', cat: 'Cartoon & Fun FX', dur: 0.24, desc: 'Hollow wooden block head bonk', fn: (t) => {
      return (Math.sin(2 * Math.PI * 520 * t) * 0.7 + Math.sin(2 * Math.PI * 1040 * t) * 0.3) * Math.exp(-t * 24);
    }},
    { id: 'cartoon_running_scramble', cat: 'Cartoon & Fun FX', dur: 0.30, desc: 'Scooby-doo rapid feet scrambling on tiles', fn: (t) => {
      const step = Math.sin(2 * Math.PI * 28 * t) > 0.6 ? 0.7 : -0.7;
      return step * Math.exp(-t * 4);
    }},
    { id: 'cartoon_kiss_mwah', cat: 'Cartoon & Fun FX', dur: 0.14, desc: 'Exaggerated lip smack kiss pop', fn: (t) => {
      return Math.sin(2 * Math.PI * (900 * Math.exp(-t * 35) + 320) * t) * Math.exp(-t * 30);
    }},
    { id: 'balloon_inflate_squeak', cat: 'Cartoon & Fun FX', dur: 0.26, desc: 'Rubber balloon neck stretched friction squeak', fn: (t) => {
      const freq = 2200 + (rng() * 2 - 1) * 300;
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 10);
    }},
    { id: 'party_horn_toot', cat: 'Cartoon & Fun FX', dur: 0.38, desc: 'Paper party horn celebration toot', fn: (t, d) => {
      const saw = (t * 440) % 1 > 0.5 ? 0.6 : -0.6;
      return saw * Math.sin(Math.PI * (t / d));
    }},
  ];

  soundDefinitions.forEach((def) => {
    const numSamples = Math.floor(sampleRate * def.dur);
    const samples = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      samples[i] = def.fn(t, def.dur);
    }

    const wavBuf = createWavBuffer(samples, sampleRate);
    const fileName = `${def.id}.wav`;
    fs.writeFileSync(path.join(libDir, fileName), wavBuf);

    catalog.push({
      id: def.id,
      category: def.cat,
      durationSec: def.dur,
      description: def.desc,
      fileName,
      path: `public/sfx/library/${fileName}`,
    });
  });

  const catalogPath = path.join(libDir, 'sfx-catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify({ total: catalog.length, catalog }, null, 2));
  console.log(`✔ Written ${catalog.length} studio-grade WAV sound files to public/sfx/library/`);
  console.log(`✔ Written catalog index to ${catalogPath}`);
}

synthesizeEventLockedBed();
synthesizeComprehensiveLibrary();
