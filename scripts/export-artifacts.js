const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpeg = path.join(process.cwd(), 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const artDir = 'C:/Users/win10/.gemini/antigravity/brain/e910c004-f718-4bd9-b9d2-fc936e457501';

// Copy MP4 and still poster to artifacts
fs.copyFileSync('out-anime-phonk.mp4', path.join(artDir, 'out-anime-phonk.mp4'));
fs.copyFileSync('still-drop-205.jpeg', path.join(artDir, 'anime-phonk-poster.jpeg'));
fs.copyFileSync('still-drop-205.jpeg', 'assets/anime-phonk-poster.jpeg');

// Generate lightweight preview GIF (width 360, -r 12)
const outGif = 'assets/anime-phonk-preview.gif';
const cmd = `"${ffmpeg}" -i out-anime-phonk.mp4 -r 12 -vf scale=360:-1 -y "${outGif}"`;
execSync(cmd, { stdio: 'inherit' });
fs.copyFileSync(outGif, path.join(artDir, 'anime-phonk-preview.gif'));
console.log('Artifacts and preview GIF generated successfully!');
