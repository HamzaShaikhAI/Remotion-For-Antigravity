'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { applyPhoneticLexicon } = require('./phonetic-lexicon');
const { runHeuristicArtDirectorQA } = require('../src/engines/studio/mean-art-director');

// 1. Test Phonetic Lexicon
const raw = 'Visit hamzashaikhai.com to clone Remotion-For-Antigravity, KeplerBridge, and AgentForge by @HamzaShaikhAI.';
const lex = applyPhoneticLexicon(raw);
assert.equal(lex.visualText, raw);
assert.match(lex.spokenText, /hum-zah shake A\.I\. dot com/);
assert.match(lex.spokenText, /Ree-motion for Anti-gravity/);
assert.match(lex.spokenText, /Kepler Bridge/);
assert.match(lex.spokenText, /Agent Forge/);
assert.match(lex.spokenText, /by hum-zah shake A\.I\.$/);
assert.ok(lex.replacementsApplied.length >= 4);
const repoLex = applyPhoneticLexicon('github.com/HamzaShaikhAI/KeplerBridge');
assert.match(repoLex.spokenText, /github dot com slash hum-zah shake A\.I\. slash Kepler Bridge/);
console.log('PASS phonetic lexicon:', lex.spokenText);

// 2. Test 3s static pixel-delta rejection + <75% vertical viewport occupancy rejection using raw PPM frames
const tmpDir = path.join(os.tmpdir(), 'rea_qa_test_' + Date.now());
fs.mkdirSync(tmpDir, { recursive: true });

function writePpm(file, w, h, rectHeightFrac, fillVal) {
  const hdr = Buffer.from(`P6\n${w} ${h}\n255\n`);
  const pix = Buffer.alloc(w * h * 3, 5);
  const yStart = Math.floor(h * 0.1);
  const yEnd = Math.min(h, Math.floor(h * (0.1 + rectHeightFrac)));
  for (let y = yStart; y < yEnd; y++) {
    for (let x = 20; x < w - 20; x++) {
      const i = (y * w + x) * 3;
      pix[i] = fillVal;
      pix[i + 1] = 200;
      pix[i + 2] = 240;
    }
  }
  fs.writeFileSync(file, Buffer.concat([hdr, pix]));
}

try {
  const s1 = path.join(tmpDir, 's1.ppm');
  const s2 = path.join(tmpDir, 's2.ppm');
  const s3 = path.join(tmpDir, 's3.ppm');
  writePpm(s1, 108, 192, 0.35, 10);
  writePpm(s2, 108, 192, 0.35, 10);
  writePpm(s3, 108, 192, 0.35, 10);

  const badEval = runHeuristicArtDirectorQA(
    { aspectRatio: '9:16', sampleStepSec: 1.5, skipCaptionPropChecks: true },
    [s1, s2, s3]
  );
  assert.equal(badEval.passed, false);
  assert.match(badEval.critique, /DEAD AIR VIOLATION/);
  assert.match(badEval.critique, /VERTICAL VIEWPORT UNDERUTILIZATION/);
  console.log('PASS static/void rejection:', badEval.metrics);

  const d1 = path.join(tmpDir, 'd1.ppm');
  const d2 = path.join(tmpDir, 'd2.ppm');
  const d3 = path.join(tmpDir, 'd3.ppm');
  writePpm(d1, 108, 192, 0.80, 10);
  writePpm(d2, 108, 192, 0.80, 180);
  writePpm(d3, 108, 192, 0.80, 40);

  const goodEval = runHeuristicArtDirectorQA(
    { aspectRatio: '9:16', sampleStepSec: 1.5, skipCaptionPropChecks: true },
    [d1, d2, d3]
  );
  assert.equal(goodEval.passed, true);
  console.log('PASS dynamic >=75% vertical approval:', goodEval.metrics);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
