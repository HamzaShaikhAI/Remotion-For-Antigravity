#!/usr/bin/env node

/**
 * REA CLI - Remotion Engine for Antigravity (v2.0.0-rc.1)
 * Enterprise-grade orchestration, video rendering, procedural SFX synthesis,
 * AI voiceover generation, and FFmpeg multimedia engine built exclusively
 * for Google Antigravity 2.0.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execSync } = require('child_process');

const VERSION = '2.0.0-rc.1';

// ANSI terminal colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}
function logSuccess(msg) {
  console.log(`${colors.green}✔ ${msg}${colors.reset}`);
}
function logInfo(msg) {
  console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`);
}
function logWarn(msg) {
  console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`);
}
function logError(msg) {
  console.error(`${colors.red}✖ ${msg}${colors.reset}`);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Locates Remotion's bundled cross-platform FFmpeg binary without forcing
 * the user to install FFmpeg globally or configure Windows PATH.
 */
function getFfmpegPath() {
  const searchDirs = [
    process.cwd(),
    __dirname,
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../dastras-showcase'),
  ];

  for (const base of searchDirs) {
    try {
      const getExec = require(path.join(base, 'node_modules/@remotion/renderer/dist/compositor/get-executable-path'));
      if (getExec && getExec.getExecutablePath) {
        const p = getExec.getExecutablePath({ type: 'ffmpeg' });
        if (p && fs.existsSync(p)) return p;
      }
    } catch (e) {}
  }

  for (const base of searchDirs) {
    const nodeModules = path.join(base, 'node_modules/@remotion');
    if (fs.existsSync(nodeModules)) {
      const entries = fs.readdirSync(nodeModules);
      for (const entry of entries) {
        if (entry.startsWith('compositor-')) {
          const binName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
          const directBin = path.join(nodeModules, entry, binName);
          if (fs.existsSync(directBin)) return directBin;
        }
      }
    }
  }

  try {
    const bundler = require('@remotion/bundler');
    if (bundler && typeof bundler.getFfmpegPath === 'function') {
      const p = bundler.getFfmpegPath();
      if (p && fs.existsSync(p)) return p;
    }
  } catch (e) {}

  return 'ffmpeg';
}

/**
 * Locates Remotion's bundled cross-platform ffprobe binary for media metadata probing.
 */
function getFfprobePath() {
  const searchDirs = [
    process.cwd(),
    __dirname,
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../dastras-showcase'),
  ];

  for (const base of searchDirs) {
    try {
      const getExec = require(path.join(base, 'node_modules/@remotion/renderer/dist/compositor/get-executable-path'));
      if (getExec && getExec.getExecutablePath) {
        const p = getExec.getExecutablePath({ type: 'ffprobe' });
        if (p && fs.existsSync(p)) return p;
      }
    } catch (e) {}
  }

  for (const base of searchDirs) {
    const nodeModules = path.join(base, 'node_modules/@remotion');
    if (fs.existsSync(nodeModules)) {
      const entries = fs.readdirSync(nodeModules);
      for (const entry of entries) {
        if (entry.startsWith('compositor-')) {
          const binName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
          const directBin = path.join(nodeModules, entry, binName);
          if (fs.existsSync(directBin)) return directBin;
        }
      }
    }
  }

  return 'ffprobe';
}

// ==========================================
// PURE NODE.JS SOUND DESIGN ENGINE (V2)
// ==========================================

/**
 * Pure Node.js 16-bit Mono PCM WAV Writer (Zero external dependencies)
 */
function writeWavFile(filePath, samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20);  // AudioFormat = 1 (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767 * 0.75), 44 + i * 2); // Normalized ~ -2.5dB
  }

  ensureDir(path.dirname(path.resolve(filePath)));
  fs.writeFileSync(filePath, buffer);
}

/**
 * Deterministic PRNG (Mulberry32) for reproducible noise bursts
 */
function createRng(seed = 42) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Procedural SFX Synthesizer
 */
function generateSfxSamples(preset, sampleRate = 44100) {
  const rng = createRng(1337);

  switch (preset) {
    case 'whoosh': {
      const duration = 0.45;
      const total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      let lp = 0;
      for (let i = 0; i < total; i++) {
        const progress = i / total;
        const t = i / sampleRate;
        const env = Math.pow(Math.sin(Math.PI * progress), 2);
        const white = rng() * 2 - 1;
        const cutoff = 0.03 + 0.22 * Math.sin(Math.PI * progress);
        lp += cutoff * (white - lp);
        const sub = Math.sin(2 * Math.PI * (160 - 110 * progress) * t) * 0.35;
        samples[i] = (lp * 1.4 + sub) * env;
      }
      return samples;
    }

    case 'pop': {
      const duration = 0.14;
      const total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const progress = i / total;
        const t = i / sampleRate;
        const env = Math.exp(-progress * 22);
        const freq = 220 + 620 * Math.exp(-progress * 35);
        samples[i] = Math.sin(2 * Math.PI * freq * t) * env;
      }
      return samples;
    }

    case 'riser': {
      const duration = 1.5;
      const total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      let phase = 0;
      for (let i = 0; i < total; i++) {
        const progress = i / total;
        const freq = 90 + Math.pow(progress, 2.4) * 950;
        phase += (2 * Math.PI * freq) / sampleRate;
        const env = Math.pow(progress, 1.5) * (progress > 0.96 ? (1 - progress) / 0.04 : 1);
        const shimmer = (rng() * 2 - 1) * 0.25 * Math.pow(progress, 2);
        samples[i] = (Math.sin(phase) * 0.65 + shimmer) * env;
      }
      return samples;
    }

    case 'typewriter': {
      const duration = 0.06;
      const total = Math.floor(sampleRate * duration);
      const samples = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const progress = i / total;
        const t = i / sampleRate;
        const env = Math.exp(-progress * 45);
        const click = (rng() * 2 - 1) * 0.7 + Math.sin(2 * Math.PI * 1850 * t) * 0.4;
        samples[i] = click * env;
      }
      return samples;
    }

    default:
      throw new Error(`Unknown SFX preset "${preset}". Available presets: whoosh, pop, riser, typewriter.`);
  }
}

