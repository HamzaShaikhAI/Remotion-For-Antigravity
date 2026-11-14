import React from 'react';
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
        [position === 'top' ? 'top' : 'bottom']: '110px',
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
          fontSize: '56px',
          fontWeight: 900,
          letterSpacing: '0.3em',
          color: '#ffffff',
          textShadow: `0 0 25px ${glowColor}, 0 0 50px ${glowColor}`,
          marginBottom: '6px',
          filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.95))',
        }}
      >
        {kanji}
      </div>
      <div
        style={{
          fontFamily: "'Syne', 'Montserrat', sans-serif",
          fontSize: '20px',
          fontWeight: 800,
          letterSpacing: '0.4em',
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
        gap: '18px',
        padding: '16px 32px',
        borderRadius: '50px',
        background: 'rgba(5, 5, 12, 0.85)',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 40px ${glowColor}, inset 0 0 20px ${glowColor}`,
        backdropFilter: 'blur(16px)',
        zIndex: 70,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: '48px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>
        {glyph}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Syne', 'Montserrat', sans-serif",
            fontSize: '28px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.1em',
            textShadow: `0 0 15px ${accentColor}`,
          }}
        >
          {points}
        </span>
        <span
          style={{
            fontFamily: "'Syne', 'Montserrat', sans-serif",
            fontSize: '13px',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// --- Directional Speedlines (Deterministic Radial Beams) ---
const RadialSpeedlines: React.FC<{
  color: string;
  density?: number;
  intensity?: number;
}> = ({ color, density = 40, intensity = 0.45 }) => {
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
            <stop offset="40%" stopColor="transparent" />
            <stop offset="85%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: density }).map((_, i) => {
          const angle =
            (i * (360 / density) + Math.sin(frame * 0.45 + i * 19) * 4) *
            (Math.PI / 180);
          const length = 1150 + Math.sin(frame * 0.8 + i * 31) * 220;
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
              strokeDasharray={`${60 + (i % 4) * 35} ${40 + (i % 3) * 25}`}
            />
          );
        })}
      </svg>
    </div>
  );
};

// --- Clip-Aware Dual-Layer Viewport ---
const AnimeViewport: React.FC<{
  videoSrc: string;
  panX?: number;
  panY?: number;
  scale?: number;
  shakeAngle?: number;
  shakeX?: number;
  shakeY?: number;
  colorGrade?: string;
  glowColor?: string;
  invert?: boolean;
  freezeFrame?: number | null;
  mangaHalftone?: boolean;
}> = ({
  videoSrc,
  panX = 0,
  panY = 0,
  scale = 1.08,
  shakeAngle = 0,
  shakeX = 0,
  shakeY = 0,
  colorGrade = 'contrast(1.2) saturate(1.25) brightness(1.02)',
  glowColor = 'rgba(255, 200, 0, 0.4)',
  invert = false,
  freezeFrame = null,
  mangaHalftone = false,
}) => {
  const content = (
    <OffthreadVideo
      src={videoSrc}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Layer 1: Ambient Gaussian Blurred Fill */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          overflow: 'hidden',
          filter: 'blur(45px) brightness(0.35)',
          transform: 'scale(1.15)',
          zIndex: 1,
        }}
      >
        {freezeFrame !== null ? <Freeze frame={freezeFrame}>{content}</Freeze> : content}
      </div>

      {/* Ambient Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,10,0.85) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2: Pristine Hero 16:9 Anime Footage */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: `translateY(-50%) translate(${shakeX + panX}px, ${shakeY + panY}px) rotate(${shakeAngle}deg) scale(${scale})`,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 25px 80px rgba(0,0,0,0.9), 0 0 50px ${glowColor}`,
          filter: invert
            ? 'invert(1) contrast(2)'
            : mangaHalftone
            ? 'contrast(2.2) grayscale(1) brightness(1.15)'
            : colorGrade,
        }}
      >
        <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          {freezeFrame !== null ? <Freeze frame={freezeFrame}>{content}</Freeze> : content}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Extended 30.0s Master Composition (1,800 Frames @ 60fps) ---
