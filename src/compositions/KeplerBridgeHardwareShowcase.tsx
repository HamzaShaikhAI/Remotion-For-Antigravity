import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
  Audio,
} from 'remotion';
import { SafeTextContainer } from '../engines/typography/SafeTextContainer.tsx';
import { motionTokens } from '../tokens/motion.ts';
import { BrandLogo } from '../tokens/logos/BrandLogo.tsx';
import { getTypographyPreset } from '../tokens/typography/index.ts';
import { paperTextures, linearMetals, glassmorphism } from '../tokens/gradients/index.tsx';
import {
  KEPLER_ACT_BOUNDARIES,
  ACT1_GIT_COMMAND,
  ACT2_CALLOUT_EVENTS,
  ACT3_TELEMETRY_GAUGES,
  ACT4_BENCHMARK_STEPS,
  ACT5_PILL_EVENTS,
} from './keplerShowcaseEvents.ts';

// ---------------------------------------------------------------------------
// Design Constants & Colors (Industrial CAD Blueprint Palette)
// ---------------------------------------------------------------------------
const OBSIDIAN_BG = '#05070A';
const SLATE_DEEP = '#0B1120';
const CYAN_BLUEPRINT = '#00F5FF';
const CYAN_MUTED = 'rgba(0, 245, 255, 0.35)';
const GOLD_PCIE = '#F59E0B';
const EMERALD_PASS = '#10B981';
const SLATE_LIGHT = '#F1F5F9';
const SLATE_MUTED = '#94A3B8';

// Mobile 9:16 Safe Zones
const SAFE_ZONE_TOP = 140;
const SAFE_ZONE_BOTTOM = 280;
const SAFE_ZONE_RIGHT = 90;
const SAFE_CONTENT_WIDTH = 1080 - SAFE_ZONE_RIGHT - 40; // ~950px

const swissIndustrial = getTypographyPreset('swissIndustrial');
const subseaTelemetry = getTypographyPreset('subseaTelemetry');

// ---------------------------------------------------------------------------
// 1. Engineering CAD Drafting Grid & Millimeter Coordinate Calipers
// ---------------------------------------------------------------------------
const CadDraftingGrid: React.FC<{ frame: number }> = ({ frame }) => {
  // Harmonic 1.2 px/sec drift
  const driftY = (frame * 0.4) % 40;
  const driftX = (frame * 0.25) % 40;
  const subsea = subseaTelemetry;

  return (
    <AbsoluteFill
      style={{
        ...paperTextures.blueprintGrid,
        backgroundColor: OBSIDIAN_BG,
        backgroundPosition: `${-driftX}px ${-driftY}px`,
        overflow: 'hidden',
      }}
    >
      {/* 20x20mm Technical Grid Pattern */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: -driftY,
          left: -driftX,
          opacity: 0.28,
        }}
      >
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 245, 255, 0.18)" strokeWidth="0.75" />
          </pattern>
          <pattern id="cadGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 245, 255, 0.45)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="1.5" fill={CYAN_BLUEPRINT} />
          </pattern>
        </defs>
        <rect width="120%" height="120%" fill="url(#cadGrid)" />
      </svg>

      {/* Blueprint Vignette and Radial Ambient Core */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Technical Corner Coordinate Badges */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <BrandLogo name="nvidia" size={22} color="#76B900" glow glowColor="rgba(118, 185, 0, 0.6)" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            fontFamily: subsea.fontFamily,
            fontSize: 11,
            color: subsea.color,
            textShadow: subsea.textShadow,
            letterSpacing: '0.12em',
          }}
        >
          <span>SPEC-GK107-D3D12 // KEPLERBRIDGE</span>
          <span>LAT: 37°23'19"N · LON: 121°58'48"W</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 48,
          right: SAFE_ZONE_RIGHT,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: CYAN_MUTED,
          textAlign: 'right',
        }}
      >
        <span>FRAME-CLOCK // 60.00 FPS</span>
        <br />
        <span>F:{String(frame).padStart(4, '0')} / 2700</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 1: The Hook — Repository & Hardware Awakening (Frames 0 – 450)
