#!/usr/bin/env node

/**
 * create-remotion-antigravity
 * One-click scaffolding tool for Remotion for Antigravity (REA) video studios.
 */

const fs = require('fs');
const path = require('path');

const BANNER = `
\x1b[36m  ██████╗ ███████╗ █████╗ 
  ██╔══██╗██╔════╝██╔══██╗
  ██████╔╝█████╗  ███████║
  ██╔══██╗██╔══╝  ██╔══██║
  ██║  ██║███████╗██║  ██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝\x1b[0m
  \x1b[1mRemotion for Antigravity (REA)\x1b[0m
  \x1b[90mAutonomous Video Studio Scaffolder\x1b[0m
`;

function printHelp() {
  console.log(BANNER);
  console.log(`
Usage:
  npx create-remotion-antigravity <project-directory> [options]

Arguments:
  <project-directory>    The name of the directory to create for your studio project.

Options:
  --template=<starter|anime-phonk>   Choose a project template (default: starter)
  -h, --help                         Show this help message and exit
  -v, --version                      Show version

Examples:
  npx create-remotion-antigravity my-video-studio
  npx create-remotion-antigravity phonk-studio --template=anime-phonk
`);
}

function run() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    console.log(`create-remotion-antigravity v${pkg.version}`);
    process.exit(0);
  }

  const projectDir = args.find(a => !a.startsWith('-')) || 'my-rea-studio';
  const templateFlag = args.find(a => a.startsWith('--template='))?.split('=')[1] || 'starter';

  const targetPath = path.resolve(process.cwd(), projectDir);

  console.log(BANNER);
  console.log(`\x1b[34m⚡ Scaffolding Remotion + Antigravity Studio in:\x1b[0m \x1b[1m${targetPath}\x1b[0m\n`);

  if (fs.existsSync(targetPath)) {
    const existing = fs.readdirSync(targetPath);
    if (existing.length > 0) {
      console.error(`\x1b[31m✖ Error: Target directory '${projectDir}' exists and is not empty.\x1b[0m`);
      process.exit(1);
    }
  } else {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // 1. package.json
  const packageJson = {
    name: path.basename(projectDir).toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    version: "1.0.0",
    private: true,
    description: "Remotion for Antigravity Video Studio",
    scripts: {
      start: "remotion preview",
      build: "remotion render src/Root.tsx Main out.mp4",
      "build:shorts": "remotion render src/Root.tsx Shorts out-shorts.mp4",
      upgrade: "remotion upgrade"
    },
    dependencies: {
      "@google/genai": "^3.3.0",
      "@remotion/cli": "^4.0.0",
      "@remotion/media-utils": "^4.0.543",
      "@remotion/zod-types": "^4.0.543",
      "antigravity-remotion-skills": "^2.4.0-rc.1",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "remotion": "^4.0.0",
      "zod": "^4.6.7"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "typescript": "^5.0.0"
    }
  };

  fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');

  // 2. tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      jsx: "react-jsx",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ["src", "remotion.config.ts"]
  };
  fs.writeFileSync(path.join(targetPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf8');

  // 3. remotion.config.ts
  const remotionConfig = `import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
`;
  fs.writeFileSync(path.join(targetPath, 'remotion.config.ts'), remotionConfig, 'utf8');

  // 4. .gitignore
  const gitignore = `node_modules/
.remotion/
out*.mp4
out*.webm
*.log
.DS_Store
`;
  fs.writeFileSync(path.join(targetPath, '.gitignore'), gitignore, 'utf8');

  // 5. Source files
  const srcDir = path.join(targetPath, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  // src/index.ts
  const indexTs = `import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
`;
  fs.writeFileSync(path.join(srcDir, 'index.ts'), indexTs, 'utf8');

  // src/Root.tsx
  const rootTsx = `import React from 'react';
import { Composition } from 'remotion';
import { MainScene } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape YouTube / Broadcast Composition */}
      <Composition
        id="Main"
        component={MainScene}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Remotion for Antigravity",
          subtitle: "#1 Autonomous AI Video Engine",
        }}
      />

      {/* 9:16 Vertical Viral Shorts / Reels Composition */}
      <Composition
        id="Shorts"
        component={MainScene}
        durationInFrames={360}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Viral 9:16 Engine",
          subtitle: "Built with REA Autonomous Agent",
        }}
      />
    </>
  );
};
`;
  fs.writeFileSync(path.join(srcDir, 'Root.tsx'), rootTsx, 'utf8');

  // src/Composition.tsx
  const compositionTsx = `import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MainSceneProps {
  title: string;
  subtitle: string;
}

export const MainScene: React.FC<MainSceneProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Deterministic spring animation (No Math.random())
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 100,
    },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a12',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          transform: \`scale(\${scale})\`,
          opacity,
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            fontSize: '1rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            marginBottom: '1rem',
            fontWeight: 700,
          }}
        >
          Google Antigravity 2.0
        </div>
        <h1
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            margin: 0,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '1.75rem',
            color: '#94a3b8',
            marginTop: '1.25rem',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(srcDir, 'Composition.tsx'), compositionTsx, 'utf8');

  // 6. Public assets folder
  const publicDir = path.join(targetPath, 'public');
  fs.mkdirSync(publicDir, { recursive: true });

  // 7. README.md
  const readmeContent = `# ${path.basename(projectDir)}

> Generated by **create-remotion-antigravity** — The Autonomous Video Studio for Google Antigravity 2.0.

## 🚀 Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Launch interactive preview in browser
npm start

# 3. Render 16:9 Master Landscape video
npm run build

# 4. Render 9:16 Viral Shorts / Reels video
npm run build:shorts
\`\`\`

## 🧠 Using with Antigravity AI Agents

Ask Antigravity in this directory:
> *"Create a 30s cinematic tech documentary about our architecture with animated lower thirds and audio-reactive waveforms."*

Or invoke the REA CLI directly:
\`\`\`bash
npx rea --help
\`\`\`
`;
  fs.writeFileSync(path.join(targetPath, 'README.md'), readmeContent, 'utf8');

  console.log(`\x1b[32m✔ Studio workspace initialized successfully!\x1b[0m\n`);
  console.log(`Next steps to create your first video:`);
  console.log(`  \x1b[36mcd ${projectDir}\x1b[0m`);
  console.log(`  \x1b[36mnpm install\x1b[0m`);
  console.log(`  \x1b[36mnpm start\x1b[0m         \x1b[90m# Open interactive Remotion Studio preview\x1b[0m`);
  console.log(`  \x1b[36mnpm run build\x1b[0m     \x1b[90m# Render production MP4 master\x1b[0m\n`);
}

run();
