import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
  Loop,
} from 'remotion';
import {
  HybridScreenCompositor,
  ScreenCallout,
  CameraKeyframe,
} from '../engines/visual/HybridScreenCompositor.tsx';
import { LowerThirdSlugBadge } from '../engines/annotations/LowerThirdSlugBadge.tsx';
import { SafeTextContainer } from '../engines/typography/SafeTextContainer.tsx';

// ---------------------------------------------------------------------------
// Camera Keyframe Timeline (Smooth spring pan-and-scan)
// ---------------------------------------------------------------------------
const CAMERA_TIMELINE: CameraKeyframe[] = [
  { frame: 0, scale: 1.0, focalPoint: { x: 540, y: 960 } },
  { frame: 240, scale: 1.45, focalPoint: { x: 540, y: 720 }, durationFrames: 50 },
  { frame: 540, scale: 1.0, focalPoint: { x: 540, y: 960 }, durationFrames: 40 },
  { frame: 800, scale: 1.6, focalPoint: { x: 420, y: 680 }, durationFrames: 45 },
  { frame: 1350, scale: 1.0, focalPoint: { x: 540, y: 960 }, durationFrames: 45 },
  { frame: 2160, scale: 1.15, focalPoint: { x: 540, y: 900 }, durationFrames: 50 },
];

// ---------------------------------------------------------------------------
// Interactive Spring-Physics Callouts Overlay
// ---------------------------------------------------------------------------
const HYBRID_CALLOUTS: ScreenCallout[] = [
  // Act 1: Raw Stream Telemetry (0.0s – 9.0s)
  {
    id: 'c1_offthread',
    startFrame: 60,
    durationFrames: 210,
    targetPoint: { x: 480, y: 640 },
    badgePosition: { x: 80, y: 380 },
    tag: 'OFFTHREAD VIDEO',
    title: 'Zero Chromium Tab Drift',
    description: 'Direct-threaded GPU compositor bypassing web audio stalls.',
    variant: 'cyber',
    pulseReticle: true,
    leaderLine: true,
  },
  {
    id: 'c2_resolution',
    startFrame: 280,
    durationFrames: 220,
    targetPoint: { x: 620, y: 780 },
    badgePosition: { x: 520, y: 1120 },
    tag: 'STREAM TELEMETRY',
    title: '5120×2880 @ 60.00 FPS',
    description: 'Hardware accelerated offscreen buffer compositing.',
    variant: 'glass',
    pulseReticle: true,
    leaderLine: true,
  },

  // Act 2: Code & Profiler Callouts (9.0s – 22.5s)
  {
    id: 'c3_ebur128',
    startFrame: 600,
    durationFrames: 240,
    targetPoint: { x: 450, y: 720 },
    badgePosition: { x: 80, y: 420 },
    tag: 'EBU R128 AUDIO',
    title: '-14.0 LUFS True-Peak Master',
    description: 'Dynamic sidechain ducking prevents sub-bass Limiter ruin.',
    variant: 'success',
    pulseReticle: true,
    leaderLine: true,
  },
  {
    id: 'c4_telemetry',
    startFrame: 900,
    durationFrames: 240,
    targetPoint: { x: 580, y: 680 },
    badgePosition: { x: 500, y: 1100 },
    tag: 'ACTIVE MONITOR',
    title: 'Dynamic Spring Zoom',
    description: 'Deterministic camera pans centered on real debug loglines.',
    variant: 'hardware',
    pulseReticle: true,
    leaderLine: true,
  },

  // Act 3: Split-Screen Comparison (22.5s – 36.0s)
  {
    id: 'c5_splitscreen',
    startFrame: 1400,
    durationFrames: 320,
    targetPoint: { x: 540, y: 840 },
    badgePosition: { x: 90, y: 360 },
    tag: 'A/B COMPARISON',
    title: 'Raw Screen vs. Hybrid Master',
    description: 'Instant side-by-side verification with interactive spring split.',
    variant: 'cyber',
    pulseReticle: true,
    leaderLine: true,
  },

  // Act 4: Climax & CTA (36.0s – 45.0s)
  {
    id: 'c6_final_cta',
    startFrame: 2200,
    durationFrames: 450,
    targetPoint: { x: 540, y: 920 },
    badgePosition: { x: 80, y: 380 },
    tag: 'PRODUCTION READY',
    title: 'One-Line CLI Quickstart',
    description: 'Drop OBS clips into rea hybrid and publish in minutes.',
    variant: 'success',
    pulseReticle: true,
    leaderLine: true,
  },
];

