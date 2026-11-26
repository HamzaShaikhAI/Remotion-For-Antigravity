import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  Loop,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { LowerThirdSlugBadge } from '../engines/annotations/LowerThirdSlugBadge.tsx';
import {
  KineticCaptions,
  CaptionWord,
  buildWordTimingsFromNarration,
} from '../engines/captions/KineticCaptionsEngine.tsx';

export interface HybridBeat {
  startSec: number;
  tag: string;
  headline: string;
  metricLabel: string;
  metricValue: string;
  barPct: number;
  zoomScale: number;
}

export interface CaptionSegment {
  visualText: string;
  startSec: number;
  endSec: number;
}

export interface HybridProofShortProps {
  videoSrc: string;
  audioSrc: string;
  repoSlug: string;
  siteUrl: string;
  accentColor: string;
  topKicker: string;
  narration: string;
  captionSegments?: CaptionSegment[];
  captionWords?: CaptionWord[];
  beats: HybridBeat[];
}

function buildWordsFromSegments(segments: CaptionSegment[], fps: number): CaptionWord[] {
  const words: CaptionWord[] = [];
  for (const seg of segments) {
    const startF = Math.round(seg.startSec * fps);
    const endF = Math.max(startF + 1, Math.round(seg.endSec * fps));
    words.push(...buildWordTimingsFromNarration(seg.visualText, endF, startF, 0));
  }
  return words;
}

