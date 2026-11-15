import path from 'path';
import { StudioFoleyEngine } from '../src/engines/psychoacoustic/StudioFoleyEngine.ts';
import {
  buildReaShowcaseStudioSfxTimeline,
  SHOWCASE_TOTAL_FRAMES,
  SHOWCASE_FPS,
} from '../src/compositions/reaShowcaseEvents.ts';

const outPath = path.resolve(process.cwd(), 'public/audio/rea_master_studio_mix.wav');
console.log('⚡ Synthesizing Studio-Grade Master Audio Bed (116 BPM Rhodes/Sub-Bass + 1:1 Tactile Foley)...');

const cues = buildReaShowcaseStudioSfxTimeline();
console.log(`✔ Loaded ${cues.length} frame-locked studio foley cues`);

StudioFoleyEngine.renderMasterMix(cues, SHOWCASE_TOTAL_FRAMES, SHOWCASE_FPS, outPath);
console.log(`🎉 Master Audio Mix successfully rendered to ${outPath}`);
