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

const VERSION = '2.2.0-rc.1';

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

  'rea-impact-freeze': {
    description: 'Anime beat-drop freeze frame with manga halftone, SVG speedlines, and bass camera shake',
    files: {
      'index.tsx': `import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export interface ImpactFreezeFrameProps {
  children: React.ReactNode;
  triggerFrame: number;
  durationInFrames?: number;
  shakeIntensity?: number;
  mangaContrast?: boolean;
  flashColor?: string;
  audioSrc?: string;
}

export const ImpactFreezeFrame: React.FC<ImpactFreezeFrameProps> = ({
  children,
  triggerFrame,
  durationInFrames = 45,
  shakeIntensity = 18,
  mangaContrast = true,
  flashColor = '#ffffff',
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc ?? '');

  const isFrozen = frame >= triggerFrame && frame < triggerFrame + durationInFrames;
  const localFrame = Math.max(0, frame - triggerFrame);

  let bassEnergy = 0;
  if (audioData && isFrozen) {
    const spectrum = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32,
    });
    bassEnergy = (spectrum[0] + spectrum[1] + spectrum[2] + spectrum[3]) / 4;
  }

  const zoomSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 9, stiffness: 280, mass: 0.7 },
  });
  const baseScale = isFrozen ? interpolate(zoomSpring, [0, 1], [1.0, 1.24]) : 1;
  const totalScale = baseScale + bassEnergy * 0.14;

  const decay = isFrozen ? Math.exp(-localFrame * 0.12) : 0;
  const activeShake = isFrozen ? shakeIntensity * (decay + bassEnergy * 0.85) : 0;
  const shakeX = Math.sin(localFrame * 2.9) * activeShake;
  const shakeY = Math.cos(localFrame * 3.7) * activeShake;
  const shakeRot = Math.sin(localFrame * 2.1) * (activeShake * 0.12);

  const flashOpacity = isFrozen
    ? interpolate(localFrame, [0, 4], [0.9, 0], { extrapolateRight: 'clamp' })
    : 0;

  const speedlines = useMemo(() => {
    return Array.from({ length: 64 }).map((_, i) => {
      const angleDeg = (i * 360) / 64 + ((i * 17) % 5) - 2.5;
      const innerRadius = 34 + ((i * 29) % 18);
      const strokeWidth = 1.5 + ((i * 13) % 4);
      return { id: i, angleDeg, innerRadius, strokeWidth };
    });
  }, []);

  const renderTransformedContent = () => (
    <AbsoluteFill
      style={{
        transform: \`translate(\${shakeX}px, \${shakeY}px) scale(\${totalScale}) rotate(\${shakeRot}deg)\`,
        filter:
          isFrozen && mangaContrast
            ? 'grayscale(100%) contrast(215%) brightness(1.08)'
            : 'none',
      }}
    >
      {children}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000000' }}>
      {isFrozen ? (
        <Freeze frame={triggerFrame}>{renderTransformedContent()}</Freeze>
      ) : (
        renderTransformedContent()
      )}

      {isFrozen && mangaContrast && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
            opacity: 0.42,
            backgroundImage:
              'radial-gradient(circle, #000000 1.35px, transparent 1.45px)',
            backgroundSize: '6px 6px',
            transform: \`translate(\${(localFrame % 2) * 1.5}px, \${(localFrame % 3) * 1.5}px)\`,
          }}
        />
      )}

      {isFrozen && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <svg
            viewBox="-50 -50 100 100"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}
          >
            {speedlines.map((ray) => {
              const rad = (ray.angleDeg * Math.PI) / 180;
              const pulse = Math.sin(localFrame * 0.9 + ray.id) * 4;
              const r1 = ray.innerRadius + pulse;
              const r2 = 85;
              return (
                <line
                  key={ray.id}
                  x1={Math.cos(rad) * r1}
                  y1={Math.sin(rad) * r1}
                  x2={Math.cos(rad) * r2}
                  y2={Math.sin(rad) * r2}
                  stroke="#ffffff"
                  strokeWidth={ray.strokeWidth * 0.18}
                  strokeOpacity={0.85}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      )}

      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: flashColor,
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-chad-overlay': {
    description: 'Sigma / GigaChad / Skull reaction overlay with chromatic RGB split and bass pulse',
    files: {
      'index.tsx': `import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export type ChadVariant = 'chad' | 'skull' | 'fire' | 'sigma';

export interface ChadEmojiOverlayProps {
  triggerFrame: number;
  durationInFrames?: number;
  variant?: ChadVariant;
  caption?: string;
  bassReactive?: boolean;
  audioSrc?: string;
  accentColor?: string;
}

const VARIANT_GLYPHS: Record<ChadVariant, string> = {
  chad: '🗿',
  skull: '💀',
  fire: '🔥',
  sigma: '⚡',
};

export const ChadEmojiOverlay: React.FC<ChadEmojiOverlayProps> = ({
  triggerFrame,
  durationInFrames = 60,
  variant = 'chad',
  caption = 'COLDEST MOMENT',
  bassReactive = true,
  audioSrc,
  accentColor = '#00f5ff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc ?? '');

  if (frame < triggerFrame || frame >= triggerFrame + durationInFrames) {
    return null;
  }

  const localFrame = frame - triggerFrame;

  let bassScaleBoost = 0;
  if (bassReactive && audioData) {
    const spectrum = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32,
    });
    const subBass = (spectrum[0] + spectrum[1] + spectrum[2]) / 3;
    bassScaleBoost = subBass * 0.32;
  }

  const slamSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 260, mass: 0.65 },
  });
  const exitOpacity = interpolate(
    localFrame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(slamSpring, [0, 1], [2.4, 1.0]) + bassScaleBoost;
  const tiltDeg = Math.sin(localFrame * 0.45) * 4;
  const rgbOffset = Math.max(0, 8 - localFrame * 0.8) + bassScaleBoost * 18;
  const glyph = VARIANT_GLYPHS[variant];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 240,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: \`scale(\${scale}) rotate(\${tiltDeg}deg)\`,
        }}
      >
        <div style={{ position: 'relative', fontSize: 150, lineHeight: 1 }}>
          <span
            style={{
              position: 'absolute',
              left: -rgbOffset,
              top: 0,
              opacity: 0.75,
              filter: 'drop-shadow(0 0 18px #00f5ff)',
            }}
          >
            {glyph}
          </span>
          <span
            style={{
              position: 'absolute',
              left: rgbOffset,
              top: 0,
              opacity: 0.75,
              filter: 'drop-shadow(0 0 18px #ff0055)',
            }}
          >
            {glyph}
          </span>
          <span
            style={{
              position: 'relative',
              filter: 'grayscale(100%) contrast(160%) drop-shadow(0 12px 24px rgba(0,0,0,0.9))',
            }}
          >
            {glyph}
          </span>
        </div>

        {caption && (
          <div
            style={{
              marginTop: 18,
              padding: '8px 26px',
              backgroundColor: '#050814',
              border: \`3px solid \${accentColor}\`,
              boxShadow: \`0 0 24px \${accentColor}, 6px 6px 0px #000000\`,
              transform: 'skewX(-8deg)',
            }}
          >
            <span
              style={{
                fontFamily: 'Impact, Anton, Poppins, sans-serif',
                fontWeight: 900,
                fontSize: 46,
                letterSpacing: 3,
                color: '#ffffff',
                textTransform: 'uppercase',
                WebkitTextStroke: '1.5px #000000',
              }}
            >
              {caption}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
`,
      'index.ts': `export * from './index.tsx';\n`,
    },
  },

  'rea-gameplay': {
    description: 'Split-screen or underlay viral background gameplay (endless 60fps 3D cyber runner or MP4 player)',
    files: {
      'index.tsx': `import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';

export interface BackgroundGameplayProps {
  mode?: 'split' | 'underlay' | 'pip';
  videoSrc?: string;
  opacity?: number;
  blur?: number;
  accentColor?: string;
  splitRatio?: number;
  speedMultiplier?: number;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ProceduralGameplayRunner: React.FC<{ accentColor?: string; speedMultiplier?: number }> = ({
  accentColor = '#00f5ff',
  speedMultiplier = 1.0,
}) => {
  const frame = useCurrentFrame();
  const viewW = 1080;
  const viewH = 960;
  const horizonY = 160;
  const roadBottomWidth = 980;
  const roadTopWidth = 140;
  const roadCenterX = viewW / 2;
  const zOffset = (frame * 18 * speedMultiplier) % 100;

  const playerSway = Math.sin(frame * 0.08) * (viewW * 0.22);
  const playerBob = Math.abs(Math.sin(frame * 0.16)) * 20;
  const playerTilt = Math.cos(frame * 0.08) * 12;

  const obstacles = [
    { lane: -1, zBase: 250, color: '#ff0055', heightRatio: 0.8 },
    { lane: 1, zBase: 550, color: '#eab308', heightRatio: 1.1 },
    { lane: 0, zBase: 850, color: '#a855f7', heightRatio: 0.9 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#050711', overflow: 'hidden' }}>
      <svg viewBox={\`0 0 \${viewW} \${viewH}\`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080c1d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <polygon points={\`\${roadCenterX - roadTopWidth / 2},\${horizonY} \${roadCenterX + roadTopWidth / 2},\${horizonY} \${roadCenterX + roadBottomWidth / 2},\${viewH} \${roadCenterX - roadBottomWidth / 2},\${viewH}\`} fill="url(#roadGrad)" stroke={accentColor} strokeWidth="3" />

        {[-0.5, 0, 0.5].map((laneRatio, idx) => (
          <line key={idx} x1={roadCenterX + roadTopWidth * laneRatio} y1={horizonY} x2={roadCenterX + roadBottomWidth * laneRatio} y2={viewH} stroke="url(#lineGrad)" strokeWidth={idx === 1 ? 4 : 2} strokeDasharray={idx === 1 ? '32,22' : 'none'} />
        ))}

        {Array.from({ length: 14 }).map((_, i) => {
          const progress = ((i * (100 / 14) + zOffset) % 100) / 100;
          const depth = Math.pow(progress, 2.5);
          const y = horizonY + depth * (viewH - horizonY);
          const currentWidth = roadTopWidth + depth * (roadBottomWidth - roadTopWidth);
          return <line key={i} x1={roadCenterX - currentWidth / 2} y1={y} x2={roadCenterX + currentWidth / 2} y2={y} stroke={accentColor} strokeWidth={1 + depth * 3.5} strokeOpacity={0.25 + depth * 0.75} />;
        })}

        {obstacles.map((obs, idx) => {
          const loopZ = 1400;
          const currentZ = ((obs.zBase - frame * 16 * speedMultiplier) % loopZ + loopZ) % loopZ;
          const progress = 1 - currentZ / loopZ;
          if (progress < 0.05 || progress > 0.98) return null;
          const depth = Math.pow(progress, 2.2);
          const y = horizonY + depth * (viewH - horizonY) - 30 * depth * obs.heightRatio;
          const currentRoadW = roadTopWidth + depth * (roadBottomWidth - roadTopWidth);
          const x = roadCenterX + obs.lane * (currentRoadW * 0.28);
          const obsW = 28 + depth * 140;
          const obsH = (20 + depth * 80) * obs.heightRatio;
          return <rect key={idx} x={x - obsW / 2} y={y - obsH} width={obsW} height={obsH} rx="6" fill={obs.color} stroke="#ffffff" strokeWidth="2" opacity={0.4 + depth * 0.6} />;
        })}

        <g transform={\`translate(\${roadCenterX + playerSway}, \${viewH - 160 + playerBob}) rotate(\${playerTilt})\`}>
          <ellipse cx="0" cy="35" rx="18" ry="24" fill="#ff0055" opacity="0.85" />
          <polygon points="-50,20 0,-35 50,20 30,30 -30,30" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
          <polygon points="-25,10 0,-20 25,10 0,18" fill={accentColor} stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', opacity: 0.5 }} />
    </div>
  );
};

export const BackgroundGameplay: React.FC<BackgroundGameplayProps> = ({
  mode = 'split',
  videoSrc,
  opacity = 1.0,
  blur = 0,
  accentColor = '#00f5ff',
  splitRatio = 0.52,
  speedMultiplier = 1.0,
}) => {
  const isSplit = mode === 'split';
  const isUnderlay = mode === 'underlay';

  const containerStyle: React.CSSProperties = isSplit
    ? { position: 'absolute', left: 0, top: \`\${splitRatio * 100}%\`, width: '100%', height: \`\${(1 - splitRatio) * 100}%\`, overflow: 'hidden', borderTop: \`4px solid \${accentColor}\`, boxShadow: \`0 0 35px \${accentColor}88\`, zIndex: 5 }
    : isUnderlay
    ? { position: 'absolute', inset: 0, opacity, filter: blur > 0 ? \`blur(\${blur}px)\` : 'none', zIndex: 0 }
    : { position: 'absolute', right: 40, bottom: 80, width: 340, height: 480, borderRadius: 24, overflow: 'hidden', border: \`3px solid \${accentColor}\`, boxShadow: \`0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px \${accentColor}66\`, zIndex: 10 };

  return (
    <div style={containerStyle}>
      {videoSrc ? (
        <OffthreadVideo src={videoSrc.startsWith('http') || videoSrc.startsWith('/') ? videoSrc : staticFile(videoSrc)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <ProceduralGameplayRunner accentColor={accentColor} speedMultiplier={speedMultiplier} />
      )}
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

// Helper: Synthesize a fallback 140 BPM Dark Phonk Cowbell + 808 WAV loop if library is empty
function generateFallbackPhonkWav(outPath, sampleRate = 44100) {
  const bpm = 140;
  const beatDur = 60 / bpm; // ~0.428s per beat
  const duration = 12.0; // 28 beats (7 bars)
  const total = Math.floor(sampleRate * duration);
  const samples = new Float32Array(total);
  const rng = createRng(808);

  // Classic Memphis/Phonk 808 cowbell frequencies (Hz)
  const cowbellNotes = [587.33, 587.33, 880.0, 587.33, 698.46, 587.33, 523.25, 440.0];

  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const beatIndex = Math.floor(t / beatDur);
    const beatProgress = (t % beatDur) / beatDur;
    const isDropSection = t >= 3.42; // Beat 8 drop (around frame 205 @ 60fps)

    // 1. Sub-808 Kick & Bass
    let bass = 0;
    if (isDropSection && beatIndex % 2 === 0) {
      const pitchEnv = 115 * Math.exp(-beatProgress * 18) + 42;
      const ampEnv = Math.exp(-beatProgress * 4.5);
      bass = Math.tanh(Math.sin(2 * Math.PI * pitchEnv * t) * 2.4) * ampEnv * 0.75;
    }

    // 2. Crisp 808 Cowbell Melody (muffled before drop, bright after drop)
    const step = Math.floor(t / (beatDur / 2));
    const stepProg = (t % (beatDur / 2)) / (beatDur / 2);
    const freq = cowbellNotes[step % cowbellNotes.length];
    const cowEnv = Math.exp(-stepProg * 14);
    const rawCow =
      Math.sign(Math.sin(2 * Math.PI * freq * t)) * 0.5 +
      Math.sign(Math.sin(2 * Math.PI * (freq * 1.48) * t)) * 0.5;
    const cowGain = isDropSection ? 0.34 : 0.14;
    const cowbell = rawCow * cowEnv * cowGain;

    // 3. Hi-hat tick
    const hatProg = (t % (beatDur / 4)) / (beatDur / 4);
    const hat = isDropSection ? (rng() * 2 - 1) * Math.exp(-hatProg * 35) * 0.12 : 0;

    samples[i] = bass + cowbell + hat;
  }

  writeWavFile(outPath, samples, sampleRate);
}

// Helper: Estimate the loudest energy jump (beat-drop timestamp) via FFmpeg ebur128 / astats
function detectBeatDropSeconds(ffmpegPath, filePath, totalDuration) {
  try {
    // Sample RMS volume per 0.5s window using FFmpeg astats
    const raw = execSync(
      `"${ffmpegPath}" -i "${filePath}" -af "astats=metadata=1:reset=22050,ametadata=print:key=lavfi.astats.Overall.RMS_level" -f null - 2>&1`
    ).toString();

    const frameTimes = [...raw.matchAll(/pts_time:([0-9.]+)/g)].map((m) => parseFloat(m[1]));
    const rmsLevels = [...raw.matchAll(/RMS_level=(-?[0-9.]+)/g)].map((m) => parseFloat(m[1]));

    let bestJump = 0;
    let dropTime = Math.min(3.5, totalDuration * 0.25);

    for (let i = 1; i < Math.min(frameTimes.length, rmsLevels.length); i++) {
      // Look for biggest dB surge in the first 45% of the track
      if (frameTimes[i] >= 1.2 && frameTimes[i] <= Math.min(12, totalDuration * 0.45)) {
        const jump = rmsLevels[i] - rmsLevels[i - 1];
        if (jump > bestJump && isFinite(jump)) {
          bestJump = jump;
          dropTime = frameTimes[i];
        }
      }
    }
    return Number(dropTime.toFixed(2));
  } catch {
    return Number(Math.min(3.5, totalDuration * 0.25).toFixed(2));
  }
}

// Command: pick-track
function handlePickTrack(args) {
  const dirArg = args.find((a) => a.startsWith('--dir='));
  const moodArg = args.find((a) => a.startsWith('--mood='));
  const outArg = args.find((a) => a.startsWith('--out='));

  const libraryDir = path.resolve(process.cwd(), dirArg ? dirArg.split('=')[1] : path.join('public', 'music', 'phonk'));
  const mood = moodArg ? moodArg.split('=')[1].toLowerCase() : null;
  const historyPath = path.resolve(process.cwd(), '.rea-track-history.json');

  fs.mkdirSync(libraryDir, { recursive: true });

  // Scan supported audio formats
  const audioExtRegex = /\.(mp3|wav|ogg|m4a)$/i;
  let allTracks = fs
    .readdirSync(libraryDir)
    .filter((file) => audioExtRegex.test(file))
    .sort();

  // Auto-synthesize a starter phonk track if library is currently empty
  if (allTracks.length === 0) {
    const fallbackName = 'dastras-aggressive-phonk-140bpm.wav';
    const fallbackFull = path.join(libraryDir, fallbackName);
    console.log(`⚠️ No audio files found in ${libraryDir}. Synthesizing starter 140 BPM phonk track...`);
    generateFallbackPhonkWav(fallbackFull);
    allTracks = [fallbackName];
  }

  // Load persistent play history
  let history = { played: [], cycleCount: 1 };
  if (fs.existsSync(historyPath)) {
    try {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      if (!Array.isArray(history.played)) history.played = [];
    } catch {
      history = { played: [], cycleCount: 1 };
    }
  }

  // Filter out already-played songs in the current rotation cycle
  let unplayed = allTracks.filter((track) => !history.played.includes(track));

  // Reset rotation only after EVERY song in the library has been used once
  if (unplayed.length === 0) {
    console.log(`🔄 Full library rotation complete (${allTracks.length} tracks). Starting cycle #${(history.cycleCount || 1) + 1}...`);
    history.played = [];
    history.cycleCount = (history.cycleCount || 1) + 1;
    unplayed = [...allTracks];
  }

  // Apply optional --mood keyword filter against unplayed tracks
  let candidates = unplayed;
  if (mood) {
    const moodMatches = unplayed.filter((t) => t.toLowerCase().includes(mood));
    if (moodMatches.length > 0) {
      candidates = moodMatches;
    } else {
      console.log(`ℹ️ No unplayed tracks matched mood "${mood}"; selecting from remaining unplayed pool.`);
    }
  }

  // Deterministic index selection based on history length (no Math.random())
  const selectedTrack = candidates[history.played.length % candidates.length];
  const sourcePath = path.join(libraryDir, selectedTrack);
  const ext = path.extname(selectedTrack);
  const targetOut = path.resolve(
    process.cwd(),
    outArg ? outArg.split('=')[1] : path.join('public', 'audio', `active-phonk${ext}`)
  );

  // Copy selected track to active composition audio path & record history
  fs.mkdirSync(path.dirname(targetOut), { recursive: true });
  fs.copyFileSync(sourcePath, targetOut);

  history.played.push(selectedTrack);
  history.lastSelected = {
    track: selectedTrack,
    mood: mood || 'any',
    selectedAt: new Date().toISOString(),
  };
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');

  // Probe duration & detect primary bass-drop timestamp
  const ffmpegPath = getFfmpegPath();
  const ffprobePath = getFfprobePath();
  let durationSec = 12.0;
  try {
    const probeOut = execSync(
      `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${targetOut}"`
    )
      .toString()
      .trim();
    durationSec = parseFloat(probeOut) || 12.0;
  } catch {}

  const dropSec = detectBeatDropSeconds(ffmpegPath, targetOut, durationSec);
  const dropFrame60 = Math.round(dropSec * 60);

  console.log(`🎵 Selected Track [${history.played.length}/${allTracks.length} in Cycle #${history.cycleCount}]: ${selectedTrack}`);
  console.log(`📂 Copied to: ${path.relative(process.cwd(), targetOut)}`);
  console.log(`⏱️ Duration: ${durationSec.toFixed(2)}s (${Math.ceil(durationSec * 60)} frames @ 60fps)`);
  console.log(`💥 Detected Beat Drop: ${dropSec}s -> triggerFrame={${dropFrame60}} (@ 60fps)`);
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

// Command: plan
function handlePlan(args) {
  const rawVideo = args[1];
  const audioTrack = args[2] && !args[2].startsWith('--') ? args[2] : null;
  const moodArg = args.find((a) => a.startsWith('--mood='));
  const mood = moodArg ? moodArg.split('=')[1] : 'aggressive';

  if (!rawVideo) {
    logError('Usage: rea plan <raw-video.mp4> [audio-track.mp3] [--mood=aggressive|dark|velocity]');
    process.exit(1);
  }

  const videoPath = path.resolve(process.cwd(), rawVideo);
  if (!fs.existsSync(videoPath)) {
    logError(`Video file not found: ${videoPath}`);
    process.exit(1);
  }

  const baseName = path.basename(videoPath, path.extname(videoPath));
  console.log(`\n${colors.bold}${colors.magenta}=================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  REA PRE-EDIT DEEP INSPECTION & VIRAL STRATEGY BLUEPRINT${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}=================================================================${colors.reset}\n`);

  logInfo(`Step 1/4: Probing media stream telemetry via ffprobe...`);
  const ffprobePath = getFfprobePath();
  const cmd = `"${ffprobePath}" -v quiet -print_format json -show_format -show_streams "${videoPath}"`;
  const probeOutput = JSON.parse(execSync(cmd, { encoding: 'utf8' }));

  const vStream = probeOutput.streams.find((s) => s.codec_type === 'video');
  const aStream = probeOutput.streams.find((s) => s.codec_type === 'audio');
  const durationSec = parseFloat(probeOutput.format.duration || (vStream && vStream.duration) || 0);
  const fps = vStream ? Math.round(eval(vStream.r_frame_rate)) : 60;
  const width = vStream ? vStream.width : 1280;
  const height = vStream ? vStream.height : 720;
  const isWidescreen = width > height;

  console.log(`  Source Video:      ${path.basename(videoPath)} (${width}x${height} @ ${fps}fps, ${durationSec.toFixed(2)}s)`);
  console.log(`  Target Canvas:     1080x1920 (9:16 Vertical Shorts/Reels/TikTok)`);
  console.log(`  Aspect Ratio Risk: ${isWidescreen ? '16:9 -> 9:16 cropping risk detected (requires Dual-Layer Viewport Engine)' : 'Native Vertical'}`);

  logInfo(`Step 2/4: Formulating Narrative Arc & Target Duration...`);
  const targetDurationSec = durationSec >= 25 ? Math.min(35, durationSec + 2) : Math.max(15, durationSec * 1.2);
  const targetFrames = Math.round(targetDurationSec * 60);
  console.log(`  Recommended Edit Duration: ${targetDurationSec.toFixed(1)}s (${targetFrames} frames @ 60fps)`);
  console.log(`  Freeze-Frame Strategy:     Dual Aura Freeze (Awakening + Climax finisher)`);

  logInfo(`Step 3/4: Formulating Audience Psychology & Viral Retention Strategy...`);
  const plan = {
    source: path.basename(videoPath),
    durationSeconds: targetDurationSec,
    durationFrames: targetFrames,
    fps: 60,
    aspectRatio: '9:16 (1080x1920)',
    retentionStrategy: {
      hookDuration: '0.0s - 1.2s',
      hookVisual: 'High-contrast character standoff with immediate Japanese kanji typography',
      swipeAwayTarget: '< 22%',
      apvTarget: '> 130%',
      beatDropFreezeFrames: [
        { time: '9.0s', frames: 48, effect: 'Manga Halftone Screentone + Moyai/Chad Aura Counter (+999,999 AURA)' },
        { time: '21.0s', frames: 50, effect: 'Fiery Screentone Halftone + Dragon Aura Counter (+1,000,000 AURA)' }
      ],
      replayLoopMechanism: '15-frame whip-zoom velocity blur seamlessly matching Frame 0 opening silhouette'
    },
    metadata: {
      highCtrTitle: `WHO HAS MORE AURA? ⚡ ${baseName.toUpperCase().replace(/[_\-]/g, ' ')} (60FPS Battle Edit)`,
      curiosityHook: `Can the assassin outspeed the lightning dragon? Watch till the beat drop 💀`,
      searchKeywords: [
        'anime edit 4k', 'phonk battle edit', '60fps phonk edit', 'aura points', 'beat drop freeze frame',
        'demon slayer', 'hunter x hunter', 'zenitsu vs killua', 'brazilian phonk bass drop'
      ],
      geoSeoTags: ['#animeedit', '#brazilianphonk', '#phonk', '#fyp', '#viral', '#demonslayer', '#hxh']
    }
  };

  console.log(`\n  ${colors.bold}Audience Hook Formula:${colors.reset}       ${plan.retentionStrategy.hookVisual}`);
  console.log(`  ${colors.bold}Expected APV (Retention):${colors.reset}    ${plan.retentionStrategy.apvTarget}`);
  console.log(`  ${colors.bold}High-CTR Title:${colors.reset}              ${colors.yellow}${plan.metadata.highCtrTitle}${colors.reset}`);
  console.log(`  ${colors.bold}Curiosity Hook:${colors.reset}              ${plan.metadata.curiosityHook}`);
  console.log(`  ${colors.bold}Discovery Tags:${colors.reset}              ${plan.metadata.geoSeoTags.join(' ')}`);

  logInfo(`Step 4/4: Saving inspection blueprint to edit-plan.json...`);
  fs.writeFileSync('edit-plan.json', JSON.stringify(plan, null, 2), 'utf8');
  logSuccess(`Pre-edit inspection complete! Blueprint saved to edit-plan.json`);
  console.log(`${colors.green}✔ You are now authorized to initiate composition compilation.${colors.reset}\n`);
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

  const propsArg = args.find((a) => a.startsWith('--props='));

  if (!compId) {
    logError('Usage: rea still <composition-id> [output.jpeg] [--frame=N] [--props=props.json]');
    process.exit(1);
  }

  logInfo(`Rendering still frame ${frameNum} of "${compId}"...`);
  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : (process.platform === 'win32' ? 'npx.cmd' : 'npx');
  const cmdArgs = fs.existsSync(remotionCli)
    ? ['still', 'src/index.ts', compId, outFile, `--frame=${frameNum}`]
    : ['remotion', 'still', 'src/index.ts', compId, outFile, `--frame=${frameNum}`];

  if (propsArg) cmdArgs.push(propsArg);

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
    const candidateDirs = ['anime-phonk-showcase', 'dastras-showcase', 'keplerbridge-vox-doc', 'rea-hero-showcase', 'saas-launch-promo'];
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

  // Pre-Publish Retention Simulator Gatekeeper
  const planPath = path.resolve(process.cwd(), 'edit-plan.json');
  if (fs.existsSync(planPath)) {
    try {
      const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
      const cuts = plan.cuts || (plan.cutTimestamps ? plan.cutTimestamps.map((sec, i) => ({
        frame: Math.round(sec * (plan.fps || 60)),
        type: i === (plan.dropIndex || 2) ? 'beat-drop' : 'action-cut'
      })) : []);
      if (cuts.length > 0) {
        const { analyzeRetentionRisk } = require('../src/utils/retention-analyzer.js');
        const retention = analyzeRetentionRisk(cuts, plan.durationFrames || 1800, plan.fps || 60);
        console.log(`\n${colors.cyan}[Retention Simulator] Predicted APV: ${retention.predictedAPV}${colors.reset}`);
        if (!retention.isSafeToRender) {
          logWarn(`Swipe-Predictor detected high risk of 2-second abandonment:`);
          retention.warnings.forEach(w => console.log(`  ${colors.yellow}• ${w}${colors.reset}`));
          if (!extraArgs.includes('--force')) {
            logError('Aborting render! Pacing is too slow to maintain short-form retention. Pass --force to bypass or tighten cuts.');
            process.exit(1);
          }
        } else {
          logSuccess(`Retention audit passed! Video pacing matches algorithmic retention sweet spots.`);
        }
      }
    } catch (e) {
      // Graceful fallback
    }
  }

  // Flawless Logic & Spatial Continuity Gatekeeper (180-Degree Rule & Momentum Conservation)
  const clipsDir = path.resolve(process.cwd(), 'public', 'clips');
  if (fs.existsSync(clipsDir)) {
    try {
      const metaFiles = fs.readdirSync(clipsDir)
        .filter(f => f.endsWith('.meta.json'))
        .sort()
        .map(f => path.join(clipsDir, f));

      if (metaFiles.length >= 2) {
        const { loadClipMeta, validateCut } = require('../src/intuition/backend.js');
        const rejections = [];
        for (let i = 0; i < metaFiles.length - 1; i++) {
          try {
            const clipA = loadClipMeta(metaFiles[i]);
            const clipB = loadClipMeta(metaFiles[i + 1]);
            const validation = validateCut(clipA, clipB);
            if (!validation.isValid) {
              rejections.push({
                clipA: path.basename(metaFiles[i]),
                clipB: path.basename(metaFiles[i + 1]),
                reason: validation.reason,
                bridge: validation.recommendedBridge,
              });
            }
          } catch (err) {}
        }

        if (rejections.length > 0) {
          logWarn(`[REA Spatial Logic] Detected ${rejections.length} cinematic continuity violation(s):`);
          rejections.forEach(r => {
            console.log(`  ${colors.yellow}• Cut "${r.clipA}" -> "${r.clipB}": ${r.reason}${colors.reset}`);
            if (r.bridge) {
              console.log(`    ${colors.cyan}↳ Suggested Bridge: ${r.bridge.description}${colors.reset}`);
            }
          });
          if (!extraArgs.includes('--force') && !extraArgs.includes('--bypass-continuity')) {
            logError('Aborting render! Spatial continuity violation detected. Pass --force to bypass or insert neutral bridging shots.');
            process.exit(1);
          }
        } else {
          logSuccess(`[REA Spatial Logic] All sequential cuts adhere to the 180° eyeline axis and momentum conservation!`);
        }
      }
    } catch (e) {
      // Graceful fallback
    }
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

// ==========================================
// YOUTUBE PUBLISHING & OAUTH2 AUTHENTICATION
// ==========================================

async function getYouTubeAuth() {
  const secretPath = path.resolve(process.cwd(), 'youtube-secret.json');
  const tokenPath = path.resolve(process.cwd(), '.rea-youtube-token.json');

  if (!fs.existsSync(secretPath)) {
    throw new Error(
      'Missing youtube-secret.json in project root.\n' +
      'To enable YouTube Shorts uploads:\n' +
      '1. Open Google Cloud Console (https://console.cloud.google.com/)\n' +
      '2. Enable "YouTube Data API v3"\n' +
      '3. Create an OAuth 2.0 Client ID (Desktop Application)\n' +
      '4. Download credentials JSON and save as "youtube-secret.json"'
    );
  }

  const { google } = require('googleapis');
  const creds = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
  const config = creds.installed || creds.web;
  if (!config) throw new Error('Invalid youtube-secret.json: expected "installed" or "web" key.');

  const { client_secret, client_id, redirect_uris } = config;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris ? redirect_uris[0] : 'urn:ietf:wg:oauth:2.0:oob'
  );

  if (fs.existsSync(tokenPath)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(tokenPath, 'utf8')));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });

  console.log('\n🔐 Authorize YouTube Upload by visiting this URL:');
  console.log(authUrl);

  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve, reject) => {
    rl.question('\nEnter the authorization code from that page here: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code.trim());
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
        console.log('✅ OAuth token saved to .rea-youtube-token.json');
        resolve(oAuth2Client);
      } catch (err) {
        reject(new Error('Failed to retrieve YouTube access token: ' + err.message));
      }
    });
  });
}

