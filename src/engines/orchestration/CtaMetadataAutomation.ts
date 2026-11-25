import fs from 'fs';
import path from 'path';

export interface ChapterTimestamp {
  timecode: string;
  frame: number;
  title: string;
  description?: string;
}

export interface CtaMetadataPackage {
  compositionId: string;
  repositoryUrl: string;
  utmTaggedUrl: string;
  line1YouTubeDescription: string;
  highCtrTitles: string[];
  chapters: ChapterTimestamp[];
  pinnedComment: string;
  fullDescription: string;
  generatedAt: string;
}

export interface CtaAutomationOptions {
  compositionId?: string;
  repositorySlug?: string;
  campaignName?: string;
  customChapters?: ChapterTimestamp[];
  outDir?: string;
}

export class CtaMetadataAutomation {
  /**
   * Generates production-grade YouTube publication copy, UTM tracking links,
   * high-CTR curiosity titles, and pinned comments with chapter markers.
   */
  static generatePackage(options: CtaAutomationOptions = {}): CtaMetadataPackage {
    const {
      compositionId = 'ReaSystemArchitectureShowcase',
      repositorySlug = 'HamzaShaikhAI/Remotion-For-Antigravity',
      campaignName = 'rea_showcase',
      outDir = path.resolve(process.cwd(), 'public/metadata'),
    } = options;

    const repositoryUrl = `https://github.com/${repositorySlug}`;
    const utmTaggedUrl = `${repositoryUrl}?utm_source=youtube&utm_medium=video&utm_campaign=${campaignName}`;

    // Line 1 YouTube link rule: Clickable link MUST be on line 1 before "Show more" fold
    const line1YouTubeDescription = `⚡ Explore the Code & Architecture: ${utmTaggedUrl}`;

    // High-CTR titles targeting curiosity gaps & technical authority
    const highCtrTitles = [
      `How I Built an Autonomous Video Engine with Remotion & Antigravity (REA)`,
      `Stop Using Slide Generators: Inside Remotion's 11-Engine Video Architecture`,
      `The Video Pipeline That Generates Broadcast-Grade Motion Code in 60s`,
    ];

    // Chapters derived from standard 45s showcase acts
    const chapters: ChapterTimestamp[] = options.customChapters || [
      { timecode: '00:00', frame: 0, title: 'VisionOS Glassmorphic Pipeline Overview' },
      { timecode: '00:07', frame: 450, title: 'The 11 Specialized Motion Engines' },
      { timecode: '00:18', frame: 1080, title: 'SafeTextContainer & Kinetic Typography' },
      { timecode: '00:28', frame: 1710, title: 'Zero-Error CI Validation & Terminal Proof' },
      { timecode: '00:37', frame: 2250, title: 'Open Source CLI & Instant Quickstart' },
    ];

    const chaptersText = chapters
      .map((c) => `${c.timecode} - ${c.title}`)
      .join('\n');

    // Pinned Comment with algorithm question prompt, chapters, and CLI one-liner
    const pinnedComment = `🚀 Star the repository & run the pipeline locally:
${utmTaggedUrl}

📌 Quickstart in your terminal:
\`\`\`bash
git clone ${repositoryUrl}.git
cd ${repositorySlug.split('/')[1] || 'repo'}
npm install
node bin/rea-cli.js preview
\`\`\`

⏱️ CHAPTERS:
${chaptersText}

💬 QUESTION FOR ENGINEERS: Which of the 11 engines would you use first in your production stack—the Mean Art Director QA loop, or the Hybrid Screen Compositor? Let me know below! 👇`;

    // Full YouTube Description
    const fullDescription = `${line1YouTubeDescription}

Full Documentation & Interactive Demos:
👉 Website: https://hamzashaikhai.com
👉 GitHub Repository: ${utmTaggedUrl}

In this video, we break down the Remotion Engine Architecture (REA v2.4.0) inside Google Antigravity—a multi-agent motion design pipeline combining VisionOS glassmorphic bento grids, spring-driven camera motion, hybrid screen capture compositing, and EBU R128 audio mastering.

━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ TIMESTAMPS:
${chaptersText}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ TECH STACK & ENGINES:
• Remotion 4.0 & React 18
• OffthreadVideo Hybrid Screen Compositor
• Mean Art Director Headless QA (<3s Visual-Change Gate)
• EBU R128 True Peak Audio Mastering (-14 LUFS)
• JetBrains Mono & Plus Jakarta Sans Typography System

━━━━━━━━━━━━━━━━━━━━━━━━━━
Connect & Follow:
• GitHub: ${repositoryUrl}
• Portfolio: https://hamzashaikhai.com

#Remotion #Antigravity #MotionDesign #React #TypeScript #WebDev #OpenSource`;

    const pkg: CtaMetadataPackage = {
      compositionId,
      repositoryUrl,
      utmTaggedUrl,
      line1YouTubeDescription,
      highCtrTitles,
      chapters,
      pinnedComment,
      fullDescription,
      generatedAt: new Date().toISOString(),
    };

    // Write to public/metadata/
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const jsonPath = path.join(outDir, `${compositionId}_cta_metadata.json`);
    const mdPath = path.join(outDir, `${compositionId}_cta_metadata.md`);

    fs.writeFileSync(jsonPath, JSON.stringify(pkg, null, 2), 'utf-8');

    const mdContent = `# YouTube & Social Publication Package: ${compositionId}

## 📌 Line 1 YouTube Description (Before the fold):
\`\`\`
${line1YouTubeDescription}
\`\`\`

## 🎯 Recommended High-CTR Titles:
${highCtrTitles.map((t, i) => `${i + 1}. **${t}**`).join('\n')}

## 💬 Pinned Comment (Algorithm Velocity Hook):
\`\`\`
${pinnedComment}
\`\`\`

## 📝 Full YouTube Description:
\`\`\`
${fullDescription}
\`\`\`

*Generated automatically by REA CtaMetadataAutomation at ${pkg.generatedAt}*
`;

    fs.writeFileSync(mdPath, mdContent, 'utf-8');

    return pkg;
  }
}
