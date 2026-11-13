#!/usr/bin/env node

/**
 * REA CLI - Remotion Engine for Antigravity
 * Enterprise-grade orchestration, video rendering, and FFmpeg multimedia engine
 * built exclusively for Google Antigravity 2.0.
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const VERSION = '1.2.0';

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

  // 1. Try Remotion's internal compositor getExecutablePath
  for (const base of searchDirs) {
    try {
      const getExec = require(path.join(base, 'node_modules/@remotion/renderer/dist/compositor/get-executable-path'));
      if (getExec && getExec.getExecutablePath) {
        const p = getExec.getExecutablePath({ type: 'ffmpeg' });
        if (p && fs.existsSync(p)) return p;
      }
    } catch (e) {}
  }

  // 2. Direct binary lookup in node_modules/@remotion/compositor-*
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

  // 3. Try @remotion/bundler if available
  try {
    const bundler = require('@remotion/bundler');
    if (bundler && typeof bundler.getFfmpegPath === 'function') {
      const p = bundler.getFfmpegPath();
      if (p && fs.existsSync(p)) return p;
    }
  } catch (e) {}

  // 4. Fallback to system PATH
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
      {/* Cyan Channel Shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: \`translate(\${channelShift}px, 0px)\`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 2px #00f5ff)',
          opacity: isGlitching ? 0.8 : 1,
        }}
      >
        {children}
      </div>

      {/* Magenta Channel Shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: \`translate(\${-channelShift}px, \${glitchOffset}px)\`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 2px #ff0055)',
          opacity: isGlitching ? 0.8 : 1,
        }}
      >
        {children}
      </div>

      {/* Main Base Layer */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};
