import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { UniversalResponsiveContainer } from '../engines/multiformat/UniversalResponsiveContainer';

// =====================================================================
// REA V4.0 MASTER CINEMATIC COMPOSITION: "THE PARADOX OF FOCUS"
// Style: Arthur Brooks / Iman Gadzhi / Vox Documentary Minimalist
// Duration: 30.0s (900 frames @ 30fps) | 9:16 Vertical (1080x1920)
// Incorporates all 10 Fundamental REA Editing Principles
// =====================================================================

export const ParadoxOfFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------------
  // 1. SCENE SEGMENTATION & TIMING ANALYSIS
  // Scene 1 (0–4s   | Frames 0–120):   Hook & Line Flow (Principles 1, 4)
  // Scene 2 (4–9s   | Frames 120–270): Philosophy & Archive (Principles 3, 9)
  // Scene 3 (9–14s  | Frames 270–420): Brain Silhouette & Stats (Principles 7, 10)
  // Scene 4 (14–19s | Frames 420–570): Progression & Friction (Principles 5, 8)
  // Scene 5 (19–24s | Frames 570–720): Minimalist Quote (Principles 2, 6)
  // Scene 6 (24–30s | Frames 720–900): Final Climax & Lockup (Principles 1, 4)
  // -------------------------------------------------------------------

  // Active scene key calculation
  const sceneIndex = useMemo(() => {
    if (frame < 120) return 1;
    if (frame < 270) return 2;
    if (frame < 420) return 3;
    if (frame < 570) return 4;
    if (frame < 720) return 5;
    return 6;
  }, [frame]);

  // Spring entrances per scene
  const s1Spring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const s2Spring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 12, stiffness: 90 } });
  const s3Spring = spring({ frame: Math.max(0, frame - 270), fps, config: { damping: 13, stiffness: 95 } });
  const s4Spring = spring({ frame: Math.max(0, frame - 420), fps, config: { damping: 12, stiffness: 110 } });
  const s5Spring = spring({ frame: Math.max(0, frame - 570), fps, config: { damping: 14, stiffness: 85 } });
  const s6Spring = spring({ frame: Math.max(0, frame - 720), fps, config: { damping: 12, stiffness: 100 } });

  // Principle 4 & 10: Accent Blue Flow Vector Progress
  const lineProgressS1 = interpolate(frame, [15, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dataProgressS3 = interpolate(frame, [290, 390], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Digital noise / data counter (0 to 34 GB)
  const gigabytesCount = Math.floor(interpolate(frame, [280, 380], [0, 34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <UniversalResponsiveContainer>
      <AbsoluteFill
        style={{
          backgroundColor: '#f6f4ee', // Warm gallery off-white paper base
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: '#111827',
          overflow: 'hidden',
        }}
      >
        {/* ------------------------------------------------------------- */}
        {/* PRINCIPLE 2: ROUGH PAPER TEXTURE OVERLAY & CINEMATIC VIGNETTE */}
        {/* ------------------------------------------------------------- */}
        <AbsoluteFill
          style={{
            opacity: 0.16,
            mixBlendMode: 'multiply',
            backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
            backgroundSize: 'cover',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Soft Radial Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 160px rgba(17, 24, 39, 0.22)',
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />

        {/* Persistent Top Editorial HUD */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb', boxShadow: '0 0 10px #2563eb' }} />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', color: '#4b5563', textTransform: 'uppercase' }}>
              COGNITIVE ESSAYS · EPISODE 04
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.08)', padding: '4px 12px', borderRadius: 20 }}>
            00:{Math.floor(frame / 30).toString().padStart(2, '0')}:30
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SCENE 1: HOOK & FLOW LINE (Frames 0–120 | Principles 1, 4)     */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 1 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 80px',
              opacity: interpolate(frame, [100, 120], [1, 0], { extrapolateRight: 'clamp' }),
            }}
          >
            {/* Accent Blue Flow Vector (Principle 4) */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <path
                d="M 60 720 Q 540 640 980 1140"
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeDasharray="2000"
                strokeDashoffset={2000 * (1 - lineProgressS1)}
              />
              {lineProgressS1 > 0.02 && (
                <circle
                  cx={60 + lineProgressS1 * 920}
                  cy={720 + lineProgressS1 * 420 + Math.sin(lineProgressS1 * Math.PI) * -40}
                  r="8"
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
              )}
            </svg>

            {/* Kinetic Dual-Font Typography (Principle 1) */}
            <div
              style={{
                transform: `translateY(${interpolate(s1Spring, [0, 1], [40, 0])}px)`,
                opacity: s1Spring,
                zIndex: 30,
                maxWidth: 820,
              }}
            >
              <div style={{ fontSize: 32, color: '#4b5563', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 12 }}>
                You think focus is about
              </div>
              <h1
                style={{
                  fontSize: 84,
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  margin: 0,
                }}
              >
                pure{' '}
                <span
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontStyle: 'italic',
                    color: '#2563eb',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(37, 99, 235, 0.3)',
                  }}
                >
                  willpower.
                </span>
              </h1>
              <div
                style={{
                  marginTop: 28,
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#ef4444',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                It isn’t.
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCENE 2: PHILOSOPHY & ARCHIVE (Frames 120–270 | Principles 3, 9) */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 2 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 80px',
              opacity: interpolate(frame, [250, 270], [1, 0], { extrapolateRight: 'clamp' }),
            }}
          >
            {/* Classical Painting / Engraving Frame (Principle 3) */}
            <div
              style={{
                width: 720,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 20,
                padding: 32,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08)',
                transform: `translateY(${interpolate(s2Spring, [0, 1], [50, 0])}px)`,
                opacity: s2Spring,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
              }}
            >
              {/* Bracket Annotation Callout (Principle 9) */}
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  right: 32,
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  padding: '4px 12px',
                  borderRadius: 6,
                }}
              >
                [ ARCHIVE · 1890 ]
              </div>

              {/* Stylized Classical Portrait Art */}
              <div
                style={{
                  height: 380,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#94a3b8',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ fontSize: 64, filter: 'grayscale(100%) opacity(70%)' }}>🏛️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 12 }}>
                  WILLIAM JAMES
                </div>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#38bdf8' }}>
                  Principles of Psychology (1890)
                </div>
              </div>

              {/* Framing Quote */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <p style={{ fontSize: 24, color: '#4b5563', margin: 0, fontWeight: 500 }}>
                  Attention is the art of
                </p>
                <h2
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    color: '#111827',
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontStyle: 'italic',
                    margin: '6px 0 0',
                  }}
                >
                  “ignoring.”
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCENE 3: STATS & SILHOUETTE (Frames 270–420 | Principles 7, 10) */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 3 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 80px',
              opacity: interpolate(frame, [400, 420], [1, 0], { extrapolateRight: 'clamp' }),
            }}
          >
            {/* Top Negative Space Relational Typography (Principle 7) */}
            <div
              style={{
                textAlign: 'center',
                transform: `translateY(${interpolate(s3Spring, [0, 1], [30, 0])}px)`,
                opacity: s3Spring,
                marginBottom: 36,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
                Sensory Input Load
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#111827', margin: '8px 0 0' }}>
                The Modern Brain Under Siege
              </h2>
            </div>

            {/* Glowing Statistic Card (Principle 10) */}
            <div
              style={{
                width: 720,
                backgroundColor: '#111827',
                borderRadius: 24,
                padding: '40px 48px',
                color: '#ffffff',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                position: 'relative',
              }}
            >
              {/* Subtle Glowing Background Grid */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 24,
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 18, color: '#9ca3af', fontWeight: 600 }}>Daily Input Volume</span>
                <span style={{ fontSize: 14, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>
                  BANDWIDTH: CRITICAL
                </span>
              </div>

              {/* Massive Metric Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 96, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 1 }}>
                  {gigabytesCount}
                </span>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#f3f4f6' }}>GB / day</span>
              </div>

              {/* Center Silhouette Brain Schematics (Principle 7) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                <div style={{ fontSize: 32 }}>🧠</div>
                <div style={{ fontSize: 15, color: '#d1d5db', lineHeight: 1.4 }}>
                  Equal to <strong style={{ color: '#ffffff' }}>100,000 words</strong> of ambient cognitive friction every 24 hours.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCENE 4: PROGRESSION & FRICTION (Frames 420–570 | Principles 5, 8) */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 4 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 80px',
              opacity: interpolate(frame, [550, 570], [1, 0], { extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ marginBottom: 30, transform: `translateY(${interpolate(s4Spring, [0, 1], [30, 0])}px)`, opacity: s4Spring }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: '#ef4444', textTransform: 'uppercase' }}>
                The Breakdown Cycle
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#111827', margin: '6px 0 0' }}>
                When You Force Focus:
              </h2>
            </div>

            {/* Asymmetric Side Progression Timeline (Principle 5 & 8) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { step: '01', title: 'Forced Willpower', desc: 'Prefrontal cortex recruits emergency adrenaline', color: '#6b7280' },
                { step: '02', title: 'Dopamine Crash', desc: 'Receptor depletion triggers chronic restlessness', color: '#f59e0b' },
                { step: '03', title: 'Cognitive Friction', desc: 'Attention fractures into involuntary doomscrolling', color: '#ef4444' },
              ].map((item, idx) => {
                const itemSpring = spring({
                  frame: Math.max(0, frame - 420 - idx * 15),
                  fps,
                  config: { damping: 12, stiffness: 120 },
                });

                return (
                  <div
                    key={item.step}
                    style={{
                      backgroundColor: '#ffffff',
                      borderLeft: `6px solid ${item.color}`,
                      borderRadius: 14,
                      padding: '20px 26px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [40, 0])}px)`,
                      opacity: itemSpring,
                    }}
                  >
                    <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: item.color }}>
                      {item.step}
                    </span>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCENE 5: TEXT-CENTRIC MINIMALIST QUOTE (Frames 570–720 | Principle 6) */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 5 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 80px',
              opacity: interpolate(frame, [700, 720], [1, 0], { extrapolateRight: 'clamp' }),
            }}
          >
            <div
              style={{
                maxWidth: 820,
                textAlign: 'center',
                position: 'relative',
                transform: `scale(${interpolate(s5Spring, [0, 1], [0.92, 1])})`,
                opacity: s5Spring,
              }}
            >
              {/* Oversized Quotation Mark Background Watermark (Principle 6) */}
              <div
                style={{
                  position: 'absolute',
                  top: -100,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 240,
                  fontFamily: 'Playfair Display, Georgia, serif',
                  color: 'rgba(37, 99, 235, 0.08)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                “
              </div>

              <p style={{ fontSize: 34, fontWeight: 500, color: '#4b5563', lineHeight: 1.4, margin: 0 }}>
                The masters don’t push through distraction.
              </p>

              <h2
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: '#111827',
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontStyle: 'italic',
                  lineHeight: 1.15,
                  marginTop: 20,
                }}
              >
                They eliminate the choice.
              </h2>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCENE 6: FINAL CLIMAX & SAFE-ZONE LOCKUP (Frames 720–900)     */}
        {/* ------------------------------------------------------------- */}
        {sceneIndex === 6 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 80px',
              transform: `translateY(${interpolate(s6Spring, [0, 1], [40, 0])}px)`,
              opacity: s6Spring,
            }}
          >
            <div style={{ maxWidth: 840 }}>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.14em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 16 }}>
                THE CORE PRINCIPLE
              </div>

              <h1
                style={{
                  fontSize: 76,
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: 1.08,
                  letterSpacing: '-0.04em',
                  margin: 0,
                }}
              >
                Ruthless{' '}
                <span
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontStyle: 'italic',
                    color: '#2563eb',
                  }}
                >
                  subtraction
                </span>
                <br />
                is the only real superpower.
              </h1>

              {/* Editorial Author Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: 16 }}>
                  R
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>REA ESSAYS</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Curated for High-Agency Minds</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MANDATORY PLATFORM SAFE-ZONES (TikTok/Reels 280px Clearance)  */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            bottom: 80, // Safely within the 280px bottom clearing buffer
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#9ca3af',
            letterSpacing: '0.1em',
            zIndex: 40,
          }}
        >
          REA V4.0 CINEMATIC ENGINE · SAFE ZONES PRESERVED
        </div>
      </AbsoluteFill>
    </UniversalResponsiveContainer>
  );
};
