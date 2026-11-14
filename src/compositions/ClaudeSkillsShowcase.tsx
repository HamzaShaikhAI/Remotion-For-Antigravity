import React, { useMemo } from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =====================================================================
// DATA: 20 OPEN-SOURCE CLAUDE SKILLS ACROSS 5 CATEGORIES
// =====================================================================
export interface SkillItem {
  id: string;
  name: string;
  desc: string;
  stars: string;
  command: string;
  category: 'VIDEO' | 'DESIGN' | '3D' | 'MOTION' | 'GAMES';
  catIndex: number;
}

export const ALL_SKILLS: SkillItem[] = [
  // 01: VIDEO (0–4s)
  { id: 'hf', name: 'hyperframes', desc: 'write HTML → get broadcast video', stars: '3.4k', command: 'claude install hyperframes', category: 'VIDEO', catIndex: 1 },
  { id: 'om', name: 'open-montage', desc: 'multi-track programmatic timeline', stars: '2.1k', command: 'claude install open-montage', category: 'VIDEO', catIndex: 2 },
  { id: 'sc', name: 'video-shotcraft', desc: 'cinematic camera & shot director', stars: '1.9k', command: 'claude install shotcraft', category: 'VIDEO', catIndex: 3 },
  { id: 'rm', name: 'remotion-skills', desc: 'React code-based video factory', stars: '5.2k', command: 'claude install remotion', category: 'VIDEO', catIndex: 4 },

  // 02: DESIGN (4–8s)
  { id: 'as', name: 'anthropic-skills', desc: 'official design & prompt patterns', stars: '6.8k', command: 'claude install anthropic-skills', category: 'DESIGN', catIndex: 5 },
  { id: 'ip', name: 'impeccable', desc: 'pixel-perfect UI design systems', stars: '2.7k', command: 'claude install impeccable', category: 'DESIGN', catIndex: 6 },
  { id: 'od', name: 'open-design', desc: 'figma-to-code generative layout', stars: '3.1k', command: 'claude install open-design', category: 'DESIGN', catIndex: 7 },
  { id: 'hm', name: 'hallmark', desc: 'brand identity & typographic rhythm', stars: '1.8k', command: 'claude install hallmark', category: 'DESIGN', catIndex: 8 },

  // 03: 3D (8–12s)
  { id: 'bm', name: 'blender-mcp', desc: 'headless Blender modeling & render', stars: '4.2k', command: 'claude install blender-mcp', category: '3D', catIndex: 9 },
  { id: 'an', name: 'anatomy', desc: 'biological 3D models & skeletal rigs', stars: '1.6k', command: 'claude install anatomy', category: '3D', catIndex: 10 },
  { id: 'um', name: 'unity-mcp', desc: 'game engine bridge & scene control', stars: '2.9k', command: 'claude install unity-mcp', category: '3D', catIndex: 11 },
  { id: 'bs', name: 'blender-skills', desc: 'geometry nodes & procedural shaders', stars: '3.8k', command: 'claude install blender-skills', category: '3D', catIndex: 12 },

  // 04: MOTION (12–16s)
  { id: 'gs', name: 'gsap-skills', desc: 'fluid spring physics & easing curves', stars: '4.5k', command: 'claude install gsap-skills', category: 'MOTION', catIndex: 13 },
  { id: 'ae', name: 'anything2explainer', desc: 'prompt to 2D illustrated explainer', stars: '3.3k', command: 'claude install anything2explainer', category: 'MOTION', catIndex: 14 },
  { id: 'om2', name: 'oil-motion', desc: 'analog & digital brush stroke motion', stars: '1.4k', command: 'claude install oil-motion', category: 'MOTION', catIndex: 15 },
  { id: 'hk', name: 'herk-edit-kit', desc: 'viral pacing & retention cuts', stars: '2.2k', command: 'claude install herk-edit-kit', category: 'MOTION', catIndex: 16 },

  // 05: GAMES (16–18s)
  { id: 'um2', name: 'universal-modder', desc: 'cross-engine logic & runtime hooks', stars: '2.4k', command: 'claude install universal-modder', category: 'GAMES', catIndex: 17 },
  { id: 'gd', name: 'gamedev-skills', desc: 'shader lab & AI behavior trees', stars: '3.6k', command: 'claude install gamedev-skills', category: 'GAMES', catIndex: 18 },
  { id: 'px', name: 'pixelfx', desc: 'retro particle systems & 2D sprites', stars: '1.7k', command: 'claude install pixelfx', category: 'GAMES', catIndex: 19 },
  { id: 'sg', name: 'sprite-gen', desc: 'generative 8-way sprite sheets', stars: '2.8k', command: 'claude install sprite-gen', category: 'GAMES', catIndex: 20 },
];

