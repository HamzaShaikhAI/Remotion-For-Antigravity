import React, { useMemo } from 'react';
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
import { SafeTextContainer } from '../engines/typography/SafeTextContainer.tsx';
import { motionTokens } from '../tokens/motion.ts';
import { BrandLogo } from '../tokens/logos/BrandLogo.tsx';
import {
  ACT_BOUNDARIES,
  ACT1_PROMPT_TEXT,
  ACT3_DEMO_FULL_TEXT,
} from './reaShowcaseEvents.ts';

// ---------------------------------------------------------------------------
// Design Constants & Colors
// ---------------------------------------------------------------------------
const CANVAS_BG = '#F7F4EE';
const CORAL_MESH = 'rgba(245, 158, 130, 0.38)';
const SKY_MESH = 'rgba(186, 215, 233, 0.42)';
const SAGE_MESH = 'rgba(209, 231, 214, 0.40)';
const LAVENDER_MESH = 'rgba(216, 207, 235, 0.36)';

const SLATE_DARK = '#0F172A';
const SLATE_MUTED = '#64748B';
const EMERALD_ACCENT = '#10B981';
const CYAN_ACCENT = '#06B6D4';
const AMBER_ACCENT = '#F59E0B';

// Strict 9:16 Mobile Safe Zones
const SAFE_ZONE_TOP = 140;
const SAFE_ZONE_BOTTOM = 280;
const SAFE_ZONE_RIGHT = 90;
const SAFE_CONTENT_WIDTH = 1080 - SAFE_ZONE_RIGHT - 40; // ~950px