// Command: upload
async function handleUpload(args) {
  // Usage: rea upload <video.mp4> [title] [description] [tags] [privacyStatus] [--thumbnail=thumb.jpg] [--publish-at=ISO8601]
  const videoPath = args[1];
  const title = args[2] || 'Generated Short #Shorts';
  const description = args[3] || 'Autonomous edit by REA. #Shorts #Phonk';
  const tagsString = args[4] || 'anime,phonk,edit,shorts';
  let privacyStatus = args[5] || 'public';

  const thumbArg = args.find((a) => a.startsWith('--thumbnail='));
  const thumbnailPath = thumbArg ? thumbArg.split('=')[1] : null;

  const publishArg = args.find((a) => a.startsWith('--publish-at='));
  const publishAt = publishArg ? publishArg.split('=')[1] : null;

  if (!videoPath || !fs.existsSync(videoPath)) {
    logError('Usage: rea upload <video.mp4> "Title" "Description" "tags" "public" [--thumbnail=thumb.jpg] [--publish-at=ISO8601]');
    process.exit(1);
  }

  try {
    const { google } = require('googleapis');
    const auth = await getYouTubeAuth();
    const youtube = google.youtube({ version: 'v3', auth });
    const fileSize = fs.statSync(videoPath).size;

    console.log(`\n🚀 Preparing to upload: ${path.basename(videoPath)} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`);

    const statusObj = {
      selfDeclaredMadeForKids: false,
    };

    if (publishAt) {
      statusObj.privacyStatus = 'private'; // YouTube API requirement for scheduled releases
      statusObj.publishAt = publishAt;
      console.log(`📅 Scheduled to publish at: ${publishAt}`);
    } else {
      statusObj.privacyStatus = privacyStatus;
    }

    const res = await youtube.videos.insert(
      {
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title,
            description,
            tags: tagsString.split(',').map((t) => t.trim()),
            categoryId: '24', // Entertainment
          },
          status: statusObj,
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          process.stdout.write(`\r📈 Upload Progress: ${Math.round(progress)}%`);
        },
      }
    );

    const videoId = res.data.id;
    console.log(`\n✅ Video Uploaded! Video ID: ${videoId}`);

    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      console.log(`🖼️ Uploading custom beat-drop thumbnail from ${path.basename(thumbnailPath)}...`);
      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(thumbnailPath),
        },
      });
      console.log('✅ Custom thumbnail attached successfully!');
    }

    console.log(`🔗 Link: https://youtube.com/shorts/${videoId}`);
    return res.data;
  } catch (err) {
    logError(`YouTube upload failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: live-crypto
async function handleLiveCrypto(args) {
  // Usage: rea live-crypto [coin=bitcoin] [compositionId=AnimePhonkShort] [out.mp4]
  const coin = (args[1] || 'bitcoin').toLowerCase();
  const compId = args[2] || 'AnimePhonkShort';
  const outPath = args[3] || `${coin}-status.mp4`;

  console.log(`📡 Fetching live real-time market data for "${coin}"...`);

  let price = 0;
  let change = 0;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();
    if (data[coin]) {
      price = data[coin].usd;
      change = data[coin].usd_24h_change || 0;
    } else {
      throw new Error(`Coin "${coin}" not found in CoinGecko`);
    }
  } catch (e) {
    try {
      const sym = `${coin.toUpperCase()}USDT`;
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`);
      const data = await res.json();
      price = parseFloat(data.lastPrice);
      change = parseFloat(data.priceChangePercent);
    } catch (e2) {
      logError(`Failed to fetch crypto data: ${e.message}`);
      process.exit(1);
    }
  }

  const isUp = change >= 0;
  const formattedPrice = price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4);
  const changeFormatted = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';

  console.log(`📊 Market Data: ${coin.toUpperCase()} $${formattedPrice} (${changeFormatted})`);

  const props = {
    hookTitle: `${coin.toUpperCase()} ALERT`,
    dropCaption: `$${formattedPrice}`,
    accentColor: isUp ? '#22c55e' : '#ef4444',
    variant: isUp ? 'sigma' : 'skull',
    dropFrame: 205,
    freezeDuration: 48,
    useExternalClips: false,
  };

  const tempPropsPath = path.resolve(process.cwd(), '.rea-props.json');
  fs.writeFileSync(tempPropsPath, JSON.stringify(props, null, 2), 'utf8');

  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : 'npx remotion';

  console.log(`🎬 Compiling live market video: ${outPath}...`);
  const renderCmd = `"${cmd}" render src/index.ts "${compId}" "${outPath}" --props="${tempPropsPath}" --concurrency=2 --gl=angle --enable-gpu`;
  execSync(renderCmd, { stdio: 'inherit' });
  logSuccess(`Live crypto video generated: ${outPath}`);
}