// Built-in plugin templates for instant offline code generation
const PLUGIN_TEMPLATES = {
  'rea-transitions': {
    description: 'GPU-accelerated slide, fade, glitch, and wipe transitions',
    files: {
      'index.tsx': `import { useCurrentFrame } from 'remotion';
import React from 'react';

export const GlitchTransition: React.FC<{
  children: React.ReactNode;
  intensity?: number;
}> = ({ children, intensity = 1 }) => {
  const frame = useCurrentFrame();

  const isGlitching = frame < 15;
  const glitchOffset = isGlitching ? Math.sin(frame * 43.1) * 8 * intensity : 0;
  const channelShift = isGlitching ? Math.cos(frame * 12.4) * 6 * intensity : 0;
  const clipPathValue = isGlitching
    ? \`inset(\${Math.abs(Math.sin(frame) * 50)}% 0 \${Math.abs(Math.cos(frame) * 40)}% 0)\`
    : 'inset(0% 0 0% 0)';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', clipPath: clipPathValue }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: \`translate(\${glitchOffset}px, 0)\`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: \`translate(\${-glitchOffset * 0.7}px, \${channelShift * 0.5}px)\`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-typography': {
    description: 'Kinetic split-text, typewriter, and spring typography animations',
    files: {
      'index.tsx': `import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import React from 'react';

export const KineticSplitText: React.FC<{
  text: string;
  delayPerLetter?: number;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, delayPerLetter = 2, color = '#ffffff', fontSize = 64, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split('');

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 900,
        fontSize,
        color,
        ...style,
      }}
    >
      {letters.map((char, index) => {
        const charSpring = spring({
          frame: frame - index * delayPerLetter,
          fps,
          config: { damping: 12, mass: 0.8, stiffness: 150 },
        });

        const translateY = interpolate(charSpring, [0, 1], [80, 0]);
        const opacity = interpolate(charSpring, [0, 0.4, 1], [0, 0.8, 1]);
        const scale = interpolate(charSpring, [0, 0.7, 1], [0.5, 1.1, 1]);

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: \`translateY(\${translateY}px) scale(\${scale})\`,
              opacity,
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-particles': {
    description: 'Deterministic particle emitters (cyberpunk neon embers, dust, starfields)',
    files: {
      'index.tsx': `import { useCurrentFrame, useVideoConfig } from 'remotion';
import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  baseX: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export const NeonEmbers: React.FC<{ count?: number; interactive?: boolean }> = ({
  count = 50,
  interactive = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [mouse, setMouse] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const particles: Particle[] = React.useMemo(() => {
    const neonPalette = ['#00f5ff', '#a855f7', '#3b82f6', '#ec4899', '#ffffff'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      baseX: (i * 37) % 100,
      size: 3 + ((i * 13) % 6),
      speed: 1.2 + ((i * 7) % 3.5),
      opacity: 0.3 + ((i * 11) % 0.6),
      color: neonPalette[i % neonPalette.length],
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => {
        const naturalY = height + 50 - ((frame * p.speed * 2) % (height + 100));
        let horizontalDrift = p.baseX + Math.sin((frame + p.id * 10) * 0.04) * 2.5;

        if (mouse.x !== null && mouse.y !== null) {
          const particleScreenX = (horizontalDrift / 100) * width;
          const particleScreenY = naturalY;
          const distX = particleScreenX - mouse.x;
          const distY = particleScreenY - mouse.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            horizontalDrift += (distX / distance) * force * 15;
          }
        }

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: \`\${horizontalDrift}%\`,
              top: \`\${naturalY}px\`,
              width: \`\${p.size}px\`,
              height: \`\${p.size}px\`,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: \`0 0 \${p.size * 3}px \${p.color}, 0 0 \${p.size * 6}px \${p.color}\`,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </div>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-mockups': {
    description: 'Sleek dark/light browser window, macOS terminal, and iPhone frames',
    files: {
      'index.tsx': `import React from 'react';

export const BrowserMockup: React.FC<{
  children: React.ReactNode;
  url?: string;
  theme?: 'dark' | 'light';
}> = ({ children, url = 'https://antigravity.google.dev', theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 18px',
          backgroundColor: isDark ? '#0a0f1d' : '#f1f5f9',
          borderBottom: \`1px solid \${isDark ? '#1e293b' : '#e2e8f0'}\`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
        <div
          style={{
            marginLeft: 16,
            backgroundColor: '#1e293b',
            padding: '4px 12px',
            borderRadius: 6,
            color: '#94a3b8',
            fontSize: 13,
            fontFamily: 'monospace',
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', minHeight: 600 }}>{children}</div>
    </div>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-captions': {
    description: 'Dynamic word-by-word animated subtitles and SRT/VTT parser components',
    files: {
      'index.tsx': `import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CaptionWord {
  word: string;
  startInFrames: number;
  endInFrames: number;
}

export const AnimatedCaptions: React.FC<{
  words: CaptionWord[];
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  highlightPill?: boolean;
}> = ({
  words,
  activeColor = '#00f5ff',
  inactiveColor = '#94a3b8',
  fontSize = 42,
  highlightPill = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        padding: '20px 40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 800,
        fontSize,
        lineHeight: 1.4,
      }}
    >
      {words.map((item, index) => {
        const isActive = frame >= item.startInFrames && frame <= item.endInFrames;

        const wordSpring = spring({
          frame: frame - item.startInFrames,
          fps,
          config: { damping: 10, mass: 0.5, stiffness: 170 },
        });

        const scale = isActive
          ? interpolate(wordSpring, [0, 1], [0.95, 1.18])
          : 1.0;

        const color = isActive ? activeColor : inactiveColor;
        const textShadow = isActive ? \`0 0 24px \${activeColor}, 0 0 40px \${activeColor}\` : 'none';

        return (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              transform: \`scale(\${scale})\`,
              textShadow,
              backgroundColor: isActive && highlightPill ? 'rgba(0, 245, 255, 0.16)' : 'transparent',
              border: isActive && highlightPill ? \`2px solid \${activeColor}\` : '2px solid transparent',
              borderRadius: 14,
              padding: isActive && highlightPill ? '4px 18px' : '4px 8px',
              boxShadow: isActive && highlightPill ? '0 0 30px rgba(0, 245, 255, 0.45)' : 'none',
              transformOrigin: 'center center',
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },
};

// ==========================================
// CLI COMMAND HANDLERS
// ==========================================

// Command: install-skill
function handleInstallSkill() {
  const sourceSkillDir = path.resolve(__dirname, '..', '.gemini', 'config', 'skills', 'remotion-dastras');
  const targetSkillDir = path.join(os.homedir(), '.gemini', 'config', 'skills', 'remotion-dastras');

  if (!fs.existsSync(sourceSkillDir)) {
    logError(`Bundled skill not found at: ${sourceSkillDir}`);
    process.exit(1);
  }

  ensureDir(path.dirname(targetSkillDir));
  fs.cpSync(sourceSkillDir, targetSkillDir, { recursive: true, force: true });

  logSuccess(`Installed 'remotion-dastras' skill globally to:`);
  console.log(`   ${targetSkillDir}`);
  logInfo(`Restart Google Antigravity or open a new agent session to activate.`);
}

// Command: sfx
function handleSfx(args) {
  const preset = (args[1] || '').toLowerCase();
  const outPath = args[2] || path.join('public', 'sfx', `${preset || 'whoosh'}.wav`);

  if (!preset || preset === '--help' || preset === '-h') {
    logError('Usage: rea sfx <whoosh|pop|riser|typewriter> [out.wav]');
    console.log('\nAvailable Presets:');
    console.log('  whoosh     - Swept low-pass noise burst for kinetic scene transitions (0.45s)');
    console.log('  pop        - Crisp high-frequency exponential decay for graphic pop-ins (0.14s)');
    console.log('  riser      - Exponential pitch swell with shimmer for dramatic reveals (1.50s)');
    console.log('  typewriter - Tactile mechanical click for character typewriter telemetry (0.06s)\n');
    process.exit(1);
  }

  try {
    const samples = generateSfxSamples(preset);
    writeWavFile(outPath, samples);
    logSuccess(`Synthesized broadcast 44.1 kHz WAV '${preset}' -> ${outPath}`);
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }
}

// Command: voice
async function handleVoice(args) {
  // Usage:
  //   Single-speaker: rea voice "<script>" [out.wav] [--provider=edge|gemini] [--voice=Charon] [--style="..."] [--validate]
  //   Multi-speaker:  rea voice --dialogue=script.json [out.wav] [--provider=gemini]
  const dialogueArg = args.find((a) => a.startsWith('--dialogue='));
  const dialogueFile = dialogueArg ? dialogueArg.split('=').slice(1).join('=') : null;

  const rawInput = args[1] && !args[1].startsWith('--') ? args[1] : null;
  const providerArg = args.find((a) => a.startsWith('--provider='));
  const provider = providerArg
    ? providerArg.split('=')[1].toLowerCase()
    : dialogueFile
      ? 'gemini'
      : 'edge';

  const voiceArg = args.find((a) => a.startsWith('--voice='));
  const styleArg = args.find((a) => a.startsWith('--style='));
  const style = styleArg ? styleArg.split('=').slice(1).join('=') : undefined;
  const validateFlag = args.includes('--validate');

  // Resolve output path from positional args (skipping flags)
  const positionalArgs = args.slice(1).filter((a) => !a.startsWith('--'));
  const rawOutArg = dialogueFile ? positionalArgs[0] : positionalArgs[1];
  const defaultExt = provider === 'gemini' ? 'wav' : 'mp3';
  const outPath = rawOutArg || path.join('public', 'audio', `voiceover.${defaultExt}`);

  if (!rawInput && !dialogueFile) {
    logError('Usage: rea voice "<script>" [out.wav] [--provider=edge|gemini] [--voice=Charon] [--style="..."]');
    console.log('   or: rea voice --dialogue=dialogue.json [out.wav]\n');
    console.log('Recommended Gemini 3.8 Flash TTS Voices:');
    console.log('  Charon / Rasalgethi - Vox / Measured documentary narrator');
    console.log('  Orus / Alnilam      - Cyberpunk / Resonant sci-fi AI system voice');
    console.log('  Zephyr / Puck       - Tech / Energetic product keynote');
    console.log('  Sulafat / Aoede     - Conversational storytelling & explainer\n');
    process.exit(1);
  }

  // Support reading text directly or from a script file
  let text = rawInput;
  if (rawInput && fs.existsSync(path.resolve(process.cwd(), rawInput))) {
    text = fs.readFileSync(path.resolve(process.cwd(), rawInput), 'utf8');
  }

  // Validate script if requested or if editorial rules exist
  if (validateFlag && text) {
    logInfo('Auditing narration against Vox editorial guardrails...');
    const editorialReport = auditScriptText(text);
    if (!editorialReport.valid) {
      logWarn(`Script audit detected ${editorialReport.issues.length} issue(s):`);
      editorialReport.issues.forEach((iss) => console.log(`  - ${colors.yellow}${iss}${colors.reset}`));
    } else {
      logSuccess('Script passed all Vox editorial guardrails!');
    }
  }

  ensureDir(path.dirname(path.resolve(outPath)));

  try {
    if (provider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        logError('Error: GEMINI_API_KEY environment variable is required for Gemini TTS.');
        process.exit(1);
      }

      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { apiVersion: 'v1beta' },
      });

      let contentBlocks = [];
      let speechConfig;

      if (dialogueFile) {
        // Multi-speaker dialogue mode (up to 2 speakers)
        const rawJson = fs.readFileSync(path.resolve(dialogueFile), 'utf8');
        const dialogue = JSON.parse(rawJson);

        if (!Array.isArray(dialogue.speakers) || dialogue.speakers.length === 0 || dialogue.speakers.length > 2) {
          throw new Error('dialogue.json must define 1 or 2 entries in "speakers".');
        }
        if (!Array.isArray(dialogue.turns) || dialogue.turns.length === 0) {
          throw new Error('dialogue.json must contain at least one turn in "turns".');
        }

        speechConfig = { speakers: dialogue.speakers };
        contentBlocks = dialogue.turns.map((turn) => ({
          type: 'text',
          text: turn.text,
          annotations: [
            {
              type: 'speech_metadata',
              speaker: turn.speaker,
              ...(turn.style ? { style: turn.style } : {}),
            },
          ],
        }));
      } else {
        // Single-speaker mode
        const selectedVoice = voiceArg ? voiceArg.split('=')[1] : 'Charon';
        const inputItem = { type: 'text', text };
        if (style) {
          inputItem.annotations = [{ type: 'speech_metadata', style }];
        }
        contentBlocks = [inputItem];
        speechConfig = [{ voice: selectedVoice }];
      }

      logInfo(`Synthesizing via gemini-3.8-flash-tts (${dialogueFile ? 'Multi-Speaker' : (voiceArg ? voiceArg.split('=')[1] : 'Charon')})...`);
      const interaction = await ai.interactions.create({
        model: 'gemini-3.8-flash-tts',
        input: [{ type: 'user_input', content: contentBlocks }],
        response_format: { type: 'audio' },
        generation_config: { speech_config: speechConfig },
      });

      const audioBuffer = Buffer.from(interaction.output_audio.data, 'base64');
      fs.writeFileSync(outPath, audioBuffer);
      logSuccess(
        dialogueFile
          ? `Gemini Multi-Speaker Dialogue (${speechConfig.speakers.map((s) => s.speaker).join(' & ')}) -> ${outPath}`
          : `Gemini TTS generated -> ${outPath}`
      );
    } else {
      // Default zero-key Edge TTS
      logInfo(`Synthesizing voiceover with Edge TTS...`);
      const selectedVoice = voiceArg ? voiceArg.split('=')[1] : 'en-US-AndrewNeural';
      let generated = false;

      try {
        const cmd = `edge-tts --text ${JSON.stringify(text)} --write-media "${path.resolve(outPath)}" --voice ${selectedVoice}`;
        execSync(cmd, { stdio: 'pipe' });
        generated = true;
      } catch (err) {
        if (process.platform === 'win32') {
          try {
            logWarn('Falling back to Windows system speech engine...');
            const tempWav = path.resolve(outPath + '.temp.wav');
            const script = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile('${tempWav.replace(/'/g, "''")}')
$synth.Speak(${JSON.stringify(text)})
$synth.Dispose()
`;
            execSync(`powershell -NoProfile -Command "${script.replace(/\n/g, '; ')}"`, { stdio: 'pipe' });
            if (fs.existsSync(tempWav)) {
              const ffmpeg = getFfmpegPath();
              execSync(`"${ffmpeg}" -y -i "${tempWav}" -c:a libmp3lame -q:a 2 "${path.resolve(outPath)}"`, { stdio: 'pipe' });
              fs.unlinkSync(tempWav);
              generated = true;
            }
          } catch (e2) {}
        }
      }

      if (!generated) {
        logError('Voiceover synthesis failed.');
        process.exit(1);
      }
      logSuccess(`Edge TTS (${selectedVoice}) generated -> ${outPath}`);
    }

    // Probe exact audio duration via ffprobe
    const ffprobePath = getFfprobePath();
    const probeCmd = `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${path.resolve(outPath)}"`;
    const durRaw = execSync(probeCmd, { encoding: 'utf8' }).trim();
    const durationSec = parseFloat(durRaw);
    const frames30 = Math.ceil(durationSec * 30);
    const frames60 = Math.ceil(durationSec * 60);

    console.log(`\n${colors.bold}${colors.cyan}--- Audio Timing Telemetry ---${colors.reset}`);
    console.log(`  Duration:        ${durationSec.toFixed(2)} seconds`);
    console.log(`  Target Frames:   ${colors.green}${frames30} frames @ 30fps${colors.reset} | ${frames60} frames @ 60fps`);
    console.log(`  Remotion Sequence: <Series.Sequence durationInFrames={${frames30 + 15}}> (+15 frames dwell buffer)\n`);
  } catch (err) {
    logError(`Voiceover generation failed (${provider}): ${err.message}`);
    process.exit(1);
  }
}

// Helper: Syllable and Cliché Script Auditor
function auditScriptText(text) {
  const issues = [];
  const bannedPhrases = [
    "in today's fast-paced world",
    "in the modern era",
    "game changer",
    "revolutionary breakthrough",
    "delve into",
    "dive deep",
    "unpack this",
    "at the end of the day",
    "needless to say",
    "a testament to",
    "pushing the boundaries",
    "furthermore, it is important to note",
    "basically",
    "actually",
    "literally",
    "virtually",
    "just imagine",
    "believe it or not",
  ];

  const lower = text.toLowerCase();
  for (const phrase of bannedPhrases) {
    if (lower.includes(phrase)) {
      issues.push(`Banned cliché detected: "${phrase}"`);
    }
  }

  // Sentence length audit
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  sentences.forEach((sentence) => {
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount > 24) {
      issues.push(`Sentence exceeds 24 words (${wordCount} words): "${sentence.slice(0, 50)}..."`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    sentenceCount: sentences.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

// Command: validate-script
function handleValidateScript(args) {
  const target = args[1];
  if (!target) {
    logError('Usage: rea validate-script <script-text | path/to/script.txt>');
    process.exit(1);
  }

  let text = target;
  if (fs.existsSync(path.resolve(process.cwd(), target))) {
    text = fs.readFileSync(path.resolve(process.cwd(), target), 'utf8');
  }

  logInfo('Analyzing text against Vox Editorial Guardrails (rules/vox-editorial.md)...');
  const report = auditScriptText(text);

  console.log(`\n${colors.bold}${colors.cyan}--- Editorial Audit Report ---${colors.reset}`);
  console.log(`  Word Count:      ${report.wordCount}`);
  console.log(`  Sentences:       ${report.sentenceCount}`);
  console.log(`  Estimated Time:  ~${Math.round((report.wordCount / 140) * 60)}s @ 140 WPM`);

  if (report.valid) {
    logSuccess('Zero cliché violations or runaway sentences detected. Script is broadcast ready!');
  } else {
    logWarn(`Found ${report.issues.length} violation(s):`);
    report.issues.forEach((iss) => console.log(`  ${colors.yellow}• ${iss}${colors.reset}`));
    process.exit(1);
  }
}

// Command: cut
function handleCut(args) {
  const inputFile = args[1];
  const startTime = args[2];
  const duration = args[3];
  const outputFile = (args[4] && !args[4].startsWith('--')) ? args[4] : 'output-cut.mp4';
  const shouldNormalize = args.includes('--normalize');

  if (!inputFile || !startTime || !duration) {
    logError('Error: Missing parameters.');
    console.log(`\n${colors.bold}Usage:${colors.reset} rea cut <input.mp4> <start_seconds> <duration_seconds> [output.mp4] [--normalize]\n`);
    process.exit(1);
  }

  const resolvedInput = path.resolve(process.cwd(), inputFile);
  if (!fs.existsSync(resolvedInput)) {
    logError(`Input file not found: ${resolvedInput}`);
    process.exit(1);
  }

  const resolvedOutput = path.resolve(process.cwd(), outputFile);

  try {
    const ffmpegPath = getFfmpegPath();
    logInfo(`Using Remotion bundled FFmpeg: ${ffmpegPath}`);

    let cmd;
    if (shouldNormalize) {
      logInfo('Applying EBU R128 audio normalization (loudnorm=I=-16:TP=-1.5:LRA=11)...');
      cmd = `"${ffmpegPath}" -ss ${startTime} -i "${resolvedInput}" -t ${duration} -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" "${resolvedOutput}" -y`;
    } else {
      cmd = `"${ffmpegPath}" -ss ${startTime} -i "${resolvedInput}" -t ${duration} -c:v copy -c:a copy "${resolvedOutput}" -y`;
    }

    logInfo('Executing stream processing sequence...');
    execSync(cmd, { stdio: 'inherit' });
    logSuccess(`Successfully generated: ${resolvedOutput}`);
  } catch (err) {
    logError(`Video cutting failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: probe
function handleProbe(mediaFile) {
  if (!mediaFile) {
    logError('Usage: rea probe <media-file>');
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), mediaFile);
  if (!fs.existsSync(resolved)) {
    logError(`File not found: ${resolved}`);
    process.exit(1);
  }

  try {
    const ffprobePath = getFfprobePath();
    logInfo(`Probing media metadata via ffprobe: ${ffprobePath}`);
    const cmd = `"${ffprobePath}" -v quiet -print_format json -show_format -show_streams "${resolved}"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    const parsed = JSON.parse(output);

    const videoStream = parsed.streams.find((s) => s.codec_type === 'video');
    const audioStream = parsed.streams.find((s) => s.codec_type === 'audio');

    console.log(`\n${colors.bold}${colors.cyan}--- Media Stream Telemetry ---${colors.reset}`);
    console.log(`  File:        ${path.basename(resolved)}`);
    console.log(`  Duration:    ${parsed.format.duration}s`);
    console.log(`  Size:        ${(parsed.format.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`  Bitrate:     ${Math.round(parsed.format.bit_rate / 1000)} kbps`);

    if (videoStream) {
      console.log(`\n  ${colors.bold}Video Track:${colors.reset}`);
      console.log(`    Codec:     ${videoStream.codec_name} (${videoStream.codec_long_name})`);
      console.log(`    Resolution: ${videoStream.width}x${videoStream.height}`);
      console.log(`    Framerate: ${videoStream.r_frame_rate} (${eval(videoStream.r_frame_rate).toFixed(2)} fps)`);
      console.log(`    Pixel Fmt: ${videoStream.pix_fmt}`);
    }

    if (audioStream) {
      console.log(`\n  ${colors.bold}Audio Track:${colors.reset}`);
      console.log(`    Codec:     ${audioStream.codec_name}`);
      console.log(`    Sample:    ${audioStream.sample_rate} Hz`);
      console.log(`    Channels:  ${audioStream.channels} (${audioStream.channel_layout})`);
    }
    console.log('');
  } catch (err) {
    logError(`Media probe failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: audio
function handleAudio(args) {
  const inputFile = args[1];
  const outputFile = args[2] || `${path.parse(inputFile || '').name || 'audio'}.mp3`;

  if (!inputFile) {
    logError('Usage: rea audio <input-video> [output-audio.mp3]');
    process.exit(1);
  }

  const resolvedInput = path.resolve(process.cwd(), inputFile);
  const resolvedOutput = path.resolve(process.cwd(), outputFile);

  try {
    const ffmpegPath = getFfmpegPath();
    logInfo(`Extracting audio via bundled FFmpeg: ${ffmpegPath}`);
    const cmd = `"${ffmpegPath}" -i "${resolvedInput}" -vn -c:a libmp3lame -q:a 2 "${resolvedOutput}" -y`;
    execSync(cmd, { stdio: 'inherit' });
    logSuccess(`Audio extracted: ${resolvedOutput}`);
  } catch (err) {
    logError(`Audio extraction failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: still
function handleStill(args) {
  const compId = args[1];
  const outFile = (args[2] && !args[2].startsWith('--')) ? args[2] : 'still.jpeg';
  const frameArg = args.find((a) => a.startsWith('--frame=') || a.startsWith('-f=')) || '--frame=0';
  const frameNum = frameArg.split('=')[1] || '0';

  if (!compId) {
    logError('Usage: rea still <composition-id> [output.jpeg] [--frame=N]');
    process.exit(1);
  }

  logInfo(`Rendering still frame ${frameNum} of "${compId}"...`);
  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : (process.platform === 'win32' ? 'npx.cmd' : 'npx');
  const cmdArgs = fs.existsSync(remotionCli)
    ? ['still', 'src/index.ts', compId, outFile, `--frame=${frameNum}`]
    : ['remotion', 'still', 'src/index.ts', compId, outFile, `--frame=${frameNum}`];

  const child = spawn(cmd, cmdArgs, { stdio: 'inherit', shell: true });
  child.on('close', (code) => {
    if (code === 0) {
      logSuccess(`Still image saved to: ${path.resolve(process.cwd(), outFile)}`);
    } else {
      logError(`Still rendering failed with exit code ${code}`);
      process.exit(code);
    }
  });
}

// Command: gif
function handleGif(args) {
  const compId = args[1];
  const outFile = (args[2] && !args[2].startsWith('--')) ? args[2] : 'animation.gif';
  const fpsArg = args.find((a) => a.startsWith('--fps=')) || '--fps=15';

  if (!compId) {
    logError('Usage: rea gif <composition-id> [output.gif] [--fps=15]');
    process.exit(1);
  }

  logInfo(`Rendering animated GIF for "${compId}"...`);
  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : (process.platform === 'win32' ? 'npx.cmd' : 'npx');
  const cmdArgs = fs.existsSync(remotionCli)
    ? ['render', 'src/index.ts', compId, outFile, '--codec=gif', fpsArg]
    : ['remotion', 'render', 'src/index.ts', compId, outFile, '--codec=gif', fpsArg];

  const child = spawn(cmd, cmdArgs, { stdio: 'inherit', shell: true });
  child.on('close', (code) => {
    if (code === 0) {
      logSuccess(`Animated GIF rendered: ${path.resolve(process.cwd(), outFile)}`);
    } else {
      logError(`GIF rendering failed with exit code ${code}`);
      process.exit(code);
    }
  });
}

// Command: init
function handleInit(projectName) {
  if (!projectName) {
    logError('Please specify a project directory: rea init <project-name>');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    logWarn(`Directory "${projectName}" already exists and is not empty.`);
  }

  logInfo(`Scaffolding Antigravity Remotion workspace at ${targetDir}...`);
  ensureDir(targetDir);
  ensureDir(path.join(targetDir, 'src'));
  ensureDir(path.join(targetDir, 'src', 'compositions'));
  ensureDir(path.join(targetDir, 'src', 'plugins'));
  ensureDir(path.join(targetDir, 'public'));
  ensureDir(path.join(targetDir, 'public', 'sfx'));
  ensureDir(path.join(targetDir, 'public', 'audio'));

  const pkgJson = {
    name: projectName,
    version: '1.0.0',
    private: true,
    scripts: {
      preview: 'rea preview',
      render: 'rea render MainVideo out.mp4',
      cut: 'rea cut',
      probe: 'rea probe',
      validate: 'rea validate',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      remotion: '^4.0.0',
      '@remotion/cli': '^4.0.0',
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/react': '^18.2.0',
    },
  };
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  const tsConfig = {
    compilerOptions: {
      target: 'es2022',
      lib: ['dom', 'es2022'],
      jsx: 'react-jsx',
      module: 'commonjs',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
    },
    include: ['src'],
  };
  fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

  const remotionConfig = `import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
`;
  fs.writeFileSync(path.join(targetDir, 'remotion.config.ts'), remotionConfig);

  const indexTs = `import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'index.ts'), indexTs);

  const rootTsx = `import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './compositions/MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Built with Antigravity REA',
          subtitle: 'Autonomous Motion Graphics for AI Agents',
        }}
      />
    </>
  );
};
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'Root.tsx'), rootTsx);

  const mainVideoTsx = `import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MainVideoProps {
  title: string;
  subtitle: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1.0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0f1d',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
          transform: \`scale(\${titleScale})\`,
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 32,
          color: '#94a3b8',
          marginTop: 20,
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'compositions', 'MainVideo.tsx'), mainVideoTsx);

  const sampleReadme = `# Static Assets Directory
Place all images, audio, video files, and fonts here.
Reference them in your compositions with:
\`\`\`tsx
import { staticFile, Img, Audio } from 'remotion';
<Img src={staticFile('logo.png')} />
<Audio src={staticFile('sfx/whoosh.wav')} />
\`\`\`
`;
  fs.writeFileSync(path.join(targetDir, 'public', 'README.md'), sampleReadme);

  const gitignore = `node_modules
out/
dist/
.remotion
`;
  fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore);

  logSuccess(`Scaffolded project "${projectName}" successfully!`);
}

// Command: add
function handleAdd(pluginName) {
  if (!pluginName) {
    logError('Please specify a plugin name: rea add <plugin-name>');
    console.log('Available plugins:');
    Object.keys(PLUGIN_TEMPLATES).forEach((p) => {
      console.log(`  - ${p}: ${PLUGIN_TEMPLATES[p].description}`);
    });
    process.exit(1);
  }

  const plugin = PLUGIN_TEMPLATES[pluginName];
  if (!plugin) {
    logError(`Unknown plugin "${pluginName}". Run "rea list-plugins" for available plugins.`);
    process.exit(1);
  }

  const projectRoot = process.cwd();
  const pluginsDir = path.join(projectRoot, 'src', 'plugins', pluginName);
  ensureDir(pluginsDir);

  Object.entries(plugin.files).forEach(([fileName, content]) => {
    const dest = path.join(pluginsDir, fileName);
    fs.writeFileSync(dest, content);
  });

  logSuccess(`Installed plugin "${pluginName}" to src/plugins/${pluginName}`);
}

// Command: validate
function handleValidate(compositionId, isSilent = false) {
  const projectRoot = process.cwd();
  let srcDir = path.join(projectRoot, 'src');
  let publicDir = path.join(projectRoot, 'public');

  if (!fs.existsSync(srcDir)) {
    const candidateDirs = ['dastras-showcase', 'keplerbridge-vox-doc', 'rea-hero-showcase', 'saas-launch-promo'];
    for (const cand of candidateDirs) {
      const candSrc = path.join(projectRoot, cand, 'src');
      if (fs.existsSync(candSrc)) {
        srcDir = candSrc;
        publicDir = path.join(projectRoot, cand, 'public');
        break;
      }
    }
  }

  const issues = [];

  if (!fs.existsSync(srcDir)) {
    issues.push('Missing "src" directory.');
  }

  const rootTsx = path.join(srcDir, 'Root.tsx');
  if (!fs.existsSync(rootTsx)) {
    issues.push('Missing "src/Root.tsx" configuration.');
  }

  if (fs.existsSync(srcDir)) {
    function scanFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanFiles(fullPath);
        } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const regex = /staticFile\(['"`](.*?)['"`]\)/g;
          let match;
          while ((match = regex.exec(content)) !== null) {
            const assetRel = match[1];
            const assetAbs = path.join(publicDir, assetRel);
            if (!fs.existsSync(assetAbs)) {
              issues.push(`Asset not found: staticFile("${assetRel}") in ${path.relative(projectRoot, fullPath)}`);
            }
          }
        }
      }
    }
    scanFiles(srcDir);
  }

  if (!isSilent) {
    if (issues.length === 0) {
      logSuccess('Project validation passed. Ready for rendering!');
    } else {
      logError(`Validation found ${issues.length} issue(s):`);
      issues.forEach((issue) => console.log(`  - ${colors.red}${issue}${colors.reset}`));
    }
  }

  return issues;
}

// Command: preview
function handlePreview(args = []) {
  logInfo('Launching Remotion Studio in background...');
  logInfo('Preview URL: http://localhost:3000');

  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : (process.platform === 'win32' ? 'npx.cmd' : 'npx');
  const cmdArgs = fs.existsSync(remotionCli) ? ['studio', '--port=3000', ...args] : ['remotion', 'studio', '--port=3000', ...args];

  const child = spawn(cmd, cmdArgs, {
    stdio: 'inherit',
    detached: false,
    shell: true,
  });

  child.on('error', (err) => {
    logError(`Failed to start Remotion Studio: ${err.message}`);
  });
}

// Command: render
function handleRender(compositionId, outFile = 'out.mp4', extraArgs = []) {
  if (!compositionId) {
    logError('Please specify composition ID: rea render <composition-id> [out-name.mp4]');
    process.exit(1);
  }

  logInfo(`Validating project before rendering "${compositionId}"...`);
  const validationIssues = handleValidate(compositionId, true);
  if (validationIssues.length > 0) {
    logError(`Aborting render due to ${validationIssues.length} asset issue(s):`);
    validationIssues.forEach((issue) => console.log(`  - ${colors.red}${issue}${colors.reset}`));
    process.exit(1);
  }

  logInfo(`Starting render: [${compositionId}] -> ${outFile}`);
  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : (process.platform === 'win32' ? 'npx.cmd' : 'npx');
  const cmdArgs = fs.existsSync(remotionCli)
    ? ['render', 'src/index.ts', compositionId, outFile, ...extraArgs]
    : ['remotion', 'render', 'src/index.ts', compositionId, outFile, ...extraArgs];

  const child = spawn(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    if (code === 0) {
      logSuccess(`Render complete! Video written to: ${path.resolve(process.cwd(), outFile)}`);
    } else {
      logError(`Render failed with exit code ${code}`);
      process.exit(code);
    }
  });
}

// Command: render-long
function handleRenderLong(args) {
  // Usage:
  //   rea render-long <Comp1,Comp2,Comp3,...> [final-output.mp4]
  //   rea render-long --auto [final-output.mp4]
  const compListArg = args[1];
  const finalOut = (compListArg === '--auto' ? args[2] : args[2]) || 'final-documentary.mp4';

  if (!compListArg) {
    logError('Usage: rea render-long <Comp1,Comp2,Comp3,...> [final-output.mp4]');
    console.log('   or: rea render-long --auto [final-output.mp4]\n');
    console.log('Renders each Act/Segment in isolation with --concurrency=2 to flush Chromium memory,');
    console.log('then losslessly concatenates segments with bundled FFmpeg.\n');
    process.exit(1);
  }

  let compositions = [];
  if (compListArg === '--auto') {
    const rootPath = path.resolve(process.cwd(), 'src', 'Root.tsx');
    if (!fs.existsSync(rootPath)) {
      logError(`Could not find src/Root.tsx in ${process.cwd()}`);
      process.exit(1);
    }
    const rootContent = fs.readFileSync(rootPath, 'utf8');
    const manifestBlock = rootContent.match(/ACTS_MANIFEST\s*=\s*\[([\s\S]*?)\]/);
    if (!manifestBlock) {
      logError('Could not find ACTS_MANIFEST in src/Root.tsx');
      process.exit(1);
    }
    compositions = [...manifestBlock[1].matchAll(/id:\s*['"`]([^'"`]+)['"`]/g)].map((m) => m[1]);
    logInfo(`Auto-detected ${compositions.length} segments from ACTS_MANIFEST: ${compositions.join(', ')}`);
  } else {
    compositions = compListArg.split(',').map((c) => c.trim()).filter(Boolean);
  }

  if (compositions.length === 0) {
    logError('No valid composition IDs specified for render-long.');
    process.exit(1);
  }

  logInfo(`Pre-flight asset validation for ${compositions.length} segments...`);
  const validationIssues = handleValidate(null, true);
  if (validationIssues.length > 0) {
    logError(`Aborting render-long due to ${validationIssues.length} asset issue(s):`);
    validationIssues.forEach((issue) => console.log(`  - ${colors.red}${issue}${colors.reset}`));
    process.exit(1);
  }

  const ffmpegPath = getFfmpegPath();
  const tempDir = path.resolve(process.cwd(), '.rea-chunks');
  ensureDir(tempDir);

  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const chunkPaths = [];

  try {
    for (let i = 0; i < compositions.length; i++) {
      const compId = compositions[i];
      const chunkFile = path.join(tempDir, `chunk_${String(i).padStart(2, '0')}_${compId}.mp4`);
      console.log(`\n${colors.bold}${colors.cyan}🎬 [${i + 1}/${compositions.length}] Rendering isolated segment: ${compId}...${colors.reset}`);

      const renderCmd = fs.existsSync(remotionCli)
        ? `"${remotionCli}" render src/index.ts "${compId}" "${chunkFile}" --concurrency=2`
        : `npx remotion render src/index.ts "${compId}" "${chunkFile}" --concurrency=2`;

      execSync(renderCmd, { stdio: 'inherit', cwd: process.cwd() });
      chunkPaths.push(chunkFile);
      logSuccess(`Segment rendered: ${chunkFile}`);
    }

    // Build FFmpeg concat demuxer list
    const concatListPath = path.join(tempDir, 'concat_list.txt');
    const concatContent = chunkPaths
      .map((p) => `file '${p.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf8');

    const resolvedOut = path.resolve(process.cwd(), finalOut);
    ensureDir(path.dirname(resolvedOut));

    console.log(`\n${colors.bold}${colors.magenta}🔗 Stitching ${chunkPaths.length} segments losslessly with bundled FFmpeg...${colors.reset}`);
    execSync(
      `"${ffmpegPath}" -f concat -safe 0 -i "${concatListPath}" -c copy "${resolvedOut}" -y`,
      { stdio: 'inherit', cwd: process.cwd() }
    );

    // Clean up temporary chunks
    fs.rmSync(tempDir, { recursive: true, force: true });
    logSuccess(`\nLong-form video complete! Written to: ${resolvedOut}`);
  } catch (err) {
    logError(`Segment render failed: ${err.message}`);
    logWarn(`Completed chunks are preserved in ${tempDir} for resumption without re-rendering.`);
    process.exit(1);
  }
}

// Command: hook
function handleHook(subcommand) {
  if (subcommand === 'pre-render') {
    let rawInput = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      rawInput += chunk;
    });

    process.stdin.on('end', () => {
      try {
        const cleaned = rawInput.replace(/^\uFEFF/, '').trim();
        const payload = cleaned ? JSON.parse(cleaned) : {};
        const cmdLine = payload?.toolCall?.args?.CommandLine || '';

        if (cmdLine.includes('rea render') || cmdLine.includes('remotion render')) {
          const issues = handleValidate(null, true);
          if (issues.length > 0) {
            const response = {
              decision: 'deny',
              reason: `Antigravity Pre-render validation check failed:\n${issues.join('\n')}`,
            };
            process.stdout.write(JSON.stringify(response));
            return;
          }
        }

        const response = { decision: 'approve' };
        process.stdout.write(JSON.stringify(response));
      } catch (e) {
        process.stdout.write(JSON.stringify({ decision: 'approve' }));
      }
    });
  } else {
    process.stdout.write(JSON.stringify({ decision: 'approve' }));
  }
}

// Command: list-plugins
function handleListPlugins() {
  console.log(`\n${colors.bold}Available REA Plugins:${colors.reset}\n`);
  Object.entries(PLUGIN_TEMPLATES).forEach(([name, meta]) => {
    console.log(`  ${colors.green}${name}${colors.reset}`);
    console.log(`    ${colors.dim}${meta.description}${colors.reset}`);
    console.log(`    ${colors.cyan}Install: rea add ${name}${colors.reset}\n`);
  });
}

// Print Help
function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}REA CLI${colors.reset} - Remotion Engine for Antigravity (v${VERSION})
Enterprise-grade autonomous motion graphics, sound synthesis, and multimedia engine.

${colors.bold}USAGE:${colors.reset}
  rea <command> [arguments...]

${colors.bold}AUDIO & SOUND DESIGN COMMANDS (V2):${colors.reset}
  ${colors.green}install-skill${colors.reset}                                    Install skill globally into ~/.gemini/config/skills/
  ${colors.green}sfx <whoosh|pop|riser|typewriter> [out.wav]${colors.reset}      Deterministic 44.1 kHz WAV procedural sound synthesis
  ${colors.green}voice "<text>" [out.wav] [--provider=gemini|edge]${colors.reset} Dual-provider (Gemini 3.8 Flash TTS / Edge) speech engine
  ${colors.green}voice --dialogue=script.json [out.wav]${colors.reset}             Gemini 2-speaker conversational dialogue synthesis
  ${colors.green}validate-script <text | file.txt>${colors.reset}                 Audit script against Vox editorial standards & banned clichés

${colors.bold}MULTIMEDIA & EDITING COMMANDS (FFmpeg-Powered):${colors.reset}
  ${colors.green}cut <in.mp4> <start> <dur> [out.mp4] [--normalize]${colors.reset}  Zero-loss video trimming with EBU R128 audio normalization
  ${colors.green}probe <media-file>${colors.reset}                                 Deep inspection of video/audio streams, codecs, fps & duration
  ${colors.green}audio <in.mp4> [out.mp3]${colors.reset}                           Extract pure MP3 audio from any video
  ${colors.green}still <comp-id> [out.jpeg] [--frame=N]${colors.reset}             Export high-res still frame at exact timestamp
  ${colors.green}gif <comp-id> [out.gif] [--fps=15]${colors.reset}                 Render animated GIF for social/docs

${colors.bold}REMOTION ENGINE & AGENT COMMANDS:${colors.reset}
  ${colors.green}init <project-name>${colors.reset}                                Scaffolds a new Antigravity Remotion workspace
  ${colors.green}add <plugin-name>${colors.reset}                                  Installs a REA visual plugin (transitions, particles, etc.)
  ${colors.green}preview [options]${colors.reset}                                  Launches Remotion Studio at http://localhost:3000
  ${colors.green}render <comp-id> [out.mp4]${colors.reset}                         Compiles video with pre-flight asset audits
  ${colors.green}render-long <Comp1,Comp2..|--auto> [out.mp4]${colors.reset} Chunked multi-act rendering + zero-loss concat (memory-safe)
  ${colors.green}validate [comp-id]${colors.reset}                                Audits project assets and staticFile references
  ${colors.green}list-plugins${colors.reset}                                      Displays all available REA visual plugins
  ${colors.green}hook pre-render${colors.reset}                                   Antigravity 2.0 lifecycle pre-render gatekeeper

${colors.bold}OPTIONS:${colors.reset}
  --help, -h                       Show this help menu
  --version, -v                    Display version
`);
}

// Entrypoint Dispatcher
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log(`v${VERSION}`);
    return;
  }

  switch (command) {
    case 'install-skill':
      handleInstallSkill();
      break;
    case 'sfx':
      handleSfx(args);
      break;
    case 'voice':
      await handleVoice(args);
      break;
    case 'validate-script':
      handleValidateScript(args);
      break;
    case 'cut':
      handleCut(args);
      break;
    case 'probe':
      handleProbe(args[1]);
      break;
    case 'audio':
      handleAudio(args);
      break;
    case 'still':
      handleStill(args);
      break;
    case 'gif':
      handleGif(args);
      break;
    case 'init':
      handleInit(args[1]);
      break;
    case 'add':
      handleAdd(args[1]);
      break;
    case 'preview':
      handlePreview(args.slice(1));
      break;
    case 'render':
      handleRender(args[1], args[2], args.slice(3));
      break;
    case 'render-long':
      handleRenderLong(args);
      break;
    case 'validate':
      handleValidate(args[1]);
      break;
    case 'list-plugins':
      handleListPlugins();
      break;
    case 'hook':
      handleHook(args[1]);
      break;
    default:
      logError(`Unknown command: "${command}"`);
      printHelp();
      process.exit(1);
  }
}

main();