// ---------------------------------------------------------------------------
// 1. High-Key Warm Editorial Oyster Canvas + 4-Point Chromatic Mesh
// ---------------------------------------------------------------------------
const OysterChromaticMesh: React.FC<{ frame: number }> = ({ frame }) => {
  // Harmonic 1.5 px/sec continuous drift (strictly deterministic)
  const driftX1 = Math.sin(frame * 0.015) * 45;
  const driftY1 = Math.cos(frame * 0.012) * 40;
  const driftX2 = Math.cos(frame * 0.018) * 50;
  const driftY2 = Math.sin(frame * 0.014) * 45;

  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS_BG, overflow: 'hidden' }}>
      {/* Mesh Glow 1: Coral (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: -120 + driftY1,
          left: -100 + driftX1,
          width: 780,
          height: 780,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${CORAL_MESH} 0%, transparent 70%)`,
          filter: 'blur(75px)',
          pointerEvents: 'none',
        }}
      />

      {/* Mesh Glow 2: Sky Slate (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          top: -80 + driftY2,
          right: -120 - driftX2,
          width: 820,
          height: 820,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${SKY_MESH} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Mesh Glow 3: Sage (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: 140 - driftY2,
          left: -80 + driftX2,
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${SAGE_MESH} 0%, transparent 70%)`,
          filter: 'blur(85px)',
          pointerEvents: 'none',
        }}
      />

      {/* Mesh Glow 4: Lavender (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: 100 - driftY1,
          right: -140 - driftX1,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${LAVENDER_MESH} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* 3.5% Analog Film Grain Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 1: The Hook — "Prompts to Broadcast Video" (Frames 0 – 450 | 0.0s – 7.5s)
// ---------------------------------------------------------------------------
const Act1HookPipeline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enterSpring = spring({
    frame,
    fps,
    config: motionTokens.spring.snappy,
  });

  // Semantic Match-Cut Zoom Exit (frames 430 to 450)
  const exitScale = interpolate(frame, [430, 450], [1.0, 1.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [430, 450], [1.0, 0.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Continuous Camera Push-In & 3D Tilt Drift (Never Static)
  const camScale = interpolate(frame, [0, 450], [1.0, 1.05]);
  const camTiltY = Math.sin(frame * 0.025) * 2.2;
  const camDriftY = Math.cos(frame * 0.02) * 6;

  // Typing progress from frame 15 to 156
  const typedCharCount = Math.min(
    ACT1_PROMPT_TEXT.length,
    Math.max(0, Math.floor(interpolate(frame, [15, 156], [0, ACT1_PROMPT_TEXT.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );
  const displayedText = ACT1_PROMPT_TEXT.slice(0, typedCharCount);
  const cursorBlink = Math.floor(frame / 16) % 2 === 0 ? '█' : ' ';

  // Match-cut expansion from command bar into 4-stage pipeline (frame 180 to 240)
  const expandProgress = spring({
    frame: frame - 180,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
  });

  // Stage nodes activation springs
  const s1Spring = spring({ frame: frame - 200, fps, config: motionTokens.spring.snappy });
  const s2Spring = spring({ frame: frame - 220, fps, config: motionTokens.spring.snappy });
  const s3Spring = spring({ frame: frame - 240, fps, config: motionTokens.spring.snappy });
  const s4Spring = spring({ frame: frame - 260, fps, config: motionTokens.spring.snappy });

  // Active Data Pulse Beam (Frames 270 - 440) traveling down stages 01 -> 02 -> 03 -> 04
  const pulsePhase = interpolate(frame, [270, 430], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const liveLatencyMs = (interpolate(frame, [270, 430], [1.2, 14.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })).toFixed(1);

  const stages = [
    { num: '01', title: 'DIRECTING PROMPT', desc: 'Vision-grounded natural language specification', color: '#3B82F6', springVal: s1Spring, idx: 0, logo: 'github' },
    { num: '02', title: 'STYLE CACHE (0-PASS A+)', desc: 'Zero-hallucination aesthetic locked AST', color: '#10B981', springVal: s2Spring, idx: 1, logo: 'typescript' },
    { num: '03', title: 'DETERMINISTIC AST', desc: 'Frame-clock synchronized React + Remotion graph', color: '#8B5CF6', springVal: s3Spring, idx: 2, logo: 'remotion' },
    { num: '04', title: '4K/60FPS MP4 RENDER', desc: 'Distributed multi-threaded headless chromium render', color: '#F59E0B', springVal: s4Spring, idx: 3, logo: 'aws' },
  ];

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp' }) * exitOpacity,
        transform: `scale(${camScale * exitScale}) rotateY(${camTiltY}deg) translateY(${camDriftY}px)`,
      }}
    >
      {/* Top Editorial Eyebrow */}
      <SafeTextContainer
        text="REA v2.4.0 // DIRECTING ENGINE"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={20}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 14 }}
      />

      {/* Main Authoritative Headline */}
      <SafeTextContainer
        text="From Prompt to Broadcast Video"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={52}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        lineHeight={1.15}
        textAlign="center"
        style={{ marginBottom: 22 }}
      />

      {/* 3D Glassmorphic Command Bar */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(28px)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxSizing: 'border-box',
          marginBottom: 20,
          transform: `scale(${interpolate(expandProgress, [0, 0.5, 1], [1, 1.02, 1])})`,
        }}
      >
        {/* Terminal Indicator & Remotion Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: frame >= 180 ? EMERALD_ACCENT : AMBER_ACCENT,
              boxShadow: `0 0 12px ${frame >= 180 ? EMERALD_ACCENT : AMBER_ACCENT}`,
            }}
          />
          <BrandLogo name="remotion" size={24} color={SLATE_DARK} glow glowColor="rgba(16, 185, 129, 0.4)" />
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SafeTextContainer
            text={`> ${displayedText}${frame < 180 ? cursorBlink : ''}`}
            containerWidth={SAFE_CONTENT_WIDTH - 180}
            baseFontSize={20}
            minFontSize={16}
            color={SLATE_DARK}
            fontWeight={700}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing={0.5}
            textStyle={{ whiteSpace: 'nowrap' }}
          />
        </div>

        {/* Enter Key Visual Indicator */}
        <div
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: 8,
            backgroundColor: frame >= 180 ? SLATE_DARK : 'rgba(15, 23, 42, 0.06)',
            color: frame >= 180 ? '#FFFFFF' : SLATE_MUTED,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            fontWeight: 800,
            flexShrink: 0,
            transform: frame >= 180 && frame < 205 ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          ↵ ENTER
        </div>
      </div>

      {/* 4-Stage Pipeline Schematic (Match Cut Unfold) */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: interpolate(expandProgress, [0, 0.3, 1], [0, 0.8, 1]),
          transform: `translateY(${interpolate(expandProgress, [0, 1], [25, 0])}px)`,
          position: 'relative',
        }}
      >
        {stages.map((st) => {
          const isPulseActive = frame >= 270 && pulsePhase >= st.idx && pulsePhase < st.idx + 1;
          const pulseGlow = isPulseActive ? `0 0 24px ${st.color}88, inset 0 0 12px ${st.color}33` : 'none';
          const pulseBorder = isPulseActive ? `2px solid ${st.color}` : '1.5px solid rgba(255, 255, 255, 0.9)';

          return (
            <div
              key={st.num}
              style={{
                width: '100%',
                borderRadius: 16,
                background: isPulseActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(24px)',
                border: pulseBorder,
                boxShadow: `0 14px 36px rgba(15, 23, 42, 0.05), ${pulseGlow}`,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxSizing: 'border-box',
                opacity: interpolate(st.springVal, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(st.springVal, [0, 1], [-25, 0])}px) scale(${isPulseActive ? 1.02 : 1})`,
                transition: 'none',
              }}
            >
              {/* Stage Number Badge */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: st.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 17,
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: `0 8px 18px ${st.color}55`,
                }}
              >
                {st.num}
              </div>

              {/* Brand Logo Badge */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  backgroundColor: `${st.color}18`,
                  border: `1px solid ${st.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BrandLogo name={st.logo} size={20} color={st.color} glow glowColor={`${st.color}66`} />
              </div>

              {/* Stage Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SafeTextContainer
                  text={st.title}
                  containerWidth={SAFE_CONTENT_WIDTH - 150}
                  baseFontSize={19}
                  color={SLATE_DARK}
                  fontWeight={800}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                />
                <SafeTextContainer
                  text={st.desc}
                  containerWidth={SAFE_CONTENT_WIDTH - 150}
                  baseFontSize={15}
                  color={SLATE_MUTED}
                  fontWeight={500}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                />
              </div>

              {/* Status Tick */}
              <div
                style={{
                  color: isPulseActive ? st.color : EMERALD_ACCENT,
                  fontSize: 20,
                  fontWeight: 900,
                  fontFamily: "'JetBrains Mono', monospace",
                  transform: isPulseActive ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                ✔
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Data Pulse & Telemetry Readout (Eliminating Dead Air Frames 270 - 450) */}
      <div
        style={{
          marginTop: 18,
          width: SAFE_CONTENT_WIDTH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: 'rgba(15, 23, 42, 0.92)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: EMERALD_ACCENT, boxShadow: `0 0 8px ${EMERALD_ACCENT}` }} />
          <SafeTextContainer
            text="Zero crude SVGs · 100% deterministic code"
            containerWidth={SAFE_CONTENT_WIDTH - 300}
            baseFontSize={16}
            color="#FFFFFF"
            fontWeight={700}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          />
        </div>

        {/* Live Latency & Pipeline Flow Telemetry */}
        <div
          style={{
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 900, color: '#0284C7' }}>
            LATENCY: {liveLatencyMs}ms · 60 FPS
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 2: The 11 Certified Studio Engines (Frames 450 – 1,080 | 7.5s – 18.0s)
// ---------------------------------------------------------------------------
interface EngineCardMeta {
  id: string;
  name: string;
  fpsTag: string;
  themeColor: string;
  previewTitle: string;
  previewSub: string;
  aesthetic: string;
}

const CERTIFIED_ENGINES: EngineCardMeta[] = [
  { id: '01', name: 'Paper 2.5D', fpsTag: '16 FPS STOP-MOTION', themeColor: '#F59E0B', previewTitle: 'Tactile Cutting Mat & Stickers', previewSub: 'Layered drop shadows & paper slide foley', aesthetic: 'Artisan Paper Cutout' },
  { id: '02', name: 'Kurzgesagt Vector', fpsTag: '60 FPS ADDITIVE', themeColor: '#3B82F6', previewTitle: 'Solar Halos & Deep Cosmos', previewSub: 'Eye-tracking vector astronaut exploration', aesthetic: 'Geometric Editorial Space' },
  { id: '03', name: 'Claude / Movez Motion', fpsTag: '30 FPS EDITORIAL', themeColor: '#8B5CF6', previewTitle: '4:5 Coverflow & 3D Modals', previewSub: 'Bento UI grids & spring bezier curves', aesthetic: 'VisionOS Glassmorphic' },
  { id: '04', name: 'RicksClips Hybrid 2.5D', fpsTag: '30 FPS HIGH-RETENTION', themeColor: '#EC4899', previewTitle: '2D Avatars in 3D Saloons', previewSub: '8px black strokes & 72px Montserrat typography', aesthetic: 'Viral Retention Master' },
  { id: '05', name: 'Pelagos Subsea HUD', fpsTag: '60 FPS TELEMETRY', themeColor: '#06B6D4', previewTitle: 'Hydrothermal Vent Sonar', previewSub: 'Polar radar reticles & 3D manipulator rig', aesthetic: 'Industrial Sci-Fi Robotics' },
  { id: '06', name: 'CAD Liquid Chrome', fpsTag: '60 FPS METALLIC', themeColor: '#64748B', previewTitle: '3D Chrome Refraction', previewSub: 'Solid fiberglass PCB traces & copper vias', aesthetic: 'Hardware Spec Macro' },
  { id: '07', name: 'Anime Opening MV', fpsTag: '175 BPM HYPER-ACTION', themeColor: '#EF4444', previewTitle: '175 BPM Halftone Particles', previewSub: 'Pop-art screen tones & 808 speed lines', aesthetic: 'J-Pop Idol High-Energy' },
  { id: '08', name: 'Claude Fable Pixel Art', fpsTag: '12 FPS RETRO', themeColor: '#10B981', previewTitle: '512px Grid Integer Scaling', previewSub: 'Discrete phase-stepping & ambient soundscape', aesthetic: 'Living Animated Pixel Art' },
  { id: '09', name: 'GSAP Interactive Lab', fpsTag: '60 FPS PROCEDURAL', themeColor: '#F97316', previewTitle: '6 Interactive Studio Sliders', previewSub: 'Dynamic control parameters & SVG path morphs', aesthetic: 'Parametric Motion Studio' },
  { id: '10', name: 'Subsea Hydrothermal', fpsTag: '60 FPS PRESSURE', themeColor: '#0284C7', previewTitle: 'Deep Oceanic Bathyal Trench', previewSub: 'Acoustic ping foley & depth gauges', aesthetic: 'Autonomous Deep Sub' },
  { id: '11', name: 'Bento Architecture Climax', fpsTag: '60 FPS BROADCAST', themeColor: '#8B5CF6', previewTitle: 'Unified Studio Pipeline', previewSub: 'Zero SVG rectangles & verified AST compile', aesthetic: 'Enterprise Broadcast' },
];

const Act2EngineCoverflow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 450;
  const duration = 630; // frames 450 to 1080

  // Semantic Match-Cut Zoom Entrance & Exit
  const enterScale = interpolate(actFrame, [0, 20], [0.90, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitScale = interpolate(actFrame, [duration - 20, duration], [1.0, 1.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(actFrame, [duration - 20, duration], [1.0, 0.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Continuous Camera Push-In & 3D Tilt Drift
  const camScale = interpolate(actFrame, [0, duration], [1.0, 1.05]);
  const camTiltY = Math.sin(frame * 0.02) * 2.5;
  const camDriftY = Math.cos(frame * 0.018) * 8;

  const stepDuration = Math.floor(580 / CERTIFIED_ENGINES.length); // ~52 frames per engine
  const activeIndex = Math.min(
    CERTIFIED_ENGINES.length - 1,
    Math.max(0, Math.floor(actFrame / stepDuration))
  );
  const activeEngine = CERTIFIED_ENGINES[activeIndex];

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(actFrame, [0, 16], [0, 1], { extrapolateLeft: 'clamp' }) * exitOpacity,
        transform: `scale(${enterScale * camScale * exitScale}) rotateY(${camTiltY}deg) translateY(${camDriftY}px)`,
      }}
    >
      {/* Top Editorial Eyebrow */}
      <SafeTextContainer
        text="REA ECOSYSTEM // 11 PRODUCTION ENGINES"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 12 }}
      />

      {/* Main Authoritative Headline */}
      <SafeTextContainer
        text="11 Certified Studio Engines"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={52}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 28 }}
      />

      {/* 3D Coverflow Container */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          height: 520,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {CERTIFIED_ENGINES.map((eng, idx) => {
          const offset = idx - activeIndex;
          if (Math.abs(offset) > 2) return null;

          const isCenter = offset === 0;
          const translateX = offset * 280;
          const rotateY = offset * -28;
          const scale = isCenter ? 1.05 : 0.85;
          const opacity = isCenter ? 1 : 0.45;
          const zIndex = 20 - Math.abs(offset);

          return (
            <div
              key={eng.id}
              style={{
                position: 'absolute',
                width: 580,
                height: 480,
                borderRadius: 24,
                background: 'rgba(255, 255, 255, 0.90)',
                backdropFilter: 'blur(30px)',
                border: isCenter ? `2.5px solid ${eng.themeColor}` : '1.5px solid rgba(255, 255, 255, 0.9)',
                boxShadow: isCenter
                  ? `0 30px 70px rgba(15, 23, 42, 0.16), 0 0 35px ${eng.themeColor}33`
                  : '0 15px 40px rgba(15, 23, 42, 0.06)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'none',
              }}
            >
              {/* Card Top: Tag + Engine ID */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    backgroundColor: `${eng.themeColor}18`,
                    color: eng.themeColor,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 900,
                  }}
                >
                  {eng.fpsTag}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 900, color: SLATE_MUTED }}>
                  #{eng.id}
                </span>
              </div>

              {/* Card Center: Visual Stage Preview Plate */}
              <div
                style={{
                  width: '100%',
                  height: 220,
                  borderRadius: 16,
                  backgroundColor: SLATE_DARK,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${eng.themeColor}33 0%, transparent 70%)`,
                  }}
                />
                <SafeTextContainer
                  text={eng.aesthetic.toUpperCase()}
                  containerWidth={500}
                  baseFontSize={16}
                  color={eng.themeColor}
                  fontWeight={800}
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing={2}
                  textAlign="center"
                  style={{ marginBottom: 12, position: 'relative' }}
                />
                <SafeTextContainer
                  text={eng.previewTitle}
                  containerWidth={500}
                  baseFontSize={28}
                  color="#FFFFFF"
                  fontWeight={800}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  textAlign="center"
                  style={{ position: 'relative', marginBottom: 8 }}
                />
                <SafeTextContainer
                  text={eng.previewSub}
                  containerWidth={500}
                  baseFontSize={18}
                  color="#94A3B8"
                  fontWeight={500}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  textAlign="center"
                  style={{ position: 'relative' }}
                />
              </div>

              {/* Card Bottom: Engine Name & Certification Stamp */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <SafeTextContainer
                    text={eng.name}
                    containerWidth={360}
                    baseFontSize={30}
                    color={SLATE_DARK}
                    fontWeight={900}
                    fontFamily="'Playfair Display', Georgia, serif"
                  />
                  <SafeTextContainer
                    text="Verified AST Architecture"
                    containerWidth={360}
                    baseFontSize={16}
                    color={SLATE_MUTED}
                    fontWeight={600}
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  />
                </div>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: EMERALD_ACCENT,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>✔</span>
                  <span>CERTIFIED</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Engine Navigation Bar */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 24px',
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_MUTED }}>
          ACTIVE:
        </span>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: SLATE_DARK }}>
          {activeEngine.name}
        </span>
        <span style={{ color: EMERALD_ACCENT, fontWeight: 900 }}>•</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: SLATE_MUTED }}>
          1:1 Studio Foley Sync
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 3: The Polish & Determinism Core (Frames 1,080 – 1,710 | 18.0s – 28.5s)
// ---------------------------------------------------------------------------
const Act3DeterminismWorkbench: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 1080;
  const duration = 630; // frames 1080 to 1710

  // Semantic Match-Cut Zoom Entrance & Exit
  const enterScale = interpolate(actFrame, [0, 20], [0.90, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitScale = interpolate(actFrame, [duration - 20, duration], [1.0, 1.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(actFrame, [duration - 20, duration], [1.0, 0.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Continuous Camera Push-In & 3D Tilt Drift
  const camScale = interpolate(actFrame, [0, duration], [1.0, 1.05]);
  const camTiltY = Math.sin(frame * 0.022) * 2.2;
  const camDriftY = Math.cos(frame * 0.019) * 7;

  // Typing simulation from frame 30 to 180
  const typedCount = Math.min(
    ACT3_DEMO_FULL_TEXT.length,
    Math.max(0, Math.floor(interpolate(actFrame, [30, 180], [14, ACT3_DEMO_FULL_TEXT.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );
  const currentDemoText = ACT3_DEMO_FULL_TEXT.slice(0, typedCount);

  // Live Continuous Container Morphing (Eliminating Dead Air Frames 180 - 580)
  // Box dynamically narrows from 900px down to 620px, then widens back to 900px
  const morphContainerWidth = Math.round(
    interpolate(
      actFrame,
      [180, 290, 400, 520],
      [SAFE_CONTENT_WIDTH - 60, 620, 620, SAFE_CONTENT_WIDTH - 60],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  // Live Auto-Scaling Font Size reacting to container width
  const liveSafeFontSize = Math.round(
    interpolate(morphContainerWidth, [620, SAFE_CONTENT_WIDTH - 60], [22, 34], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  const waveformPhase = (actFrame * 4) % 360;

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(actFrame, [0, 16], [0, 1], { extrapolateLeft: 'clamp' }) * exitOpacity,
        transform: `scale(${enterScale * camScale * exitScale}) rotateY(${camTiltY}deg) translateY(${camDriftY}px)`,
      }}
    >
      {/* Top Section Header */}
      <SafeTextContainer
        text="REA CORE GUARANTEES // ZERO COMPROMISES"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 10 }}
      />
      <SafeTextContainer
        text="Polish & Determinism Architecture"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={50}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 26 }}
      />

      {/* 3 Split Workbench Guarantee Cards */}
      <div style={{ width: SAFE_CONTENT_WIDTH, display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Guarantee 1: Zero-Overflow SafeTextContainer Live Morphing */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 22,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: EMERALD_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                1. DYNAMIC ZERO-OVERFLOW CONTAINER
              </span>
            </div>
            <div
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: EMERALD_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              BOX: {morphContainerWidth}PX · FONT: {liveSafeFontSize}PX
            </div>
          </div>

          {/* Strict Morphing Bounding Box Stress Demo */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '6px 0',
            }}
          >
            <div
              style={{
                width: morphContainerWidth,
                height: 95,
                border: '4px solid #0F172A',
                borderRadius: 14,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                boxSizing: 'border-box',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                transition: 'none',
              }}
            >
              <SafeTextContainer
                text={currentDemoText}
                containerWidth={morphContainerWidth - 40}
                baseFontSize={liveSafeFontSize}
                minFontSize={18}
                autoScale={false}
                color={SLATE_DARK}
                fontWeight={900}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                textAlign="center"
              />
            </div>
          </div>
        </div>

        {/* Guarantee 2: Deterministic Clock (Zero Math.random()) */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 22,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: CYAN_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                2. DETERMINISTIC CLOCK ENGINE
              </span>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                color: CYAN_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              ZERO MATH.RANDOM()
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: SLATE_DARK,
              color: '#38BDF8',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>frame: {frame} · seed(frame * 0.015)</span>
            <span style={{ color: EMERALD_ACCENT }}>AST COMPLIANT</span>
          </div>
        </div>

        {/* Guarantee 3: 1:1 Studio Foley Scheduler */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 22,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: AMBER_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                3. TACTILE STUDIO FOLEY
              </span>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: AMBER_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              WARM RHODES + 116 BPM GROOVE
            </div>
          </div>

          {/* Scrolling Waveform & Foley Markers */}
          <div
            style={{
              width: '100%',
              height: 60,
              borderRadius: 12,
              backgroundColor: SLATE_DARK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 16px',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 36 }).map((_, barIdx) => {
              const barH = 14 + Math.abs(Math.sin((barIdx * 12 + waveformPhase) * (Math.PI / 180))) * 34;
              const isHitBar = barIdx % 6 === 0;
              return (
                <div
                  key={barIdx}
                  style={{
                    width: 4,
                    height: barH,
                    borderRadius: 2,
                    backgroundColor: isHitBar ? AMBER_ACCENT : 'rgba(255, 255, 255, 0.45)',
                    boxShadow: isHitBar ? `0 0 8px ${AMBER_ACCENT}` : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 4: Automated Quality Gatekeeper & Cloud Scale (Frames 1,710 – 2,250 | 28.5s – 37.5s)
// ---------------------------------------------------------------------------
const Act4TerminalGatekeeper: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 1710;
  const duration = 540; // frames 1710 to 2250

  // Semantic Match-Cut Zoom Entrance & Exit
  const enterScale = interpolate(actFrame, [0, 20], [0.90, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitScale = interpolate(actFrame, [duration - 20, duration], [1.0, 1.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(actFrame, [duration - 20, duration], [1.0, 0.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Continuous Camera Push-In & 3D Tilt Drift
  const camScale = interpolate(actFrame, [0, duration], [1.0, 1.05]);
  const camTiltY = Math.sin(frame * 0.024) * 2.2;
  const camDriftY = Math.cos(frame * 0.02) * 6;

  // Snappy spring checkmarks for CI verification steps
  const c1Spring = spring({ frame: actFrame - 30, fps, config: { damping: 12, stiffness: 260, mass: 0.5 } });
  const c2Spring = spring({ frame: actFrame - 80, fps, config: { damping: 12, stiffness: 260, mass: 0.5 } });
  const c3Spring = spring({ frame: actFrame - 130, fps, config: { damping: 12, stiffness: 260, mass: 0.5 } });
  const c4Spring = spring({ frame: actFrame - 180, fps, config: { damping: 12, stiffness: 260, mass: 0.5 } });

  // Live Lambda Worker Progress & Telemetry (Eliminating Dead Air Frames 240 - 540)
  const workerProgress = interpolate(actFrame, [230, 480], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const streamFrameNum = Math.min(2700, Math.round(interpolate(actFrame, [230, 480], [120, 2700], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

  const terminalChecks = [
    { cmd: 'npx tsc --noEmit', result: '0 TypeScript errors (Strict AST Verified)', springVal: c1Spring, color: '#38BDF8', logo: 'typescript' },
    { cmd: 'rea motion-lint', result: '294/294 files compliant with MOTION.md', springVal: c2Spring, color: '#34D399', logo: 'remotion' },
    { cmd: 'rea audit-polish', result: '0 overflow warnings · Studio Foley verified', springVal: c3Spring, color: '#A78BFA', logo: 'github' },
    { cmd: 'rea lambda-render', result: 'ap-south-1 → us-east-1 ready (128 workers)', springVal: c4Spring, color: '#FBBF24', logo: 'aws' },
  ];

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(actFrame, [0, 16], [0, 1], { extrapolateLeft: 'clamp' }) * exitOpacity,
        transform: `scale(${enterScale * camScale * exitScale}) rotateY(${camTiltY}deg) translateY(${camDriftY}px)`,
      }}
    >
      {/* Top Editorial Eyebrow */}
      <SafeTextContainer
        text="CI/CD VALIDATION // ZERO REGRESSION GATE"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 12 }}
      />

      {/* Main Authoritative Headline */}
      <SafeTextContainer
        text="Automated Quality Gatekeeper"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={52}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 28 }}
      />

      {/* Dark Terminal Workbench Container */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 24,
          backgroundColor: '#0F172A',
          border: '1.5px solid #334155',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: '24px 28px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B',
            paddingBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span
              style={{
                marginLeft: 12,
                color: '#94A3B8',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              rea-gatekeeper // bash
            </span>
          </div>

          <div
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: EMERALD_ACCENT,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            ACTIVE WORKBENCH
          </div>
        </div>

        {/* Terminal Checks */}
        {terminalChecks.map((tc, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              opacity: interpolate(tc.springVal, [0, 1], [0.15, 1]),
            }}
          >
            {/* Command Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo name={tc.logo} size={20} color={tc.color} glow glowColor={`${tc.color}88`} />
              <span style={{ color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800 }}>
                &gt;
              </span>
              <span style={{ color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace", fontSize: 19, fontWeight: 700 }}>
                {tc.cmd}
              </span>
            </div>

            {/* Checkmark and Result Line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginLeft: 16,
                transform: `scale(${interpolate(tc.springVal, [0, 1], [0.85, 1])})`,
                transformOrigin: 'left center',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  backgroundColor: EMERALD_ACCENT,
                  color: SLATE_DARK,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 900,
                  boxShadow: `0 0 12px ${EMERALD_ACCENT}88`,
                }}
              >
                ✔
              </div>
              <SafeTextContainer
                text={tc.result}
                containerWidth={SAFE_CONTENT_WIDTH - 140}
                baseFontSize={17}
                color="#E2E8F0"
                fontWeight={600}
                fontFamily="'JetBrains Mono', monospace"
              />
            </div>
          </div>
        ))}

        {/* Live Lambda Distributed Render Progress Bar (Eliminating Dead Air) */}
        {actFrame >= 210 && (
          <div
            style={{
              marginTop: 6,
              padding: '14px 18px',
              borderRadius: 14,
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: '#38BDF8' }}>
                128 AWS LAMBDA WORKERS RENDERING PARALLEL
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 900, color: EMERALD_ACCENT }}>
                {Math.round(workerProgress)}% COMPLETE
              </span>
            </div>
            {/* Progress Bar Track */}
            <div style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: '#0F172A', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${workerProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38BDF8 0%, #10B981 100%)',
                  boxShadow: '0 0 10px #10B981',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#94A3B8' }}>
                STREAMING FRAME {streamFrameNum}/2700 · JITTER: 0.00ms
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FDE68A' }}>
                FAILOVER READY
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Status Pill */}
      <div
        style={{
          marginTop: 22,
          padding: '12px 28px',
          borderRadius: 999,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)',
        }}
      >
        <span style={{ color: EMERALD_ACCENT, fontSize: 18, fontWeight: 900 }}>✔</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 900, color: SLATE_DARK }}>
          PASS RATE: 100.0% · GRADE A+ PRODUCTION CERTIFIED
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 5: Climax 4×3 System Architecture Bento Matrix (Frames 2,250 – 2,700 | 37.5s – 45.0s)
// ---------------------------------------------------------------------------
interface BentoTile {
  title: string;
  category: string;
  metric: string;
  color: string;
}

const BENTO_TILES: BentoTile[] = [
  { title: 'Paper 2.5D', category: 'ARTISAN', metric: '16 FPS · Foley', color: '#F59E0B' },
  { title: 'Kurzgesagt', category: 'COSMIC', metric: '60 FPS · Vectors', color: '#3B82F6' },
  { title: 'Claude Motion', category: 'EDITORIAL', metric: 'Bento UI · 4:5', color: '#8B5CF6' },
  { title: 'RicksClips', category: 'VIRAL', metric: '72px Stroke Caps', color: '#EC4899' },
  { title: 'Pelagos HUD', category: 'ROBOTICS', metric: '360° Sonar · 3D', color: '#06B6D4' },
  { title: 'CAD Chrome', category: 'INDUSTRIAL', metric: 'Liquid Metallic', color: '#64748B' },
  { title: 'Anime 175BPM', category: 'J-POP MV', metric: 'Beat-Grid Lock', color: '#EF4444' },
  { title: 'Pixel Art', category: 'RETRO', metric: '12 FPS Integer', color: '#10B981' },
  { title: 'StyleCache', category: 'CORE AST', metric: '0-Pass A+ Lock', color: '#14B8A6' },
  { title: 'SafeText', category: 'TYPOGRAPHY', metric: '0-Overflow Clamp', color: '#6366F1' },
  { title: 'StudioFoley', category: 'AUDIO BED', metric: '116 BPM Rhodes', color: '#F97316' },
  { title: 'Cloud Lambda', category: 'SCALE', metric: 'Multi-Region CI', color: '#0EA5E9' },
];

const Act5BentoMatrixClimax: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 2250;

  // Semantic Match-Cut Zoom Entrance
  const enterScale = interpolate(actFrame, [0, 20], [0.90, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Continuous Camera Push-In & 3D Tilt Drift
  const camScale = interpolate(actFrame, [0, 450], [1.0, 1.04]);
  const camTiltY = Math.sin(frame * 0.02) * 2.0;
  const camDriftY = Math.cos(frame * 0.016) * 6;

  // Final CTA Settle Spring
  const settleSpring = spring({
    frame: actFrame - 135,
    fps,
    config: motionTokens.spring.snappy,
  });

  // Continuous Diagonal Specular Shimmer Wave (sweeping every 90 frames = 1.5s)
  const shimmerCycle = (actFrame % 90) / 90;
  const shimmerPos = interpolate(shimmerCycle, [0, 1], [-120, 220]);

  // Simulated Interactive Developer Cursor path across modules
  const cursorProgress = interpolate(actFrame, [140, 260, 310], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorX = interpolate(cursorProgress, [0, 0.4, 0.8, 1], [240, 680, 520, 520]);
  const cursorY = interpolate(cursorProgress, [0, 0.4, 0.8, 1], [380, 520, 840, 840]);
  const isCtaClicked = actFrame >= 270;

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(actFrame, [0, 16], [0, 1], { extrapolateLeft: 'clamp' }),
        transform: `scale(${enterScale * camScale}) rotateY(${camTiltY}deg) translateY(${camDriftY}px)`,
        position: 'relative',
      }}
    >
      {/* Top Editorial Eyebrow */}
      <SafeTextContainer
        text="REA ARCHITECTURE MATRIX // 12 MODULES"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 10 }}
      />

      {/* Main Authoritative Headline */}
      <SafeTextContainer
        text="REA v2.4.0 Studio Matrix"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={54}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 24 }}
      />

      {/* 4×3 Bento Grid (12 Connected Modules) with Diagonal Shimmer */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          boxSizing: 'border-box',
          marginBottom: 26,
          position: 'relative',
        }}
      >
        {BENTO_TILES.map((tile, idx) => {
          const tileSpring = spring({
            frame: actFrame - 15 - idx * 8,
            fps,
            config: motionTokens.spring.snappy,
          });

          return (
            <div
              key={idx}
              style={{
                borderRadius: 18,
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(24px)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                minHeight: 110,
                transform: `scale(${interpolate(tileSpring, [0, 1], [0.85, 1])})`,
                opacity: interpolate(tileSpring, [0, 1], [0, 1]),
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer Light Bar */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: `linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.4) ${shimmerPos}%, transparent ${shimmerPos + 35}%)`,
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 900,
                    color: tile.color,
                  }}
                >
                  {tile.category}
                </span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: tile.color,
                    boxShadow: `0 0 8px ${tile.color}`,
                  }}
                />
              </div>

              <SafeTextContainer
                text={tile.title}
                containerWidth={SAFE_CONTENT_WIDTH / 3 - 50}
                baseFontSize={19}
                color={SLATE_DARK}
                fontWeight={800}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              />

              <SafeTextContainer
                text={tile.metric}
                containerWidth={SAFE_CONTENT_WIDTH / 3 - 50}
                baseFontSize={13}
                color={SLATE_MUTED}
                fontWeight={600}
                fontFamily="'JetBrains Mono', monospace"
              />
            </div>
          );
        })}
      </div>

      {/* Climax Bottom CTA Pill */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 999,
          background: SLATE_DARK,
          border: isCtaClicked ? '2.5px solid #10B981' : '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isCtaClicked
            ? '0 20px 60px rgba(16, 185, 129, 0.4), 0 0 35px #10B981'
            : '0 20px 60px rgba(15, 23, 42, 0.25)',
          padding: '18px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          boxSizing: 'border-box',
          opacity: interpolate(settleSpring, [0.3, 1], [0, 1]),
          transform: `scale(${isCtaClicked ? 0.98 : interpolate(settleSpring, [0.3, 1], [0.92, 1])})`,
          transition: 'none',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: EMERALD_ACCENT,
            color: SLATE_DARK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            fontWeight: 900,
            flexShrink: 0,
            boxShadow: `0 0 16px ${EMERALD_ACCENT}`,
          }}
        >
          ✔
        </div>
        <BrandLogo name="remotion" size={26} color="#FFFFFF" glow glowColor="rgba(16, 185, 129, 0.8)" />
        <SafeTextContainer
          text="REA v2.4.0 — Your Autonomous Motion Design Studio"
          containerWidth={SAFE_CONTENT_WIDTH - 120}
          baseFontSize={23}
          color="#FFFFFF"
          fontWeight={800}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          textAlign="center"
        />
      </div>

      {/* Simulated Interactive Developer Cursor (Frames 140 - 320) */}
      {actFrame >= 130 && (
        <div
          style={{
            position: 'absolute',
            top: cursorY,
            left: cursorX,
            pointerEvents: 'none',
            zIndex: 99,
            transform: isCtaClicked ? 'scale(0.88)' : 'scale(1)',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L10.5 20L13.5 13.5L20 10.5L4 4Z" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Showcase Composition Component (45.0s @ 60 FPS = 2,700 Frames)
// ---------------------------------------------------------------------------
export const ReaSystemArchitectureShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous Camera Push-In & 3D Spatial Drift (Guarantees zero static hold frames)
  const masterCameraScale = 1.0 + Math.sin(frame * 0.007) * 0.014 + (frame / 2700) * 0.022;
  const masterCameraRotX = Math.sin(frame * 0.005) * 0.35;
  const masterCameraRotY = Math.cos(frame * 0.006) * 0.45;
  const masterCameraTransY = Math.sin(frame * 0.009) * 4.5;

  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS_BG, overflow: 'hidden' }}>
      {/* 1. Master Underscore: 125 BPM Minimal Tech Pulse with Beat-Synced Sidechain Ducking */}
      <Loop durationInFrames={922}>
        <Audio
          src={staticFile('audio/music_library/minimal_tech_pulse_125bpm.wav')}
          volume={(f) => {
            const beatPhase = (f % 28.8) / 28.8;
            return interpolate(beatPhase, [0, 0.12, 0.45, 1], [0.26, 0.44, 0.38, 0.28]);
          }}
        />
      </Loop>

      {/* 2. Pure Event-Locked Foley Bed (122 cues: keycap thocks, card snaps, velvet whooshes, celesta accents) */}
      <Audio
        src={staticFile('audio/rea_showcase_event_locked_sfx.wav')}
        volume={0.94}
      />

      {/* 3. Base High-Key Oyster Canvas + 4-Point Chromatic Mesh */}
      <OysterChromaticMesh frame={frame} />

      {/* 4. Continuous Cinematic 3D Camera Rig */}
      <div
        style={{
          width: '100%',
          height: '100%',
          perspective: 1400,
          transform: `scale(${masterCameraScale}) rotateX(${masterCameraRotX}deg) rotateY(${masterCameraRotY}deg) translateY(${masterCameraTransY}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Act 1: The Hook — "Prompts to Broadcast Video" (Frames 0 – 450 | 0.0s – 7.5s) */}
        {frame < 452 && <Act1HookPipeline frame={frame} fps={fps} />}

        {/* Act 2: The 11 Certified Studio Engines (Frames 450 – 1,080 | 7.5s – 18.0s) */}
        {frame >= 445 && frame < 1082 && <Act2EngineCoverflow frame={frame} fps={fps} />}

        {/* Act 3: The Polish & Determinism Core (Frames 1,080 – 1,710 | 18.0s – 28.5s) */}
        {frame >= 1075 && frame < 1712 && <Act3DeterminismWorkbench frame={frame} fps={fps} />}

        {/* Act 4: Automated Quality Gatekeeper & Cloud Scale (Frames 1,710 – 2,250 | 28.5s – 37.5s) */}
        {frame >= 1705 && frame < 2252 && <Act4TerminalGatekeeper frame={frame} fps={fps} />}

        {/* Act 5: Climax 4×3 System Architecture Bento Matrix (Frames 2,250 – 2,700 | 37.5s – 45.0s) */}
        {frame >= 2245 && <Act5BentoMatrixClimax frame={frame} fps={fps} />}
      </div>
    </AbsoluteFill>
  );
};
