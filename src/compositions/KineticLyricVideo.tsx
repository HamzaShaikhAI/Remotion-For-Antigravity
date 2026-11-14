import React, { useMemo } from 'react';
import {
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { CanvasEffectsMatrix, CanvasEffect } from '../engines/effects/CanvasEffectsMatrix';

// Deterministic pseudo-random number generator (no Math.random())
function pseudoNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ---------------------------------------------------------------------
// 1. INTRO COMPONENT (Frames 0 - 344)
// ---------------------------------------------------------------------
const IntroSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Progress indicators
  const scanlineY = (frame * 12) % 1080;
  const gridOpacity = interpolate(frame, [0, 40], [0, 0.4], { extrapolateRight: 'clamp' });

  // Word 1: INITIALIZE CANVAS (0 - 80)
  const w1Spring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 220 } });
  // Word 2: LOCK TIMELINE CLOCK (80 - 160)
  const w2Spring = spring({ frame: frame - 85, fps, config: { damping: 12, stiffness: 220 } });
  // Word 3: ONE SENTENCE IN (160 - 250)
  const w3Spring = spring({ frame: frame - 165, fps, config: { damping: 10, stiffness: 240 } });
  // Word 4: IGNITE! (250 - 344)
  const w4Spring = spring({ frame: frame - 250, fps, config: { damping: 8, stiffness: 300 } });

  const flashOpacity = interpolate(frame, [250, 256, 280], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: gridOpacity,
        }}
      />

      {/* Cyber Scanning Line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanlineY}px`,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
          boxShadow: '0 0 15px #38bdf8',
        }}
      />

      {/* Top Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'monospace',
          color: '#38bdf8',
          fontSize: 18,
          letterSpacing: '0.15em',
        }}
      >
        <div>[SYS_BOOT: KINETIC_STUDIO_V2.4]</div>
        <div style={{ color: '#facc15' }}>TIMECODE: {Math.floor(frame / 60)}:{(frame % 60).toString().padStart(2, '0')}</div>
        <div>TARGET_FPS: 60.000 // JITTER: 0.00ms</div>
      </div>

      {/* Center Dynamic Typography */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {frame < 85 && (
          <div
            style={{
              transform: `scale(${interpolate(w1Spring, [0, 1], [0.6, 1])})`,
              opacity: w1Spring,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 100,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              textShadow: '0 0 30px rgba(56, 189, 248, 0.8), 0 4px 12px rgba(0,0,0,0.9)',
            }}
          >
            INITIALIZE <span style={{ color: '#38bdf8' }}>CANVAS</span>
          </div>
        )}

        {frame >= 85 && frame < 165 && (
          <div
            style={{
              transform: `scale(${interpolate(w2Spring, [0, 1], [0.5, 1])}) rotate(${interpolate(w2Spring, [0, 1], [-5, 0])}deg)`,
              opacity: w2Spring,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 110,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              textShadow: '0 0 40px rgba(250, 204, 21, 0.7)',
            }}
          >
            LOCK <span style={{ color: '#facc15' }}>TIMELINE</span> CLOCK
          </div>
        )}

        {frame >= 165 && frame < 250 && (
          <div
            style={{
              transform: `scale(${interpolate(w3Spring, [0, 1], [0.7, 1.1])})`,
              opacity: w3Spring,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 130,
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '0 0 50px rgba(56, 189, 248, 1)',
            }}
          >
            ONE SENTENCE IN.
          </div>
        )}

        {frame >= 250 && (
          <div
            style={{
              transform: `scale(${interpolate(w4Spring, [0, 1], [2.2, 1])})`,
              opacity: w4Spring,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 190,
              color: '#facc15',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textShadow: '0 0 80px rgba(250, 204, 21, 1), 0 0 30px #ffffff',
            }}
          >
            IGNITE!
          </div>
        )}
      </div>

      {/* Riser Flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. VERSE COMPONENT (Frames 344 - 729)
// ---------------------------------------------------------------------
const VerseSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 344;

  // Subsection 1: TYPING PROMPT, FIRING CODE (0 - 95)
  const sub1 = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 220 } });
  // Subsection 2: VECTOR SPRINGS IN OVERLOAD! (95 - 195)
  const sub2 = spring({ frame: localFrame - 95, fps, config: { damping: 9, stiffness: 240 } });
  // Subsection 3: NO TIMELINE DRAG, NO RENDER PAIN (195 - 285)
  const sub3 = spring({ frame: localFrame - 195, fps, config: { damping: 11, stiffness: 210 } });
  // Subsection 4: NEURAL VISION IN THE BRAIN! (285 - 385)
  const sub4 = spring({ frame: localFrame - 285, fps, config: { damping: 10, stiffness: 250 } });

  // Kinetic code snippet ribbons scrolling in background
  const scrollOffset = (localFrame * 8) % 1920;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background Fast Code Stream */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: `-${scrollOffset}px`,
          whiteSpace: 'nowrap',
          fontFamily: 'monospace',
          fontSize: 22,
          color: 'rgba(56, 189, 248, 0.25)',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
        }}
      >
        {`const springVal = spring({ frame, fps, config: { damping: 10, stiffness: 200 } }); interpolate(springVal, [0, 1], [0, 1080]); `
          .repeat(8)}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: `-${scrollOffset}px`,
          whiteSpace: 'nowrap',
          fontFamily: 'monospace',
          fontSize: 22,
          color: 'rgba(163, 230, 53, 0.25)',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
        }}
      >
        {`export const Composition = () => <AudioReactiveMesh frequencyData={stems.bass} color="#a3e635" /> `
          .repeat(8)}
      </div>

      {/* Main Kinetic Typography Stage */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
        }}
      >
        {localFrame < 95 && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                transform: `translateX(${interpolate(sub1, [0, 1], [-200, 0])}px)`,
                opacity: sub1,
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 110,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textShadow: '0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              TYPING <span style={{ color: '#38bdf8' }}>PROMPT,</span>
            </div>
            <div
              style={{
                transform: `translateX(${interpolate(sub1, [0, 1], [200, 0])}px)`,
                opacity: sub1,
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 120,
                color: '#a3e635',
                letterSpacing: '0.04em',
                textShadow: '0 0 35px rgba(163, 230, 53, 0.8)',
              }}
            >
              FIRING CODE!
            </div>
          </div>
        )}

        {localFrame >= 95 && localFrame < 195 && (
          <div
            style={{
              transform: `scale(${interpolate(sub2, [0, 1], [0.6, 1.05])}) rotate(${interpolate(sub2, [0, 1], [8, -2])}deg)`,
              opacity: sub2,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 100,
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              VECTOR SPRINGS
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 135,
                color: '#facc15',
                textTransform: 'uppercase',
                textShadow: '0 0 45px rgba(250, 204, 21, 0.9)',
              }}
            >
              IN OVERLOAD!
            </div>
          </div>
        )}

        {localFrame >= 195 && localFrame < 285 && (
          <div
            style={{
              transform: `scale(${interpolate(sub3, [0, 1], [1.2, 1])})`,
              opacity: sub3,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                padding: '12px 32px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid #ef4444',
                borderRadius: 16,
                fontFamily: 'monospace',
                fontSize: 48,
                color: '#ef4444',
                fontWeight: 900,
              }}
            >
              ❌ NO TIMELINE DRAG
            </div>
            <div
              style={{
                padding: '12px 32px',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                borderRadius: 16,
                fontFamily: 'monospace',
                fontSize: 48,
                color: '#22c55e',
                fontWeight: 900,
              }}
            >
              ✅ NO RENDER PAIN
            </div>
          </div>
        )}

        {localFrame >= 285 && (
          <div
            style={{
              transform: `scale(${interpolate(sub4, [0, 1], [0.7, 1])})`,
              opacity: sub4,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 90,
                color: '#ffffff',
                letterSpacing: '0.04em',
              }}
            >
              NEURAL VISION
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 140,
                color: '#38bdf8',
                letterSpacing: '0.06em',
                textShadow: '0 0 60px rgba(56, 189, 248, 1)',
              }}
            >
              IN THE BRAIN!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. CHORUS & DROP COMPONENT (Frames 729 - 1618)