/**
 * HybridScreenShowcase
 * 45-second 9:16 vertical flagship master composition.
 * Upgrades REA from synthetic slide generator to broadcast-grade hybrid compositor,
 * fusing authentic OBS screen recordings, spring-physics telemetry, split-screen A/B
 * comparison, and automated lower-third QR slug cards.
 */
export const HybridScreenShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Act 3 Split Screen Divider Spring Animation (Frames 1350 – 2160)
  const isSplitActive = frame >= 1350 && frame < 2160;
  const splitProgress = isSplitActive
    ? spring({
        frame: frame - 1350,
        fps,
        config: { damping: 18, stiffness: 60 },
      })
    : 0;
  const dividerPosition = isSplitActive
    ? interpolate(Math.sin((frame - 1350) * 0.02), [-1, 1], [0.35, 0.65])
    : 0.5;

  // Header Title Opacity & Spring
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070D', overflow: 'hidden' }}>
      {/* 1. Underscore Soundtrack with Dynamic Beat Ducking */}
      <Loop durationInFrames={922}>
        <Audio
          src={staticFile('audio/music_library/minimal_tech_pulse_125bpm.wav')}
          volume={(f) => {
            const beatPhase = (f % 28.8) / 28.8;
            return interpolate(beatPhase, [0, 0.15, 0.5, 1], [0.24, 0.42, 0.36, 0.25]);
          }}
        />
      </Loop>

      {/* 2. Ambient Screen Foley (Subtle mechanical typing and card snaps) */}
      <Audio
        src={staticFile('audio/rea_showcase_event_locked_sfx.wav')}
        volume={0.88}
      />

      {/* 3. Top Floating Header HUD */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 80,
          opacity: Math.min(1, Math.max(0, headerSpring)),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1.5px solid #38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
            }}
          >
            <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: 16 }}>▶</span>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                fontWeight: 800,
                color: '#38BDF8',
                letterSpacing: '0.1em',
              }}
            >
              REA HYBRID COMPOSITOR
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 18,
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              Real Screen Recording + Spring HUD
            </div>
          </div>
        </div>

        {/* Telemetry Pill */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: '6px 16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            fontWeight: 700,
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }}
          />
          ACTIVE // FRAME {frame}
        </div>
      </div>

      {/* 4. Core Hybrid Screen Compositor Engine */}
      <HybridScreenCompositor
        videoSrc="clips/benchmark_4k.mp4"
        cameraKeyframes={CAMERA_TIMELINE}
        callouts={HYBRID_CALLOUTS}
        glassMockupFrame={true}
        mockupTitle="OBS 60FPS Video Capture // Hybrid Engine Layer"
        ambientBackdrop={true}
        hudOverlay={{
          enabled: true,
          fpsTelemetry: 60.0,
          modeBadge: isSplitActive ? 'A/B SPLIT COMPARISON' : 'OFFTHREAD COMPOSITOR',
          latencyMs: 1.2,
          gpuModel: 'NVIDIA GT 740 / D3D12',
        }}
        splitScreen={{
          enabled: isSplitActive,
          secondaryVideoSrc: 'clips/clip1.mp4',
          dividerPosition,
          labelA: 'RAW OBS RECORDING',
          labelB: 'REA SPRING COMPOSITOR',
          dividerColor: '#38BDF8',
        }}
      />

      {/* 5. Broadcast Lower-Third Slug & Scannable QR Code (Peak Retention Window: 30.0s – 35.0s) */}
      <LowerThirdSlugBadge
        repositorySlug="github.com/HamzaShaikhAI/Remotion-For-Antigravity"
        fullUrl="https://github.com/HamzaShaikhAI/Remotion-For-Antigravity"
        headline="OPEN SOURCE ARCHITECTURE"
        subline="Star on GitHub • Run in 60s"
        startFrame={1800}
        durationInFrames={300}
        positionBottom={340}
        accentColor="#38BDF8"
        theme="dark-glass"
      />
    </AbsoluteFill>
  );
};