export const HYBRID_SHORT_PRESETS: Record<'kepler' | 'agentforge' | 'rea', HybridProofShortProps> = {
  kepler: {
    videoSrc: 'clips/hybrid_captures/kepler_explorer_capture.mp4',
    audioSrc: 'audio/hybrid_kepler.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/KeplerBridge',
    siteUrl: 'https://hamzashaikhai.com/keplerbridge/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_kepler',
    accentColor: '#34D399',
    topKicker: 'KEPLERBRIDGE // C++20 DX12 PROXY',
    narration:
      'NVIDIA dropped DirectX 12 on the GT 740, so I built KeplerBridge in C++20. Cold DXIL translation takes 1.12 milliseconds, dropping to 0.03 warm. Check the 86-game matrix including honest Palworld -dx11 limits at hamzashaikhai.com, and star KeplerBridge on GitHub (@HamzaShaikhAI).',
    captionSegments: [
      { startSec: 0.10, endSec: 6.38, visualText: 'NVIDIA dropped DirectX 12 on the GT 740, so I built KeplerBridge in C++20.' },
      { startSec: 6.38, endSec: 13.10, visualText: 'Cold DXIL translation takes 1.12 milliseconds, dropping to 0.03 warm.' },
      { startSec: 13.10, endSec: 22.80, visualText: 'Check the 86-game matrix including honest Palworld -dx11 limits at hamzashaikhai.com, and star KeplerBridge on GitHub (@HamzaShaikhAI).' },
    ],
    beats: [
      { startSec: 0, tag: 'BEAT 01 • GT 740', headline: 'DX12 ON 12-YEAR-OLD SILICON', metricLabel: 'COLD DXIL LOWERING', metricValue: '1.12 ms', barPct: 32, zoomScale: 1.0 },
      { startSec: 3.2, tag: 'BEAT 02 • CACHE', headline: 'WARM SHA-256 SHADER HIT', metricLabel: 'WARM LOAD SPEEDUP', metricValue: '0.03 ms (-97.3%)', barPct: 94, zoomScale: 1.03 },
      { startSec: 6.4, tag: 'BEAT 03 • MATRIX', headline: 'ELDEN RING & DMC5 PROJECTIONS', metricLabel: 'LIVE GPU SWITCHER', metricValue: 'GT 740 -> GTX 780 Ti', barPct: 78, zoomScale: 1.02 },
      { startSec: 9.6, tag: 'BEAT 04 • HONEST SPEC', headline: 'PALWORLD REQUIRES NATIVE -DX11', metricLabel: 'ZERO FAKE CLAIMS', metricValue: 'FL 11_0 MODEL A', barPct: 86, zoomScale: 1.04 },
      { startSec: 12.8, tag: 'BEAT 05 • ZERO MODS', headline: 'DROP-IN d3d12.dll SIDE-BY-SIDE', metricLabel: 'WINDOWS SYSTEM FILES', metricValue: '0 MODIFICATIONS', barPct: 95, zoomScale: 1.01 },
      { startSec: 16.0, tag: 'BEAT 06 • EXPLORE', headline: 'FILTER 86+ GAMES LIVE NOW', metricLabel: 'INTERACTIVE MATRIX', metricValue: 'hamzashaikhai.com', barPct: 82, zoomScale: 1.03 },
      { startSec: 19.2, tag: 'BEAT 07 • OPEN SOURCE', headline: 'STAR KEPLERBRIDGE ON GITHUB', metricLabel: 'MIT C++20 REPO', metricValue: 'Line 1 Link Below', barPct: 100, zoomScale: 1.0 },
    ],
  },
  agentforge: {
    videoSrc: 'clips/hybrid_captures/agentforge_portal_capture.mp4',
    audioSrc: 'audio/hybrid_af.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/AgentForge',
    siteUrl: 'https://hamzashaikhai.com/agentforge/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_agentforge',
    accentColor: '#EF4444',
    topKicker: 'AGENTFORGE // LOCAL MCP FIREWALL',
    narration:
      'Autonomous coding agents love running git push --force until a permission firewall stops them. AgentForge enforces five cryptographic approval tiers, OS-encrypted DPAPI vaults, and 508 verified Vitest security checks across 38 bridges and 56 MCP presets at hamzashaikhai.com (@HamzaShaikhAI).',
    captionSegments: [
      { startSec: 0.10, endSec: 5.40, visualText: 'Autonomous coding agents love running git push --force until a permission firewall stops them.' },
      { startSec: 5.40, endSec: 21.40, visualText: 'AgentForge enforces five cryptographic approval tiers, OS-encrypted DPAPI vaults, and 508 verified Vitest security checks across 38 bridges and 56 MCP presets at hamzashaikhai.com (@HamzaShaikhAI).' },
    ],
    beats: [
      { startSec: 0, tag: 'BEAT 01 • THREAT', headline: 'STOP ROGUE AI REPO WIPES', metricLabel: 'DESTRUCTIVE GATE', metricValue: 'git push --force BLOCKED', barPct: 92, zoomScale: 1.0 },
      { startSec: 3.0, tag: 'BEAT 02 • POLICY', headline: '5-TIER CRYPTOGRAPHIC GATES', metricLabel: 'APPROVAL HASH', metricValue: 'SHA-256 CHAIN', barPct: 84, zoomScale: 1.03 },
      { startSec: 6.0, tag: 'BEAT 03 • VAULT', headline: 'DPAPI + AES-256 SECRET ISOLATION', metricLabel: 'ZERO GIT LEAKS', metricValue: 'ENV SANDBOX', barPct: 96, zoomScale: 1.02 },
      { startSec: 9.0, tag: 'BEAT 04 • COVERAGE', headline: '38 BRIDGES & 56 MCP PRESETS', metricLabel: 'VERIFIED SUITES', metricValue: '508 / 508 PASS', barPct: 100, zoomScale: 1.04 },
      { startSec: 12.0, tag: 'BEAT 05 • RUNTIME', headline: 'LOCAL-FIRST ANTIGRAVITY GUARD', metricLabel: 'CAPABILITY TRUTH', metricValue: 'PRE-FLIGHT VERIFIED', barPct: 88, zoomScale: 1.01 },
      { startSec: 15.0, tag: 'BEAT 06 • AUDIT', headline: 'HUMAN APPROVAL CHECKPOINTS', metricLabel: 'ZERO SILENT PUSH', metricValue: 'EXPLICIT SIGN-OFF', barPct: 94, zoomScale: 1.03 },
      { startSec: 18.0, tag: 'BEAT 07 • OPEN SOURCE', headline: 'CLONE & TEST IN 3 COMMANDS', metricLabel: 'MIT LICENSED', metricValue: 'hamzashaikhai.com', barPct: 100, zoomScale: 1.0 },
    ],
  },
  rea: {
    videoSrc: 'clips/hybrid_captures/rea_gallery_capture.mp4',
    audioSrc: 'audio/hybrid_rea.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/Remotion-For-Antigravity',
    siteUrl: 'https://hamzashaikhai.com/remotion/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_rea',
    accentColor: '#38BDF8',
    topKicker: 'REA v2.4 // REACT VIDEO COMPILER',
    narration:
      'Pixel diffusion warps real code, so I replaced After Effects with Remotion-For-Antigravity. An AI Art Director rejects any 9:16 Short under 75% vertical fill or frozen for 3 seconds, composites mobile browser captures, and masters to -14 LUFS at hamzashaikhai.com (@HamzaShaikhAI).',
    captionSegments: [
      { startSec: 0.10, endSec: 6.00, visualText: 'Pixel diffusion warps real code, so I replaced After Effects with Remotion-For-Antigravity.' },
      { startSec: 6.00, endSec: 20.85, visualText: 'An AI Art Director rejects any 9:16 Short under 75% vertical fill or frozen for 3 seconds, composites mobile browser captures, and masters to -14 LUFS at hamzashaikhai.com (@HamzaShaikhAI).' },
    ],
    beats: [
      { startSec: 0, tag: 'BEAT 01 • UPGRADE', headline: 'NO MORE FROZEN SLIDES', metricLabel: 'ART DIRECTOR QA', metricValue: '< 3.0s PIXEL DELTA', barPct: 90, zoomScale: 1.0 },
      { startSec: 2.9, tag: 'BEAT 02 • HYBRID', headline: 'OFFTHREADVIDEO OBS COMPOSITOR', metricLabel: '430x932 MOBILE SYNC', metricValue: 'ZERO CROP CAPTURE', barPct: 96, zoomScale: 1.03 },
      { startSec: 5.8, tag: 'BEAT 03 • LEXICON', headline: 'PHONETIC TTS PRONUNCIATION', metricLabel: 'hum-zah shake A.I.', metricValue: 'ZERO GARBLED URLS', barPct: 86, zoomScale: 1.02 },
      { startSec: 8.7, tag: 'BEAT 04 • VIEWPORT', headline: '80%+ VERTICAL SHORTS FILL', metricLabel: 'SAFE ZONE LOCK', metricValue: '360px+ BOTTOM CLEAR', barPct: 94, zoomScale: 1.04 },
      { startSec: 11.6, tag: 'BEAT 05 • MASTER', headline: 'EBU R128 -14 LUFS NORMALIZED', metricLabel: 'ZERO SILENT TAIL', metricValue: '< 0.3s END PAD', barPct: 89, zoomScale: 1.01 },
      { startSec: 14.5, tag: 'BEAT 06 • BADGES', headline: 'SYNCED KARAOKE CAPTIONS & QR', metricLabel: 'UTM ATTRIBUTION', metricValue: 'hamzashaikhai.com', barPct: 97, zoomScale: 1.03 },
      { startSec: 17.4, tag: 'BEAT 07 • GALLERY', headline: '1-CLICK CLI TEMPLATES LIVE', metricLabel: 'MIT OPEN SOURCE', metricValue: 'Line 1 Link Below', barPct: 100, zoomScale: 1.0 },
    ],
  },
};

