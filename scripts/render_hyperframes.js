const { spawn } = require('child_process');
const path = require('path');

const ffmpegDir = path.resolve('bin', 'ffmpeg');

const env = {
  ...process.env,
  PATH: `${ffmpegDir};${process.env.PATH}`,
};

const cwd = path.resolve('hyperframes-reel');

console.log('Starting HyperFrames Render using Gyan FFmpeg 6.1.1 + Remotion FFprobe...');

const proc = spawn('npx.cmd', ['--yes', 'hyperframes@0.9.46', 'render', '-o', 'renders/uc1-motion-reel.mp4', '-f', '60'], {
  cwd,
  env,
  stdio: 'inherit',
  shell: true,
});

proc.on('close', (code) => {
  console.log('HyperFrames render completed with exit code:', code);
  process.exit(code || 0);
});