const CATEGORY_META = {
  VIDEO: { label: 'VIDEO', num: '01/05', color: '#f97316', bgTint: 'rgba(249, 115, 22, 0.08)' },
  DESIGN: { label: 'DESIGN', num: '02/05', color: '#ec4899', bgTint: 'rgba(236, 72, 153, 0.08)' },
  '3D': { label: '3D', num: '03/05', color: '#10b981', bgTint: 'rgba(16, 185, 129, 0.08)' },
  MOTION: { label: 'MOTION', num: '04/05', color: '#8b5cf6', bgTint: 'rgba(139, 92, 246, 0.08)' },
  GAMES: { label: 'GAMES', num: '05/05', color: '#0ea5e9', bgTint: 'rgba(14, 165, 233, 0.08)' },
};

// =====================================================================
// CUTE 3D PEACH BLOB CHARACTER COMPONENT
// =====================================================================
const CutePeachBlob: React.FC<{
  frame: number;
  scale?: number;
  accessory?: 'clapper' | 'palette' | 'cube' | 'sparkle' | 'headphones' | 'cheer';
}> = ({ frame, scale = 1, accessory = 'clapper' }) => {
  // Gentle breathing / floating bounce
  const breathe = Math.sin(frame * 0.08) * 8;
  const squish = 1 + Math.sin(frame * 0.12) * 0.03;
  const blink = (frame % 120 > 112) ? 0.1 : 1;

  return (
    <div
      style={{
        position: 'relative',
        width: 160 * scale,
        height: 160 * scale,
        transform: `translateY(${breathe}px) scaleX(${1 / squish}) scaleY(${squish})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        filter: 'drop-shadow(0 18px 25px rgba(251, 146, 60, 0.28))',
      }}
    >
      {/* 3D Sphere Body with soft radial lighting */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50% 50% 46% 46%',
          background: 'radial-gradient(circle at 35% 30%, #ffedd5 0%, #fed7aa 40%, #fb923c 100%)',
          boxShadow: 'inset 0 -8px 16px rgba(194, 65, 12, 0.25), inset 0 8px 14px rgba(255, 255, 255, 0.7)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft Cheeks */}
        <div
          style={{
            position: 'absolute',
            top: '56%',
            left: '18%',
            width: '18%',
            height: '10%',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.35)',
            filter: 'blur(3px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '56%',
            right: '18%',
            width: '18%',
            height: '10%',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.35)',
            filter: 'blur(3px)',
          }}
        />

        {/* Eyes (glossy black beads) */}
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '32%',
            width: 14 * scale,
            height: 16 * scale * blink,
            borderRadius: '50%',
            backgroundColor: '#1c1917',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '25%',
              width: 5 * scale,
              height: 5 * scale,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '42%',
            right: '32%',
            width: 14 * scale,
            height: 16 * scale * blink,
            borderRadius: '50%',
            backgroundColor: '#1c1917',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '25%',
              width: 5 * scale,
              height: 5 * scale,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Tiny Happy Smile */}
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 16 * scale,
            height: 8 * scale,
            borderBottom: `${3 * scale}px solid #1c1917`,
            borderRadius: '0 0 16px 16px',
          }}
        />
      </div>

      {/* Floating Category Accessories */}
      {accessory === 'clapper' && (
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            right: -12,
            background: '#1e293b',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 800,
            transform: `rotate(${Math.sin(frame * 0.1) * 8}deg)`,
            border: '2px solid #ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          🎬 60FPS
        </div>
      )}

      {accessory === 'palette' && (
        <div
          style={{
            position: 'absolute',
            bottom: -8,
            right: -10,
            background: '#ffffff',
            padding: '5px 8px',
            borderRadius: 12,
            display: 'flex',
            gap: 4,
            border: '2px solid #ec4899',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ec4899' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
        </div>
      )}

      {accessory === 'cube' && (
        <div
          style={{
            position: 'absolute',
            top: -15,
            right: -10,
            width: 28,
            height: 28,
            border: '2.5px solid #10b981',
            borderRadius: 6,
            transform: `rotateX(45deg) rotateY(${frame * 2}deg)`,
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
          }}
        />
      )}

      {accessory === 'sparkle' && (
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: -10,
            fontSize: 22,
            transform: `scale(${1 + Math.sin(frame * 0.2) * 0.2})`,
          }}
        >
          ✨
        </div>
      )}

      {accessory === 'headphones' && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80 * scale,
            height: 40 * scale,
            borderTop: `${5 * scale}px solid #0284c7`,
            borderRadius: '40px 40px 0 0',
          }}
        />
      )}
    </div>
  );
};

