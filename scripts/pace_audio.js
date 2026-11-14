const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const srcDir = path.resolve(__dirname, '../public/audio/seismo');
const outDir = path.resolve(__dirname, '../public/audio/seismo_paced');
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.wav'));
let currentFrame = 0;
const timeline = [];

for (const file of files) {
  const inPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);
  
  execSync(`.\\bin\\ffmpeg\\ffmpeg.exe -y -i "${inPath}" -filter:a "atempo=1.26" "${outPath}"`, { stdio: 'pipe' });
  
  const probe = execSync(`node bin/rea-cli.js probe "${outPath}"`, { encoding: 'utf8' });
  const m = probe.match(/Duration:\s+([0-9.]+)s/);
  const dur = m ? parseFloat(m[1]) : 0;
  const frames = Math.round(dur * 30);
  
  timeline.push({
    file: `audio/seismo_paced/${file}`,
    startFrame: currentFrame,
    durationFrames: frames,
    durationSeconds: dur
  });
  
  currentFrame += frames;
}

console.table(timeline);
console.log('Total Master Duration:', currentFrame, 'frames @ 30fps =', (currentFrame / 30).toFixed(2), 'seconds');
fs.writeFileSync(path.join(outDir, 'timeline.json'), JSON.stringify(timeline, null, 2));
