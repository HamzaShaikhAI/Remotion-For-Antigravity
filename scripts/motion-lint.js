/**
 * REA Deterministic Motion Linter (scripts/motion-lint.js)
 * Enforces MOTION.md architectural standards across all TypeScript and CSS files.
 */

const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.ts', '.tsx', '.css']) {
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
      if (exts.includes(ext) && !file.includes('motion.ts') && !file.includes('motion-lint')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const rules = [
  {
    re: /(transition|animation)\s*:[^;]*cubic-bezier\(/i,
    msg: 'Use named motion token (tokens.ease.* or var(--ease-*)), not raw inline cubic-bezier curves in transitions/animations',
  },
  {
    re: /transition:\s*all\b/,
    msg: 'Prohibited "transition: all" causes unpredictable layout thrashing. Animate explicit transform/opacity properties.',
  },
];

function runMotionLint() {
  console.log(`\n🔍 [REA Motion Linter] Scanning codebase against MOTION.md specification...`);
  const files = getFiles(path.resolve(__dirname, '../src'));
  let failureCount = 0;

  for (const file of files) {
    const relFile = path.relative(process.cwd(), file);
    const lines = fs.readFileSync(file, 'utf8').split('\n');

    lines.forEach((line, i) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) return;

      for (const { re, msg } of rules) {
        if (re.test(line) && !line.includes('var(--') && !line.includes('motionTokens')) {
          console.log(`   ❌ ${relFile}:${i + 1} -> ${msg}`);
          failureCount++;
        }
      }
    });
  }

  if (failureCount > 0) {
    console.log(`\n⚠️  Motion linter found ${failureCount} infractions of MOTION.md rules.\n`);
    return false;
  } else {
    console.log(`\n✔  All ${files.length} source files pass MOTION.md quality standards!\n`);
    return true;
  }
}

if (require.main === module) {
  const success = runMotionLint();
  process.exit(success ? 0 : 1);
}

module.exports = { runMotionLint };
