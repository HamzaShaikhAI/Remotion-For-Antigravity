import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
} from 'remotion';
import { SafeTextContainer } from '../engines/typography/SafeTextContainer.tsx';
import { motionTokens } from '../tokens/motion.ts';
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
          backgroundSize: '4px 4px',
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 1: The Hook — "Prompts to Broadcast Video" (Frames 0 – 450)
// ---------------------------------------------------------------------------
const Act1HookPipeline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.85 },
  });

  const fullPromptText = 'rea create "What if the Sun vanished?" --style=auto';
  // Typing progress from frame 25 to 160
  const typedCharCount = Math.min(
    fullPromptText.length,
    Math.max(0, Math.floor(interpolate(frame, [25, 160], [0, fullPromptText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );
  const displayedText = fullPromptText.slice(0, typedCharCount);
  const cursorBlink = Math.floor(frame / 18) % 2 === 0 ? '█' : ' ';

  // Match-cut expansion from command bar into 4-stage pipeline (frame 180 to 240)
  const expandProgress = spring({
    frame: frame - 180,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
  });

  // Stage nodes activation springs
  const s1Spring = spring({ frame: frame - 195, fps, config: motionTokens.spring.snappy });
  const s2Spring = spring({ frame: frame - 215, fps, config: motionTokens.spring.snappy });
  const s3Spring = spring({ frame: frame - 235, fps, config: motionTokens.spring.snappy });
  const s4Spring = spring({ frame: frame - 255, fps, config: motionTokens.spring.snappy });

  const stages = [
    { num: '01', title: 'DIRECTING PROMPT', desc: 'Vision-grounded natural language specification', color: '#3B82F6', springVal: s1Spring },
    { num: '02', title: 'STYLE CACHE (0-PASS A+)', desc: 'Zero-hallucination aesthetic locked AST', color: '#10B981', springVal: s2Spring },
    { num: '03', title: 'DETERMINISTIC AST', desc: 'Frame-clock synchronized React + Remotion graph', color: '#8B5CF6', springVal: s3Spring },
    { num: '04', title: '4K/60FPS MP4 RENDER', desc: 'Distributed multi-threaded headless chromium render', color: '#F59E0B', springVal: s4Spring },
  ];

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [0, 20, 420, 450], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(enterSpring, [0, 1], [40, 0])}px) scale(${interpolate(enterSpring, [0, 1], [0.94, 1])})`,
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
        style={{ marginBottom: 16 }}
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
        style={{ marginBottom: 24 }}
      />

      {/* 3D Glassmorphic Command Bar */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.84)',
          backdropFilter: 'blur(28px)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxSizing: 'border-box',
          marginBottom: 24,
          transform: `scale(${interpolate(expandProgress, [0, 0.5, 1], [1, 1.02, 1])})`,
        }}
      >
        {/* Terminal Indicator */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: frame >= 180 ? EMERALD_ACCENT : AMBER_ACCENT,
            boxShadow: `0 0 12px ${frame >= 180 ? EMERALD_ACCENT : AMBER_ACCENT}`,
            flexShrink: 0,
          }}
        />

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
          gap: 14,
          opacity: interpolate(expandProgress, [0, 0.3, 1], [0, 0.8, 1]),
          transform: `translateY(${interpolate(expandProgress, [0, 1], [25, 0])}px)`,
        }}
      >
        {stages.map((st, idx) => (
          <div
            key={idx}
            style={{
              width: '100%',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(24px)',
              border: `1.5px solid rgba(255, 255, 255, 0.9)`,
              boxShadow: '0 14px 36px rgba(15, 23, 42, 0.05)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxSizing: 'border-box',
              opacity: interpolate(st.springVal, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(st.springVal, [0, 1], [-25, 0])}px) scale(${interpolate(st.springVal, [0, 1], [0.95, 1])})`,
            }}
          >
            {/* Stage Number Badge */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: st.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                fontWeight: 900,
                flexShrink: 0,
                boxShadow: `0 8px 18px ${st.color}55`,
              }}
            >
              {st.num}
            </div>

            {/* Stage Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SafeTextContainer
                text={st.title}
                containerWidth={SAFE_CONTENT_WIDTH - 150}
                baseFontSize={20}
                color={SLATE_DARK}
                fontWeight={800}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              />
              <SafeTextContainer
                text={st.desc}
                containerWidth={SAFE_CONTENT_WIDTH - 150}
                baseFontSize={16}
                color={SLATE_MUTED}
                fontWeight={500}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              />
            </div>

            {/* Status Tick */}
            <div
              style={{
                color: EMERALD_ACCENT,
                fontSize: 20,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ✔
            </div>
          </div>
        ))}
      </div>

      {/* Kinetic Callout Footer */}
      <div
        style={{
          marginTop: 22,
          padding: '12px 28px',
          borderRadius: 999,
          background: 'rgba(15, 23, 42, 0.92)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
          opacity: interpolate(s4Spring, [0, 1], [0, 1]),
          transform: `scale(${interpolate(s4Spring, [0, 1], [0.9, 1])})`,
        }}
      >
        <SafeTextContainer
          text="Zero crude SVGs. 100% deterministic code."
          containerWidth={SAFE_CONTENT_WIDTH - 80}
          baseFontSize={19}
          color="#FFFFFF"
          fontWeight={700}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          textAlign="center"
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 2: The 11 Certified Studio Engines (Frames 450 – 1,080)
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
  { id: '04', name: 'RicksClips Hybrid 2.5D', fpsTag: '30 FPS VIRAL', themeColor: '#EC4899', previewTitle: '3D Dusty Frontier Perspective', previewSub: '72px stroke captions & saloon duel standoff', aesthetic: 'Viral Character Explainer' },
  { id: '05', name: 'Pelagos Robotics HUD', fpsTag: '60 FPS TELEMETRY', themeColor: '#06B6D4', previewTitle: 'Articulated Subsea Cephalopod', previewSub: 'Depth telemetry & 360° sonar scan lines', aesthetic: 'Braun Engineering HUD' },
  { id: '06', name: 'CAD Liquid Chrome', fpsTag: '60 FPS RAY-TRACED', themeColor: '#64748B', previewTitle: 'Millimeter Calipers & Chrome Emblem', previewSub: 'Liquid reflection & metallic highlights', aesthetic: 'Industrial Luxury CAD' },
  { id: '07', name: 'Anime OP 175 BPM', fpsTag: '24 FPS BEAT-GRID', themeColor: '#EF4444', previewTitle: 'Fractional Beat-Grid Sync', previewSub: 'Pixel idol sprites & neon speedlines', aesthetic: 'J-Pop Idol Anime MV' },
  { id: '08', name: 'Living Pixel Art', fpsTag: '12 FPS INTEGER GRID', themeColor: '#10B981', previewTitle: 'Procedural Rain & Lantern Glow', previewSub: 'Nearest-neighbor scaling & pixel audio loop', aesthetic: 'Claude Fable Pixel Art' },
  { id: '09', name: 'Zhang Heng Seismo', fpsTag: '30 FPS HISTORICAL', themeColor: '#D97706', previewTitle: 'Bronze Dragon Telemetry', previewSub: 'Seismic wave detection & pendulum physics', aesthetic: 'Ancient Scientific Instrument' },
  { id: '10', name: 'Neutron Star Core', fpsTag: '60 FPS RELATIVISTIC', themeColor: '#6366F1', previewTitle: 'Magnetic Pulsar Radiations', previewSub: 'Subatomic particle jets & gravitational warp', aesthetic: 'Deep Astrophysics Vector' },
  { id: '11', name: 'Zenitsu Anime Shonen', fpsTag: '60 FPS PHONK EDIT', themeColor: '#EAB308', previewTitle: 'Thunder God Aura & 808 Shockwaves', previewSub: 'Sub-bass beat drops & time-freeze frames', aesthetic: 'High-Octane Battle Anime' },
];

