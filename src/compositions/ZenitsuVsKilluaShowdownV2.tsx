import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Freeze,
  interpolate,
  OffthreadVideo,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// --- Minimalist Cinematic Anime Typography ---
const AnimeTitleCard: React.FC<{
  kanji: string;
  subtext: string;
  themeColor: string;
  glowColor: string;
  position?: 'top' | 'bottom';
  opacity?: number;
  scale?: number;
}> = ({
  kanji,
  subtext,
  themeColor,
  glowColor,
  position = 'bottom',
  opacity = 1,
  scale = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position === 'top' ? 'top' : 'bottom']: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity,
        transform: `scale(${scale})`,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: "'Noto Serif JP', 'Yu Mincho', serif, sans-serif",
          fontSize: '60px',
          fontWeight: 900,
          letterSpacing: '0.28em',
          color: '#ffffff',
          textShadow: `0 0 25px ${glowColor}, 0 0 50px ${glowColor}`,
          marginBottom: '8px',
          filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.95))',
        }}
      >
        {kanji}
      </div>
      <div
        style={{
          fontFamily: "'Syne', 'Montserrat', sans-serif",
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '0.42em',
          color: themeColor,
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.9))',
        }}
      >
        {subtext}
      </div>
    </div>
  );
};

// --- Chad / Sigma Aura Counter Badge ---
const AuraBadge: React.FC<{
  glyph?: string;
  points: string;
  label: string;
  accentColor: string;
  glowColor: string;
  scale?: number;
  opacity?: number;
}> = ({
  glyph = '🗿',
  points,
  label,
  accentColor,
  glowColor,
  scale = 1,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '18px 36px',
        borderRadius: '50px',
        background: 'rgba(5, 5, 12, 0.88)',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 45px ${glowColor}, inset 0 0 25px ${glowColor}`,
        backdropFilter: 'blur(20px)',
        zIndex: 75,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: '52px', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' }}>
        {glyph}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Syne', 'Montserrat', sans-serif",
            fontSize: '32px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.12em',
            textShadow: `0 0 20px ${accentColor}`,
          }}
        >
          {points}
        </span>
        <span
          style={{
            fontFamily: "'Syne', 'Montserrat', sans-serif",
            fontSize: '14px',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// --- Directional Radial Speedlines (Deterministic Radial Beams) ---
const RadialSpeedlines: React.FC<{
  color: string;
  density?: number;
  intensity?: number;
}> = ({ color, density = 48, intensity = 0.55 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: intensity,
        zIndex: 35,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id={`lineFade_${color.replace('#', '')}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="transparent" />
            <stop offset="85%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: density }).map((_, i) => {
          const angle =
            (i * (360 / density) + Math.sin(frame * 0.45 + i * 19) * 4) *
            (Math.PI / 180);
          const length = 1200 + Math.sin(frame * 0.8 + i * 31) * 250;
          const x2 = 540 + Math.cos(angle) * length;
          const y2 = 960 + Math.sin(angle) * length;
          const strokeWidth = 2 + (i % 3);

          return (
            <line
              key={i}
              x1={540}
              y1={960}
              x2={x2}
              y2={y2}
              stroke={`url(#lineFade_${color.replace('#', '')})`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${70 + (i % 4) * 35} ${40 + (i % 3) * 25}`}
            />
          );
        })}
      </svg>
    </div>
  );
};

// --- Deterministic Golden Embers Particle Field ---
const GoldenEmbersField: React.FC<{
  count?: number;
  intensity?: number;
  color?: string;
}> = ({ count = 35, intensity = 0.65, color = '#FFD700' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      seedX: (i * 73) % width,
      seedY: (i * 127) % height,
      speedY: 2.2 + ((i * 19) % 3),
      driftX: Math.sin(i * 13) * 1.8,
      size: 3 + (i % 4) * 2,
      opacity: 0.4 + (i % 5) * 0.12,
    }));
  }, [count, width, height]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 40,
        opacity: intensity,
        mixBlendMode: 'screen',
      }}
    >
      {particles.map((p, i) => {
        const currentY = (p.seedY - frame * p.speedY) % height;
        const normalizedY = currentY < 0 ? currentY + height : currentY;
        const currentX = p.seedX + Math.sin(frame * 0.05 + i) * 25 + p.driftX * frame;
        const normalizedX = ((currentX % width) + width) % width;
        const pulse = 0.8 + Math.sin(frame * 0.2 + i * 7) * 0.2;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: normalizedX,
              top: normalizedY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 14px ${color}, 0 0 28px ${color}`,
              opacity: p.opacity * pulse,
            }}
          />
        );
      })}
    </div>
  );
};