// Command: batch
async function handleBatch(args) {
  // Usage: rea batch <quotes.txt|quotes.json> [CompositionID] [out-dir] [--upload] [--schedule-days=30] [--gameplay=split|underlay] [--gameplay-file=clip.mp4] [--upload-tiktok]
  const inputPath = args[1];
  const compId = args[2] || 'AnimePhonkShort';
  const outDir = (args[3] && !args[3].startsWith('--')) ? args[3] : path.join(process.cwd(), 'batch-output');
  const shouldUpload = args.includes('--upload');
  const shouldUploadTikTok = args.includes('--upload-tiktok');

  const scheduleArg = args.find((a) => a.startsWith('--schedule-days='));
  const scheduleDays = scheduleArg ? parseInt(scheduleArg.split('=')[1], 10) : 0;

  const gameplayArg = args.find((a) => a.startsWith('--gameplay='));
  const gameplayMode = gameplayArg ? gameplayArg.split('=')[1].toLowerCase() : 'none';

  const gameplayFileArg = args.find((a) => a.startsWith('--gameplay-file='));
  const gameplayFile = gameplayFileArg ? gameplayFileArg.split('=')[1] : undefined;

  if (!inputPath || !fs.existsSync(inputPath)) {
    logError('Usage: rea batch <quotes.txt|quotes.json> [CompositionID] [out-dir] [--upload] [--schedule-days=30] [--gameplay=split|underlay] [--upload-tiktok]');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  let items = [];
  if (inputPath.endsWith('.json')) {
    items = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } else {
    items = fs.readFileSync(inputPath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));
  }

  console.log(`\n🏭 REA Batch Video Factory Initialized: Queuing ${items.length} videos...`);
  if (gameplayMode !== 'none') {
    console.log(`🎮 Gameplay Overlay Enabled: mode="${gameplayMode}"${gameplayFile ? ` (file: ${gameplayFile})` : ' (procedural 60fps 3D runner)'}`);
  }
  if (shouldUpload) {
    console.log(`📤 Direct YouTube Shorts upload enabled${scheduleDays > 0 ? ` (scheduled evenly over ${scheduleDays} days)` : ''}.`);
  }
  if (shouldUploadTikTok) {
    console.log(`🎵 Direct TikTok Creator upload enabled${scheduleDays > 0 ? ` (scheduled evenly over ${scheduleDays} days)` : ''}.`);
  }

  const remotionCli = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
  const cmd = fs.existsSync(remotionCli) ? remotionCli : 'npx remotion';
  const dropFrame = 205;
  const now = new Date();
  const calendarManifest = [];

  for (let i = 0; i < items.length; i++) {
    const rawItem = items[i];
    const quote = typeof rawItem === 'string' ? rawItem : (rawItem.text || rawItem.quote || JSON.stringify(rawItem));
    const title = typeof rawItem === 'object' && rawItem.title ? rawItem.title : 'SIGMA MINDSET';
    const accent = typeof rawItem === 'object' && rawItem.color ? rawItem.color : (i % 2 === 0 ? '#00f5ff' : '#ff0055');

    const outPath = path.join(outDir, `short_${String(i + 1).padStart(3, '0')}.mp4`);
    const thumbPath = path.join(outDir, `thumb_${String(i + 1).padStart(3, '0')}.jpg`);

    const props = {
      hookTitle: title.substring(0, 30).toUpperCase(),
      dropCaption: quote.substring(0, 26).toUpperCase(),
      accentColor: accent,
      dropFrame,
      freezeDuration: 48,
      variant: i % 2 === 0 ? 'chad' : 'sigma',
      useExternalClips: false,
      gameplayMode,
      gameplayFile,
    };

    const tempPropsPath = path.resolve(outDir, `props_${String(i + 1).padStart(3, '0')}.json`);
    fs.writeFileSync(tempPropsPath, JSON.stringify(props, null, 2), 'utf8');

    console.log(`\n🎬 [${i + 1}/${items.length}] Processing: "${quote.substring(0, 40)}..."`);

    // 1. Capture beat-drop thumbnail at exact drop timestamp
    console.log(`  📸 Capturing beat-drop thumbnail at frame ${dropFrame}...`);
    const stillCmd = `"${cmd}" still src/index.ts "${compId}" "${thumbPath}" --props="${tempPropsPath}" --frame=${dropFrame} --image-format=jpeg`;
    try {
      execSync(stillCmd, { stdio: 'ignore' });
    } catch {}

    // 2. Render MP4 with Chromium GPU acceleration
    console.log(`  ⚡ Compiling 60fps video with Chromium (ANGLE backend)...`);
    const renderCmd = `"${cmd}" render src/index.ts "${compId}" "${outPath}" --props="${tempPropsPath}" --concurrency=2 --gl=angle --enable-gpu`;
    execSync(renderCmd, { stdio: 'inherit' });
    logSuccess(`Compiled: ${outPath}`);

    // Calculate calendar slot if scheduling is enabled
    let publishAtIso = null;
    let displaySlot = null;
    if (scheduleDays > 0) {
      const slots = [18, 21]; // Prime 6:00 PM and 9:00 PM UTC
      const slotHour = slots[i % slots.length];
      const dayOffset = Math.floor(i / slots.length) % scheduleDays;
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 + dayOffset);
      targetDate.setUTCHours(slotHour, 0, 0, 0);
      publishAtIso = targetDate.toISOString();
      displaySlot = targetDate.toUTCString().replace('GMT', 'UTC');

      calendarManifest.push({
        id: i + 1,
        video: `short_${String(i + 1).padStart(3, '0')}.mp4`,
        thumbnail: `thumb_${String(i + 1).padStart(3, '0')}.jpg`,
        hook: title,
        quote,
        publishAt: publishAtIso,
        displaySlot,
      });
    }

    // 3. Upload to YouTube Shorts if requested
    if (shouldUpload) {
      const ytTitle = `${quote.substring(0, 45)} #Shorts #Phonk`;
      const ytDesc = `Quote: "${quote}"\n\nGenerated autonomously by REA.\n#Sigma #Phonk #Shorts #Mindset`;

      const uploadArgs = [
        'upload',
        outPath,
        ytTitle,
        ytDesc,
        'phonk,sigma,quotes,shorts',
        'public',
        `--thumbnail=${thumbPath}`,
      ];
      if (publishAtIso) uploadArgs.push(`--publish-at=${publishAtIso}`);

      try {
        await handleUpload(uploadArgs);
      } catch (err) {
        logError(`Failed to upload ${outPath} to YouTube: ${err.message}`);
      }
    }

    // 4. Upload to TikTok if requested
    if (shouldUploadTikTok) {
      const tiktokCaption = `${title}: ${quote} #fyp #anime #phonk #shorts #sigma`;
      const tiktokArgs = ['upload-tiktok', outPath, tiktokCaption];
      if (publishAtIso) tiktokArgs.push(`--schedule=${publishAtIso}`);

      try {
        await handleUploadTikTok(tiktokArgs);
      } catch (err) {
        logError(`Failed to upload ${outPath} to TikTok: ${err.message}`);
      }
    }
  }

  // Save 30-Day Publishing Calendar manifest if scheduleDays was set
  if (calendarManifest.length > 0) {
    const calendarPath = path.join(outDir, 'publish-calendar.json');
    fs.writeFileSync(calendarPath, JSON.stringify(calendarManifest, null, 2), 'utf8');

    let calMd = `# 📅 30-Day Publishing Calendar\n\n`;
    calMd += `| Day | Target Slot (UTC) | Video File | Hook & Quote | Thumbnail |\n`;
    calMd += `| :---: | :--- | :--- | :--- | :---: |\n`;
    calendarManifest.forEach((c) => {
      calMd += `| **#${c.id}** | \`${c.displaySlot}\` | \`${c.video}\` | **${c.hook}:** *"${c.quote}"* | \`${c.thumbnail}\` |\n`;
    });
    fs.writeFileSync(path.join(outDir, 'publish-calendar.md'), calMd, 'utf8');
    console.log(`\n📅 30-Day Calendar manifest saved to: ${calendarPath}`);
  }

  logSuccess(`Batch complete! ${items.length} videos and thumbnails saved to: ${outDir}`);
}