export const ZenitsuVsKilluaShowdownV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#040407',
        overflow: 'hidden',
        width,
        height,
      }}
    >
      {/* Normalized Brazilian Phonk Soundtrack starting from 0.0s */}
      <Audio
        src={staticFile('audio/active-phonk.mp3')}
        startFrom={0}
        volume={1.0}
      />

      <Series>
        {/* ACT 1: The Infinity Castle Standoff (Frames 0–180, 3.0s) */}
        <Series.Sequence durationInFrames={180}>
          {(() => {
            const localFrame = frame;
            // Smooth Pan across Infinity Castle: Zenitsu (left) -> Killua (right)
            const panX = interpolate(localFrame, [0, 60, 120, 180], [-130, -130, 130, 130], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(localFrame, [0, 180], [1.12, 1.22]);
            const textOpacity = interpolate(localFrame, [0, 20, 160, 180], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_01_standoff.mp4')}
                  panX={panX}
                  scale={scale}
                  colorGrade="contrast(1.18) saturate(1.25) brightness(1.0)"
                  glowColor="rgba(255, 180, 0, 0.35)"
                />
                <AnimeTitleCard
                  kanji="雷霆 VS 神速"
                  subtext="THUNDER VS GODSPEED"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.6)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 2: Zenitsu Gathers Thunder (Frames 180–310, 2.16s) */}
        <Series.Sequence durationInFrames={130}>
          {(() => {
            const localFrame = frame - 180;
            const scale = interpolate(localFrame, [0, 130], [1.15, 1.28]);
            const goldPulse = Math.sin(localFrame * 0.25) * 0.15;
            const textOpacity = interpolate(localFrame, [0, 15, 115, 130], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_02_zenitsu_sparks.mp4')}
                  panX={-35}
                  scale={scale}
                  colorGrade={`contrast(1.25) saturate(${1.35 + goldPulse}) brightness(${1.04 + goldPulse * 0.4})`}
                  glowColor="rgba(255, 190, 0, 0.55)"
                />
                <AnimeTitleCard
                  kanji="雷の呼吸"
                  subtext="THUNDER BREATHING"
                  themeColor="#FFC107"
                  glowColor="rgba(255, 193, 7, 0.65)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 3: Killua Silver Sparks (Frames 310–440, 2.16s) */}
        <Series.Sequence durationInFrames={130}>
          {(() => {
            const localFrame = frame - 310;
            const scale = interpolate(localFrame, [0, 130], [1.16, 1.28]);
            const cyanPulse = Math.sin(localFrame * 0.3) * 0.18;
            const textOpacity = interpolate(localFrame, [0, 15, 115, 130], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_03_killua_sparks.mp4')}
                  panX={35}
                  scale={scale}
                  colorGrade={`contrast(1.25) saturate(${1.25 + cyanPulse}) hue-rotate(-8deg) brightness(${1.02 + cyanPulse * 0.4})`}
                  glowColor="rgba(0, 229, 255, 0.55)"
                />
                <AnimeTitleCard
                  kanji="暗殺者の眼光"
                  subtext="ASSASSIN'S GAZE"
                  themeColor="#00E5FF"
                  glowColor="rgba(0, 229, 255, 0.7)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 4: The Wide Clash & Pre-Drop Tension (Frames 440–620, 3.0s) */}
        <Series.Sequence durationInFrames={180}>
          {(() => {
            const localFrame = frame - 440;
            const scale = interpolate(localFrame, [0, 160, 180], [1.1, 1.24, 1.3]);

            // Pre-drop silence & tension desaturate in last 25 frames
            const preDrop = localFrame >= 155;
            const desaturate = preDrop ? interpolate(localFrame, [155, 180], [1.0, 0.0]) : 1.0;
            const brightness = preDrop ? interpolate(localFrame, [155, 180], [1.0, 0.3]) : 1.0;
            const textOpacity = interpolate(localFrame, [0, 15, 140, 155], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_04_wide_clash.mp4')}
                  scale={scale}
                  colorGrade={`contrast(${1.2 + (preDrop ? 0.4 : 0)}) saturate(${desaturate * 1.3}) brightness(${brightness})`}
                  glowColor="rgba(255, 255, 255, 0.5)"
                />

                {/* Pre-Drop White Warning Flash on frames 178-179 */}
                {localFrame >= 177 && localFrame <= 179 && (
                  <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: 0.95, zIndex: 60 }} />
                )}

                <AnimeTitleCard
                  kanji="電光衝突"
                  subtext="ENERGY COLLISION"
                  themeColor="#FFFFFF"
                  glowColor="rgba(255, 255, 255, 0.85)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 5: THE BEAT DROP - KILLUA GODSPEED AURA FREEZE & CHAD OVERLAY (Frames 620–980, 6.0s) */}
        <Series.Sequence durationInFrames={360}>
          {(() => {
            const localFrame = frame - 620;

            // Aura Freeze for first 48 frames (0.8s) on the awakening frame!
            const isFrozen = localFrame < 48;
            const freezeFrameIndex = 30; // Peak lightning surge frame

            // Invert flash on frame 0-1
            const isInvert = localFrame === 0 || localFrame === 1;

            // Rotational Trauma Shake
            const shakeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 10, stiffness: 240, mass: 0.8 },
            });
            const shakeDecay = Math.max(0, 1 - shakeSpring);
            const rotJitter = Math.sin(localFrame * 0.9) * shakeDecay * 3.8;
            const transX = Math.cos(localFrame * 1.2) * shakeDecay * 35;
            const transY = Math.sin(localFrame * 1.5) * shakeDecay * 22;

            // Scale Velocity Punch
            const scale = interpolate(localFrame, [0, 48, 360], [1.35, 1.16, 1.3]);

            // Bass Cowbell Kick Chromatic Pulse
            const cowbellKick = localFrame % 46 < 4;
            const chromOffset = cowbellKick ? 12 : 0;

            // Chad Aura Badge Entrance & Exit
            const badgeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 220 },
            });
            const badgeOpacity = interpolate(localFrame, [0, 10, 80, 95], [0, 1, 1, 0]);

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
                  colorGrade={`contrast(1.34) saturate(1.45) brightness(1.08) hue-rotate(-12deg) drop-shadow(-${chromOffset}px 0 0 rgba(255,0,80,0.65)) drop-shadow(${chromOffset}px 0 0 rgba(0,230,255,0.75))`}
                  glowColor="rgba(0, 229, 255, 0.65)"
                />

                {/* Radial Electric Blue Speedlines */}
                <RadialSpeedlines color="#00E5FF" density={44} intensity={0.65} />

                {/* Chad / Sigma Aura Counter Badge */}
                {localFrame < 95 && (
                  <AuraBadge
                    glyph="🗿"
                    points="+999,999 AURA"
                    label="GODSPEED AWAKENED"
                    accentColor="#00E5FF"
                    glowColor="rgba(0, 229, 255, 0.85)"
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
                  opacity={interpolate(localFrame, [0, 5, 330, 360], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 360], [1.0, 1.08])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 6: Zenitsu Counter Awakening (Frames 980–1180, 3.33s) */}
        <Series.Sequence durationInFrames={200}>
          {(() => {
            const localFrame = frame - 980;
            const scale = interpolate(localFrame, [0, 200], [1.14, 1.28]);
            const textOpacity = interpolate(localFrame, [0, 15, 180, 200], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_07_zenitsu_counter.mp4')}
                  scale={scale}
                  colorGrade="contrast(1.26) saturate(1.35) brightness(1.05)"
                  glowColor="rgba(255, 200, 0, 0.5)"
                />
                <AnimeTitleCard
                  kanji="霹靂一閃"
                  subtext="THUNDERCLAP AND FLASH"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.8)"
                  position="top"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 7: Zenitsu Iaijutsu Draw Stance (Frames 1180–1300, 2.0s) */}
        <Series.Sequence durationInFrames={120}>
          {(() => {
            const localFrame = frame - 1180;
            const scale = interpolate(localFrame, [0, 120], [1.16, 1.3]);
            const textOpacity = interpolate(localFrame, [0, 10, 105, 120], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_08_zenitsu_draw.mp4')}
                  scale={scale}
                  colorGrade="contrast(1.28) saturate(1.4) brightness(1.08)"
                  glowColor="rgba(255, 170, 0, 0.6)"
                />
                <AnimeTitleCard
                  kanji="抜刀の構え"
                  subtext="IAIJUTSU STANCE"
                  themeColor="#FFB300"
                  glowColor="rgba(255, 179, 0, 0.85)"
                  position="bottom"
                  opacity={textOpacity}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 8: THE SECOND BEAT DROP - ZENITSU FLAMING DRAGON AURA FREEZE & CHAD BADGE (Frames 1300–1740, 7.33s) */}
        <Series.Sequence durationInFrames={440}>
          {(() => {
            const localFrame = frame - 1300;

            // Aura Freeze for 48 frames on dragon eruption frame!
            const isFrozen = localFrame < 48;
            const freezeFrameIndex = 36; // Full Dragon head roar frame

            // Impact Spring Shake
            const dragonSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 250 },
            });
            const dragonDecay = Math.max(0, 1 - dragonSpring);
            const rotShake = Math.sin(localFrame * 0.85) * dragonDecay * 4.2;
            const transX = Math.cos(localFrame * 1.1) * dragonDecay * 38;
            const transY = Math.sin(localFrame * 1.4) * dragonDecay * 24;

            const scale = interpolate(localFrame, [0, 48, 440], [1.38, 1.18, 1.35]);

            // Chad Aura Badge Entrance & Exit
            const badgeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 9, stiffness: 220 },
            });
            const badgeOpacity = interpolate(localFrame, [0, 10, 85, 100], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_09_zenitsu_dragon.mp4')}
                  scale={scale}
                  shakeAngle={rotShake}
                  shakeX={transX}
                  shakeY={transY}
                  freezeFrame={isFrozen ? freezeFrameIndex : null}
                  mangaHalftone={isFrozen}
                  colorGrade="contrast(1.32) saturate(1.55) brightness(1.12)"
                  glowColor="rgba(255, 170, 0, 0.75)"
                />

                {/* Fiery Golden Dragon Speedlines */}
                <RadialSpeedlines color="#FFD700" density={52} intensity={0.75} />

                {/* Chad / Sigma Aura Counter Badge */}
                {localFrame < 100 && (
                  <AuraBadge
                    glyph="🔥"
                    points="+1,000,000 AURA"
                    label="SEVENTH FORM UNLEASHED"
                    accentColor="#FFD700"
                    glowColor="rgba(255, 215, 0, 0.9)"
                    scale={badgeSpring}
                    opacity={badgeOpacity}
                  />
                )}

                <AnimeTitleCard
                  kanji="漆ノ型 火雷神"
                  subtext="SEVENTH FORM : HONOIKAZUCHI NO KAMI"
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.95)"
                  position="bottom"
                  opacity={interpolate(localFrame, [0, 5, 410, 440], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 440], [1.0, 1.1])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* ACT 9: SEAMLESS REPLAY LOOP OUTRO (Frames 1740–1800, 1.0s) */}
        <Series.Sequence durationInFrames={60}>
          {(() => {
            const localFrame = frame - 1740;
            // Rapid whip-zoom blur matching Frame 0 standoff
            const loopScale = interpolate(localFrame, [0, 45, 60], [1.18, 1.25, 1.55]);
            const loopBlur = interpolate(localFrame, [45, 60], [0, 18]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/scene_01_standoff.mp4')}
                  scale={loopScale}
                  colorGrade={`contrast(1.2) saturate(1.2) brightness(0.95) blur(${loopBlur}px)`}
                  glowColor="rgba(255, 215, 0, 0.4)"
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