// --- Full 9:16 Vertical Immersive Viewport ---
const AnimeViewport: React.FC<{
  videoSrc: string;
  panX?: number;
  panY?: number;
  scale?: number;
  shakeAngle?: number;
  shakeX?: number;
  shakeY?: number;
  colorGrade?: string;
  freezeFrame?: number | null;
  mangaHalftone?: boolean;
  invert?: boolean;
  glowColor?: string;
}> = ({
  videoSrc,
  panX = 0,
  panY = 0,
  scale = 2.2,
  shakeAngle = 0,
  shakeX = 0,
  shakeY = 0,
  colorGrade = 'none',
  freezeFrame = null,
  mangaHalftone = false,
  invert = false,
  glowColor = 'rgba(255, 200, 0, 0.45)',
}) => {
  const content = (
    <OffthreadVideo
      src={videoSrc}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05050a',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Radial Depth Background */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          overflow: 'hidden',
          filter: 'blur(50px) brightness(0.4)',
          transform: 'scale(1.15)',
          zIndex: 1,
        }}
      >
        {freezeFrame !== null ? <Freeze frame={freezeFrame}>{content}</Freeze> : content}
      </div>

      {/* Layer 2: Full 9:16 Vertical Screen Immersion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${shakeX + panX}px, ${shakeY + panY}px) rotate(${shakeAngle}deg) scale(${scale})`,
          transformOrigin: 'center center',
          zIndex: 10,
          boxShadow: `inset 0 0 100px rgba(0,0,0,0.85), 0 0 60px ${glowColor}`,
          filter: invert
            ? 'invert(1) contrast(2.4)'
            : mangaHalftone
            ? 'contrast(2.4) grayscale(1) brightness(1.2)'
            : colorGrade,
        }}
      >
        {freezeFrame !== null ? <Freeze frame={freezeFrame}>{content}</Freeze> : content}
      </div>

      {/* Ambient Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(3,3,8,0.75) 90%, rgba(2,2,5,0.95) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// --- Extended 32.0s Master Composition (1,920 Frames @ 60fps) ---
export const ZenitsuVsKilluaShowdownV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Volume Automation: Drops to 0.05 during the two Pre-Drop Inhale Pauses
  // Pause 1: frames 536 to 560 (pre-Godspeed drop)
  // Pause 2: frames 1296 to 1320 (pre-Flaming Thunder God drop)
  let musicVolume = 1.0;
  if (frame >= 536 && frame < 560) {
    musicVolume = interpolate(frame, [536, 545, 560], [1.0, 0.08, 0.08]);
  } else if (frame >= 1296 && frame < 1320) {
    musicVolume = interpolate(frame, [1296, 1305, 1320], [1.0, 0.04, 0.04]);
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#040407',
        overflow: 'hidden',
        width,
        height,
      }}
    >
      {/* Master Brazilian Phonk Soundtrack with Dynamic Inhale Ducking */}
      <Audio
        src={staticFile('audio/active-phonk.mp3')}
        startFrom={0}
        volume={musicVolume}
      />

      {/* Procedural Audio SFX Placements */}
      {/* Opening Wind Whoosh */}
      {frame >= 0 && frame < 60 && (
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.85} />
      )}
      {/* Midpoint Sword Clash */}
      {frame >= 440 && frame < 500 && (
        <Audio src={staticFile('sfx/sword_clash.wav')} volume={0.95} />
      )}
      {/* Beat Drop 1: Godspeed Thunder Shockwave */}
      {frame >= 560 && frame < 650 && (
        <Audio src={staticFile('sfx/thunder_strike.wav')} volume={1.0} />
      )}
      {/* Beat Drop 2: Flaming Thunder Dragon Detonation */}
      {frame >= 1320 && frame < 1420 && (
        <Audio src={staticFile('sfx/thunder_strike.wav')} volume={1.0} />
      )}

      <Series>
        {/* ACT 1: The Infinity Castle Standoff (Frames 0–180, 0.0s – 3.0s) */}
        <Series.Sequence durationInFrames={180}>
          {(() => {
            const localFrame = frame;
            // Smooth Camera Track across Infinity Castle: Zenitsu (left) -> Killua (right)
            const panX = interpolate(localFrame, [0, 60, 120, 180], [-140, -140, 140, 140], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(localFrame, [0, 180], [2.15, 2.3]);
            const textOpacity = interpolate(localFrame, [0, 20, 160, 180], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_01_standoff.mp4')}
                  panX={panX}
                  scale={scale}
                  colorGrade="contrast(1.22) saturate(1.3) brightness(1.02)"
                  glowColor="rgba(255, 180, 0, 0.4)"
                />
                <AnimeTitleCard
                  kanji="雷霆 VS 神速"
                  subtext="THUNDER VS GODSPEED"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.7)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 2: Zenitsu Gathers Thunder Sparks (Frames 180–310, 3.0s – 5.16s) */}
        <Series.Sequence durationInFrames={130}>
          {(() => {
            const localFrame = frame - 180;
            const scale = interpolate(localFrame, [0, 130], [2.2, 2.4]);
            const goldPulse = Math.sin(localFrame * 0.25) * 0.18;
            const textOpacity = interpolate(localFrame, [0, 15, 115, 130], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_02_zenitsu_sparks.mp4')}
                  panX={-55}
                  scale={scale}
                  colorGrade={`contrast(1.28) saturate(${1.35 + goldPulse}) brightness(${1.05 + goldPulse * 0.4})`}
                  glowColor="rgba(255, 190, 0, 0.6)"
                />
                <RadialSpeedlines color="#FFD700" density={36} intensity={0.45} />
                <AnimeTitleCard
                  kanji="雷の呼吸"
                  subtext="THUNDER BREATHING"
                  themeColor="#FFC107"
                  glowColor="rgba(255, 193, 7, 0.75)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 3: Killua Silver Assassin Smirk (Frames 310–440, 5.16s – 7.33s) */}
        <Series.Sequence durationInFrames={130}>
          {(() => {
            const localFrame = frame - 310;
            const scale = interpolate(localFrame, [0, 130], [2.2, 2.4]);
            const cyanPulse = Math.sin(localFrame * 0.3) * 0.2;
            const textOpacity = interpolate(localFrame, [0, 15, 115, 130], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_03_killua_sparks.mp4')}
                  panX={55}
                  scale={scale}
                  colorGrade={`contrast(1.28) saturate(${1.3 + cyanPulse}) hue-rotate(-8deg) brightness(${1.04 + cyanPulse * 0.4})`}
                  glowColor="rgba(0, 229, 255, 0.65)"
                />
                <RadialSpeedlines color="#00E5FF" density={36} intensity={0.5} />
                <AnimeTitleCard
                  kanji="暗殺者の眼光"
                  subtext="ASSASSIN'S GAZE"
                  themeColor="#00E5FF"
                  glowColor="rgba(0, 229, 255, 0.8)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 4: Midpoint Clash & Pre-Drop Inhale (Frames 440–560, 7.33s – 9.33s) */}
        <Series.Sequence durationInFrames={120}>
          {(() => {
            const localFrame = frame - 440;
            const scale = interpolate(localFrame, [0, 95, 120], [2.15, 2.35, 2.45]);

            // Pre-drop silence & tension desaturate in last 24 frames (frames 96-120)
            const preDrop = localFrame >= 96;
            const desaturate = preDrop ? interpolate(localFrame, [96, 120], [1.0, 0.0]) : 1.0;
            const brightness = preDrop ? interpolate(localFrame, [96, 120], [1.0, 0.25]) : 1.0;
            const textOpacity = interpolate(localFrame, [0, 15, 80, 96], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_04_wide_clash.mp4')}
                  scale={scale}
                  colorGrade={`contrast(${1.25 + (preDrop ? 0.45 : 0)}) saturate(${desaturate * 1.35}) brightness(${brightness})`}
                  glowColor="rgba(255, 255, 255, 0.6)"
                />

                {/* Pre-Drop White Warning Flash on frames 118-119 */}
                {localFrame >= 117 && localFrame <= 119 && (
                  <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: 0.95, zIndex: 65 }} />
                )}

                <AnimeTitleCard
                  kanji="電光衝突"
                  subtext="ENERGY COLLISION"
                  themeColor="#FFFFFF"
                  glowColor="rgba(255, 255, 255, 0.9)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 5: BEAT DROP 1 - KILLUA GODSPEED AURA FREEZE & CHAD OVERLAY (Frames 560–960, 9.33s – 16.0s) */}
        <Series.Sequence durationInFrames={400}>
          {(() => {
            const localFrame = frame - 560;

            // Aura Freeze for 45 frames (0.75s) on peak lightning surge!
            const isFrozen = localFrame < 45;
            const freezeFrameIndex = 30;

            // Invert flash on frame 0-1
            const isInvert = localFrame === 0 || localFrame === 1;

            // Rotational Trauma Spring Shake
            const shakeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 240, mass: 0.75 },
            });
            const shakeDecay = Math.max(0, 1 - shakeSpring);
            const rotJitter = Math.sin(localFrame * 0.9) * shakeDecay * 4.2;
            const transX = Math.cos(localFrame * 1.2) * shakeDecay * 42;
            const transY = Math.sin(localFrame * 1.5) * shakeDecay * 26;

            // Dynamic scale punch
            const scale = interpolate(localFrame, [0, 45, 400], [2.45, 2.15, 2.35]);

            // Bass Kick Chromatic Pulse
            const cowbellKick = localFrame % 46 < 4;
            const chromOffset = cowbellKick ? 14 : 0;

            // Chad Aura Badge Entrance & Exit
            const badgeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 8, stiffness: 240 },
            });
            const badgeOpacity = interpolate(localFrame, [0, 8, 90, 105], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_06_killua_godspeed.mp4')}
                  scale={scale}
                  shakeAngle={rotJitter}
                  shakeX={transX}
                  shakeY={transY}
                  invert={isInvert}
                  freezeFrame={isFrozen ? freezeFrameIndex : null}
                  mangaHalftone={isFrozen}
                  colorGrade={`contrast(1.36) saturate(1.48) brightness(1.1) hue-rotate(-10deg) drop-shadow(-${chromOffset}px 0 0 rgba(255,0,80,0.7)) drop-shadow(${chromOffset}px 0 0 rgba(0,230,255,0.8))`}
                  glowColor="rgba(0, 229, 255, 0.75)"
                />

                {/* Radial Electric Cyan Speedlines */}
                <RadialSpeedlines color="#00E5FF" density={48} intensity={0.7} />

                {/* Chad / Sigma Aura Counter Badge */}
                {localFrame < 105 && (
                  <AuraBadge
                    glyph="🗿"
                    points="+999,999 AURA"
                    label="GODSPEED AWAKENED"
                    accentColor="#00E5FF"
                    glowColor="rgba(0, 229, 255, 0.9)"
                    scale={badgeSpring}
                    opacity={badgeOpacity}
                  />
                )}

                <AnimeTitleCard
                  kanji="神速・疾風迅雷"
                  subtext="GODSPEED : WHIRLWIND"
                  themeColor="#00E5FF"
                  glowColor="rgba(0, 229, 255, 0.95)"
                  position="bottom"
                  opacity={interpolate(localFrame, [0, 5, 370, 400], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 400], [1.0, 1.08])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 6: Zenitsu Counter Recovery (Frames 960–1160, 16.0s – 19.33s) */}
        <Series.Sequence durationInFrames={200}>
          {(() => {
            const localFrame = frame - 960;
            const scale = interpolate(localFrame, [0, 200], [2.18, 2.38]);
            const textOpacity = interpolate(localFrame, [0, 15, 180, 200], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_07_zenitsu_counter.mp4')}
                  panX={-45}
                  scale={scale}
                  colorGrade="contrast(1.28) saturate(1.38) brightness(1.06)"
                  glowColor="rgba(255, 200, 0, 0.55)"
                />
                <GoldenEmbersField count={25} intensity={0.5} />
                <AnimeTitleCard
                  kanji="霹靂一閃"
                  subtext="THUNDERCLAP AND FLASH"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.85)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 7: The Calm Before The Storm — Iaijutsu Draw Stance (Frames 1160–1320, 19.33s – 22.0s) */}
        <Series.Sequence durationInFrames={160}>
          {(() => {
            const localFrame = frame - 1160;
            const scale = interpolate(localFrame, [0, 135, 160], [2.2, 2.4, 2.5]);

            // Second Pre-Drop Vacuum in last 24 frames (frames 136-160)
            const preDrop2 = localFrame >= 136;
            const desaturate2 = preDrop2 ? interpolate(localFrame, [136, 160], [1.0, 0.0]) : 1.0;
            const brightness2 = preDrop2 ? interpolate(localFrame, [136, 160], [1.0, 0.25]) : 1.0;
            const textOpacity = interpolate(localFrame, [0, 12, 120, 136], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_08_zenitsu_draw.mp4')}
                  scale={scale}
                  colorGrade={`contrast(${1.3 + (preDrop2 ? 0.5 : 0)}) saturate(${desaturate2 * 1.45}) brightness(${brightness2})`}
                  glowColor="rgba(255, 170, 0, 0.65)"
                />

                {/* Pre-Drop Warning Flash on frames 158-159 */}
                {localFrame >= 157 && localFrame <= 159 && (
                  <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: 0.95, zIndex: 65 }} />
                )}

                <AnimeTitleCard
                  kanji="抜刀の構え"
                  subtext="IAIJUTSU STANCE"
                  themeColor="#FFB300"
                  glowColor="rgba(255, 179, 0, 0.9)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 8: BEAT DROP 2 — ZENITSU FLAMING DRAGON AURA FREEZE & CHAD BADGE (Frames 1320–1840, 22.0s – 30.66s) */}
        <Series.Sequence durationInFrames={520}>
          {(() => {
            const localFrame = frame - 1320;

            // Aura Freeze for 50 frames (0.83s) on ferocious dragon jaws!
            const isFrozen = localFrame < 50;
            const freezeFrameIndex = 36;

            // Invert flash on frame 0-1
            const isInvert = localFrame === 0 || localFrame === 1;

            // Impact Spring Shake
            const dragonSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 250 },
            });
            const dragonDecay = Math.max(0, 1 - dragonSpring);
            const rotShake = Math.sin(localFrame * 0.85) * dragonDecay * 4.6;
            const transX = Math.cos(localFrame * 1.1) * dragonDecay * 46;
            const transY = Math.sin(localFrame * 1.4) * dragonDecay * 28;

            const scale = interpolate(localFrame, [0, 50, 520], [2.48, 2.18, 2.4]);

            // Chad Aura Badge Entrance & Exit
            const badgeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 220 },
            });
            const badgeOpacity = interpolate(localFrame, [0, 8, 95, 110], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_09_zenitsu_dragon.mp4')}
                  scale={scale}
                  shakeAngle={rotShake}
                  shakeX={transX}
                  shakeY={transY}
                  invert={isInvert}
                  freezeFrame={isFrozen ? freezeFrameIndex : null}
                  mangaHalftone={isFrozen}
                  colorGrade="contrast(1.35) saturate(1.58) brightness(1.14)"
                  glowColor="rgba(255, 170, 0, 0.85)"
                />

                {/* Fiery Golden Dragon Speedlines */}
                <RadialSpeedlines color="#FFD700" density={56} intensity={0.8} />

                {/* Golden Embers Scatter */}
                <GoldenEmbersField count={45} intensity={0.85} color="#FFD700" />

                {/* Chad / Sigma Aura Counter Badge */}
                {localFrame < 110 && (
                  <AuraBadge
                    glyph="🔥"
                    points="+1,000,000 AURA"
                    label="SEVENTH FORM UNLEASHED"
                    accentColor="#FFD700"
                    glowColor="rgba(255, 215, 0, 0.95)"
                    scale={badgeSpring}
                    opacity={badgeOpacity}
                  />
                )}

                <AnimeTitleCard
                  kanji="漆ノ型 火雷神"
                  subtext="SEVENTH FORM : HONOIKAZUCHI NO KAMI"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.98)"
                  position="bottom"
                  opacity={interpolate(localFrame, [0, 5, 480, 520], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 520], [1.0, 1.1])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 9: COLD SHEATHE & SEAMLESS REPLAY LOOP OUTRO (Frames 1840–1920, 30.66s – 32.0s) */}
        <Series.Sequence durationInFrames={80}>
          {(() => {
            const localFrame = frame - 1840;
            // Rapid whip-zoom blur matching Frame 0 standoff
            const loopScale = interpolate(localFrame, [0, 55, 80], [2.18, 2.3, 2.7]);
            const loopBlur = interpolate(localFrame, [55, 80], [0, 24]);
            const loopOpacity = interpolate(localFrame, [70, 80], [1, 0.85]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_01_standoff.mp4')}
                  panX={-140}
                  scale={loopScale}
                  colorGrade={`contrast(1.22) saturate(1.25) brightness(1.0) blur(${loopBlur}px)`}
                  glowColor="rgba(255, 215, 0, 0.5)"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#040407',
                    opacity: 1 - loopOpacity,
                    zIndex: 60,
                  }}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