`,
      'index.ts': `export { GlitchTransition } from './index.tsx';\n`,
    },
  },

  'rea-particles': {
    description: 'Lightweight procedural particle and neon ember systems with mouse repulsion',
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
        let verticalOffset = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const particleScreenX = (horizontalDrift / 100) * width;
          const particleScreenY = naturalY;
          const distX = particleScreenX - mouse.x;
          const distY = particleScreenY - mouse.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            horizontalDrift += (distX / distance) * force * 12;
            verticalOffset += (distY / distance) * force * 12;
          }
        }

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: \`\${horizontalDrift}%\`,
              top: \`\${naturalY + verticalOffset}px\`,
              width: \`\${p.size}px\`,
              height: \`\${p.size}px\`,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: \`0 0 \${p.size * 3}px \${p.color}, 0 0 \${p.size * 6}px \${p.color}\`,
              opacity: p.opacity,
              transition: 'left 0.05s linear, top 0.05s linear',
            }}
          />
        );
      })}
    </div>
  );
};
`,
      'index.ts': `export { NeonEmbers } from './index.tsx';\n`,
    },
  },

  'rea-typography': {
    description: 'Kinetic text, split character animations, and typewriter reveals',
    files: {
      'index.tsx': `import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import React from 'react';

export const KineticSplitText: React.FC<{
  text: string;
  delayPerLetter?: number;
  style?: React.CSSProperties;
}> = ({ text, delayPerLetter = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split('');

  return (
    <div style={{ display: 'flex', overflow: 'hidden', ...style }}>
      {letters.map((char, index) => {
        const charFrame = Math.max(0, frame - index * delayPerLetter);
        const entranceSpring = spring({
          frame: charFrame,
          fps,
          config: { damping: 10, stiffness: 180 },
        });

        const translateY = interpolate(entranceSpring, [0, 1], [60, 0]);
        const opacity = interpolate(entranceSpring, [0, 1], [0, 1]);
        const rotate = interpolate(entranceSpring, [0, 1], [15, 0]);

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              transform: \`translateY(\${translateY}px) rotate(\${rotate}deg)\`,
              opacity,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const Typewriter: React.FC<{ text: string; speed?: number; color?: string }> = ({
  text,
  speed = 2,
  color = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.min(text.length, Math.floor(frame / speed));
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 30, color, letterSpacing: 1, minHeight: 40 }}>
      {text.slice(0, charsToShow)}
      <span style={{ opacity: showCursor ? 1 : 0, color: '#00f5ff' }}>_</span>
    </div>
  );
};
`,
      'index.ts': `export { KineticSplitText, Typewriter } from './index.tsx';\n`,
    },
  },

  'rea-mockups': {
    description: 'Responsive device frames (Browser, Smartphone, Terminal)',
    files: {
      'index.tsx': `import React from 'react';

export const BrowserMockup: React.FC<{
  title?: string;
  url?: string;
  children: React.ReactNode;
}> = ({ title = 'Antigravity Studio', url = 'https://antigravity.google.dev', children }) => {
  return (
    <div
      style={{
        width: '90%',
        maxWidth: 1200,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #334155',
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        <div
          style={{
            flex: 1,
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
      'index.ts': `export * from './index';\n`,
    },
  },
};

// Command: cut
function handleCut(args) {
  // Usage: rea cut <input-file> <start-seconds> <duration-seconds> [output-file] [--normalize]
  const inputFile = args[1];
  const startTime = args[2];
  const duration = args[3];
  const outputFile = (args[4] && !args[4].startsWith('--')) ? args[4] : 'output-cut.mp4';
  const shouldNormalize = args.includes('--normalize');

  if (!inputFile || !startTime || !duration) {
    logError('Error: Missing parameters.');
    console.log(`\n${colors.bold}Usage:${colors.reset} rea cut <input.mp4> <start_seconds> <duration_seconds> [output.mp4] [--normalize]\n`);
    console.log('Examples:');
    console.log('  rea cut raw.mp4 10 5 clip.mp4              # Fast 5-second slice at 10s (stream-copy)');
    console.log('  rea cut raw.mp4 0 15 highlight.mp4 --normalize # Cut & normalize audio (EBU R128)');
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
      // Re-encodes audio using loudnorm filter while stream-copying video for speed
      cmd = `"${ffmpegPath}" -ss ${startTime} -i "${resolvedInput}" -t ${duration} -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" "${resolvedOutput}" -y`;
    } else {
      // Standard fast stream copy without re-encoding
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

// Command: audio (Extract pure audio from video)
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

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          transform: \`scale(\${titleScale})\`,
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
import { staticFile, Img } from 'remotion';
<Img src={staticFile('logo.png')} />
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
  console.log(`
Next steps:
  cd ${projectName}
  npm install
  rea preview       # Launch live Remotion Studio
  rea render MainVideo out.mp4
  rea cut raw.mp4 10 5 clip.mp4 --normalize
`);
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

  Object.entries(plugin.files).forEach(([filename, content]) => {
    fs.writeFileSync(path.join(pluginsDir, filename), content);
  });

  logSuccess(`Installed plugin "${pluginName}" into src/plugins/${pluginName}/`);
  logInfo('Import into your component with:');
  console.log(`  ${colors.cyan}import { ... } from '../plugins/${pluginName}';${colors.reset}\n`);
}

// Command: validate
function handleValidate(compositionId, isSilent = false) {
  const issues = [];
  const projectRoot = process.cwd();

  const rootFile = path.join(projectRoot, 'src', 'Root.tsx');
  if (!fs.existsSync(rootFile)) {
    issues.push('Missing src/Root.tsx composition registration file.');
  }

  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    issues.push('Missing public/ folder for static assets.');
  }

  const srcDir = path.join(projectRoot, 'src');
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
  const issues = handleValidate(compositionId, true);
  if (issues.length > 0) {
    logError(`Aborting render due to ${issues.length} validation failure(s):`);
    issues.forEach((issue) => console.log(`  - ${colors.red}${issue}${colors.reset}`));
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
Enterprise-grade autonomous motion graphics and FFmpeg multimedia engine.

${colors.bold}USAGE:${colors.reset}
  rea <command> [arguments...]

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
