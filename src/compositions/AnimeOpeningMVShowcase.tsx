import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
} from 'remotion';
import {
  AnimeHalftoneBackground,
  AnimeKineticLyrics,
  AnimePixelSprite,
  AnimePixelRunnerStage,
  ANIME_OP_175BPM,
  ANIME_OP_LYRICS,
} from '../engines/animeop';

export const AnimeOpeningMVShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Find active lyric line based on current frame
  const currentLyric = ANIME_OP_LYRICS.find(
    (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
  );

  // 175 BPM beat pulse
  const beatProgress = (frame % ANIME_OP_175BPM.framesPerBeat) / ANIME_OP_175BPM.framesPerBeat;
  const beatBounce = Math.sin(beatProgress * Math.PI);

  // Scene partitioning across 960 frames (40.0s @ 24fps)
  // Scene 1: Frames 0 - 72   (Arcade Ready & Countdown)
  // Scene 2: Frames 72 - 212 (Main Title Card & Idol Reveal)
  // Scene 3: Frames 212 - 470 (16-Bit Side-Scroller Parallax Runner)
  // Scene 4: Frames 470 - 660 (Tension Drum Breaks & Dual Kanji Slams)
  // Scene 5: Frames 660 - 960 (Grand Chorus Pixel Idol Line & Climax)

  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b', overflow: 'hidden' }}>
      {/* Authentic Suno J-Pop Idol Track */}
      <Audio src={staticFile('audio/anime_op_suno_175bpm.mp3')} volume={0.92} />

      {/* ======================================================== */}
      {/* SCENE 1: ARCADE READY & COUNTDOWN (Frames 0 - 72)         */}
      {/* ======================================================== */}
      {frame < 72 && (
        <AbsoluteFill>
          <AnimeHalftoneBackground
            theme="scarlet"
            showTvSize={true}
            showTape={false}
            speedLines={true}
          />
          {/* Centered Idol in Ready Stance */}
          <div
            style={{
              position: 'absolute',
              bottom: 180,
              left: width / 2 - 120,
              zIndex: 10,
            }}
          >
            <AnimePixelSprite action="ready" pixelScale={8} direction="right" sparkles={true} />
          </div>
          {/* Arcade READY? Box */}
          <AnimeKineticLyrics currentLyric={currentLyric} />
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: MAIN TITLE CARD & IDOL REVEAL (Frames 72 - 212) */}
      {/* ======================================================== */}
      {frame >= 72 && frame < 212 && (
        <AbsoluteFill>
          <AnimeHalftoneBackground
            theme="cream"
            showTvSize={true}
            showTape={true}
            tapeText="TV ANIMATION OPENING • 175 BPM"
            speedLines={true}
          />

          {/* Left Dancer (Wave) */}
          <div
            style={{
              position: 'absolute',
              bottom: 140,
              left: 200,
              zIndex: 12,
            }}
          >
            <AnimePixelSprite action="wave" pixelScale={8} direction="right" sparkles={true} />
          </div>

          {/* Right Dancer (Dance) */}
          <div
            style={{
              position: 'absolute',
              bottom: 140,
              right: 200,
              zIndex: 12,
            }}
          >
            <AnimePixelSprite action="dance" pixelScale={8} direction="left" sparkles={true} />
          </div>

          {/* Kinetic Title Text */}
          <AnimeKineticLyrics currentLyric={currentLyric} />
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: 16-BIT PARALLAX RUNNER STAGE (Frames 212 - 470) */}
      {/* ======================================================== */}
      {frame >= 212 && frame < 470 && (
        <AbsoluteFill>
          <AnimePixelRunnerStage
            speed={1.2}
            characterAction="run"
            score={48200 + Math.floor((frame - 212) * 45)}
            combo={32 + Math.floor((frame - 212) / 16)}
            stageName="SHIBUYA TWILIGHT RUN"
          />
          {/* Subtitle Line during verse */}
          <AnimeKineticLyrics currentLyric={currentLyric} />
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: DRUM BREAKS & DUAL KANJI SLAMS (Frames 470 - 660)*/}
      {/* ======================================================== */}
      {frame >= 470 && frame < 660 && (
        <AbsoluteFill>
          {/* Deep dark / midnight theme for high contrast impact */}
          <AnimeHalftoneBackground
            theme="night"
            showTvSize={true}
            showTape={false}
            speedLines={true}
          />

          {/* Kanji Slam Impact Component */}
          <AnimeKineticLyrics currentLyric={currentLyric} />
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 5: GRAND CHORUS & PIXEL IDOL LINE (Frames 660 - 960)*/}
      {/* ======================================================== */}
      {frame >= 660 && (
        <AbsoluteFill>
          {/* Alternating energetic theme on 175 BPM downbeats */}
          <AnimeHalftoneBackground
            theme={Math.floor(frame / (ANIME_OP_175BPM.framesPerBeat * 4)) % 2 === 0 ? 'scarlet' : 'cyan'}
            showTvSize={true}
            showTape={true}
            tapeText="★ GRAND CHORUS // SPRINTING BOUNCE ★"
            speedLines={true}
          />

          {/* 5-Member Pixel Idol Dancing Chorus Line */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              zIndex: 15,
            }}
          >
            {/* Dancer 1 (Wave) */}
            <AnimePixelSprite action="wave" pixelScale={6.5} direction="right" sparkles={false} />
            {/* Dancer 2 (Dance) */}
            <AnimePixelSprite action="dance" pixelScale={7.2} direction="right" sparkles={true} />
            {/* Center Soloist (Lead Dancer) */}
            <AnimePixelSprite action="dance" pixelScale={8.5} direction="right" sparkles={true} />
            {/* Dancer 4 (Dance) */}
            <AnimePixelSprite action="dance" pixelScale={7.2} direction="left" sparkles={true} />
            {/* Dancer 5 (Wave) */}
            <AnimePixelSprite action="wave" pixelScale={6.5} direction="left" sparkles={false} />
          </div>

          {/* Golden Confetti / Sparkle Explosion */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 18,
            }}
          >
            {Array.from({ length: 36 }, (_, i) => {
              const pX = (i * 54 + frame * 4) % width;
              const pY = ((i * 37 + frame * 9) % height);
              const pSize = 4 + (i % 4) * 3;
              const pRot = (frame * 6 + i * 20) % 360;
              const pColor = i % 3 === 0 ? '#fde047' : i % 3 === 1 ? '#38bdf8' : '#ffffff';
              return (
                <rect
                  key={i}
                  x={pX}
                  y={pY}
                  width={pSize}
                  height={pSize * 1.5}
                  fill={pColor}
                  transform={`rotate(${pRot} ${pX + pSize / 2} ${pY + pSize})`}
                  opacity={0.8}
                />
              );
            })}
          </svg>

          {/* Kinetic Lyrics / Glitch Bar / End Card */}
          <AnimeKineticLyrics currentLyric={currentLyric} />
        </AbsoluteFill>
      )}

      {/* Broadcast Frame Overlay Border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: '12px solid #000000',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};
