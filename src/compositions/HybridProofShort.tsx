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

export interface HybridBeat {
  startSec: number;
  tag: string;
  headline: string;
  metricLabel: string;
  metricValue: string;
  barPct: number;
  zoomScale: number;
}

export interface HybridProofShortProps {
  videoSrc: string;
  audioSrc: string;
  repoSlug: string;
  siteUrl: string;
  accentColor: string;
  topKicker: string;
  beats: HybridBeat[];
}

export const HYBRID_SHORT_PRESETS: Record<'kepler' | 'agentforge' | 'rea', HybridProofShortProps> = {
  kepler: {
    videoSrc: 'clips/hybrid_captures/kepler_explorer_capture.mp4',
    audioSrc: 'audio/hybrid_kepler.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/KeplerBridge',
    siteUrl: 'https://hamzashaikhai.com/keplerbridge/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_kepler',
    accentColor: '#34D399',
    topKicker: 'KEPLERBRIDGE // C++20 DX12 PROXY',
    beats: [
      { startSec: 0, tag: 'BEAT 01 • GT 740', headline: 'DX12 ON 12-YEAR-OLD SILICON', metricLabel: 'COLD DXIL LOWERING', metricValue: '1.12 ms', barPct: 32, zoomScale: 1.0 },
      { startSec: 2.3, tag: 'BEAT 02 • CACHE', headline: 'WARM SHA-256 SHADER HIT', metricLabel: 'WARM LOAD SPEEDUP', metricValue: '0.03 ms (-97.3%)', barPct: 94, zoomScale: 1.12 },
      { startSec: 4.6, tag: 'BEAT 03 • MATRIX', headline: 'ELDEN RING & DMC5 PROJECTIONS', metricLabel: 'LIVE GPU SWITCHER', metricValue: 'GT 740 -> GTX 780 Ti', barPct: 78, zoomScale: 1.06 },
      { startSec: 6.9, tag: 'BEAT 04 • HONEST SPEC', headline: 'PALWORLD REQUIRES NATIVE -DX11', metricLabel: 'ZERO FAKE CLAIMS', metricValue: 'FL 11_0 MODEL A', barPct: 86, zoomScale: 1.14 },
      { startSec: 9.2, tag: 'BEAT 05 • ZERO MODS', headline: 'DROP-IN d3d12.dll SIDE-BY-SIDE', metricLabel: 'WINDOWS SYSTEM FILES', metricValue: '0 MODIFICATIONS', barPct: 95, zoomScale: 1.04 },
      { startSec: 11.5, tag: 'BEAT 06 • EXPLORE', headline: 'FILTER 86+ GAMES LIVE NOW', metricLabel: 'INTERACTIVE MATRIX', metricValue: 'hamzashaikhai.com', barPct: 82, zoomScale: 1.11 },
      { startSec: 13.8, tag: 'BEAT 07 • OPEN SOURCE', headline: 'STAR KEPLERBRIDGE ON GITHUB', metricLabel: 'MIT C++20 REPO', metricValue: 'Line 1 Link Below', barPct: 100, zoomScale: 1.02 },
    ],
  },
  agentforge: {
    videoSrc: 'clips/hybrid_captures/agentforge_portal_capture.mp4',
    audioSrc: 'audio/hybrid_af.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/AgentForge',
    siteUrl: 'https://hamzashaikhai.com/agentforge/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_agentforge',
    accentColor: '#EF4444',
    topKicker: 'AGENTFORGE // LOCAL MCP FIREWALL',
    beats: [
      { startSec: 0, tag: 'BEAT 01 • THREAT', headline: 'STOP ROGUE AI REPO WIPES', metricLabel: 'DESTRUCTIVE GATE', metricValue: 'git push --force BLOCKED', barPct: 92, zoomScale: 1.0 },
      { startSec: 2.5, tag: 'BEAT 02 • POLICY', headline: '5-TIER CRYPTOGRAPHIC GATES', metricLabel: 'APPROVAL HASH', metricValue: 'SHA-256 CHAIN', barPct: 84, zoomScale: 1.12 },
      { startSec: 5.0, tag: 'BEAT 03 • VAULT', headline: 'DPAPI + AES-256 SECRET ISOLATION', metricLabel: 'ZERO GIT LEAKS', metricValue: 'ENV SANDBOX', barPct: 96, zoomScale: 1.06 },
      { startSec: 7.5, tag: 'BEAT 04 • COVERAGE', headline: '38 BRIDGES & 56 MCP PRESETS', metricLabel: 'VERIFIED SUITES', metricValue: '508 / 508 PASS', barPct: 100, zoomScale: 1.14 },
      { startSec: 10.0, tag: 'BEAT 05 • RUNTIME', headline: 'LOCAL-FIRST ANTIGRAVITY GUARD', metricLabel: 'CAPABILITY TRUTH', metricValue: 'PRE-FLIGHT VERIFIED', barPct: 88, zoomScale: 1.05 },
      { startSec: 12.5, tag: 'BEAT 06 • AUDIT', headline: 'HUMAN APPROVAL CHECKPOINTS', metricLabel: 'ZERO SILENT PUSH', metricValue: 'EXPLICIT SIGN-OFF', barPct: 94, zoomScale: 1.10 },
      { startSec: 15.0, tag: 'BEAT 07 • OPEN SOURCE', headline: 'CLONE & TEST IN 3 COMMANDS', metricLabel: 'MIT LICENSED', metricValue: 'hamzashaikhai.com', barPct: 100, zoomScale: 1.02 },
    ],
  },
  rea: {
    videoSrc: 'clips/hybrid_captures/rea_gallery_capture.mp4',
    audioSrc: 'audio/hybrid_rea.mp3',
    repoSlug: 'github.com/HamzaShaikhAI/Remotion-For-Antigravity',
    siteUrl: 'https://hamzashaikhai.com/remotion/?utm_source=youtube&utm_medium=shorts&utm_campaign=hybrid_rea',
    accentColor: '#38BDF8',
    topKicker: 'REA v2.4 // REACT VIDEO COMPILER',
    beats: [
      { startSec: 0, tag: 'BEAT 01 • UPGRADE', headline: 'NO MORE FROZEN SLIDES', metricLabel: 'ART DIRECTOR QA', metricValue: '< 3.0s PIXEL DELTA', barPct: 90, zoomScale: 1.0 },
      { startSec: 2.3, tag: 'BEAT 02 • HYBRID', headline: 'OFFTHREADVIDEO OBS COMPOSITOR', metricLabel: 'REAL CAPTURE SYNC', metricValue: '60 FPS DETERMINISTIC', barPct: 96, zoomScale: 1.12 },
      { startSec: 4.6, tag: 'BEAT 03 • LEXICON', headline: 'PHONETIC TTS PRONUNCIATION', metricLabel: 'BRAND SAFE VOICE', metricValue: 'ZERO GARBLED URLS', barPct: 86, zoomScale: 1.05 },
      { startSec: 6.9, tag: 'BEAT 04 • VIEWPORT', headline: '80%+ VERTICAL SHORTS FILL', metricLabel: 'TYPOGRAPHY LOCK', metricValue: '42px SAFE ZONE', barPct: 94, zoomScale: 1.14 },
      { startSec: 9.2, tag: 'BEAT 05 • MASTER', headline: 'EBU R128 -14 LUFS NORMALIZED', metricLabel: 'PROCEDURAL FOLEY', metricValue: '44.1 kHz STEREO', barPct: 89, zoomScale: 1.04 },
      { startSec: 11.5, tag: 'BEAT 06 • BADGES', headline: 'AUTOMATED QR & REPO SLUG', metricLabel: 'UTM ATTRIBUTION', metricValue: 'hamzashaikhai.com', barPct: 97, zoomScale: 1.11 },
      { startSec: 13.8, tag: 'BEAT 07 • GALLERY', headline: '1-CLICK CLI TEMPLATES LIVE', metricLabel: 'MIT OPEN SOURCE', metricValue: 'Line 1 Link Below', barPct: 100, zoomScale: 1.02 },
    ],
  },
};