// ---------------------------------------------------------------------------
const Act1RepoAwakening: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.85 },
  });

  // Typing git clone https://github.com/HamzaShaikhAI/KeplerBridge.git
  const typedCharCount = Math.min(
    ACT1_GIT_COMMAND.length,
    Math.max(0, Math.floor(interpolate(frame, [15, 175], [0, ACT1_GIT_COMMAND.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );
  const displayedCommand = ACT1_GIT_COMMAND.slice(0, typedCharCount);
  const cursorBlink = Math.floor(frame / 16) % 2 === 0 ? '█' : ' ';

  // Match-cut expansion at frame 180
  const expandProgress = spring({
    frame: frame - 180,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
  });

  // Caliper & PCB vector outline drawing progress (frames 200 – 320)
  const caliperProgress = interpolate(frame, [200, 310], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineSpring = spring({ frame: frame - 310, fps, config: motionTokens.spring.snappy });

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
        transform: `translateY(${interpolate(enterSpring, [0, 1], [40, 0])}px)`,
      }}
    >
      {/* Eyebrow Label */}
      <SafeTextContainer
        text="OPEN-SOURCE SILICON REVIVAL // REPO ENTRY"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={CYAN_BLUEPRINT}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 16 }}
      />

      {/* Main Authoritative Headline */}
      <SafeTextContainer
        text="KeplerBridge: Legacy Silicon, Modern Pipeline."
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={48}
        color={swissIndustrial.color}
        fontWeight={swissIndustrial.fontWeight}
        fontFamily={swissIndustrial.fontFamily}
        lineHeight={1.15}
        textAlign="center"
        style={{ marginBottom: 28, textShadow: swissIndustrial.textShadow }}
      />

      {/* Engineering Command Bar */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 18,
          background: 'rgba(15, 23, 42, 0.90)',
          backdropFilter: 'blur(28px)',
          border: '1.5px solid rgba(0, 245, 255, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 245, 255, 0.15)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxSizing: 'border-box',
          marginBottom: 28,
          transform: `scale(${interpolate(expandProgress, [0, 0.5, 1], [1, 1.02, 1])})`,
        }}
      >
        <BrandLogo name="nvidia" size={24} color="#76B900" glow glowColor="rgba(118, 185, 0, 0.5)" />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: frame >= 180 ? EMERALD_PASS : GOLD_PCIE,
            boxShadow: `0 0 12px ${frame >= 180 ? EMERALD_PASS : GOLD_PCIE}`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SafeTextContainer
            text={`$ ${displayedCommand}${frame < 180 ? cursorBlink : ''}`}
            containerWidth={SAFE_CONTENT_WIDTH - 180}
            baseFontSize={19}
            minFontSize={15}
            color={CYAN_BLUEPRINT}
            fontWeight={700}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing={0.5}
            textStyle={{ whiteSpace: 'nowrap' }}
          />
        </div>
        <div
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: 8,
            backgroundColor: frame >= 180 ? 'rgba(0, 245, 255, 0.20)' : 'rgba(255, 255, 255, 0.06)',
            color: frame >= 180 ? CYAN_BLUEPRINT : SLATE_MUTED,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          ENTER ↵
        </div>
      </div>

      {/* CAD Vector Schematic Blueprint of GT 740 & Calipers */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          height: 380,
          borderRadius: 20,
          background: 'rgba(11, 17, 32, 0.88)',
          border: '1.5px solid rgba(0, 245, 255, 0.3)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0, 245, 255, 0.05)',
        }}
      >
        {/* Subtle Top-Down Orthographic CAD Plate Underlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: interpolate(caliperProgress, [0, 0.4, 1], [0, 0.35, 0.65]),
            mixBlendMode: 'screen',
            filter: 'contrast(1.15) brightness(0.95)',
          }}
        >
          <Img
            src={staticFile('images/kepler_hardware/gt740_pcb_cad_topdown.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Animated Caliper Vector Overlay */}
        <svg width="100%" height="100%" viewBox="0 0 850 380" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Outer PCB Bounding Box */}
          <rect
            x="80"
            y="70"
            width={690 * caliperProgress}
            height="240"
            rx="12"
            fill="none"
            stroke={CYAN_BLUEPRINT}
            strokeWidth="2.5"
            strokeDasharray="6,4"
          />
          {/* PCIe Connector Tabs */}
          <rect
            x="130"
            y="310"
            width={240 * caliperProgress}
            height="35"
            fill="rgba(245, 158, 11, 0.15)"
            stroke={GOLD_PCIE}
            strokeWidth="2"
          />
          <rect
            x="390"
            y="310"
            width={280 * caliperProgress}
            height="35"
            fill="rgba(245, 158, 11, 0.15)"
            stroke={GOLD_PCIE}
            strokeWidth="2"
          />
          {/* GK107 Die Socket Center */}
          <circle cx="430" cy="190" r={65 * caliperProgress} fill="none" stroke={CYAN_BLUEPRINT} strokeWidth="2" />
          <rect
            x="395"
            y="155"
            width={70 * caliperProgress}
            height={70 * caliperProgress}
            fill="rgba(0, 245, 255, 0.12)"
            stroke={CYAN_BLUEPRINT}
            strokeWidth="2"
          />
          {/* 9-Blade Fan Reticle */}
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i * (360 / 9) + frame * 1.5) * (Math.PI / 180);
            const x2 = 430 + Math.cos(angle) * 55 * caliperProgress;
            const y2 = 190 + Math.sin(angle) * 55 * caliperProgress;
            return <line key={i} x1="430" y1="190" x2={x2} y2={y2} stroke={CYAN_MUTED} strokeWidth="1.5" />;
          })}
        </svg>

        {/* Real-Time Dimension Caliper Chips */}
        {frame >= 240 && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 90,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 800,
              color: CYAN_BLUEPRINT,
              background: 'rgba(5, 7, 10, 0.85)',
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid rgba(0, 245, 255, 0.4)',
            }}
          >
            ↔ PCB LENGTH: 145.0mm · TOLERANCE: ±0.1mm
          </div>
        )}

        {frame >= 270 && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 80,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 800,
              color: GOLD_PCIE,
              background: 'rgba(5, 7, 10, 0.85)',
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid rgba(245, 158, 11, 0.4)',
            }}
          >
            PCIe 3.0 x16 (164-PIN GOLD CONNECTOR)
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 2: Real Hardware Anatomy & Exploded CAD Inspection (Frames 450 – 1,080)
// ---------------------------------------------------------------------------
const Act2HardwareAnatomy: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 450;

  // 3D Macro tilt camera sweep: rotateX: 18deg -> 6deg, rotateY: -22deg -> -6deg, scale: 1.0 -> 1.18
  const tiltProgress = interpolate(actFrame, [0, 600], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rotX = interpolate(tiltProgress, [0, 1], [18, 6]);
  const rotY = interpolate(tiltProgress, [0, 1], [-22, -6]);
  const camScale = interpolate(tiltProgress, [0, 1], [1.02, 1.16]);

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
      {/* Header */}
      <SafeTextContainer
        text="ACT 2 // PHYSICAL HARDWARE ANATOMY"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={CYAN_BLUEPRINT}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 10 }}
      />
      <SafeTextContainer
        text="NVIDIA GeForce GT 740 (GK107 Kepler)"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={46}
        color={SLATE_LIGHT}
        fontWeight={900}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        textAlign="center"
        style={{ marginBottom: 24 }}
      />

      {/* 3D Hardware Canvas Container */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          height: 680,
          borderRadius: 24,
          background: 'rgba(11, 17, 32, 0.92)',
          border: '2px solid rgba(0, 245, 255, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          perspective: 1200,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 255, 0.15)',
        }}
      >
        {/* Photorealistic Hardware Hero Plate */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${camScale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Img
            src={staticFile('images/kepler_hardware/gt740_isometric_hero.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Subtle Dynamic Specular Sweep Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(${interpolate(actFrame, [0, 600], [45, 135])}deg, transparent 40%, rgba(0, 245, 255, 0.15) 50%, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* 5 Precision Callout Leader Lines (SVG Overlay) */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {ACT2_CALLOUT_EVENTS.map((item, idx) => {
            const isVisible = frame >= item.frame;
            if (!isVisible) return null;

            const lineProg = interpolate(frame, [item.frame, item.frame + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            // Exact anchor target coordinates on the card
            const targets = [
              { targetX: 470, targetY: 340, calloutX: 70, calloutY: 100 }, // GK107 Die
              { targetX: 520, targetY: 260, calloutX: 580, calloutY: 80 },  // 9-Blade Fan
              { targetX: 620, targetY: 380, calloutX: 580, calloutY: 480 }, // Memory / Caps
              { targetX: 380, targetY: 530, calloutX: 60, calloutY: 550 },  // PCIe Gold Fingers
              { targetX: 200, targetY: 300, calloutX: 60, calloutY: 240 },  // Steel I/O Bracket
            ];
            const coord = targets[idx] || targets[0];
            const currTargetX = interpolate(lineProg, [0, 1], [coord.calloutX, coord.targetX]);
            const currTargetY = interpolate(lineProg, [0, 1], [coord.calloutY, coord.targetY]);

            return (
              <g key={item.id}>
                {/* Glowing Reticle Anchor */}
                <circle cx={coord.targetX} cy={coord.targetY} r="7" fill={CYAN_BLUEPRINT} opacity={lineProg} />
                <circle cx={coord.targetX} cy={coord.targetY} r="14" fill="none" stroke={CYAN_BLUEPRINT} strokeWidth="1.5" opacity={lineProg * 0.7} />
                {/* Connecting Leader Line */}
                <line
                  x1={coord.calloutX}
                  y1={coord.calloutY}
                  x2={currTargetX}
                  y2={currTargetY}
                  stroke={CYAN_BLUEPRINT}
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />
              </g>
            );
          })}
        </svg>

        {/* Precision HUD Callout Cards */}
        {ACT2_CALLOUT_EVENTS.map((item, idx) => {
          if (frame < item.frame) return null;
          const popSpring = spring({ frame: frame - item.frame, fps, config: motionTokens.spring.snappy });
          const cardPositions = [
            { top: 50, left: 30 },
            { top: 50, right: 30 },
            { bottom: 120, right: 30 },
            { bottom: 50, left: 30 },
            { top: 200, left: 30 },
          ];
          const pos = cardPositions[idx] || cardPositions[0];
          const calloutLogos = ['gpu_die', 'fan_axial', 'ram_dimm', 'pcie', 'hdmi'];
          const logoName = calloutLogos[idx] || 'gpu_die';

          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                ...pos,
                padding: '10px 16px',
                borderRadius: 12,
                background: 'rgba(5, 7, 10, 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(0, 245, 255, 0.5)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                transform: `scale(${popSpring})`,
                maxWidth: 340,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: 'rgba(0, 245, 255, 0.12)',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BrandLogo name={logoName} size={22} color={CYAN_BLUEPRINT} glow glowColor={CYAN_BLUEPRINT} />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 900, color: CYAN_BLUEPRINT, marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: SLATE_LIGHT, fontWeight: 700 }}>
                  {item.spec}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 3: The KeplerBridge Runtime & Compatibility Layer (Frames 1,080 – 1,710)
// ---------------------------------------------------------------------------
const Act3RuntimeLayer: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 1080;

  // Real-time data packet pulse animation
  const packetOffset = (actFrame * 6) % 100;

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
      <SafeTextContainer
        text="ACT 3 // SOFTWARE COMPATIBILITY ARCHITECTURE"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={CYAN_BLUEPRINT}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 10 }}
      />
      <SafeTextContainer
        text="KeplerBridge Translation & Runtime Layer"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={46}
        color={SLATE_LIGHT}
        fontWeight={900}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        textAlign="center"
        style={{ marginBottom: 26 }}
      />

      {/* 3-Tier Architecture Workbench */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 22,
          background: 'rgba(15, 23, 42, 0.90)',
          backdropFilter: 'blur(28px)',
          border: '2px solid rgba(0, 245, 255, 0.35)',
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          marginBottom: 20,
        }}
      >
        {/* Tier 1: Hardware Foundation */}
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            background: 'rgba(5, 7, 10, 0.85)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background PCIe insertion photo texture */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 220,
              height: '100%',
              opacity: 0.38,
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to left, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
            }}
          >
            <Img
              src={staticFile('images/kepler_hardware/gt740_pcie_insertion_macro.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BrandLogo name="pcie" size={24} color={GOLD_PCIE} glow glowColor={GOLD_PCIE} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 900, color: GOLD_PCIE }}>
                LAYER 01 // PHYSICAL SILICON & PCIE BUS
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: SLATE_MUTED }}>
                GK107 GPU Core · 164-Pin PCIe 3.0 x16 · 128-Bit GDDR5
              </div>
            </div>
          </div>
          <div style={{ fontFamily: subseaTelemetry.fontFamily, fontSize: 13, color: GOLD_PCIE, fontWeight: 800, textShadow: '0 0 10px rgba(245, 158, 11, 0.6)' }}>
            PCI 10DE:0FC8
          </div>
        </div>

        {/* Animated Data Packets Flowing Down */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 28, position: 'relative' }}>
          <div style={{ width: 3, height: '100%', backgroundColor: 'rgba(0, 245, 255, 0.3)' }} />
          <div
            style={{
              position: 'absolute',
              top: `${packetOffset}%`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: CYAN_BLUEPRINT,
              boxShadow: '0 0 12px #00F5FF',
            }}
          />
        </div>

        {/* Tier 2: KeplerBridge Translation Engine */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: 'rgba(0, 245, 255, 0.08)',
            border: '2px solid rgba(0, 245, 255, 0.6)',
            boxShadow: '0 0 25px rgba(0, 245, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <BrandLogo name="nvidia" size={24} color={CYAN_BLUEPRINT} glow glowColor={CYAN_BLUEPRINT} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 900, color: CYAN_BLUEPRINT }}>
                LAYER 02 // KEPLERBRIDGE TRANSLATION CORE
              </div>
            </div>
            <div style={{ padding: '3px 10px', borderRadius: 6, backgroundColor: 'rgba(0, 245, 255, 0.25)', color: CYAN_BLUEPRINT, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 900 }}>
              STANDALONE PROXY
            </div>
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: SLATE_LIGHT, lineHeight: 1.4 }}>
            Interception Proxy (<code style={{ color: CYAN_BLUEPRINT }}>d3d12.dll</code>) + bounded bytecode decompiler decoding <strong>Shader Model 6 DXIL</strong> into <strong>SM5 DXBC</strong> in &lt;0.4ms.
          </div>
        </div>

        {/* Animated Data Packets Flowing Down */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 28, position: 'relative' }}>
          <div style={{ width: 3, height: '100%', backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
          <div
            style={{
              position: 'absolute',
              top: `${(packetOffset + 50) % 100}%`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: EMERALD_PASS,
              boxShadow: '0 0 12px #10B981',
            }}
          />
        </div>

        {/* Tier 3: Modern Target Output */}
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            background: 'rgba(5, 7, 10, 0.85)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BrandLogo name="hdmi" size={24} color={EMERALD_PASS} glow glowColor={EMERALD_PASS} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 900, color: EMERALD_PASS }}>
                LAYER 03 // MODERN DIRECTX 12 / VULKAN OUTPUT
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: SLATE_MUTED }}>
                Full Hardware Rasterization · 60 Hz HDMI/DVI Display Pipeline
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: EMERALD_PASS, fontWeight: 800 }}>
            LOCKED @ 60FPS
          </div>
        </div>
      </div>

      {/* 4 Braun-Style Telemetry Gauges */}
      <div style={{ width: SAFE_CONTENT_WIDTH, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {ACT3_TELEMETRY_GAUGES.map((gauge) => {
          return (
            <div
              key={gauge.label}
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: SLATE_MUTED, fontWeight: 800 }}>
                {gauge.label}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: CYAN_BLUEPRINT, fontWeight: 900 }}>
                {gauge.val}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 4: Live Terminal Benchmark & Verification Gate (Frames 1,710 – 2,250)
// ---------------------------------------------------------------------------
const Act4BenchmarkGate: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
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
      <SafeTextContainer
        text="ACT 4 // LIVE BENCHMARK VERIFICATION"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={CYAN_BLUEPRINT}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 10 }}
      />
      <SafeTextContainer
        text="Automated Hardware Validation Suite"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={46}
        color={SLATE_LIGHT}
        fontWeight={900}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        textAlign="center"
        style={{ marginBottom: 28 }}
      />

      {/* Dark Engineering Terminal Window */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          borderRadius: 22,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(0, 245, 255, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 245, 255, 0.12)',
          padding: 26,
          boxSizing: 'border-box',
          marginBottom: 20,
        }}
      >
        {/* Terminal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <BrandLogo name="nvidia" size={20} color="#76B900" glow glowColor="rgba(118, 185, 0, 0.6)" />
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: SLATE_MUTED, fontWeight: 700 }}>
            keplerbridge-diagnostics-v2.4.0 — bash
          </div>
        </div>

        {/* 4 Interactive Benchmark Execution Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ACT4_BENCHMARK_STEPS.map((step, idx) => {
            const isExecuted = frame >= step.execFrame;
            const isPassed = frame >= step.passFrame;
            const passSpring = spring({ frame: frame - step.passFrame, fps, config: motionTokens.spring.snappy });
            const stepLogos = ['gpu_die', 'nvidia', 'hdmi', 'pcie'];
            const stepLogo = stepLogos[idx] || 'gpu_die';

            if (!isExecuted) return null;

            return (
              <div key={step.cmd} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: CYAN_BLUEPRINT, fontWeight: 800 }}>
                  <BrandLogo name={stepLogo} size={18} color={CYAN_BLUEPRINT} />
                  <span>{step.cmd}</span>
                </div>
                {isPassed && (
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 15,
                      color: EMERALD_PASS,
                      fontWeight: 700,
                      transform: `scale(${passSpring})`,
                      transformOrigin: 'left center',
                      paddingLeft: 12,
                    }}
                  >
                    {step.res}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade A+ Verification Trophy Badge */}
      {frame >= 2070 && (
        <div
          style={{
            padding: '14px 28px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 245, 255, 0.25) 100%)',
            border: '2px solid #10B981',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transform: `scale(${spring({ frame: frame - 2070, fps, config: motionTokens.spring.snappy })})`,
          }}
        >
          <div style={{ fontSize: 28 }}>🏆</div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 900, color: '#FFFFFF' }}>
              HARDWARE ACCELERATION CERTIFIED // GRADE A+
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: SLATE_LIGHT }}>
              NVIDIA GeForce GT 740 passed all 12 conformance tests
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Act 5: Climax Hardware + Software Lockup (Frames 2,250 – 2,700)
// ---------------------------------------------------------------------------
const Act5HardwareClimax: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const actFrame = frame - 2250;
  const pullback = spring({
    frame: actFrame,
    fps,
    config: { damping: 16, stiffness: 130 },
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
        opacity: interpolate(frame, [2250, 2280], [0, 1], { extrapolateLeft: 'clamp' }),
        transform: `scale(${interpolate(pullback, [0, 1], [1.08, 1])})`,
      }}
    >
      <SafeTextContainer
        text="OPEN SOURCE SILICON PRESERVATION"
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={18}
        color={CYAN_BLUEPRINT}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
        textAlign="center"
        style={{ marginBottom: 12 }}
      />
      <SafeTextContainer
        text="Never Abandon Working Silicon."
        containerWidth={SAFE_CONTENT_WIDTH}
        baseFontSize={50}
        color={SLATE_LIGHT}
        fontWeight={900}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        textAlign="center"
        style={{ marginBottom: 28 }}
      />

      {/* Hero Showcase Card with Radial Halo */}
      <div
        style={{
          width: SAFE_CONTENT_WIDTH,
          height: 480,
          borderRadius: 24,
          background: 'rgba(11, 17, 32, 0.94)',
          border: '2px solid rgba(0, 245, 255, 0.5)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 245, 255, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <Img
          src={staticFile('images/kepler_hardware/gt740_isometric_hero.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Radial Center Halo */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        {/* Hardware Badge Stamp */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '6px 14px',
            borderRadius: 8,
            backgroundColor: 'rgba(5, 7, 10, 0.85)',
            border: '1px solid rgba(0, 245, 255, 0.5)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 800,
            color: CYAN_BLUEPRINT,
          }}
        >
          NVIDIA GEFORCE GT 740 // GK107
        </div>
      </div>

      {/* 4 Floating Feature Pills */}
      <div style={{ width: SAFE_CONTENT_WIDTH, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 32 }}>
        {ACT5_PILL_EVENTS.map((pill, idx) => {
          const isPop = frame >= pill.frame;
          const popSpring = spring({ frame: frame - pill.frame, fps, config: motionTokens.spring.snappy });
          const pillLogos = ['gpu_die', 'pcie', 'fan_axial', 'hdmi'];
          const pillLogo = pillLogos[idx] || 'gpu_die';

          return (
            <div
              key={pill.label}
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(15, 23, 42, 0.90)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(0, 245, 255, 0.45)',
                color: CYAN_BLUEPRINT,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 15,
                fontWeight: 800,
                transform: `scale(${isPop ? popSpring : 0})`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <BrandLogo name={pillLogo} size={18} color={CYAN_BLUEPRINT} />
              <span>{pill.label}</span>
            </div>
          );
        })}
      </div>

      {/* Master CTA Pill */}
      {frame >= 2430 && (
        <div
          style={{
            padding: '16px 36px',
            borderRadius: 999,
            background: linearMetals.liquidChrome,
            boxShadow: '0 0 45px rgba(0, 245, 255, 0.6), 0 10px 30px rgba(0,0,0,0.8)',
            transform: `scale(${spring({ frame: frame - 2430, fps, config: motionTokens.spring.snappy })})`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <BrandLogo name="nvidia" size={26} color="#05070A" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              fontWeight: 900,
              color: '#05070A',
              letterSpacing: 0.5,
            }}
          >
            ✔ github.com/HamzaShaikhAI/KeplerBridge
          </span>
          <BrandLogo name="github" size={24} color="#05070A" />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Showcase Composition Component (45.0s @ 60 FPS = 2,700 Frames)
// ---------------------------------------------------------------------------
export const KeplerBridgeHardwareShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic audio ducking calculation: ducks music during high-impact moments
  const musicVolume = useMemo(() => {
    if (
      (frame >= 430 && frame <= 470) ||
      (frame >= 1060 && frame <= 1100) ||
      (frame >= 1690 && frame <= 1730) ||
      (frame >= 2230 && frame <= 2270)
    ) {
      return 0.14;
    }
    return 0.32;
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: OBSIDIAN_BG, overflow: 'hidden' }}>
      {/* 1. Frame-Exact 44.1 kHz Event-Locked Foley Bed (86 Cues) */}
      <Audio
        src={staticFile('audio/kepler_hardware_event_locked_sfx.wav')}
        volume={0.96}
      />

      {/* 2. Cyberpunk / Industrial Tech Studio Underscore */}
      <Audio
        src={staticFile('audio/rea_architecture_music_45s.wav')}
        volume={musicVolume}
      />

      {/* 3. Base CAD Blueprint Grid Canvas */}
      <CadDraftingGrid frame={frame} />

      {/* Act 1: The Hook — Repository & Hardware Awakening (Frames 0 – 450) */}
      {frame < 460 && <Act1RepoAwakening frame={frame} fps={fps} />}

      {/* Act 2: Real Hardware Anatomy & Exploded CAD Inspection (Frames 450 – 1,080) */}
      {frame >= 440 && frame < 1090 && <Act2HardwareAnatomy frame={frame} fps={fps} />}

      {/* Act 3: The KeplerBridge Runtime & Compatibility Layer (Frames 1,080 – 1,710) */}
      {frame >= 1070 && frame < 1720 && <Act3RuntimeLayer frame={frame} fps={fps} />}

      {/* Act 4: Live Terminal Benchmark & Verification Gate (Frames 1,710 – 2,250) */}
      {frame >= 1700 && frame < 2260 && <Act4BenchmarkGate frame={frame} fps={fps} />}

      {/* Act 5: Climax Hardware + Software Lockup (Frames 2,250 – 2,700) */}
      {frame >= 2240 && <Act5HardwareClimax frame={frame} fps={fps} />}
    </AbsoluteFill>
  );
};