// =====================================================================
// FLOATING BROWSER-STYLE SKILL CARD
// =====================================================================
const BrowserSkillCard: React.FC<{
  skill: SkillItem;
  themeColor: string;
  isActive: boolean;
  entranceProgress: number;
}> = ({ skill, themeColor, entranceProgress }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: '24px 28px',
        boxShadow:
          '0 20px 40px rgba(30, 41, 59, 0.08), 0 1px 3px rgba(30, 41, 59, 0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        transform: `translateY(${interpolate(entranceProgress, [0, 1], [40, 0])}px) scale(${interpolate(entranceProgress, [0, 1], [0.94, 1])})`,
        opacity: entranceProgress,
      }}
    >
      {/* Top Browser Bar Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
          <span
            style={{
              marginLeft: 8,
              fontSize: 13,
              fontFamily: 'monospace',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            claude-skills / {skill.name}
          </span>
        </div>

        {/* GitHub Stars Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 700,
            color: '#334155',
          }}
        >
          <span>⭐</span>
          <span>{skill.stars}</span>
        </div>
      </div>

      {/* Card Content Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {skill.name}
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: themeColor,
                backgroundColor: `${themeColor}18`,
                padding: '2px 8px',
                borderRadius: 8,
                letterSpacing: '0.05em',
              }}
            >
              {skill.category}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: '#475569',
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: 580,
            }}
          >
            {skill.desc}
          </p>
        </div>
      </div>

      {/* Terminal Command Strip */}
      <div
        style={{
          marginTop: 16,
          backgroundColor: '#0f172a',
          borderRadius: 14,
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: themeColor }}>$</span>
          <span>{skill.command}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#4ade80',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>✓</span>
          <span>installed</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// MASTER COMPOSITION: CLAUDE SKILLS SHOWCASE (9:16 VERTICAL, 20s @ 60fps)
