import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { AnimeKineticLyricLine, ANIME_OP_175BPM } from './types';

interface AnimeKineticLyricsProps {
  currentLyric?: AnimeKineticLyricLine;
}

export const AnimeKineticLyrics: React.FC<AnimeKineticLyricsProps> = ({ currentLyric }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!currentLyric) return null;

  const localFrame = frame - currentLyric.startFrame;
  if (localFrame < 0 || localFrame > currentLyric.durationFrames) return null;

  // Spring impact animation
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.8 },
  });

  // Beat pulse bounce
  const beatProgress = (frame % ANIME_OP_175BPM.framesPerBeat) / ANIME_OP_175BPM.framesPerBeat;
  const beatBounce = Math.sin(beatProgress * Math.PI) * 0.08;

  // Render Type 1: Title Card / Big Action Text ("SPARKLING IDOL RUN!" or "RUN!")
  if (currentLyric.type === 'title') {
    const scale = interpolate(enterSpring, [0, 1], [2.4, 1]) + beatBounce;
    const rotate = interpolate(enterSpring, [0, 1], [-8, -4]);

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            textAlign: 'center',
            filter: 'drop-shadow(8px 8px 0px #000000)',
          }}
        >
          {/* Main Title English/Romaji */}
          <h1
            style={{
              margin: 0,
              fontSize: 108,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              color: currentLyric.color || '#facc15',
              letterSpacing: 4,
              WebkitTextStroke: '6px #000000',
              textTransform: 'uppercase',
              lineHeight: 0.95,
            }}
          >
            {currentLyric.japanese}
          </h1>

          {/* Subtitle / Katakana tape */}
          {currentLyric.english && (
            <div
              style={{
                marginTop: 18,
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                padding: '8px 28px',
                fontSize: 26,
                fontWeight: 900,
                fontFamily: "'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
                letterSpacing: 6,
                borderRadius: 4,
                boxShadow: '4px 4px 0px #000000',
                transform: 'skewX(-12deg)',
              }}
            >
              {currentLyric.english}
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // Render Type 2: Arcade "READY?" Countdown
  if (currentLyric.type === 'ready') {
    const scale = interpolate(enterSpring, [0, 1], [0.2, 1.1]) + beatBounce;
    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 25,
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) skewX(-10deg)`,
            backgroundColor: '#000000',
            padding: '24px 70px',
            border: '6px solid #facc15',
            boxShadow: '12px 12px 0px #dc2626',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#38bdf8',
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 8,
              fontFamily: "'Courier New', monospace",
              marginBottom: 4,
            }}
          >
            STAGE 01 // IDOL LIVE
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              fontFamily: "'Impact', sans-serif",
              color: '#ffffff',
              letterSpacing: 8,
              lineHeight: 1,
              textShadow: '0 0 20px #facc15',
            }}
          >
            READY?
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Render Type 3: Giant Single Kanji Slam ("届" or "疾") with Impact Burst Lines
  if (currentLyric.type === 'kanji-slam') {
    const slamScale = interpolate(enterSpring, [0, 1], [3.5, 1]);
    const impactShock = Math.max(0, 1 - localFrame / 18);
    const shakeX = Math.sin(localFrame * 3.5) * 14 * impactShock;
    const shakeY = Math.cos(localFrame * 3.5) * 14 * impactShock;

    const kanjiChar = currentLyric.kanjiImpactChar || currentLyric.japanese.charAt(0);

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Radial Speed Impact Lines on Slam */}
        {localFrame < 24 && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: impactShock,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: 32 }, (_, i) => {
              const angle = (i * 360) / 32;
              const rad = (angle * Math.PI) / 180;
              const r1 = 180 + (i % 3) * 60;
              const r2 = 900;
              const x1 = width / 2 + Math.cos(rad) * r1;
              const y1 = height / 2 + Math.sin(rad) * r1;
              const x2 = width / 2 + Math.cos(rad) * r2;
              const y2 = height / 2 + Math.sin(rad) * r2;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ffffff"
                  strokeWidth={4 + (i % 2) * 4}
                />
              );
            })}
          </svg>
        )}

        {/* Slamming Kanji Character */}
        <div
          style={{
            position: 'relative',
            transform: `scale(${slamScale}) rotate(-6deg)`,
            textAlign: 'center',
          }}
        >
          {/* Chromatic aberration layer (Cyan) */}
          <span
            style={{
              position: 'absolute',
              top: -6 * impactShock,
              left: -8 * impactShock,
              fontSize: 340,
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
              fontWeight: 900,
              color: '#06b6d4',
              opacity: 0.8 * impactShock,
              lineHeight: 1,
            }}
          >
            {kanjiChar}
          </span>
          {/* Chromatic aberration layer (Magenta) */}
          <span
            style={{
              position: 'absolute',
              top: 6 * impactShock,
              left: 8 * impactShock,
              fontSize: 340,
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
              fontWeight: 900,
              color: '#ec4899',
              opacity: 0.8 * impactShock,
              lineHeight: 1,
            }}
          >
            {kanjiChar}
          </span>

          {/* Main Solid Kanji */}
          <span
            style={{
              position: 'relative',
              fontSize: 340,
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
              fontWeight: 900,
              color: '#ffffff',
              WebkitTextStroke: '16px #000000',
              lineHeight: 1,
              filter: 'drop-shadow(14px 14px 0px #dc2626)',
              display: 'inline-block',
            }}
          >
            {kanjiChar}
          </span>

          {/* Subtitle phrase banner */}
          <div
            style={{
              marginTop: -40,
              backgroundColor: '#000000',
              color: '#facc15',
              padding: '12px 42px',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: 6,
              fontFamily: "'Impact', sans-serif",
              border: '4px solid #ffffff',
              transform: 'skewX(-14deg)',
              display: 'inline-block',
              boxShadow: '6px 6px 0px #dc2626',
            }}
          >
            {currentLyric.japanese}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Render Type 4: Glitch Impact Bar ("SPARKLING!!")
  if (currentLyric.type === 'glitch-bar') {
    const barWidth = interpolate(enterSpring, [0, 1], [0, width]);
    const glitchOffset = Math.sin(localFrame * 5) * 8;

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 35,
        }}
      >
        <div
          style={{
            width: barWidth,
            height: 140,
            backgroundColor: '#000000',
            borderTop: '6px solid #facc15',
            borderBottom: '6px solid #facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
            transform: `skewY(-2deg) translateX(${glitchOffset}px)`,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: 90,
              fontFamily: "'Impact', sans-serif",
              color: '#ffffff',
              letterSpacing: 12,
              WebkitTextStroke: '4px #dc2626',
              textShadow: '4px 4px 0px #06b6d4',
            }}
          >
            ★ ★ {currentLyric.japanese} ★ ★
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  // Render Type 5: Subtitle Line ("この瞬間を、THIS MOMENT")
  const subY = interpolate(enterSpring, [0, 1], [60, 0]);
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 110,
        zIndex: 22,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translateY(${subY}px) skewX(-8deg)`,
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          borderLeft: '10px solid #dc2626',
          borderRight: '10px solid #facc15',
          padding: '14px 40px',
          borderRadius: 6,
          boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: "'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
            letterSpacing: 4,
          }}
        >
          {currentLyric.japanese}
        </span>
        {currentLyric.english && (
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#facc15',
              fontFamily: "'Impact', sans-serif",
              letterSpacing: 3,
            }}
          >
            / {currentLyric.english}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};
