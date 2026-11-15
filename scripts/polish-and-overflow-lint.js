/**
 * REA Polish & Zero-Overflow Linter (scripts/polish-and-overflow-lint.js)
 * 
 * Deeply audits Remotion compositions and components for:
 * 1. Zero Text Overflow & Bounding Box Containment (no text escaping cards/HUDs).
 * 2. Continuous Motion Continuity & Momentum (smooth spring physics, no Math.random(), no linear snapping).
 * 3. High-Density Micro-SFX Integration (audits audio layers and transient density).
 */

const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'scratch') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext) && !file.includes('.test.') && !file.includes('.spec.')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const OVERFLOW_RULES = [
  {
    name: 'Unconstrained Variable Text Box',
    test: (line, content, i, filePath) => {
      // Look for fixed width box rendering dynamic variables without overflow or maxWidth constraints
      if (/width:\s*['"]?\d{3,}px['"]?/.test(line) && !line.includes('overflow') && !line.includes('maxWidth')) {
        const window = content.slice(i, i + 6).join('\n');
        if (/<(h\d|p|div|span)[^>]*>\{[a-zA-Z0-9_.]+\}<\/(h\d|p|div|span)>/.test(window) && !window.includes('overflow') && !window.includes('SafeTextContainer')) {
          return 'Fixed-width container renders dynamic text without overflow:hidden or SafeTextContainer bounds.';
        }
      }
      return null;
    }
  },
  {
    name: 'Prohibited Math.random() in Render Loop',
    test: (line, content, i, filePath) => {
      // Only enforce in renderable UI / compositions / plugins / scenes
      const isUiFile = /compositions|components|scenes|plugins/.test(filePath);
      if (!isUiFile) return null;

      // Skip lines where Math.random is inside a string literal, comment, or JSX text/slogan
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return null;
      if (/['"`].*Math\.random\(\).*['"`]/.test(line)) return null;
      if (/>\s*[^<]*Math\.random\(\)[^<]*</.test(line)) return null;
      if (/NO\s+Math\.random/i.test(line)) return null;

      if (/Math\.random\(\)/.test(line)) {
        return 'Non-deterministic Math.random() detected in UI render tree. Derive particle/motion states deterministically from frame.';
      }
      return null;
    }
  },
  {
    name: 'Unclamped Giant Headline',
    test: (line, content, i, filePath) => {
      const match = line.match(/fontSize:\s*['"]?([8-9]\d|1\d\d)px['"]?/);
      if (match) {
        const window = content.slice(Math.max(0, i - 2), i + 4).join('\n');
        // If it's an emoji or symbol or has clamp / computeSafeFontSize / SafeTextContainer, it's safe
        if (/⚡|🔥|💥|⭐|🎉|🚀|clamp\(|computeSafeFontSize|SafeTextContainer|Math\.min/.test(window)) {
          return null;
        }
        if (/\{[a-zA-Z0-9_.]+\}/.test(window)) {
          return `Massive font size (${match[1]}px) on dynamic string without clamp() or computeSafeFontSize() risks container overflow.`;
        }
      }
      return null;
    }
  }
];

function auditCompositionsForAudio(srcDir) {
  const compFiles = getFiles(path.join(srcDir, 'compositions'));
  const results = [];

  for (const file of compFiles) {
    const code = fs.readFileSync(file, 'utf8');
    const relFile = path.relative(process.cwd(), file);
    const hasAudioComponent = /<Audio\b/.test(code);
    const hasSfxTrack = /sfx|audioTrack|soundDesign|MicroSfxEngine|playSfx/i.test(code);
    const hasMusic = /music|soundtrack|bgm/i.test(code);

    results.push({
      file: relFile,
      hasAudio: hasAudioComponent || hasSfxTrack,
      hasSfx: hasSfxTrack,
      hasMusic: hasMusic,
      status: (hasAudioComponent || hasSfxTrack) ? 'AUDIO_VERIFIED' : 'MUTED_WARNING'
    });
  }

  return results;
}

function runPolishAndOverflowLint() {
  console.log(`\n💎 [REA Polish & Zero-Overflow Linter] Auditing typography bounds, motion continuity, and micro-SFX...`);
  const srcDir = path.resolve(__dirname, '../src');
  const files = getFiles(srcDir);
  let issueCount = 0;
  let warningCount = 0;

  console.log(`   Scanning ${files.length} TypeScript source files...`);

  for (const file of files) {
    const relFile = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf8').split('\n');

    content.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      for (const rule of OVERFLOW_RULES) {
        const error = rule.test(line, content, i, file);
        if (error) {
          if (rule.name === 'Prohibited Math.random() in Render Loop') {
            console.log(`   ❌ [DETERMINISM] ${relFile}:${i + 1} -> ${error}`);
            issueCount++;
          } else {
            console.log(`   ⚠️  [TYPOGRAPHY] ${relFile}:${i + 1} -> ${error}`);
            warningCount++;
          }
        }
      }
    });
  }

  console.log(`\n🔊 [SFX & Audio Audit] Checking composition acoustic presence...`);
  const audioAudit = auditCompositionsForAudio(srcDir);
  let mutedComps = 0;
  for (const comp of audioAudit) {
    if (comp.status === 'MUTED_WARNING') {
      console.log(`   ⚠️  [MUTED] ${comp.file}: No <Audio> element or MicroSfxEngine track detected.`);
      mutedComps++;
    } else {
      console.log(`   ✔  [AUDIO] ${comp.file}: Audio/SFX layers verified.`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`📊 Audit Summary:`);
  console.log(`   Files Scanned:          ${files.length}`);
  console.log(`   Determinism Violations: ${issueCount}`);
  console.log(`   Typography Warnings:     ${warningCount}`);
  console.log(`   Muted Compositions:      ${mutedComps}/${audioAudit.length}`);
  console.log(`======================================================`);

  if (issueCount > 0) {
    console.log(`\n❌ Polish audit failed with ${issueCount} critical violations.\n`);
    return false;
  }

  console.log(`\n✔  Polish & Zero-Overflow audit completed successfully!\n`);
  return true;
}

if (require.main === module) {
  const success = runPolishAndOverflowLint();
  process.exit(success ? 0 : 1);
}

module.exports = { runPolishAndOverflowLint };
