const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpeg = path.join(process.cwd(), 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const dirs = [
  path.join(process.cwd(), 'public', 'clips'),
  path.join(process.cwd(), 'anime-phonk-showcase', 'public', 'clips')
];

dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

const colors = ['#050814', '#111827', '#1e1b4b', '#030712', '#0f172a'];

for (let i = 1; i <= 5; i++) {
  const c = colors[i - 1];
  const out1 = path.join(dirs[0], `clip${i}.mp4`);
  const out2 = path.join(dirs[1], `clip${i}.mp4`);
  if (!fs.existsSync(out1)) {
    const cmd = `"${ffmpeg}" -f lavfi -i color=c=${c}:s=1080x1920:d=1 -pix_fmt yuv420p "${out1}" -y`;
    execSync(cmd, { stdio: 'inherit' });
    fs.copyFileSync(out1, out2);
  }
}
console.log('Successfully generated placeholder clips 1-5');
