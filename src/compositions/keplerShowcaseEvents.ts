import { SfxCue } from '../engines/psychoacoustic/MicroSfxEngine.ts';

export const KEPLER_FPS = 60;
export const KEPLER_TOTAL_FRAMES = 2700; // 45.00s exact

export const KEPLER_ACT_BOUNDARIES = {
  ACT1_HOOK_START: 0,
  ACT2_HARDWARE_ANATOMY_START: 450,
  ACT3_RUNTIME_START: 1080,
  ACT4_BENCHMARK_START: 1710,
  ACT5_CLIMAX_START: 2250,
} as const;

export const ACT1_GIT_COMMAND = 'git clone https://github.com/HamzaShaikhAI/KeplerBridge.git';
export const ACT1_TYPE_START = 15;
export const ACT1_FRAMES_PER_CHAR = 3; // 58 chars * 3 = 174 frames
export const ACT1_ENTER_FRAME = 180;
export const ACT1_CALIPER_DRAW_FRAME = 220;
export const ACT1_HEADLINE_FRAME = 310;

export const ACT2_CALLOUT_EVENTS = [
  { id: '01', title: 'GK107 KEPLER CORE', spec: '384 CUDA Cores · 28nm TSMC · 993 MHz', frame: 520, sfx: 'servo_whirr' },
  { id: '02', title: '9-BLADE AXIAL COOLER', spec: 'Extruded Aluminum Radial Fin Array', frame: 630, sfx: 'hardware_fan_spinup' },
  { id: '03', title: 'GDDR5 MEMORY & SOLID CAPS', spec: '128-Bit Bus · 5.0 Gbps · Japanese Caps', frame: 740, sfx: 'mechanical_click' },
  { id: '04', title: 'PCIE 3.0 X16 GOLD CONNECTOR', spec: '164-Pin Gold-Plated Fingers · 10DE:0FC8', frame: 850, sfx: 'hardware_pcie_slot_snap' },
  { id: '05', title: 'STEEL I/O BRACKET', spec: 'Dual-Link DVI-I · Mini-HDMI · D-Sub VGA', frame: 960, sfx: 'sword_clash' },
] as const;

export const ACT3_DATA_PULSES_START = 1110;
export const ACT3_DATA_PULSES_END = 1680;
export const ACT3_TELEMETRY_GAUGES = [
  { label: 'CORE CLOCK', val: '993 MHz', frame: 1140 },
  { label: 'VRAM BUS', val: '128-BIT @ 5.0 Gbps', frame: 1260 },
  { label: 'OPERATING TEMP', val: '44°C (AXIAL PWM ACTIVE)', frame: 1380 },
  { label: 'BRIDGE TRANSLATION LATENCY', val: '< 0.38 ms (ZERO BOTTLENECK)', frame: 1500 },
] as const;

export const ACT4_BENCHMARK_STEPS = [
  {
    cmd: '> keplerbridge --detect-gpu',
    res: '✔ Found NVIDIA GeForce GT 740 (GK107 · PCI 10DE:0FC8)',
    execFrame: 1735,
    passFrame: 1765,
  },
  {
    cmd: '> keplerbridge --init-bridge',
    res: '✔ Translation layer active · Zero frame drop (d3d12.dll)',
    execFrame: 1815,
    passFrame: 1845,
  },
  {
    cmd: '> keplerbridge --verify-outputs',
    res: '✔ HDMI / DVI-I display pipeline locked @ 60Hz raster',
    execFrame: 1895,
    passFrame: 1925,
  },
  {
    cmd: '> keplerbridge --bench',
    res: '✔ Hardware acceleration verified · Grade A+ (100% Pass)',
    execFrame: 1975,
    passFrame: 2015,
  },
] as const;
export const ACT4_BADGE_FRAME = 2070;

export const ACT5_PILL_EVENTS = [
  { label: 'Open Source', frame: 2285 },
  { label: 'GK107 Native', frame: 2315 },
  { label: 'Zero-Overhead Bridge', frame: 2345 },
  { label: 'Plug & Play d3d12', frame: 2375 },
] as const;
export const ACT5_CTA_FRAME = 2430;

