'use strict';
const fs = require('node:fs');
const { execFileSync, execSync } = require('node:child_process');
const ffmpeg = require('ffmpeg-static');

const jobs = [
  ['HybridShortKepler', 'out/hybrid_kepler_short.mp4'],
  ['HybridShortAgentForge', 'out/hybrid_agentforge_short.mp4'],
  ['HybridShortRea', 'out/hybrid_rea_short.mp4'],
];

for (const [comp, outPath] of jobs) {
  if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 100000) {
    console.log(`\n=== Rendering ${comp} -> ${outPath} ===`);
    execSync(`node bin/rea-cli.js render ${comp} ${outPath} --concurrency=2 --force`, { stdio: 'inherit' });
  } else {
    console.log(`\n=== Using existing render ${outPath} ===`);
  }
  console.log(`\n=== Art Director Pixel-Delta QA on ${outPath} ===`);
  execSync(`node bin/rea-cli.js art-director --video=${outPath}`, { stdio: 'inherit' });
  const checkPng = outPath.replace(/\.mp4$/, '_check.png');
  execFileSync(ffmpeg, ['-y', '-ss', '4', '-i', outPath, '-frames:v', '1', checkPng], { stdio: 'pipe' });
  console.log(`Extracted visual check frame -> ${checkPng}`);
}