const Act2EngineCoverflow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Act 2 spans frames 450 to 1080 (630 frames = 10.5s)
  const actFrame = frame - 450;

  // Carousel sweep progress across the 11 engines
  // Smoothly advances through engine indices 0 to 10
  const carouselIndex = Math.min(
    10,
    Math.max(0, interpolate(actFrame, [30, 580], [0, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  );
  const activeIdx = Math.round(carouselIndex);
  const activeEngine = CERTIFIED_ENGINES[activeIdx];

  // Circular progress ring value (0 to 1)
  const progressRatio = (activeIdx + 1) / CERTIFIED_ENGINES.length;
  const strokeDashoffset = 283 * (1 - progressRatio);

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [450, 480, 1050, 1080], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}
    >
      {/* Top Header with Circular Progress Ring */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SafeTextContainer
            text="REA STUDIO ECOSYSTEM"
            containerWidth={SAFE_CONTENT_WIDTH - 160}
            baseFontSize={18}
            color={SLATE_MUTED}
            fontWeight={800}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing={3}
          />
          <SafeTextContainer
            text="11 Certified Visual Engines"
            containerWidth={SAFE_CONTENT_WIDTH - 160}
            baseFontSize={46}
            color={SLATE_DARK}
            fontWeight={900}
            fontFamily="'Playfair Display', Georgia, serif"
          />
        </div>

        {/* Circular SVG Progress Ring (Ticking 01/11 to 11/11) */}
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <svg width={90} height={90} viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx={50}
              cy={50}
              r={45}
              fill="none"
              stroke="rgba(15, 23, 42, 0.08)"
              strokeWidth={8}
            />
            {/* Animated Active Stroke */}
            <circle
              cx={50}
              cy={50}
              r={45}
              fill="none"
              stroke={EMERALD_ACCENT}
              strokeWidth={8}
              strokeDasharray={283}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              fontWeight: 900,
              color: SLATE_DARK,
            }}
          >
            <span>{String(activeIdx + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 11, color: SLATE_MUTED }}>/11</span>
          </div>
        </div>
      </div>

      {/* 3D Perspective Coverflow Carousel Container */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          height: 640,
          perspective: 1200,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {CERTIFIED_ENGINES.map((eng, idx) => {
          const offset = idx - carouselIndex;
          if (Math.abs(offset) > 2.2) return null; // Cull distant cards

          const translateX = offset * 340;
          const translateZ = -Math.abs(offset) * 220;
          const rotateY = Math.max(-28, Math.min(28, -offset * 20));
          const scale = Math.max(0.78, 1 - Math.abs(offset) * 0.14);
          const opacity = Math.max(0, 1 - Math.abs(offset) * 0.45);
          const isCenter = Math.abs(offset) < 0.5;

          return (
            <div
              key={eng.id}
              style={{
                position: 'absolute',
                width: 580,
                height: 580,
                borderRadius: 28,
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(28px)',
                border: isCenter
                  ? `2.5px solid ${eng.themeColor}`
                  : '1.5px solid rgba(255, 255, 255, 0.8)',
                boxShadow: isCenter
                  ? `0 30px 80px rgba(15, 23, 42, 0.16), 0 0 35px ${eng.themeColor}33`
                  : '0 16px 40px rgba(15, 23, 42, 0.08)',
                padding: 36,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: Math.round(100 - Math.abs(offset) * 10),
              }}
            >
              {/* Card Top Row: Engine Number & FPS Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 10,
                    backgroundColor: eng.themeColor,
                    color: '#FFFFFF',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16,
                    fontWeight: 900,
                  }}
                >
                  ENGINE {eng.id}
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(15, 23, 42, 0.06)',
                    color: SLATE_DARK,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  {eng.fpsTag}
                </div>
              </div>

              {/* Card Center: Live Micro-Preview Graphical Plate */}
              <div
                style={{
                  width: '100%',
                  height: 260,
                  borderRadius: 18,
                  backgroundColor: SLATE_DARK,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 20,
                  boxSizing: 'border-box',
                }}
              >
                {/* Visual Graphic Representation */}
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
          1.20 Hits/Sec Foley Sync
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 3: The Polish & Determinism Core (Frames 1,080 – 1,710)
// ---------------------------------------------------------------------------
const Act3DeterminismWorkbench: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Act 3 spans frames 1080 to 1710 (630 frames = 10.5s)
  const actFrame = frame - 1080;

  // Module 1: SafeTextContainer Dynamic Length Stress-Test
  // Headline dynamically expands from 12 chars to 48 chars from frame 60 to 300
  const stressProgress = interpolate(actFrame, [60, 240, 420, 560], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stressShortText = 'KINETIC TITLE';
  const stressLongText = 'KINETIC HYBRID 2.5D HIGH-RETENTION MASTER STORY';
  const charSlice = Math.round(interpolate(stressProgress, [0, 1], [stressShortText.length, stressLongText.length]));
  const dynamicStressText = stressLongText.slice(0, Math.max(stressShortText.length, charSlice));
  
  // Real-time computed safe font size: 54px down to 26px
  const liveFontSize = Math.round(interpolate(stressProgress, [0, 1], [54, 26]));

  // Module 3: Scrolling 1.20 hits/sec audio waveform markers
  // Every 50 frames @ 60 FPS fires a tactile marker
  const waveformPhase = (actFrame * 3.5) % 360;

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [1080, 1110, 1680, 1710], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
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
        style={{ marginBottom: 32 }}
      />

      {/* 3 Split Workbench Guarantee Cards */}
      <div style={{ width: SAFE_CONTENT_WIDTH, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Guarantee 1: Zero-Overflow SafeTextContainer */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: EMERALD_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                1. ZERO-OVERFLOW TYPOGRAPHY
              </span>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: EMERALD_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              computeSafeFontSize(): {liveFontSize}px
            </div>
          </div>

          {/* Strict 5px solid #0F172A Bounding Box Stress Demo */}
          <div
            style={{
              width: '100%',
              height: 110,
              border: '5px solid #0F172A',
              borderRadius: 14,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <SafeTextContainer
              text={dynamicStressText}
              containerWidth={SAFE_CONTENT_WIDTH - 90}
              baseFontSize={liveFontSize}
              minFontSize={24}
              autoScale={false}
              color={SLATE_DARK}
              fontWeight={900}
              fontFamily="'Plus Jakarta Sans', sans-serif"
              textAlign="center"
            />
            {/* Safe Box Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 800,
                color: 'rgba(15, 23, 42, 0.35)',
              }}
            >
              BOUNDING BOX CLAMPED • 0px CLIPPING
            </div>
          </div>
        </div>

        {/* Guarantee 2: Frame-Clock Determinism */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: CYAN_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                2. FRAME-CLOCK DETERMINISM
              </span>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                color: CYAN_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              tl.seek(frame / 60)
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {/* Left: Non-Deterministic Random Disqualified */}
            <div
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 900, color: '#EF4444' }}>
                ✕ Non-Deterministic Random (BANNED)
              </span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: SLATE_MUTED }}>
                Thread race conditions, frame tearing, and non-reproducible artifacts.
              </span>
            </div>

            {/* Right: REA Deterministic Clock */}
            <div
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 900, color: EMERALD_ACCENT }}>
                ✔ useCurrentFrame() + LCG
              </span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: SLATE_DARK, fontWeight: 600 }}>
                Bit-identical multi-threaded rendering across local & cloud clusters.
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee 3: 1.20 Hits/Sec Psychoacoustic Foley */}
        <div
          style={{
            width: '100%',
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(28px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: AMBER_ACCENT }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: SLATE_DARK }}>
                3. PSYCHOACOUSTIC FOLEY SCHEDULER
              </span>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: AMBER_ACCENT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              1.20 Hits/Sec (Every 50f @ 60FPS)
            </div>
          </div>

          {/* Scrolling Waveform & Foley Markers */}
          <div
            style={{
              width: '100%',
              height: 72,
              borderRadius: 12,
              backgroundColor: SLATE_DARK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 16px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {Array.from({ length: 36 }).map((_, barIdx) => {
              const barH = 16 + Math.abs(Math.sin((barIdx * 12 + waveformPhase) * (Math.PI / 180))) * 38;
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

          {/* Foley Cue Tags */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            {['mechanical_click', 'whoosh_fast', 'card_pop', 'paper_slide', 'impact_thud'].map((sfx, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: SLATE_MUTED,
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(15, 23, 42, 0.04)',
                }}
              >
                {sfx}
              </span>
            ))}
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 4: Automated Quality Gatekeeper & Cloud Scale (Frames 1,710 – 2,250)
// ---------------------------------------------------------------------------
const Act4TerminalGatekeeper: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Act 4 spans frames 1710 to 2250 (540 frames = 9.0s)
  const actFrame = frame - 1710;

  // Snappy spring checkmarks for CI verification steps
  const c1Spring = spring({ frame: actFrame - 40, fps, config: { damping: 10, stiffness: 280, mass: 0.4 } });
  const c2Spring = spring({ frame: actFrame - 100, fps, config: { damping: 10, stiffness: 280, mass: 0.4 } });
  const c3Spring = spring({ frame: actFrame - 160, fps, config: { damping: 10, stiffness: 280, mass: 0.4 } });
  const c4Spring = spring({ frame: actFrame - 220, fps, config: { damping: 10, stiffness: 280, mass: 0.4 } });

  const terminalChecks = [
    {
      cmd: 'npx tsc --noEmit',
      result: '0 TypeScript errors (Strict AST Verified)',
      springVal: c1Spring,
      color: '#38BDF8',
    },
    {
      cmd: 'rea motion-lint',
      result: '294/294 files compliant with MOTION.md (Zero linear transitions)',
      springVal: c2Spring,
      color: '#34D399',
    },
    {
      cmd: 'rea audit-polish',
      result: '0 overflow warnings · 1.20 hits/s audio verified',
      springVal: c3Spring,
      color: '#A78BFA',
    },
    {
      cmd: 'rea lambda-render --multi-region',
      result: 'ap-south-1 → us-east-1 failover ready (<3s cold start · 128 workers)',
      springVal: c4Spring,
      color: '#FBBF24',
    },
  ];

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [1710, 1740, 2220, 2250], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}
    >
      {/* Top Editorial Eyebrow */}
      <SafeTextContainer
        text="CI/CD AUTOMATED GATEKEEPER"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={SLATE_MUTED}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 12 }}
      />
      <SafeTextContainer
        text="Automated Verification Suite"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={50}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 36 }}
      />

      {/* Dark Terminal Workbench (#0F172A) */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 24,
          backgroundColor: SLATE_DARK,
          border: '1.5px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28), 0 0 40px rgba(6, 182, 212, 0.12)',
          padding: '28px 32px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Terminal Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>
            rea-quality-gatekeeper — bash — 1080×1920 @ 60fps
          </span>
          <div style={{ width: 40 }} />
        </div>

        {/* Terminal Checks */}
        {terminalChecks.map((tc, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              opacity: interpolate(tc.springVal, [0, 1], [0.15, 1]),
            }}
          >
            {/* Command Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800 }}>
                &gt;
              </span>
              <span style={{ color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700 }}>
                {tc.cmd}
              </span>
            </div>

            {/* Checkmark and Result Line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginLeft: 20,
                transform: `scale(${interpolate(tc.springVal, [0, 1], [0.8, 1])})`,
                transformOrigin: 'left center',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  backgroundColor: EMERALD_ACCENT,
                  color: SLATE_DARK,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 16,
                  fontWeight: 900,
                  boxShadow: `0 0 16px ${EMERALD_ACCENT}88`,
                }}
              >
                ✔
              </div>
              <SafeTextContainer
                text={tc.result}
                containerWidth={SAFE_CONTENT_WIDTH - 140}
                baseFontSize={19}
                color="#E2E8F0"
                fontWeight={600}
                fontFamily="'JetBrains Mono', monospace"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Status Pill */}
      <div
        style={{
          marginTop: 32,
          padding: '14px 32px',
          borderRadius: 999,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)',
        }}
      >
        <span style={{ color: EMERALD_ACCENT, fontSize: 20, fontWeight: 900 }}>✔</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 900, color: SLATE_DARK }}>
          PASS RATE: 100.0% · GRADE A+ PRODUCTION CERTIFIED
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 5: Climax 4×3 System Architecture Bento Matrix (Frames 2,250 – 2,700)
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
  { title: 'MicroSfx', category: 'AUDIO BED', metric: '1.20 Hits/Sec', color: '#F97316' },
  { title: 'Cloud Lambda', category: 'SCALE', metric: 'Multi-Region CI', color: '#0EA5E9' },
];