/**
 * Generates frame-accurate SfxCue[] timeline for KeplerBridgeHardwareShowcase
 */
export function buildKeplerShowcaseSfxTimeline(): SfxCue[] {
  const cues: SfxCue[] = [];

  // 1. Act 1: Command line typing
  for (let i = 0; i < ACT1_GIT_COMMAND.length; i += 2) {
    cues.push({
      frame: ACT1_TYPE_START + i * ACT1_FRAMES_PER_CHAR,
      sfx: 'ui_keystroke_tick',
      gain: 0.28 + (i % 3) * 0.04,
    });
  }
  // Enter slam & CAD emergence
  cues.push({ frame: ACT1_ENTER_FRAME, sfx: 'impact_thud', gain: 0.75 });
  cues.push({ frame: ACT1_CALIPER_DRAW_FRAME, sfx: 'electric_spark', gain: 0.45 });
  cues.push({ frame: ACT1_CALIPER_DRAW_FRAME + 20, sfx: 'whoosh_fast', gain: 0.40 });
  cues.push({ frame: ACT1_HEADLINE_FRAME, sfx: 'card_pop', gain: 0.65 });

  // 2. Act 2: Hardware Anatomy leader lines
  cues.push({ frame: KEPLER_ACT_BOUNDARIES.ACT2_HARDWARE_ANATOMY_START, sfx: 'whoosh_fast', gain: 0.50 });
  ACT2_CALLOUT_EVENTS.forEach((item) => {
    cues.push({ frame: item.frame, sfx: item.sfx as any, gain: 0.42 });
    cues.push({ frame: item.frame + 12, sfx: 'card_pop', gain: 0.55 });
  });

  // 3. Act 3: Runtime translation data pulses
  cues.push({ frame: KEPLER_ACT_BOUNDARIES.ACT3_RUNTIME_START, sfx: 'whoosh_fast', gain: 0.48 });
  for (let f = ACT3_DATA_PULSES_START; f < ACT3_DATA_PULSES_END; f += 45) {
    cues.push({
      frame: f,
      sfx: (f / 45) % 2 === 0 ? 'ui_toggle' : 'bubble_pop',
      gain: 0.22,
    });
  }
  ACT3_TELEMETRY_GAUGES.forEach((g) => {
    cues.push({ frame: g.frame, sfx: 'paper_slide', gain: 0.38 });
    cues.push({ frame: g.frame + 10, sfx: 'bell_ding', gain: 0.30 });
  });

  // 4. Act 4: Live Terminal Benchmark
  ACT4_BENCHMARK_STEPS.forEach((step) => {
    cues.push({ frame: step.execFrame, sfx: 'keyboard_keystroke', gain: 0.35 });
    cues.push({ frame: step.passFrame, sfx: 'bell_ding', gain: 0.58 });
  });
  cues.push({ frame: ACT4_BADGE_FRAME, sfx: 'cinematic_boom', gain: 0.72 });
  cues.push({ frame: ACT4_BADGE_FRAME + 6, sfx: 'bell_ding', gain: 0.60 });

  // 5. Act 5: Climax pullback & CTA lockup
  cues.push({ frame: KEPLER_ACT_BOUNDARIES.ACT5_CLIMAX_START - 40, sfx: 'cinematic_riser', gain: 0.55 });
  cues.push({ frame: KEPLER_ACT_BOUNDARIES.ACT5_CLIMAX_START, sfx: 'heavy_bass_drop', gain: 0.85 });

  ACT5_PILL_EVENTS.forEach((pill) => {
    cues.push({ frame: pill.frame, sfx: 'card_pop', gain: 0.48 });
  });
  cues.push({ frame: ACT5_CTA_FRAME, sfx: 'impact_thud', gain: 0.76 });
  cues.push({ frame: ACT5_CTA_FRAME + 8, sfx: 'bell_ding', gain: 0.65 });
  cues.push({ frame: 2640, sfx: 'tape_stop', gain: 0.40 });

  return cues.sort((a, b) => (a.frame ?? 0) - (b.frame ?? 0));
}