export const HybridProofShort: React.FC<Partial<HybridProofShortProps> & Record<string, unknown>> = ({
  videoSrc = HYBRID_SHORT_PRESETS.kepler.videoSrc,
  audioSrc = HYBRID_SHORT_PRESETS.kepler.audioSrc,
  repoSlug = HYBRID_SHORT_PRESETS.kepler.repoSlug,
  siteUrl = HYBRID_SHORT_PRESETS.kepler.siteUrl,
  accentColor = HYBRID_SHORT_PRESETS.kepler.accentColor,
  topKicker = HYBRID_SHORT_PRESETS.kepler.topKicker,
  narration = HYBRID_SHORT_PRESETS.kepler.narration,
  captionSegments,
  captionWords,
  beats = HYBRID_SHORT_PRESETS.kepler.beats,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sec = frame / fps;
  const totalSec = durationInFrames / fps;

  // Pick active beat every ~2.9-3.2s so headline, bar, and phone scale shift continuously
  let activeIdx = 0;
  for (let i = 0; i < beats.length; i++) {
    if (sec >= beats[i].startSec) activeIdx = i;
  }
  const beat = beats[activeIdx];
  const beatStartFrame = Math.round(beat.startSec * fps);
  const beatSpring = spring({
    frame: Math.max(0, frame - beatStartFrame),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Gentle vertical motion + subtle breathing without cropping mobile capture edges
  const prevBar = activeIdx > 0 ? beats[activeIdx - 1].barPct : 25;
  const barWidth = interpolate(beatSpring, [0, 1], [prevBar, beat.barPct]);
  const gentleBreath = 1 + Math.max(0, Math.sin(sec * 1.4)) * 0.015;
  const continuousPanY = Math.cos(sec * 1.15) * 8;
  const videoLoopFrames = 300;

  // Background ambient gradient sweep so pixels continuously evolve across 100% height
  const sweepX = 25 + ((frame * 3.2) % 60);
  const sweepY = 20 + Math.abs(Math.sin(sec * 0.85)) * 55;

  const syncedWords =
    captionWords && captionWords.length > 0
      ? captionWords
      : captionSegments && captionSegments.length > 0
        ? buildWordsFromSegments(captionSegments, fps)
        : buildWordTimingsFromNarration(narration, durationInFrames, 3, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050811', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Dynamic sweeping neon background glow so ambient pixels stay alive */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${sweepX}% ${sweepY}%, ${accentColor}44 0%, rgba(5,8,17,0.95) 68%)`,
        }}
      />

      {/* Audio: Phonetic TTS voiceover + soft underscore beat matched to tight duration */}
      <Audio src={staticFile(audioSrc)} volume={1.0} />
      <Loop durationInFrames={durationInFrames}>
        <Audio
          src={staticFile('audio/music_library/minimal_tech_pulse_125bpm.wav')}
          volume={(f) => (f > durationInFrames - 12 ? interpolate(f, [durationInFrames - 12, durationInFrames], [0.12, 0.0], { extrapolateRight: 'clamp' }) : 0.12)}
        />
      </Loop>

      {/* Top Safe Header + Kinetic 42px Headline */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: '84px 48px 14px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              background: '#0F172A',
              border: `2px solid ${accentColor}`,
              color: accentColor,
              padding: '7px 16px',
              borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {topKicker}
          </span>
          <span
            style={{
              background: accentColor,
              color: '#030712',
              padding: '7px 15px',
              borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {beat.tag}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 42, // Locked inside 36-48px kinetic typography band
            lineHeight: 1.08,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 6px 24px rgba(0,0,0,0.9)',
            transform: `translateY(${interpolate(beatSpring, [0, 1], [12, 0])}px)`,
          }}
        >
          {beat.headline}
        </h1>

        {/* Live Animated Metric & Timeline Progress Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid rgba(148, 163, 184, 0.25)',
            borderRadius: 16,
            padding: '14px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: 20, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              {beat.metricLabel}
            </span>
            <span style={{ color: accentColor, fontSize: 22, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
              {beat.metricValue}
            </span>
          </div>
          <div style={{ width: '100%', height: 14, background: '#1E293B', borderRadius: 7, overflow: 'hidden' }}>
            <div
              style={{
                width: `${barWidth}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accentColor}, #FACC15)`,
                borderRadius: 7,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 5, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (sec / totalSec) * 100)}%`, height: '100%', background: accentColor }} />
            </div>
            <span style={{ color: '#CBD5E1', fontSize: 15, fontFamily: 'JetBrains Mono, monospace' }}>
              {sec.toFixed(1)}s / {totalSec.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Stage: Uncropped 430x932 Mobile Capture + Right Telemetry Panel (clears 140px Shorts right icons) */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '4px 140px 0 44px',
          height: 878,
          display: 'flex',
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        {/* Left: Crisp 430x932 Mobile Bezel with ZERO horizontal cropping */}
        <div
          style={{
            width: 405,
            height: '100%',
            borderRadius: 28,
            overflow: 'hidden',
            border: `3px solid ${accentColor}`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.85), 0 0 28px ${accentColor}33`,
            background: '#030712',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${gentleBreath}) translateY(${continuousPanY}px)`,
              transformOrigin: '50% 50%',
            }}
          >
            <Loop durationInFrames={videoLoopFrames}>
              <OffthreadVideo
                src={staticFile(videoSrc)}
                muted
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Loop>
          </div>
        </div>

        {/* Right: Synchronized Beat Telemetry Stack (fits cleanly inside left 896px safe boundary) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          {beats.map((b, i) => {
            const isCurrent = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <div
                key={b.tag}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 16,
                  background: isCurrent ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.55)',
                  border: isCurrent ? `2px solid ${accentColor}` : '1px solid rgba(148, 163, 184, 0.16)',
                  boxShadow: isCurrent ? `0 0 24px ${accentColor}33` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  opacity: isCurrent ? 1 : isPast ? 0.72 : 0.45,
                  transform: `scale(${isCurrent ? 1.02 : 0.98})`,
                }}
              >
                <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: isCurrent ? accentColor : '#94A3B8' }}>
                  {b.tag}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginTop: 4 }}>
                  {b.metricValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synced Karaoke Captions anchored cleanly right below the focal visual (above LowerThirdSlugBadge) */}
      <KineticCaptions
        words={syncedWords}
        activeColor={accentColor}
        inactiveColor="#E2E8F0"
        pillBgColor={`${accentColor}26`}
        fontSize={36}
        bottomOffset={515}
        rightSafeMargin={140}
        wordsPerWindow={4}
        maxWidth={896}
      />

      {/* Safe-Zone Compliant QR + Lower-Third Repo Slug Card (>=360px bottom, >=140px right clearance) */}
      <LowerThirdSlugBadge
        repositorySlug={repoSlug}
        fullUrl={siteUrl}
        headline="VERIFIED LIVE BUILD"
        subline="Scan QR or click Line 1 link in description"
        startFrame={18}
        durationInFrames={Math.max(120, durationInFrames - 18)}
        positionBottom={360}
        rightSafeMargin={140}
        accentColor={accentColor}
      />
    </AbsoluteFill>
  );
};
