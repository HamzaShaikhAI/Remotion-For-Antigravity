import React from 'react';
import {
  AbsoluteFill,
  Audio,
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
          <radialGradient id="lineFade" cx="50%" cy="50%" r="50%">
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
              stroke="url(#lineFade)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${60 + (i % 4) * 35} ${40 + (i % 3) * 25}`}
            />
          );
        })}
      </svg>
    </div>
  );
};

// --- Clip-Aware Framed Viewport ---
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
}) => {
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
        <OffthreadVideo
          src={videoSrc}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
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

      {/* Layer 2: Pristine Hero 16:9 Anime Footage (Centered with Camera Pan & Scan) */}
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
          filter: invert ? 'invert(1) contrast(2)' : colorGrade,
        }}
      >
        <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          <OffthreadVideo
            src={videoSrc}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Main Bespoke Composition ---
export const ZenitsuVsKilluaShowdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Audio start offset: Frame 212 (3.53s in) aligns peak 808 drop to Frame 280
  const audioStartOffset = 212;
  const DROP_FRAME = 280;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#040407',
        overflow: 'hidden',
        width,
        height,
      }}
    >
      {/* EBU R128 Normalized Brazilian Phonk Soundtrack */}
      <Audio
        src={staticFile('audio/active-phonk.mp3')}
        startFrom={audioStartOffset}
        volume={1.0}
      />

      <Series>
        {/* SCENE 1: The Infinity Castle Standoff (Frames 0–70, 1.16s) */}
        <Series.Sequence durationInFrames={70}>
          {(() => {
            const localFrame = frame;
            // Smooth Pan: Zenitsu (left) -> Killua (right)
            const panX = interpolate(localFrame, [0, 24, 46, 70], [-130, -130, 130, 130], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(localFrame, [0, 70], [1.12, 1.22]);
            const textOpacity = interpolate(localFrame, [0, 10, 60, 70], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_01_standoff.mp4')}
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

        {/* SCENE 2: Zenitsu Power Gathering (Frames 70–130, 1.0s) */}
        <Series.Sequence durationInFrames={60}>
          {(() => {
            const localFrame = frame - 70;
            const scale = interpolate(localFrame, [0, 60], [1.15, 1.26]);
            const goldPulse = Math.sin(localFrame * 0.3) * 0.15;
            const textOpacity = interpolate(localFrame, [0, 8, 52, 60], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_02_zenitsu_charge.mp4')}
                  panX={-30}
                  scale={scale}
                  colorGrade={`contrast(1.24) saturate(${1.35 + goldPulse}) brightness(${1.04 + goldPulse * 0.4})`}
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

        {/* SCENE 3: Killua Assassin Smirk (Frames 130–200, 1.16s) */}
        <Series.Sequence durationInFrames={70}>
          {(() => {
            const localFrame = frame - 130;
            const scale = interpolate(localFrame, [0, 70], [1.16, 1.28]);
            const cyanPulse = Math.sin(localFrame * 0.35) * 0.18;
            const textOpacity = interpolate(localFrame, [0, 10, 60, 70], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_03_killua_smirk.mp4')}
                  panX={0}
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

        {/* SCENE 4: The Wide Clash & Pre-Drop Breath (Frames 200–280, 1.33s) */}
        <Series.Sequence durationInFrames={80}>
          {(() => {
            const localFrame = frame - 200;
            const scale = interpolate(localFrame, [0, 70, 80], [1.1, 1.22, 1.28]);

            // Pre-drop tension desaturate
            const preDropSilence = localFrame >= 68;
            const desaturate = preDropSilence
              ? interpolate(localFrame, [68, 80], [1.0, 0.0])
              : 1.0;
            const brightness = preDropSilence
              ? interpolate(localFrame, [68, 80], [1.0, 0.35])
              : 1.0;

            const textOpacity = interpolate(localFrame, [0, 10, 60, 68], [0, 1, 1, 0]);

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_04_wide_clash.mp4')}
                  scale={scale}
                  colorGrade={`contrast(${1.2 + (preDropSilence ? 0.35 : 0)}) saturate(${desaturate * 1.3}) brightness(${brightness})`}
                  glowColor="rgba(255, 255, 255, 0.5)"
                />

                {/* Pre-Drop White Warning Flash on frames 78-79 */}
                {localFrame >= 77 && localFrame <= 79 && (
                  <AbsoluteFill
                    style={{ backgroundColor: '#ffffff', opacity: 0.9, zIndex: 60 }}
                  />
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

        {/* SCENE 5: THE BEAT DROP - KILLUA GODSPEED DETONATION (Frames 280–500, 3.66s) */}
        <Series.Sequence durationInFrames={220}>
          {(() => {
            const localFrame = frame - 280;

            // 1-Frame Negative Invert on the drop
            const isInvertFrame = localFrame === 0 || localFrame === 1;

            // Rotational Trauma Shake with Spring Physics
            const shakeSpring = spring({
              frame: localFrame,
              fps,
              config: { damping: 11, stiffness: 250, mass: 0.8 },
            });
            const shakeDecay = Math.max(0, 1 - shakeSpring);
            const rotJitter = Math.sin(localFrame * 0.9) * shakeDecay * 3.5;
            const transX = Math.cos(localFrame * 1.2) * shakeDecay * 32;
            const transY = Math.sin(localFrame * 1.5) * shakeDecay * 20;

            // Velocity Speed Ramping: Burst fast -> smooth slow-mo linger
            const scale = interpolate(localFrame, [0, 25, 220], [1.32, 1.15, 1.28]);

            // RGB Chromatic Aberration pulse on cowbell beats
            const cowbellKick = localFrame % 46 < 4;
            const chromOffset = cowbellKick ? 12 : 0;

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_05_killua_godspeed.mp4')}
                  scale={scale}
                  shakeAngle={rotJitter}
                  shakeX={transX}
                  shakeY={transY}
                  invert={isInvertFrame}
                  colorGrade={`contrast(1.34) saturate(1.45) brightness(1.08) hue-rotate(-12deg) drop-shadow(-${chromOffset}px 0 0 rgba(255,0,80,0.65)) drop-shadow(${chromOffset}px 0 0 rgba(0,230,255,0.75))`}
                  glowColor="rgba(0, 229, 255, 0.65)"
                />

                {/* Radial Electric Blue Speedlines */}
                <RadialSpeedlines color="#00E5FF" density={44} intensity={0.6} />

                <AnimeTitleCard
                  kanji="神速・疾風迅雷"
                  subtext="GODSPEED : WHIRLWIND"
                  themeColor="#00E5FF"
                  glowColor="rgba(0, 229, 255, 0.95)"
                  position="bottom"
                  opacity={interpolate(localFrame, [0, 3, 195, 220], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 220], [1.0, 1.08])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>

        {/* SCENE 6: THE COUNTER CLIMAX - ZENITSU'S FLAMING THUNDER GOD (Frames 500–840, 5.66s) */}
        <Series.Sequence durationInFrames={340}>
          {(() => {
            const localFrame = frame - 500;
            const isDragonAwakened = localFrame >= 140;

            // Climax Impact Shake
            const dragonSpring = spring({
              frame: Math.max(0, localFrame - 140),
              fps,
              config: { damping: 9, stiffness: 260 },
            });
            const dragonDecay = isDragonAwakened ? Math.max(0, 1 - dragonSpring) : 0;
            const rotShake = Math.sin(localFrame * 0.85) * dragonDecay * 4.0;
            const transX = Math.cos(localFrame * 1.1) * dragonDecay * 36;
            const transY = Math.sin(localFrame * 1.4) * dragonDecay * 22;

            const scale = interpolate(localFrame, [0, 60, 140, 340], [1.12, 1.22, 1.18, 1.34]);

            // Seamless Loop Outro: Rapid whip-zoom on last 12 frames back to Frame 0 standoff
            const isLoopOutro = localFrame >= 328;
            const loopScale = isLoopOutro
              ? interpolate(localFrame, [328, 340], [1.0, 1.4])
              : 1.0;
            const loopBlur = isLoopOutro
              ? interpolate(localFrame, [328, 340], [0, 14])
              : 0;

            return (
              <AbsoluteFill>
                <AnimeViewport
                  videoSrc={staticFile('clips/clip_06_zenitsu_dragon.mp4')}
                  scale={scale * loopScale}
                  shakeAngle={rotShake}
                  shakeX={transX}
                  shakeY={transY}
                  colorGrade={`contrast(1.3) saturate(${isDragonAwakened ? 1.55 : 1.35}) brightness(${isDragonAwakened ? 1.12 : 1.02}) blur(${loopBlur}px)`}
                  glowColor={
                    isDragonAwakened
                      ? 'rgba(255, 170, 0, 0.7)'
                      : 'rgba(255, 200, 0, 0.45)'
                  }
                />

                {/* Fiery Golden Dragon Speedlines during Climax */}
                {isDragonAwakened && (
                  <RadialSpeedlines color="#FFD700" density={50} intensity={0.7} />
                )}

                <AnimeTitleCard
                  kanji={isDragonAwakened ? '漆ノ型 火雷神' : '霹靂一閃'}
                  subtext={
                    isDragonAwakened
                      ? 'SEVENTH FORM : HONOIKAZUCHI NO KAMI'
                      : 'THUNDERCLAP AND FLASH'
                  }
                  themeColor="#FFD700"
                  glowColor="rgba(255, 215, 0, 0.9)"
                  position={isDragonAwakened ? 'bottom' : 'top'}
                  opacity={interpolate(localFrame, [0, 15, 310, 330], [0, 1, 1, 0])}
                  scale={interpolate(localFrame, [0, 340], [1.0, 1.1])}
                />
              </AbsoluteFill>
            );
          })()}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