const Act5BentoMatrixClimax: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Act 5 spans frames 2250 to 2700 (450 frames = 7.5s)
  const actFrame = frame - 2250;

  // Climax camera pull-back with heavy cinematic settling
  const settleSpring = spring({
    frame: actFrame,
    fps,
    config: { damping: 16, stiffness: 130, mass: 1.0 },
  });

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_ZONE_TOP,
        paddingBottom: SAFE_ZONE_BOTTOM,
        paddingLeft: 40,
        paddingRight: SAFE_ZONE_RIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [2250, 2280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `scale(${interpolate(settleSpring, [0, 1], [1.08, 1])}) translateY(${interpolate(settleSpring, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Top Climax Header */}
      <SafeTextContainer
        text="AUTONOMOUS MOTION DESIGN ARCHITECTURE"
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
        text="REA v2.4.0 Studio Matrix"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={54}
        color={SLATE_DARK}
        fontWeight={900}
        fontFamily="'Playfair Display', Georgia, serif"
        textAlign="center"
        style={{ marginBottom: 28 }}
      />

      {/* 4×3 Bento Grid (12 Connected Modules) */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          boxSizing: 'border-box',
          marginBottom: 32,
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
                background: 'rgba(255, 255, 255, 0.86)',
                backdropFilter: 'blur(24px)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                minHeight: 115,
                transform: `scale(${interpolate(tileSpring, [0, 1], [0.85, 1])})`,
                opacity: interpolate(tileSpring, [0, 1], [0, 1]),
              }}
            >
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
                baseFontSize={20}
                color={SLATE_DARK}
                fontWeight={800}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              />

              <SafeTextContainer
                text={tile.metric}
                containerWidth={SAFE_CONTENT_WIDTH / 3 - 50}
                baseFontSize={14}
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
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25), 0 0 30px rgba(16, 185, 129, 0.2)',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          boxSizing: 'border-box',
          opacity: interpolate(settleSpring, [0.3, 1], [0, 1]),
          transform: `scale(${interpolate(settleSpring, [0.3, 1], [0.92, 1])})`,
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
          }}
        >
          ✔
        </div>
        <SafeTextContainer
          text="REA v2.4.0 — Your Autonomous Motion Design Studio"
          containerWidth={SAFE_CONTENT_WIDTH - 120}
          baseFontSize={24}
          color="#FFFFFF"
          fontWeight={800}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          textAlign="center"
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Showcase Composition Component (45.0s @ 60 FPS = 2,700 Frames)
// ---------------------------------------------------------------------------
export const ReaSystemArchitectureShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic ducking calculation: ducks music during high-impact moments
  const musicVolume = useMemo(() => {
    // Duck at Act transitions (frames ~450, 1080, 1710, 2250)
    if (
      (frame >= 430 && frame <= 470) ||
      (frame >= 1060 && frame <= 1100) ||
      (frame >= 1690 && frame <= 1730) ||
      (frame >= 2230 && frame <= 2270)
    ) {
      return 0.25;
    }
    return 0.52;
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS_BG, overflow: 'hidden' }}>
      {/* 1. Event-Locked 44.1 kHz Frame-Exact Foley Bed (105 Cues Aligned 1:1) */}
      <Audio
        src={staticFile('audio/rea_showcase_event_locked_sfx.wav')}
        volume={0.95}
      />

      {/* 2. Ambient Electronic / Lo-Fi Studio Underscore (Ducked to 0.20 for Vocal/SFX Clarity) */}
      <Audio
        src={staticFile('audio/rea_architecture_music_45s.wav')}
        volume={musicVolume * 0.40}
      />

      {/* 3. Base High-Key Oyster Canvas + 4-Point Chromatic Mesh */}
      <OysterChromaticMesh frame={frame} />

      {/* Act 1: The Hook — "Prompts to Broadcast Video" (Frames 0 – 450 | 0.0s – 7.5s) */}
      {frame < 460 && <Act1HookPipeline frame={frame} fps={fps} />}

      {/* Act 2: The 11 Certified Studio Engines (Frames 450 – 1,080 | 7.5s – 18.0s) */}
      {frame >= 440 && frame < 1090 && <Act2EngineCoverflow frame={frame} fps={fps} />}

      {/* Act 3: The Polish & Determinism Core (Frames 1,080 – 1,710 | 18.0s – 28.5s) */}
      {frame >= 1070 && frame < 1720 && <Act3DeterminismWorkbench frame={frame} fps={fps} />}

      {/* Act 4: Automated Quality Gatekeeper & Cloud Scale (Frames 1,710 – 2,250 | 28.5s – 37.5s) */}
      {frame >= 1700 && frame < 2260 && <Act4TerminalGatekeeper frame={frame} fps={fps} />}

      {/* Act 5: Climax 4×3 System Architecture Bento Matrix (Frames 2,250 – 2,700 | 37.5s – 45.0s) */}
      {frame >= 2240 && <Act5BentoMatrixClimax frame={frame} fps={fps} />}
    </AbsoluteFill>
  );
};