// =====================================================================
export const ClaudeSkillsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total Duration: 20 seconds = 1200 frames @ 60fps
  // Phase 1: 0–4s (0–240)    → VIDEO (01/05)
  // Phase 2: 4–8s (240–480)  → DESIGN (02/05)
  // Phase 3: 8–12s (480–720) → 3D (03/05)
  // Phase 4: 12–16s (720–960)→ MOTION (04/05)
  // Phase 5: 16–18s (960–1080)→ GAMES (05/05)
  // Phase 6: 18–20s (1080–1200)→ FINAL FULL 4x5 GRID

  // Active Category Logic
  const categoryKey: 'VIDEO' | 'DESIGN' | '3D' | 'MOTION' | 'GAMES' | 'GRID' = useMemo(() => {
    if (frame < 240) return 'VIDEO';
    if (frame < 480) return 'DESIGN';
    if (frame < 720) return '3D';
    if (frame < 960) return 'MOTION';
    if (frame < 1080) return 'GAMES';
    return 'GRID';
  }, [frame]);

  // Current counter (01/20 to 20/20)
  const currentCount = useMemo(() => {
    if (frame >= 1080) return 20;
    const progress = Math.min(1, Math.max(0, frame / 1080));
    return Math.max(1, Math.floor(progress * 20));
  }, [frame]);

  // Dynamic Accent Color
  const activeColor = useMemo(() => {
    if (frame < 240) return '#f97316'; // Orange
    if (frame < 480) return '#ec4899'; // Pink
    if (frame < 720) return '#10b981'; // Green
    if (frame < 960) return '#8b5cf6'; // Purple
    if (frame < 1080) return '#0ea5e9'; // Blue
    return '#6366f1'; // Indigo final
  }, [frame]);

  // Skills for current category (4 per page)
  const categorySkills = useMemo(() => {
    if (categoryKey === 'GRID') return ALL_SKILLS;
    return ALL_SKILLS.filter((s) => s.category === categoryKey);
  }, [categoryKey]);

  // Floating background ambient particles
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      const seedX = (i * 137.5) % 1080;
      const seedY = (i * 219.3) % 1920;
      const size = 6 + (i % 5) * 4;
      arr.push({ id: i, x: seedX, y: seedY, size });
    }
    return arr;
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#faf7f2', // Soft warm cream/beige
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND AMBIENT GRADIENTS & VOLUMETRIC GLOW                 */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -150,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: -200,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${activeColor}22 0%, transparent 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Floating Ambient Particles */}
      {particles.map((p) => {
        const py = (p.y - frame * 0.7) % 1920;
        const actualY = py < 0 ? py + 1920 : py;
        const px = p.x + Math.sin((frame + p.id * 20) * 0.04) * 20;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: px,
              top: actualY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: 'rgba(251, 146, 60, 0.25)',
              filter: 'blur(1px)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ------------------------------------------------------------- */}
      {/* PERSISTENT TOP APP BAR & LIVE COUNTER                          */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '10px 22px',
            borderRadius: 30,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: activeColor,
              boxShadow: `0 0 10px ${activeColor}`,
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
            claude studio
          </span>
          <span style={{ color: '#94a3b8', fontSize: 18 }}>·</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>skills</span>
        </div>

        {/* Live Install Counter Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#0f172a',
            padding: '10px 20px',
            borderRadius: 30,
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
          }}
        >
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>INSTALLED</span>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8' }}>
            {currentCount.toString().padStart(2, '0')}/20
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN DYNAMIC CONTENT STAGE (PHASES 1–5 vs FINAL GRID)         */}
      {/* ------------------------------------------------------------- */}
      {categoryKey !== 'GRID' ? (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 50,
            right: 50,
            bottom: 120,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Category Header Row + Cute Character Interaction */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              padding: '0 10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    color: activeColor,
                    backgroundColor: `${activeColor}20`,
                    padding: '4px 14px',
                    borderRadius: 20,
                  }}
                >
                  CATEGORY {CATEGORY_META[categoryKey].num}
                </span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 48,
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.04em',
                }}
              >
                {CATEGORY_META[categoryKey].label}
              </h1>
            </div>

            {/* Cute Peach 3D Blob Character In-Scene */}
            <CutePeachBlob
              frame={frame}
              scale={0.95}
              accessory={
                categoryKey === 'VIDEO'
                  ? 'clapper'
                  : categoryKey === 'DESIGN'
                  ? 'palette'
                  : categoryKey === '3D'
                  ? 'cube'
                  : categoryKey === 'MOTION'
                  ? 'sparkle'
                  : 'headphones'
              }
            />
          </div>

          {/* 4 Stacked Floating Browser Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, margin: '15px 0' }}>
            {categorySkills.map((skill, index) => {
              // Staggered spring entrance per card
              const cardOffset = (frame % 240) - index * 12;
              const cardSpring = spring({
                frame: cardOffset,
                fps,
                config: { damping: 12, stiffness: 180 },
              });

              return (
                <BrowserSkillCard
                  key={skill.id}
                  skill={skill}
                  themeColor={activeColor}
                  isActive={true}
                  entranceProgress={Math.max(0, Math.min(1, cardSpring))}
                />
              );
            })}
          </div>

          {/* Subtitle Hint */}
          <div
            style={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 600,
              color: '#64748b',
              letterSpacing: '0.02em',
            }}
          >
            Open-source AI extensions ready for production
          </div>
        </div>
      ) : (
        /* ----------------------------------------------------------- */
        /* PHASE 6: FINAL 4×5 FULL GRID (18–20s / Frames 1080–1200)    */
        /* ----------------------------------------------------------- */
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 45,
            right: 45,
            bottom: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Big Title Hero */}
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 54,
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
              }}
            >
              20 skills.
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                One AI studio.
              </span>
            </h1>
          </div>

          {/* 4×5 Mini Grid Cards */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: 12,
              padding: '10px 0',
            }}
          >
            {ALL_SKILLS.map((skill, i) => {
              const localF = frame - 1080 - i * 3;
              const gridPop = spring({ frame: localF, fps, config: { damping: 10, stiffness: 220 } });
              const meta = CATEGORY_META[skill.category];

              return (
                <div
                  key={skill.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 14,
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    transform: `scale(${Math.max(0, Math.min(1, gridPop))})`,
                    opacity: gridPop,
                    height: 140,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: meta.color,
                      }}
                    />
                    <span style={{ fontSize: 9, fontWeight: 800, color: meta.color }}>
                      {skill.category}
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        marginBottom: 4,
                      }}
                    >
                      {skill.name}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: '#64748b',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {skill.desc}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#10b981',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 4,
                    }}
                  >
                    <span>⭐ {skill.stars}</span>
                    <span>✓ Ready</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Call-To-Action Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '16px 36px',
              borderRadius: 40,
              boxShadow: '0 15px 35px rgba(15, 23, 42, 0.25)',
              transform: `scale(${interpolate(frame - 1140, [0, 20], [0.85, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })})`,
            }}
          >
            <CutePeachBlob frame={frame} scale={0.45} accessory="cheer" />
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.02em' }}>
              bookmark this · install them tonight
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PERSISTENT BOTTOM COLORED ACCENT PROGRESS LINE                 */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: '#e2e8f0',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / 1200) * 100}%`,
            backgroundColor: activeColor,
            transition: 'background-color 0.4s ease',
            boxShadow: `0 0 12px ${activeColor}`,
          }}
        />
      </div>
    </div>
  );
};