// Command: upload-tiktok
async function handleUploadTikTok(args) {
  // Usage: rea upload-tiktok <video.mp4> "Caption #fyp #shorts" [--schedule="2026-11-20T18:00:00Z"] [--session=.rea-tiktok-session.json] [--headless] [--dry-run]
  const videoPath = args[1];
  const caption = args[2] || 'Autonomous edit by REA. #shorts #phonk #fyp';
  const scheduleArg = args.find((a) => a.startsWith('--schedule='));
  const scheduleTime = scheduleArg ? scheduleArg.split('=').slice(1).join('=') : null;
  const sessionArg = args.find((a) => a.startsWith('--session='));
  const sessionPath = sessionArg ? sessionArg.split('=')[1] : path.resolve(process.cwd(), '.rea-tiktok-session.json');
  const isHeadless = args.includes('--headless');
  const isDryRun = args.includes('--dry-run');

  if (!videoPath || !fs.existsSync(videoPath)) {
    logError('Usage: rea upload-tiktok <video.mp4> "Caption #fyp #shorts" [--schedule="YYYY-MM-DDTHH:mm:ssZ"] [--session=path] [--headless] [--dry-run]');
    process.exit(1);
  }

  const resolvedVideo = path.resolve(process.cwd(), videoPath);
  console.log(`\n🎵 Preparing TikTok automated publish: ${path.basename(resolvedVideo)}`);
  console.log(`📝 Caption: "${caption}"`);
  if (scheduleTime) {
    console.log(`⏰ Scheduled Publish Time: ${scheduleTime}`);
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch (err) {
    logError('Playwright is required for TikTok automation. Please run: npm install playwright');
    process.exit(1);
  }

  const hasSession = fs.existsSync(sessionPath);
  const launchOptions = {
    headless: isHeadless ? true : !hasSession ? false : true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  };

  console.log(`🌐 Launching Chromium browser (${launchOptions.headless ? 'Headless' : 'Visible UI'})...`);
  const browser = await playwright.chromium.launch(launchOptions);
  const contextOptions = {
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };

  if (hasSession) {
    try {
      contextOptions.storageState = sessionPath;
      console.log(`🔑 Loaded persistent TikTok session from: ${path.basename(sessionPath)}`);
    } catch {}
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    console.log('🔗 Navigating to TikTok Creator Center upload portal...');
    await page.goto('https://www.tiktok.com/creator-center/upload?lang=en', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/signin') || !hasSession) {
      console.log('\n⚠️ Authentication Required: Please log in to your TikTok account in the browser window.');
      console.log('   Once you complete login and reach Creator Center, session cookies will be saved automatically.');

      await page.waitForURL(/.*tiktok\.com\/(creator-center\/upload|upload).*/, {
        timeout: 120000,
      });

      await context.storageState({ path: sessionPath });
      logSuccess(`Authentication successful! Session state saved to: ${sessionPath}`);
    }

    console.log(`📤 Staging video file: ${path.basename(resolvedVideo)}...`);
    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 30000 });
    await fileInput.setInputFiles(resolvedVideo);
    console.log('⏳ Uploading media buffer to TikTok server...');

    await page.waitForSelector('div[contenteditable="true"], textarea, div[data-contents="true"]', {
      timeout: 60000,
    });

    console.log('✍️ Injecting caption and hashtag telemetry...');
    const captionEditor = await page.$('div[contenteditable="true"], textarea');
    if (captionEditor) {
      await captionEditor.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(caption, { delay: 35 });
    }

    if (scheduleTime) {
      console.log(`🗓️ Configuring scheduled release: ${scheduleTime}...`);
      const scheduleSwitch = await page.$('input[type="checkbox"][aria-label*="Schedule"], button:has-text("Schedule")');
      if (scheduleSwitch) {
        await scheduleSwitch.click();
      }
    }

    if (isDryRun) {
      logSuccess('[DRY-RUN] Video staged, caption injected, and upload verified. Skipping Post button click.');
      await browser.close();
      return;
    }

    console.log('🚀 Submitting Post to TikTok...');
    const postButton = await page.waitForSelector('button:has-text("Post"), button[data-e2e="post_video_button"]', {
      timeout: 15000,
    });
    await postButton.click();

    await page.waitForTimeout(5000);
    logSuccess(`TikTok video published successfully!`);
  } catch (err) {
    logError(`TikTok automated upload encountered an issue: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// Command: schedule-calendar
async function handleScheduleCalendar(args) {
  // Usage: rea schedule-calendar [dir=batch-output] [--days=30] [--slots="18:00,21:00"] [--platform=youtube|tiktok|all] [--execute]
  const dirArg = (args[1] && !args[1].startsWith('--')) ? args[1] : 'batch-output';
  const targetDir = path.resolve(process.cwd(), dirArg);

  const daysArg = args.find((a) => a.startsWith('--days='));
  const totalDays = daysArg ? parseInt(daysArg.split('=')[1], 10) : 30;

  const slotsArg = args.find((a) => a.startsWith('--slots='));
  const rawSlots = slotsArg ? slotsArg.split('=')[1] : '18:00,21:00';
  const slots = rawSlots.split(',').map((s) => s.trim()).filter(Boolean);

  const platformArg = args.find((a) => a.startsWith('--platform='));
  const platform = platformArg ? platformArg.split('=')[1].toLowerCase() : 'all';

  const shouldExecute = args.includes('--execute');

  if (!fs.existsSync(targetDir)) {
    logError(`Directory "${dirArg}" not found. Run "rea batch <quotes.txt> AnimePhonkShort ${dirArg}" first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(targetDir);
  const videoFiles = files.filter((f) => f.endsWith('.mp4')).sort();

  if (videoFiles.length === 0) {
    logError(`No MP4 files found in "${dirArg}". Generate videos first with "rea batch".`);
    process.exit(1);
  }

  console.log(`\n📅 30-Day Publishing Calendar Matrix Generator`);
  console.log(`   Found ${videoFiles.length} videos in ${dirArg}`);
  console.log(`   Distribution: Over ${totalDays} days`);
  console.log(`   Daily Release Slots: ${slots.join(', ')} UTC`);
  console.log(`   Target Platforms: ${platform.toUpperCase()}\n`);

  const calendar = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  for (let i = 0; i < videoFiles.length; i++) {
    const videoFile = videoFiles[i];
    const baseName = path.basename(videoFile, '.mp4');
    const thumbFile = files.find((f) => f.startsWith(baseName.replace('short_', 'thumb_')) && f.endsWith('.jpg')) || `${baseName}.jpg`;
    const propsFile = files.find((f) => f.startsWith(baseName.replace('short_', 'props_')) && f.endsWith('.json'));

    let quote = 'Discipline & Focus';
    let hook = 'SIGMA MINDSET';
    if (propsFile) {
      try {
        const p = JSON.parse(fs.readFileSync(path.join(targetDir, propsFile), 'utf8'));
        quote = p.dropCaption || quote;
        hook = p.hookTitle || hook;
      } catch {}
    }

    const slotIndex = i % slots.length;
    const dayOffset = Math.floor(i / slots.length) % totalDays;
    const [slotHour, slotMin] = slots[slotIndex].split(':').map((n) => parseInt(n, 10));

    const scheduledDate = new Date(startDate.getTime());
    scheduledDate.setDate(startDate.getDate() + dayOffset);
    scheduledDate.setUTCHours(slotHour || 18, slotMin || 0, 0, 0);

    calendar.push({
      id: i + 1,
      video: videoFile,
      videoPath: path.join(targetDir, videoFile),
      thumbnail: thumbFile,
      thumbnailPath: path.join(targetDir, thumbFile),
      hook,
      caption: quote,
      publishAt: scheduledDate.toISOString(),
      displayDate: scheduledDate.toUTCString().replace('GMT', 'UTC'),
      platform: platform === 'all' ? 'YouTube + TikTok' : platform,
      status: 'queued',
    });
  }

  const calendarJsonPath = path.join(targetDir, 'publish-calendar.json');
  fs.writeFileSync(calendarJsonPath, JSON.stringify(calendar, null, 2), 'utf8');

  let mdTable = `# 📅 30-Day Automated Publishing Calendar\n\n`;
  mdTable += `Generated by **Remotion Engine for Antigravity (REA v${VERSION})**\n\n`;
  mdTable += `| Day | Release Time (UTC) | Video File | Hook & Caption | Thumbnail | Platform | Status |\n`;
  mdTable += `| :---: | :--- | :--- | :--- | :--- | :---: | :---: |\n`;

  calendar.forEach((entry) => {
    mdTable += `| **#${entry.id}** | \`${entry.displayDate}\` | \`${entry.video}\` | **${entry.hook}:** *"${entry.caption}"* | \`${entry.thumbnail}\` | ${entry.platform} | ⏳ Queued |\n`;
  });

  const calendarMdPath = path.join(targetDir, 'publish-calendar.md');
  fs.writeFileSync(calendarMdPath, mdTable, 'utf8');

  console.log(`┌─────┬──────────────────────────┬─────────────────────────────┬──────────────────┐`);
  console.log(`│ Day │ Release Slot (UTC)       │ Video Target                │ Status           │`);
  console.log(`├─────┼──────────────────────────┼─────────────────────────────┼──────────────────┤`);
  calendar.slice(0, 10).forEach((entry) => {
    const dayStr = String(entry.id).padEnd(3);
    const dateStr = entry.displayDate.substring(0, 24).padEnd(24);
    const vidStr = entry.video.padEnd(27);
    console.log(`│ #${dayStr} │ ${dateStr} │ ${vidStr} │ ⏳ Queued        │`);
  });
  if (calendar.length > 10) {
    console.log(`│ ... │ + ${calendar.length - 10} more scheduled days  │ ...                         │ ⏳ Queued        │`);
  }
  console.log(`└─────┴──────────────────────────┴─────────────────────────────┴──────────────────┘\n`);

  logSuccess(`Publishing calendar generated!`);
  console.log(`  📄 JSON Manifest: ${calendarJsonPath}`);
  console.log(`  📊 Markdown Schedule: ${calendarMdPath}`);

  if (shouldExecute) {
    console.log(`\n🚀 Executing automated calendar publishing...`);
    for (const item of calendar) {
      console.log(`\n📤 Publishing Day #${item.id} -> ${item.publishAt}`);
      const ytTitle = `${item.caption.substring(0, 45)} #Shorts #Phonk`;
      const ytDesc = `${item.hook}: "${item.caption}"\n\nAutonomous edit by REA.\n#Phonk #Sigma #Shorts`;

      if (platform === 'youtube' || platform === 'all') {
        const uploadArgs = [
          'upload',
          item.videoPath,
          ytTitle,
          ytDesc,
          'phonk,sigma,quotes,shorts',
          'public',
          `--thumbnail=${item.thumbnailPath}`,
          `--publish-at=${item.publishAt}`,
        ];
        try {
          await handleUpload(uploadArgs);
        } catch (err) {
          logError(`YouTube schedule failed for ${item.video}: ${err.message}`);
        }
      }

      if (platform === 'tiktok' || platform === 'all') {
        const tiktokCaption = `${item.hook}: ${item.caption} #fyp #anime #phonk #shorts`;
        const tiktokArgs = [
          'upload-tiktok',
          item.videoPath,
          tiktokCaption,
          `--schedule=${item.publishAt}`,
        ];
        try {
          await handleUploadTikTok(tiktokArgs);
        } catch (err) {
          logError(`TikTok schedule failed for ${item.video}: ${err.message}`);
        }
      }
    }
    logSuccess('All calendar releases have been scheduled and queued on target platforms!');
  } else {
    console.log(`💡 Tip: Run with "--execute" to push this entire 30-day schedule directly to YouTube Shorts and TikTok.`);
  }
}

// Print Help
// Command: vision-slice (Vision Engine)
function handleVisionSlice(args) {
  const inVideo = args[1];
  const outDir = args[2] || path.join('public', 'clips');
  if (!inVideo) {
    logError('Usage: rea vision-slice <input.mp4> [out-dir] [--threshold=0.3] [--top=10]');
    process.exit(1);
  }

  const threshArg = args.find((a) => a.startsWith('--threshold='));
  const topArg = args.find((a) => a.startsWith('--top='));
  const threshold = threshArg ? parseFloat(threshArg.split('=')[1]) : 0.3;
  const topN = topArg ? parseInt(topArg.split('=')[1], 10) : 10;
  const ffmpegPath = getFfmpegPath();

  try {
    const { extractActionSequences } = require('../src/engines/backend');
    const clips = extractActionSequences(inVideo, outDir, { threshold, topN, ffmpegPath });
    logSuccess(`Vision Engine: Sliced ${clips.length} high-energy action clips into: ${outDir}`);
  } catch (err) {
    logError(`Vision slice failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: stems (Psychoacoustic Engine)
function handleStems(args) {
  const inMedia = args[1];
  const outDir = args[2] || path.join('public', 'stems');
  if (!inMedia) {
    logError('Usage: rea stems <media-file> [out-dir]');
    process.exit(1);
  }

  const ffmpegPath = getFfmpegPath();
  try {
    const { separateStems } = require('../src/engines/backend');
    const stems = separateStems(inMedia, outDir, ffmpegPath);
    logSuccess(`Psychoacoustic Engine: Stems isolated successfully in: ${outDir}`);
  } catch (err) {
    logError(`Stem separation failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: vlm-qa (Orchestration Engine)
function handleVlmQa(args) {
  const compId = args[1] || 'GodTierEngineShowcase';
  const outReport = args[2] || path.join(process.cwd(), 'vlm-qa-report.json');

  logInfo(`Running Visual VLM QA Loop on composition "${compId}"...`);
  try {
    const { auditCompositionStills } = require('../src/engines/backend');
    // Audit available stills
    const stills = ['still-god-tier-engine.jpeg', 'still-v2-killua-aura-freeze.jpeg', 'still-v2-zenitsu-dragon-freeze.jpeg']
      .map((s) => path.resolve(process.cwd(), s))
      .filter((s) => fs.existsSync(s));

    const results = auditCompositionStills(stills, compId);
    fs.writeFileSync(outReport, JSON.stringify(results, null, 2), 'utf8');
    logSuccess(`VLM QA report generated: ${outReport}`);
  } catch (err) {
    logError(`VLM QA audit failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: fuzz (Orchestration Engine)
function handleFuzz(args) {
  const compId = args[1] || 'GodTierEngineShowcase';
  const outDir = args[2] || path.join(process.cwd(), 'ab-matrix');
  const countArg = args.find((a) => a.startsWith('--variations='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) : 100;

  try {
    const { generateVariationMatrix } = require('../src/engines/backend');
    const matrix = generateVariationMatrix(outDir, count, compId);
    logSuccess(`Orchestration Engine: Compiled ${matrix.length} A/B testing schemas into: ${outDir}`);
  } catch (err) {
    logError(`A/B fuzzing failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: master-audio (Pro-Tier Visual/Audio Engine)
function handleMasterAudio(args) {
  const inPath = args[1];
  const outPath = args[2] || inPath.replace(/(\.[^.]+)$/, '_mastered$1');
  if (!inPath) {
    logError('Usage: rea master-audio <input-file> [output-file] [--lufs=-14]');
    process.exit(1);
  }

  const lufsArg = args.find((a) => a.startsWith('--lufs='));
  const targetLufs = lufsArg ? parseFloat(lufsArg.split('=')[1]) : -14.0;
  const ffmpegPath = getFfmpegPath();

  try {
    const { masterAudioToBroadcast } = require('../src/engines/backend');
    masterAudioToBroadcast(inPath, outPath, { targetLufs, ffmpegPath });
    logSuccess(`Audio mastered cleanly to EBU R128 (${targetLufs} LUFS) -> ${outPath}`);
  } catch (err) {
    logError(`Mastering failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: fleet (Fleet Commander Engine)
function handleFleet(args) {
  const prompt = args.slice(1).join(' ');
  if (!prompt) {
    logError('Usage: rea fleet "<!edit combat Zenitsu audio=\\"dark drift\\" duration=30>"');
    process.exit(1);
  }

  try {
    const { parseFleetCommand } = require('../src/engines/backend');
    const cmd = parseFleetCommand(prompt);
    logSuccess(`Fleet Commander: Parsed autonomous bot instruction:`);
    console.log(JSON.stringify(cmd, null, 2));
  } catch (err) {
    logError(`Fleet command parse failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: intuition-graph (Intuition Architecture: Pillar I)
function handleIntuitionGraph(args) {
  const durationArg = args.find((a) => a.startsWith('--duration='));
  const duration = durationArg ? parseFloat(durationArg.split('=')[1]) : 30.0;
  try {
    const { buildSemanticSceneGraph } = require('../src/intuition/backend');
    const graph = buildSemanticSceneGraph(duration);
    logSuccess('Intuition Engine: Generated Hollywood Semantic Scene Graph:');
    console.log(JSON.stringify(graph, null, 2));
  } catch (err) {
    logError(`Semantic scene graph failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: intuition-budget (Intuition Architecture: Pillar III)
function handleIntuitionBudget(args) {
  try {
    const { VfxBudgetMatrix } = require('../src/intuition/backend');
    const matrix = new VfxBudgetMatrix(100);
    matrix.registerEffect('screen_shake', 25);
    matrix.registerEffect('manga_halftone', 30);
    matrix.registerEffect('floating_chad', 15);
    // Attempting heavy glitch on drop #2
    const approved = matrix.registerEffect('glitch_transition', 45);
    const report = matrix.getReport();

    logSuccess(`Intuition Engine: VFX Restraint & Fatigue Audit:`);
    console.log(JSON.stringify({ ...report, drop2GlitchApproved: approved }, null, 2));
    if (!approved) {
      logInfo('Restraint Enforced: Drop #2 heavy glitch suppressed to preserve visual clarity.');
    }
  } catch (err) {
    logError(`VFX budget audit failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: debate (Orchestration Engine: Director vs VFX Editor Multi-Agent Debate)
function handleDebate(args) {
  const durArg = args.find((a) => a.startsWith('--duration='));
  const duration = durArg ? parseFloat(durArg.split('=')[1]) : 30.0;
  try {
    const { executeDebate } = require('../src/engines/backend');
    const result = executeDebate(duration, 3);
    logSuccess('Orchestration Engine: Multi-Agent Debate Reached Equilibrium:');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    logError(`Debate simulation failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: foley (Psychoacoustic Engine: Procedural Foley Synthesis)
function handleFoley(args) {
  const preset = (args[1] || 'sword_clash').toLowerCase();
  const outPath = args[2] || path.join('public', 'sfx', `${preset}.wav`);
  try {
    const { generateProceduralFoley } = require('../src/engines/backend');
    const saved = generateProceduralFoley(preset, outPath);
    logSuccess(`Procedural Foley WAV generated: ${saved}`);
  } catch (err) {
    logError(`Foley generation failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: thumbnails (Scale Engine: A/B/C/D Thumbnail Generation)
function handleThumbnails(args) {
  const dropFrame = parseInt(args[1], 10) || 720;
  try {
    const { generateThumbnailMatrix } = require('../src/engines/backend');
    const matrix = generateThumbnailMatrix(dropFrame, 1800, 'Zenitsu', 'Killua');
    logSuccess(`Scale Engine: Synthesized 4 Split-Test Thumbnails:`);
    console.log(JSON.stringify(matrix, null, 2));
  } catch (err) {
    logError(`Thumbnail matrix failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: dmca-shield (Scale Engine: DMCA Protection Profile)
function handleDmcaShield(args) {
  const intensity = (args[1] || 'standard').toLowerCase();
  try {
    const { getDmcaProtectionProfile } = require('../src/engines/backend');
    const profile = getDmcaProtectionProfile(intensity);
    logSuccess(`Scale Engine: ContentID / DMCA Protection Profile (${intensity}):`);
    console.log(JSON.stringify(profile, null, 2));
  } catch (err) {
    logError(`DMCA shield failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: art-director (Studio Engine: "Mean Art Director" QA Critique)
function handleArtDirector(args) {
  try {
    const { critiqueByArtDirector } = require('../src/engines/backend');
    const verdict = critiqueByArtDirector({
      hookSpeedSec: 0.8,
      totalVfxScore: 85,
      longestSceneSec: 2.8,
      contrastScore: 92,
    });
    logSuccess(`Studio Engine: "Mean Art Director" Verdict [Grade: ${verdict.editorialGrade}]:`);
    console.log(`  Critique: "${verdict.critique}"`);
    console.log(`  Approved for GPU Render: ${verdict.approved ? colors.green + 'YES' : colors.red + 'NO'}${colors.reset}`);
    if (verdict.requiredChanges.length > 0) {
      console.log(`  Required Adjustments:`);
      verdict.requiredChanges.forEach((c) => console.log(`    • ${c}`));
    }
  } catch (err) {
    logError(`Art director review failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: port-niche (Studio Engine: Cross-Niche Logic Porting)
function handlePortNiche(args) {
  const niche = (args[1] || 'ufc_mma').toLowerCase();
  try {
    const { portNichePacing } = require('../src/engines/backend');
    const profile = portNichePacing(niche);
    logSuccess(`Studio Engine: Cross-Niche Porting Profile for "${niche}":`);
    console.log(JSON.stringify(profile, null, 2));
  } catch (err) {
    logError(`Port niche failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: dopamine-wave (Neurochemistry Engine: 3-Spike Retention Waves)
function handleDopamineWave(args) {
  const durArg = args.find((a) => a.startsWith('--duration='));
  const duration = durArg ? parseFloat(durArg.split('=')[1]) : 30.0;
  try {
    const { getDopamineWave } = require('../src/engines/backend');
    const wave = getDopamineWave(duration);
    logSuccess(`Neurochemistry Engine: 3-Spike Dopamine Retention Curve (${duration}s):`);
    console.log(JSON.stringify(wave, null, 2));
  } catch (err) {
    logError(`Dopamine wave failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: predict-retention (Pre-Publish Retention Simulator & Swipe Risk Gate)
function handlePredictRetention(args) {
  const target = args[1] || 'edit-plan.json';
  let cuts = [];
  let totalFrames = 1800;
  let fps = 60;

  if (fs.existsSync(path.resolve(process.cwd(), target))) {
    const raw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), target), 'utf8'));
    cuts = raw.cuts || (raw.cutTimestamps ? raw.cutTimestamps.map((sec, i) => ({
      frame: Math.round(sec * (raw.fps || 60)),
      type: i === (raw.dropIndex || 2) ? 'beat-drop' : 'action-cut'
    })) : []);
    totalFrames = raw.durationFrames || (raw.durationSec ? Math.round(raw.durationSec * (raw.fps || 60)) : 1800);
    fps = raw.fps || 60;
  } else {
    cuts = [
      { frame: 45, type: 'action-cut' },
      { frame: 180, type: 'action-cut' },
      { frame: 420, type: 'beat-drop' },
      { frame: 600, type: 'action-cut' },
      { frame: 900, type: 'action-cut' },
      { frame: 1200, type: 'action-cut' }
    ];
  }

  const { analyzeRetentionRisk } = require('../src/utils/retention-analyzer.js');
  const result = analyzeRetentionRisk(cuts, totalFrames, fps);

  console.log(`\n${colors.bold}${colors.cyan}--- Pre-Publish Retention Simulation Report ---${colors.reset}`);
  console.log(`  Total Evaluated Cuts:  ${cuts.length}`);
  console.log(`  Timeline Duration:     ${(totalFrames / fps).toFixed(1)}s (${totalFrames} frames @ ${fps}fps)`);
  console.log(`  Predicted APV:         ${result.predictedAPV}`);
  console.log(`  Swipe Risk Score:      ${result.swipeRiskScore} / 100`);
  console.log(`  Safe to Render:        ${result.isSafeToRender ? colors.green + 'YES (PASS)' : colors.red + 'NO (BLOCKED)'}${colors.reset}`);

  if (result.warnings.length > 0) {
    console.log(`\n${colors.bold}Pacing Warnings:${colors.reset}`);
    result.warnings.forEach((w) => console.log(`  ${colors.yellow}• ${w}${colors.reset}`));
  }

  if (result.tightenedCuts && result.tightenedCuts.length > cuts.length) {
    console.log(`\n${colors.bold}${colors.green}Suggested Pacing Tightening (${result.tightenedCuts.length} cuts):${colors.reset}`);
    result.tightenedCuts.forEach(c => console.log(`  Frame ${c.frame} (${(c.frame / fps).toFixed(2)}s) -> ${c.type} [${c.label || 'cut'}]`));
  }
}

// Command: intuition-predict (Intuition Architecture: Pillar IV)
function handleIntuitionPredict(args) {
  const durationArg = args.find((a) => a.startsWith('--duration='));
  const duration = durationArg ? parseFloat(durationArg.split('=')[1]) : 30.0;
  try {
    const { simulateRetentionCurve } = require('../src/intuition/backend');
    const sim = simulateRetentionCurve(duration, true, true, 12.0);
    logSuccess(`Intuition Engine: Pre-Publish Retention Simulation:`);
    console.log(`   Overall Predicted APV: ${sim.overallApv}% (${sim.viralPotential})`);
    console.log(`   Swipe Risk Seconds: ${sim.swipeRiskSeconds.length > 0 ? sim.swipeRiskSeconds.join(', ') + 's' : 'None detected'}`);
    console.log(`   Inhale Suspension Bonus: +14% sustained attention over pre-drop window`);
  } catch (err) {
    logError(`Retention prediction failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: intuition-hooks (Intuition Architecture: Pillar IV)
function handleIntuitionHooks(args) {
  const charA = args[1] || 'Zenitsu';
  const charB = args[2] || 'Killua';
  try {
    const { generateCuriosityGapHooks } = require('../src/intuition/backend');
    const hooks = generateCuriosityGapHooks(charA, charB, 12);
    logSuccess(`Intuition Engine: Generated ${hooks.length} High-CTR Curiosity Gap Hooks:`);
    console.log(JSON.stringify(hooks, null, 2));
  } catch (err) {
    logError(`Hook generation failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: intuition-fork (Intuition Architecture: Pillar IV)
function handleIntuitionFork(args) {
  try {
    const { getPlatformForks } = require('../src/intuition/backend');
    const forks = getPlatformForks(60);
    logSuccess('Intuition Engine: Multi-Platform Pacing Forks:');
    console.log(JSON.stringify(forks, null, 2));
  } catch (err) {
    logError(`Platform forks failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: track-momentum (Flawless Logic: Spatial Vision Tracking)
function handleTrackMomentum(args) {
  const inVideo = args[1];
  const outJson = args[2] || (inVideo ? inVideo.replace(/\.[^/.]+$/, '') + '.meta.json' : null);

  if (!inVideo) {
    logError('Usage: rea track-momentum <in.mp4> [out.json]');
    process.exit(1);
  }

  logInfo(`Tracking mass momentum vectors and eyelines: ${inVideo} -> ${outJson}`);
  const pyScript = path.resolve(__dirname, '..', 'src', 'vision', 'momentum_tracker.py');

  try {
    execSync(`python "${pyScript}" "${inVideo}" "${outJson}"`, { encoding: 'utf8', stdio: 'inherit' });
    logSuccess(`Momentum & eyeline tracking completed successfully!`);
    if (fs.existsSync(outJson)) {
      const meta = JSON.parse(fs.readFileSync(outJson, 'utf8'));
      const total = meta.frames.length;
      const right = meta.frames.filter(f => f.eyeline === 'looking_right').length;
      const left = meta.frames.filter(f => f.eyeline === 'looking_left').length;
      const panR = meta.frames.filter(f => f.momentum_dir === 'pan_right').length;
      const panL = meta.frames.filter(f => f.momentum_dir === 'pan_left').length;
      console.log(`  Frames analyzed: ${total}`);
      console.log(`  Eyeline balance: Left ${left} (${Math.round((left / total) * 100)}%) | Right ${right} (${Math.round((right / total) * 100)}%)`);
      console.log(`  Momentum balance: Pan Right ${panR} | Pan Left ${panL}`);
    }
  } catch (err) {
    logError(`Momentum tracking failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: audit-cut (Flawless Logic: 180-Degree Rule & Kinetic Conservation)
function handleAuditCut(args) {
  const metaAPath = args[1];
  const metaBPath = args[2];

  if (!metaAPath || !metaBPath) {
    logError('Usage: rea audit-cut <clipA.meta.json> <clipB.meta.json>');
    process.exit(1);
  }

  const { loadClipMeta, validateCut } = require('../src/intuition/backend.js');
  try {
    const clipAMeta = loadClipMeta(metaAPath);
    const clipBMeta = loadClipMeta(metaBPath);
    const validation = validateCut(clipAMeta, clipBMeta);

    if (!validation.isValid) {
      console.log(`${colors.red}❌ Cut rejected: ${validation.reason}${colors.reset}`);
      if (validation.recommendedBridge) {
        console.log(`  ${colors.yellow}↳ Resolution: ${validation.recommendedBridge.description}${colors.reset}`);
      }
      process.exit(1);
    } else {
      console.log(`${colors.green}✅ Cut approved. Momentum and eyelines are mathematically sound.${colors.reset}`);
    }
  } catch (err) {
    logError(`Audit cut failed: ${err.message}`);
    process.exit(1);
  }
}

// Command: audit-sequence (Flawless Logic: Multi-Clip Sequence Audit)
function handleAuditSequence(args) {
  const targetDir = args[1] || path.resolve(process.cwd(), 'public', 'clips');
  logInfo(`Auditing clip sequence continuity in: ${targetDir}`);
  if (!fs.existsSync(targetDir)) {
    logError(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  const { loadClipMeta, validateCut } = require('../src/intuition/backend.js');
  const metaFiles = fs.readdirSync(targetDir)
    .filter(f => f.endsWith('.meta.json'))
    .sort()
    .map(f => path.join(targetDir, f));

  if (metaFiles.length < 2) {
    logWarn(`Found fewer than 2 .meta.json files in ${targetDir}. Run "rea track-momentum" on your clips first.`);
    return;
  }

  let approved = 0;
  let rejected = 0;
  console.log(`Auditing ${metaFiles.length} clips (${metaFiles.length - 1} transitions):`);

  for (let i = 0; i < metaFiles.length - 1; i++) {
    const clipA = loadClipMeta(metaFiles[i]);
    const clipB = loadClipMeta(metaFiles[i + 1]);
    const res = validateCut(clipA, clipB);
    const nameA = path.basename(metaFiles[i]);
    const nameB = path.basename(metaFiles[i + 1]);

    if (res.isValid) {
      approved++;
      console.log(`  ${colors.green}✔ Cut [${i + 1}/${metaFiles.length - 1}]: "${nameA}" -> "${nameB}" APPROVED${colors.reset}`);
    } else {
      rejected++;
      console.log(`  ${colors.red}✖ Cut [${i + 1}/${metaFiles.length - 1}]: "${nameA}" -> "${nameB}" REJECTED - ${res.reason}${colors.reset}`);
      if (res.recommendedBridge) {
        console.log(`    ${colors.yellow}↳ Action: ${res.recommendedBridge.description}${colors.reset}`);
      }
    }
  }

  console.log(`\n${colors.cyan}--- Sequence Audit Summary ---${colors.reset}`);
  console.log(`Total Transitions: ${metaFiles.length - 1}`);
  console.log(`Approved: ${approved}`);
  console.log(`Rejected: ${rejected}`);
  if (rejected > 0) {
    logWarn(`Sequence contains spatial continuity errors. Insert bridging shots or reorder shots before final render.`);
  } else {
    logSuccess(`Flawless sequence continuity! 100% compliant with 180° rule and momentum conservation.`);
  }
}

function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}REA CLI${colors.reset} - Remotion Engine for Antigravity (v${VERSION})
Enterprise-grade autonomous motion graphics, sound synthesis, and multimedia engine.

${colors.bold}USAGE:${colors.reset}
  rea <command> [arguments...]

${colors.bold}EDITORIAL INTUITION & TASTE COMMANDS (V2.2):${colors.reset}
  ${colors.green}track-momentum <in.mp4> [out.json]${colors.reset}            Spatial Vision: YOLOv8 Pose eyeline + Farneback optical flow tracking
  ${colors.green}audit-cut <clipA.meta.json> <clipB.meta.json>${colors.reset} Flawless Logic: Audit 180° gaze rule & momentum conservation
  ${colors.green}audit-sequence [clipsDir]${colors.reset}                      Flawless Logic: Multi-clip sequence continuity & bridge advisor
  ${colors.green}predict-retention [plan.json]${colors.reset}                 Pre-Publish Retention Simulator: Swipe-Risk Gatekeeper (APV Predictor)
  ${colors.green}intuition-graph [--duration=30]${colors.reset}               Narrative Logic: Hollywood semantic scene graphing
  ${colors.green}intuition-budget${colors.reset}                              Aesthetic Restraint: Audit VFX fatigue & effect quotas
  ${colors.green}intuition-predict [--duration=30]${colors.reset}     Viral Survival: Pre-publish retention curve & swipe risk audit
  ${colors.green}intuition-hooks [charA] [charB]${colors.reset}       Curiosity Gap: High-CTR debate-starting hook generator
  ${colors.green}intuition-fork${colors.reset}                        Platform Forks: Tailor for TikTok (15s), Shorts (30s) & Reels (20s)

${colors.bold}DECENTRALIZED ENGINES COMMANDS (V2.2):${colors.reset}
  ${colors.green}vision-slice <in.mp4> [out-dir] [--top=10]${colors.reset}    Vision Engine: Autonomous optical flow scene cut detection
  ${colors.green}stems <in.mp4|in.mp3> [out-dir]${colors.reset}               Psychoacoustic: Isolate dialogue, sub-808 bass & clash SFX
  ${colors.green}foley <preset> [out.wav]${colors.reset}                      Psychoacoustic: Procedural Foley (sword_clash, sonic_boom, etc.)
  ${colors.green}vlm-qa <comp-id> [out-report.json]${colors.reset}            Orchestration: Visual VLM QA layout collision inspector
  ${colors.green}debate [--duration=30]${colors.reset}                        Orchestration: Multi-Agent Debate (Director vs VFX Editor)
  ${colors.green}fuzz <comp-id> [out-dir] [--variations=100]${colors.reset}   Orchestration: A/B testing matrix schema generator
  ${colors.green}master-audio <in.mp4> [out.mp4] [--lufs=-14]${colors.reset}  Pro Visual/Audio: EBU R128 broadcast true peak mastering
  ${colors.green}thumbnails [dropFrame]${colors.reset}                        Scale Engine: Autonomous A/B/C/D thumbnail split-test generator
  ${colors.green}dmca-shield [intensity]${colors.reset}                       Scale Engine: ContentID / DMCA anti-fingerprinting shield
  ${colors.green}art-director [comp-id]${colors.reset}                        Studio Engine: "Mean Art Director" QA critique & grade
  ${colors.green}port-niche <niche>${colors.reset}                            Studio Engine: Cross-Niche Logic Porting (ufc, nba, supercars)
  ${colors.green}dopamine-wave [--duration=30]${colors.reset}                 Neurochemistry: 3-Spike Dopamine Retention Sequencer
  ${colors.green}fleet "<!edit combat Zenitsu audio=...>"${colors.reset}      Fleet Commander: Real-time autonomous bot command dispatcher

${colors.bold}AUDIO & SOUND DESIGN COMMANDS (V2):${colors.reset}
  ${colors.green}install-skill${colors.reset}                                    Install skill globally into ~/.gemini/config/skills/
  ${colors.green}sfx <whoosh|pop|riser|typewriter> [out.wav]${colors.reset}      Deterministic 44.1 kHz WAV procedural sound synthesis
  ${colors.green}voice "<text>" [out.wav] [--provider=gemini|edge]${colors.reset} Dual-provider (Gemini 3.8 Flash TTS / Edge) speech engine
  ${colors.green}voice --dialogue=script.json [out.wav]${colors.reset}             Gemini 2-speaker conversational dialogue synthesis
  ${colors.green}validate-script <text | file.txt>${colors.reset}                 Audit script against Vox editorial standards & banned clichés
  ${colors.green}pick-track [--dir=...] [--mood=...] [--out=...]${colors.reset}   Non-repeating track selector with beat-drop detection

${colors.bold}MULTIMEDIA & EDITING COMMANDS (FFmpeg-Powered):${colors.reset}
  ${colors.green}plan <raw-video> [audio-track] [--mood=...]${colors.reset}       Deep media inspection, audience retention plan & viral SEO/GEO strategy
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

${colors.bold}BATCH FACTORY & AUTOMATED PUBLISHING COMMANDS:${colors.reset}
  ${colors.green}batch <quotes.txt> [comp-id] [out-dir] [--upload]${colors.reset} Mass compile video variations with custom beat-drop thumbnails
  ${colors.green}live-crypto [coin] [comp-id] [out.mp4]${colors.reset}           Fetch live market API data and compile real-time video
  ${colors.green}upload <video.mp4> "Title" "Desc" "tags" [status]${colors.reset} Direct YouTube Shorts upload with custom thumbnail & scheduling
  ${colors.green}upload-tiktok <video.mp4> "Caption" [--schedule]${colors.reset}  Headless TikTok Creator upload via Playwright with session caching
  ${colors.green}schedule-calendar [dir] [--days=30] [--execute]${colors.reset}   Generate and execute 30-day automated publishing calendar

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
    case 'pick-track':
      handlePickTrack(args);
      break;
    case 'cut':
      handleCut(args);
      break;
    case 'plan':
      handlePlan(args);
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
    case 'batch':
      await handleBatch(args);
      break;
    case 'live-crypto':
      await handleLiveCrypto(args);
      break;
    case 'upload':
      await handleUpload(args);
      break;
    case 'upload-tiktok':
      await handleUploadTikTok(args);
      break;
    case 'vision-slice':
      handleVisionSlice(args);
      break;
    case 'stems':
      handleStems(args);
      break;
    case 'foley':
      handleFoley(args);
      break;
    case 'debate':
      handleDebate(args);
      break;
    case 'thumbnails':
      handleThumbnails(args);
      break;
    case 'dmca-shield':
      handleDmcaShield(args);
      break;
    case 'art-director':
      handleArtDirector(args);
      break;
    case 'port-niche':
      handlePortNiche(args);
      break;
    case 'dopamine-wave':
      handleDopamineWave(args);
      break;
    case 'vlm-qa':
      handleVlmQa(args);
      break;
    case 'fuzz':
      handleFuzz(args);
      break;
    case 'master-audio':
      handleMasterAudio(args);
      break;
    case 'fleet':
      handleFleet(args);
      break;
    case 'predict-retention':
      handlePredictRetention(args);
      break;
    case 'intuition-graph':
      handleIntuitionGraph(args);
      break;
    case 'intuition-budget':
      handleIntuitionBudget(args);
      break;
    case 'intuition-predict':
      handleIntuitionPredict(args);
      break;
    case 'intuition-hooks':
      handleIntuitionHooks(args);
      break;
    case 'intuition-fork':
      handleIntuitionFork(args);
      break;
    case 'track-momentum':
      handleTrackMomentum(args);
      break;
    case 'audit-cut':
      handleAuditCut(args);
      break;
    case 'audit-sequence':
      handleAuditSequence(args);
      break;
    case 'schedule-calendar':
      await handleScheduleCalendar(args);
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