export const HybridProofShort: React.FC<HybridProofShortProps> = ({
  videoSrc,
  audioSrc,
  repoSlug,
  siteUrl,
  accentColor,
  topKicker,
  beats,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sec = frame / fps;
  const totalSec = durationInFrames / fps;

  // Pick active beat every ~2.3s so headline, bar, and zoom shift continuously under the 3.0s rule
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

  // Continuous camera drift + pan so no 1.5s window ever freezes flat
  const prevBar = activeIdx > 0 ? beats[activeIdx - 1].barPct : 25;
  const barWidth = interpolate(beatSpring, [0, 1], [prevBar, beat.barPct]);
  const continuousZoom = beat.zoomScale + Math.sin(sec * 1.45) * 0.045;
  const continuousPanX = Math.sin(sec * 0.9) * 26;
  const continuousPanY = Math.cos(sec * 1.15) * 18;
  const videoLoopFrames = 300; // 10s @ 30fps loop window

  // Alternating spotlight gradient sweep for vibrant visual momentum
  const sweepX = 25 + ((frame * 3.2) % 60);
  const sweepY = 20 + Math.abs(Math.sin(sec * 0.85)) * 55;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050811', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Dynamic sweeping neon background glow so ambient pixels stay alive */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${sweepX}% ${sweepY}%, ${accentColor}44 0%, rgba(5,8,17,0.94) 68%)`,
        }}
      />

      {/* Audio: Phonetic TTS voiceover + soft underscore beat */}
      <Audio src={staticFile(audioSrc)} volume={1.0} />
      <Loop durationInFrames={450}>
        <Audio src={staticFile('audio/music_library/minimal_tech_pulse_125bpm.wav')} volume={0.14} />
      </Loop>

      {/* Top Safe Header + Kinetic 44px Headline (75–100% vertical composition coverage) */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: '72px 48px 18px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              background: '#0F172A',
              border: `2px solid ${accentColor}`,
              color: accentColor,
              padding: '8px 18px',
              borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 22,
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
              padding: '8px 16px',
              borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {beat.tag}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 44, // Locked strictly within 36-48px kinetic typography band
            lineHeight: 1.1,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 6px 24px rgba(0,0,0,0.9)',
            transform: `translateY(${interpolate(beatSpring, [0, 1], [14, 0])}px)`,
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
            padding: '16px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: 22, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              {beat.metricLabel}
            </span>
            <span style={{ color: accentColor, fontSize: 24, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
              {beat.metricValue}
            </span>
          </div>
          <div style={{ width: '100%', height: 18, background: '#1E293B', borderRadius: 9, overflow: 'hidden' }}>
            <div
              style={{
                width: `${barWidth}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accentColor}, #FACC15)`,
                borderRadius: 9,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (sec / totalSec) * 100)}%`, height: '100%', background: accentColor }} />
            </div>
            <span style={{ color: '#CBD5E1', fontSize: 16, fontFamily: 'JetBrains Mono, monospace' }}>
              {sec.toFixed(1)}s / {totalSec.toFixed(0)}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Stage: Live <OffthreadVideo> Browser/Code Proof Capture (~1040px height -> >82% vertical fill) */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '6px 48px 0 48px',
          height: 1040,
          borderRadius: 24,
          overflow: 'hidden',
          border: `3px solid ${accentColor}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          background: '#030712',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${continuousZoom}) translate(${continuousPanX}px, ${continuousPanY}px)`,
            transformOrigin: '50% 45%',
          }}
        >
          <Loop durationInFrames={videoLoopFrames}>
            <OffthreadVideo
              src={staticFile(videoSrc)}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Loop>
        </div>
      </div>

      {/* Automated Visual QR + Lower-Third Repo Slug Card (Positioned above 280px Shorts UI zone) */}
      <LowerThirdSlugBadge
        repositorySlug={repoSlug}
        fullUrl={siteUrl}
        headline="VERIFIED LIVE BUILD"
        subline="Scan QR or click Line 1 link in description"
        startFrame={30}
        durationInFrames={Math.max(360, durationInFrames - 30)}
        positionBottom={250}
        accentColor={accentColor}
      />
    </AbsoluteFill>
  );
};
