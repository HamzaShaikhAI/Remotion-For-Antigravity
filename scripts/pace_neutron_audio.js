const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobePath = path.resolve('bin', 'ffmpeg', 'ffprobe.exe');
const ffmpegPath = path.resolve('bin', 'ffmpeg', 'ffmpeg.exe');
const rawDir = path.resolve('public', 'audio', 'neutron_raw');
const pacedDir = path.resolve('public', 'audio', 'neutron_paced');

if (!fs.existsSync(pacedDir)) {
  fs.mkdirSync(pacedDir, { recursive: true });
}

// 1. Get raw durations
const lines = [
  { id: 'neutron_01', text: "Imagine floating in deep space holding an ordinary kitchen teaspoon. Harmless, right? Well, dip that spoon into a neutron star, and things get terrifying." },
  { id: 'neutron_02', text: "Because a single teaspoon of this material weighs roughly five billion kilograms. That is the entire mass of Mount Everest, packed into five milliliters." },
  { id: 'neutron_03', text: "How can anything be this dense? It all starts when a massive star runs out of fuel. Without outward nuclear pressure, gravity violently crushes the entire core inward." },
  { id: 'neutron_04', text: "In everyday atoms, ninety-nine percent of the volume is completely empty space. But here, electrons are hammered directly into protons, fusing into solid neutrons." },
  { id: 'neutron_05', text: "The result is a city-sized atomic nucleus spinning hundreds of times per second, with surface gravity two hundred billion times stronger than Earth." },
  { id: 'neutron_06', text: "If you dropped that teaspoon from just one meter high, it would strike the surface at millions of kilometers per hour, unleashing the fury of a nuclear bomb." },
  { id: 'neutron_07', text: "In this bizarre cosmic graveyard, the rules of ordinary matter completely shatter. The universe isn't just strange—it's denser than we can possibly imagine." }
];

let rawTotal = 0;
const rawStats = lines.map((item) => {
  const filePath = path.join(rawDir, `${item.id}.wav`);
  const cmd = `"${ffprobePath}" -v error -show_entries format=duration -of default=nw=1:nk=1 "${filePath}"`;
  const dur = parseFloat(execSync(cmd).toString().trim());
  rawTotal += dur;
  return { ...item, rawDur: dur };
});

console.log(`Raw Total Duration: ${rawTotal.toFixed(2)}s`);

// Target total narration length: ~57.5 seconds (leaving 2.5s outro buffer for 60.0s @ 60 FPS = 3600 frames)
const targetTotal = 57.5;
const tempo = rawTotal / targetTotal;
console.log(`Applying speed factor: ${tempo.toFixed(3)}x`);

let currentFrame = 0;
const fps = 60;
const timeline = [];

rawStats.forEach((item, idx) => {
  const inPath = path.join(rawDir, `${item.id}.wav`);
  const outPath = path.join(pacedDir, `${item.id}.wav`);
  
  // Apply atempo with high-quality resampling
  execSync(`"${ffmpegPath}" -y -i "${inPath}" -filter:a "atempo=${tempo.toFixed(4)}" "${outPath}"`);
  
  const actualDur = parseFloat(execSync(`"${ffprobePath}" -v error -show_entries format=duration -of default=nw=1:nk=1 "${outPath}"`).toString().trim());
  const durFrames = Math.round(actualDur * fps);
  
  timeline.push({
    id: item.id,
    start: currentFrame,
    dur: durFrames,
    durSec: actualDur,
    text: item.text,
  });
  
  currentFrame += durFrames;
});

const totalFrames = currentFrame;
console.log(`Paced Total: ${totalFrames} frames (${(totalFrames / fps).toFixed(2)}s @ ${fps}fps)`);
fs.writeFileSync(path.join(pacedDir, 'timeline.json'), JSON.stringify(timeline, null, 2));
console.log('Saved timeline.json to public/audio/neutron_paced/');