// ---------------------------------------------------------------------
const ChorusSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 729;

  // 140 BPM downbeat pulse (every 25.71 frames)
  const beatProgress = (localFrame % 25.71) / 25.71;
  const bassPulse = Math.sin(beatProgress * Math.PI);
  const ringScale = 1 + bassPulse * 0.25;

  // Hook 1: ONE SENTENCE IN! SIXTY FRAMES A SECOND OUT! (0 - 141)
  const hook1 = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 260 } });
  // Hook 1 follow: TURN CODE UP, MAKE SPEAKERS SHOUT! (141 - 281)
  const hook1b = spring({ frame: localFrame - 141, fps, config: { damping: 9, stiffness: 250 } });
  // Hook 2: ONE SENTENCE IN! SIXTY FRAMES A SECOND OUT! (281 - 431)
  const hook2 = spring({ frame: localFrame - 281, fps, config: { damping: 9, stiffness: 260 } });
  // Hook 2 follow: PURE MATH, WHAT IT IS ALL ABOUT! (431 - 571)
  const hook2b = spring({ frame: localFrame - 431, fps, config: { damping: 10, stiffness: 240 } });
  // Hook 3: ONE SENTENCE IN! SIXTY FRAMES A SECOND OUT! (571 - 751)
  const hook3 = spring({ frame: localFrame - 571, fps, config: { damping: 8, stiffness: 280 } });
  // DROP CLIMAX: D R O P ! (751 - 889)
  const dropSpring = spring({ frame: localFrame - 751, fps, config: { damping: 7, stiffness: 320 } });

  // Camera Shake on DROP
  const isDrop = localFrame >= 751;
  const shakeX = isDrop ? Math.sin(localFrame * 1.8) * 16 * (1 - (localFrame - 751) / 138) : 0;
  const shakeY = isDrop ? Math.cos(localFrame * 2.2) * 14 * (1 - (localFrame - 751) / 138) : 0;

  // Strobe flash on drop
  const dropFlash = isDrop
    ? interpolate(localFrame - 751, [0, 5, 25], [0.95, 0.4, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Bass Reactive Radial Rings */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 800,
          marginTop: -400,
          marginLeft: -400,
          borderRadius: '50%',
          border: '4px solid rgba(163, 230, 53, 0.4)',
          transform: `scale(${ringScale})`,
          boxShadow: '0 0 60px rgba(163, 230, 53, 0.3)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1200,
          height: 1200,
          marginTop: -600,
          marginLeft: -600,
          borderRadius: '50%',
          border: '2px dashed rgba(56, 189, 248, 0.3)',
          transform: `scale(${ringScale * 1.15}) rotate(${localFrame}deg)`,
          pointerEvents: 'none',
        }}
      />

      {/* Center Hook Visualizations */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* HOOK 1 */}
        {localFrame < 141 && (
          <div style={{ transform: `scale(${interpolate(hook1, [0, 1], [0.7, 1])})` }}>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 130,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                WebkitTextStroke: '3px #000000',
                textShadow: '0 0 35px #a3e635',
              }}
            >
              ONE SENTENCE IN!
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 105,
                color: '#a3e635',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textShadow: '0 0 50px rgba(163, 230, 53, 1)',
              }}
            >
              60 FRAMES A SECOND OUT!
            </div>
          </div>
        )}

        {/* HOOK 1b */}
        {localFrame >= 141 && localFrame < 281 && (
          <div style={{ transform: `scale(${interpolate(hook1b, [0, 1], [0.8, 1.05])})` }}>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 110,
                color: '#38bdf8',
                textTransform: 'uppercase',
                textShadow: '0 0 40px rgba(56, 189, 248, 0.9)',
              }}
            >
              TURN CODE UP!
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 120,
                color: '#facc15',
                textTransform: 'uppercase',
                textShadow: '0 0 50px rgba(250, 204, 21, 1)',
              }}
            >
              MAKE SPEAKERS SHOUT!
            </div>
          </div>
        )}

        {/* HOOK 2 */}
        {localFrame >= 281 && localFrame < 431 && (
          <div
            style={{
              transform: `scale(${interpolate(hook2, [0, 1], [0.65, 1.1])}) rotate(${interpolate(hook2, [0, 1], [-4, 2])}deg)`,
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 140,
                color: '#ffffff',
                letterSpacing: '0.05em',
                textShadow: '0 0 40px #ec4899',
              }}
            >
              ONE SENTENCE IN!
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 100,
                color: '#ec4899',
                letterSpacing: '0.04em',
                textShadow: '0 0 60px rgba(236, 72, 153, 1)',
              }}
            >
              60 FRAMES A SECOND OUT!
            </div>
          </div>
        )}

        {/* HOOK 2b */}
        {localFrame >= 431 && localFrame < 571 && (
          <div style={{ transform: `scale(${interpolate(hook2b, [0, 1], [0.85, 1])})` }}>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 125,
                color: '#a3e635',
                textTransform: 'uppercase',
                textShadow: '0 0 50px rgba(163, 230, 53, 0.9)',
              }}
            >
              PURE MATH!
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 48,
                color: '#ffffff',
                background: 'rgba(0,0,0,0.6)',
                padding: '10px 30px',
                borderRadius: 12,
                border: '1px solid #a3e635',
                marginTop: 20,
              }}
            >
              lim(latency → 0) [ RenderSpeed = ∞ ]
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 80,
                color: '#ffffff',
                marginTop: 20,
              }}
            >
              WHAT IT IS ALL ABOUT!
            </div>
          </div>
        )}

        {/* HOOK 3 */}
        {localFrame >= 571 && localFrame < 751 && (
          <div
            style={{
              transform: `scale(${interpolate(hook3, [0, 1], [0.7, 1.15])})`,
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 150,
                color: '#facc15',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textShadow: '0 0 70px rgba(250, 204, 21, 1)',
              }}
            >
              ONE SENTENCE IN!
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 110,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textShadow: '0 0 40px #38bdf8',
              }}
            >
              60 FRAMES A SECOND OUT!
            </div>
          </div>
        )}

        {/* THE DROP */}
        {localFrame >= 751 && (
          <div
            style={{
              transform: `scale(${interpolate(dropSpring, [0, 1], [3.5, 1])})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 260,
                color: '#ffffff',
                letterSpacing: '0.12em',
                textShadow: '0 0 100px #ff0055, 0 0 40px #a3e635, 0 8px 30px #000000',
                WebkitTextStroke: '4px #000000',
              }}
            >
              DROP!
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 32,
                color: '#a3e635',
                background: '#000000',
                padding: '8px 24px',
                borderRadius: 8,
                border: '2px solid #a3e635',
                letterSpacing: '0.2em',
              }}
            >
              MAXIMAL BASS SHOCKWAVE // 140 BPM
            </div>
          </div>
        )}
      </div>

      {/* DROP FLASH */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          opacity: dropFlash,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. BRIDGE COMPONENT (Frames 1618 - 2067)
// ---------------------------------------------------------------------
const BridgeSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 1618;

  // Subsection 1: SUB-BASS SHAKING THROUGH FOUR K GLASS (0 - 112)
  const b1 = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 180 } });
  // Subsection 2: BEZIER CURVES IN A FIRST-CLASS PASS (112 - 222)
  const b2 = spring({ frame: localFrame - 112, fps, config: { damping: 12, stiffness: 190 } });
  // Subsection 3: NO MATH.RANDOM, ZERO DRIFT (222 - 332)
  const b3 = spring({ frame: localFrame - 222, fps, config: { damping: 11, stiffness: 210 } });
  // Subsection 4: EVERY PIXEL ON INSTANT SHIFT! (332 - 449)
  const b4 = spring({ frame: localFrame - 332, fps, config: { damping: 10, stiffness: 230 } });

  // Animated Bezier Path Line
  const pathT = interpolate(localFrame, [112, 222], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Futuristic Vector SVG Curves */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1920 1080"
      >
        <path
          d="M 100 800 C 500 200, 1400 900, 1820 300"
          fill="none"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="4"
          strokeDasharray="1800"
          strokeDashoffset={1800 * (1 - pathT)}
        />
        <circle cx="500" cy="200" r="8" fill="#facc15" />
        <circle cx="1400" cy="900" r="8" fill="#facc15" />
      </svg>

      {/* Typography Stage */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 100px',
          textAlign: 'center',
        }}
      >
        {localFrame < 112 && (
          <div
            style={{
              transform: `scale(${interpolate(b1, [0, 1], [0.8, 1])})`,
              opacity: b1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              padding: '40px 60px',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 90,
                color: '#ffffff',
                letterSpacing: '0.04em',
              }}
            >
              SUB-BASS SHAKING
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 120,
                color: '#38bdf8',
                letterSpacing: '0.05em',
                textShadow: '0 0 40px rgba(56, 189, 248, 0.9)',
              }}
            >
              THROUGH 4K GLASS!
            </div>
          </div>
        )}

        {localFrame >= 112 && localFrame < 222 && (
          <div
            style={{
              transform: `scale(${interpolate(b2, [0, 1], [0.75, 1])})`,
              opacity: b2,
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 95,
                color: '#facc15',
                textTransform: 'uppercase',
                textShadow: '0 0 35px rgba(250, 204, 21, 0.8)',
              }}
            >
              BEZIER CURVES
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 110,
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              IN A FIRST-CLASS PASS!
            </div>
          </div>
        )}

        {localFrame >= 222 && localFrame < 332 && (
          <div
            style={{
              transform: `scale(${interpolate(b3, [0, 1], [0.8, 1.05])})`,
              opacity: b3,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                background: 'rgba(239, 68, 68, 0.25)',
                border: '2px solid #ef4444',
                borderRadius: 12,
                fontFamily: 'monospace',
                fontSize: 48,
                color: '#ef4444',
                fontWeight: 900,
                marginBottom: 20,
              }}
            >
              NO Math.random() ❌
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 140,
                color: '#a3e635',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textShadow: '0 0 50px rgba(163, 230, 53, 1)',
              }}
            >
              ZERO DRIFT!
            </div>
          </div>
        )}

        {localFrame >= 332 && (
          <div
            style={{
              transform: `scale(${interpolate(b4, [0, 1], [0.7, 1])})`,
              opacity: b4,
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 100,
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              EVERY PIXEL ON
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 140,
                color: '#38bdf8',
                textTransform: 'uppercase',
                textShadow: '0 0 60px rgba(56, 189, 248, 1)',
              }}
            >
              INSTANT SHIFT!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. OUTRO COMPONENT (Frames 2067 - 2412)
// ---------------------------------------------------------------------
const OutroSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 2067;

  // Final Hook (0 - 133)
  const oHook = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 240 } });
  // RENDER COMPLETE (133 - 233)
  const oRender = spring({ frame: localFrame - 133, fps, config: { damping: 10, stiffness: 230 } });
  // SHIP IT! (233 - 345)
  const oShip = spring({ frame: localFrame - 233, fps, config: { damping: 8, stiffness: 280 } });

  // Fade out at end
  const blackout = interpolate(localFrame, [320, 345], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {localFrame < 133 && (
          <div style={{ transform: `scale(${interpolate(oHook, [0, 1], [0.75, 1.05])})` }}>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 130,
                color: '#ffffff',
                textShadow: '0 0 40px #a3e635',
              }}
            >
              ONE SENTENCE IN!
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 105,
                color: '#a3e635',
                textShadow: '0 0 60px rgba(163, 230, 53, 1)',
              }}
            >
              60 FRAMES A SECOND OUT!
            </div>
          </div>
        )}

        {localFrame >= 133 && localFrame < 233 && (
          <div style={{ transform: `scale(${interpolate(oRender, [0, 1], [0.8, 1])})` }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 32,
                color: '#38bdf8',
                marginBottom: 20,
                letterSpacing: '0.2em',
              }}
            >
              [ 100% HARDWARE ACCELERATED // 0 DROPPED FRAMES ]
            </div>
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 160,
                color: '#22c55e',
                textShadow: '0 0 70px rgba(34, 197, 94, 1)',
              }}
            >
              RENDER COMPLETE!
            </div>
          </div>
        )}

        {localFrame >= 233 && (
          <div
            style={{
              transform: `scale(${interpolate(oShip, [0, 1], [2, 1])})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: 220,
                color: '#facc15',
                letterSpacing: '0.08em',
                textShadow: '0 0 80px rgba(250, 204, 21, 1), 0 0 30px #ffffff',
                WebkitTextStroke: '3px #000000',
              }}
            >
              SHIP IT!
            </div>
            <div
              style={{
                marginTop: 20,
                padding: '12px 36px',
                background: '#070a13',
                borderRadius: 50,
                border: '2px solid #facc15',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: 28,
                letterSpacing: '0.15em',
              }}
            >
              REA v2.4.0 × CLAUDE OPUS 5.5
            </div>
          </div>
        )}
      </div>

      {/* Iris Blackout Wipe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          opacity: blackout,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------
// DYNAMIC AUDIO EQUALIZER VISUALIZER (140 BPM BASS WAVE)
// ---------------------------------------------------------------------
const AudioEqualizerBars: React.FC<{ frame: number }> = ({ frame }) => {
  // 140 BPM beat cycle (every 25.71 frames at 60fps)
  const beatProg = (frame % 25.71) / 25.71;
  const kickPulse = Math.sin(beatProg * Math.PI);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 140,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 24,
        pointerEvents: 'none',
        zIndex: 40,
        opacity: 0.7,
      }}
    >
      {Array.from({ length: 48 }).map((_, i) => {
        const offset = Math.sin(frame * 0.15 + i * 0.3) * 0.5 + 0.5;
        const barHeight = 12 + (offset * 85 + kickPulse * 45) * (1 - Math.abs(i - 24) / 24);
        const hue = (i * 7 + frame * 2) % 360;
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: barHeight,
              borderRadius: '6px 6px 0 0',
              background: `linear-gradient(180deg, hsl(${hue}, 95%, 65%) 0%, hsl(${hue}, 80%, 40%) 100%)`,
              boxShadow: `0 0 16px hsl(${hue}, 90%, 55%)`,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------
// MASTER COMPOSITION: KINETIC LYRIC VIDEO
// ---------------------------------------------------------------------
export const KineticLyricVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic canvas post-processing shader stack:
  // Chromatic aberration spikes on chorus drop, scanlines subtle throughout
  const effects: CanvasEffect[] = useMemo(() => {
    const list: CanvasEffect[] = [
      { type: 'scanlines', intensity: 0.08 },
    ];

    if (frame >= 1480 && frame <= 1618) {
      list.push({ type: 'chromaticAberration', intensity: 0.06 });
      list.push({ type: 'vhsGlitch', intensity: 0.04 });
    }

    return list;
  }, [frame]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#070a13',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Deterministic Master Soundtrack (Upgraded AI Music v2.4) */}
      <Audio src={staticFile('audio/kinetic_master_v2.mp3')} />

      {/* Dynamic 140 BPM Reactive Audio Equalizer */}
      <AudioEqualizerBars frame={frame} />

      {/* Effects Matrix & Post-Processing */}
      <CanvasEffectsMatrix effects={effects} style={{ width: '100%', height: '100%' }}>
        {/* Section 1: INTRO (0 - 344) */}
        {frame < 344 && <IntroSection frame={frame} fps={fps} />}

        {/* Section 2: VERSE (344 - 729) */}
        {frame >= 344 && frame < 729 && <VerseSection frame={frame} fps={fps} />}

        {/* Section 3: CHORUS & DROP (729 - 1618) */}
        {frame >= 729 && frame < 1618 && <ChorusSection frame={frame} fps={fps} />}

        {/* Section 4: BRIDGE (1618 - 2067) */}
        {frame >= 1618 && frame < 2067 && <BridgeSection frame={frame} fps={fps} />}

        {/* Section 5: OUTRO (2067 - 2412) */}
        {frame >= 2067 && <OutroSection frame={frame} fps={fps} />}
      </CanvasEffectsMatrix>
    </div>
  );
};
