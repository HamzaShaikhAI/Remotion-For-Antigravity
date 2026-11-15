import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { MotionLabCard } from './types.ts';
import { MotionLabMascot } from './MotionLabMascot.tsx';

export interface MotionLabBrowserCardProps {
  card: MotionLabCard;
  frame: number;
  carouselProgress?: number; // -1 (exiting left), 0 (center), 1 (previewing right)
  style?: React.CSSProperties;
}

export const MotionLabBrowserCard: React.FC<MotionLabBrowserCardProps> = ({
  card,
  frame,
  carouselProgress = 0,
  style = {},
}) => {
  const { fps } = useVideoConfig();

  // 3D Carousel Transform & Perspective
  const translateX = carouselProgress * 1150;
  const translateZ = Math.abs(carouselProgress) * -280;
  const rotateY = carouselProgress * -14;
  const cardScale = interpolate(Math.abs(carouselProgress), [0, 1], [1.0, 0.88], {
    extrapolateRight: 'clamp',
  });
  const cardOpacity = interpolate(Math.abs(carouselProgress), [0, 1.2], [1.0, 0.35], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 250,
        left: '50%',
        width: 1100,
        height: 1160,
        marginLeft: -550,
        transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${cardScale})`,
        transformStyle: 'preserve-3d',
        opacity: cardOpacity,
        borderRadius: 44,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 100%)',
        border: '2px solid rgba(255, 255, 255, 0.65)',
        boxShadow: `
          0 36px 80px rgba(80, 50, 110, 0.25),
          0 12px 32px rgba(80, 50, 110, 0.15),
          inset 0 2px 4px rgba(255, 255, 255, 0.8),
          inset 0 -2px 6px rgba(180, 160, 210, 0.3)
        `,
        backdropFilter: 'blur(30px)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Chrome Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          paddingLeft: 6,
        }}
      >
        {/* Traffic Lights */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ff5f56', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ffbd2e', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#27c93f', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </div>

        {/* Frosted Glass Address Bar */}
        <div
          style={{
            flex: 1,
            marginLeft: 20,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.38)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            fontFamily: "'SF Mono', Menlo, Consolas, monospace",
            fontSize: 22,
            color: '#2a2a38',
            letterSpacing: 0.5,
          }}
        >
          {/* Padlock Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#525266">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span>github.com/{card.repo}</span>
        </div>
      </div>

      {/* Main Dark Content Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          borderRadius: 32,
          backgroundColor: '#0c0f18',
          background: 'linear-gradient(180deg, #101422 0%, #070910 100%)',
          overflow: 'hidden',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 44,
          boxSizing: 'border-box',
        }}
      >
        {/* Top Viewport Header / Badges */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Tag Pill (e.g. REC, ease, PBR) */}
          {card.tag && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: card.tag === 'REC' ? '#ef4444' : '#22d3ee',
                fontSize: 18,
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: card.tag === 'REC' ? '#ef4444' : '#22d3ee',
                  boxShadow: `0 0 8px ${card.tag === 'REC' ? '#ef4444' : '#22d3ee'}`,
                }}
              />
              <span>{card.tag}</span>
            </div>
          )}

          {/* Timecode for Video category */}
          {card.category === 'video' && (
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: 20,
                color: 'rgba(255, 255, 255, 0.45)',
                letterSpacing: 2,
              }}
            >
              00:00:00:18
            </div>
          )}
        </div>

        {/* Viewport Visual Stage Based on VisualType */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Visual: code-editor (01 HyperFrames) */}
          {card.visualType === 'code-editor' && (
            <>
              {/* Spotlight Cone */}
              <div
                style={{
                  position: 'absolute',
                  top: -80,
                  left: '48%',
                  transform: 'translateX(-50%)',
                  width: 520,
                  height: 600,
                  background: 'radial-gradient(ellipse at top, rgba(255, 240, 200, 0.22) 0%, rgba(255, 240, 200, 0) 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Floating Mini IDE Code Editor */}
              <div
                style={{
                  position: 'absolute',
                  left: 60,
                  top: 150,
                  width: 320,
                  padding: '16px 20px',
                  borderRadius: 18,
                  backgroundColor: 'rgba(18, 22, 34, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(16px)',
                  fontFamily: "'SF Mono', Menlo, Consolas, monospace",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
                  <span style={{ marginLeft: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>index.html</span>
                </div>
                <div style={{ color: '#ec4899' }}>&lt;<span style={{ color: '#60a5fa' }}>div</span> <span style={{ color: '#facc15' }}>class</span>=<span style={{ color: '#a3e635' }}>"clawd"</span>&gt;</div>
                <div style={{ paddingLeft: 16, color: '#f97316' }}>animate: <span style={{ color: '#ffffff' }}>jump</span></div>
                <div style={{ color: '#ec4899' }}>&lt;/<span style={{ color: '#60a5fa' }}>div</span>&gt;</div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: '#22c55e', display: 'flex', justifyContent: 'space-between' }}>
                  <span>▶ render clawd.mp4</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>19%</span>
                </div>
              </div>

              {/* Central Mascot */}
              <MotionLabMascot frame={frame} expression="star" action="idle" scale={1.3} style={{ marginTop: 20 }} />

              {/* Camera Viewfinder Overlay Brackets */}
              <div
                style={{
                  position: 'absolute',
                  width: 440,
                  height: 340,
                  border: '2px solid transparent',
                  pointerEvents: 'none',
                }}
              >
                {/* Top Left Bracket */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 36, height: 36, borderTop: '4px solid rgba(255,255,255,0.6)', borderLeft: '4px solid rgba(255,255,255,0.6)' }} />
                {/* Top Right Bracket */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 36, height: 36, borderTop: '4px solid rgba(255,255,255,0.6)', borderRight: '4px solid rgba(255,255,255,0.6)' }} />
                {/* Bottom Left Bracket */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 36, height: 36, borderBottom: '4px solid rgba(255,255,255,0.6)', borderLeft: '4px solid rgba(255,255,255,0.6)' }} />
                {/* Bottom Right Bracket */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderBottom: '4px solid rgba(255,255,255,0.6)', borderRight: '4px solid rgba(255,255,255,0.6)' }} />
              </div>
            </>
          )}

          {/* Visual: film-strip (02 Remotion) */}
          {card.visualType === 'film-strip' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {/* Film Strip Border Container */}
              <div
                style={{
                  width: '92%',
                  height: 200,
                  backgroundColor: '#f5f0e8',
                  borderRadius: 16,
                  border: '6px solid #2a2520',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '12px 16px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Perforation holes on top & bottom */}
                <div style={{ position: 'absolute', top: 6, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 12px' }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ width: 14, height: 10, borderRadius: 2, backgroundColor: '#2a2520' }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 12px' }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ width: 14, height: 10, borderRadius: 2, backgroundColor: '#2a2520' }} />
                  ))}
                </div>

                {/* 4 sequential animation frames */}
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '22%',
                      height: 120,
                      backgroundColor: '#eedbc5',
                      borderRadius: 8,
                      border: '2px solid #5a483a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <MotionLabMascot frame={frame + idx * 8} scale={0.48} expression="happy" />
                  </div>
                ))}
              </div>

              {/* Large film reel wheel on the left */}
              <div
                style={{
                  position: 'absolute',
                  left: 40,
                  bottom: 140,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '10px solid #4a4a58',
                  backgroundColor: '#22222a',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${frame * 1.2}deg)`,
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#0c0f18',
                      transform: `rotate(${i * 72}deg) translateY(-40px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Visual: bezier-curve (05 GSAP Skills) */}
          {card.visualType === 'bezier-curve' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Green Radar Coordinate Grid */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.28 }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22c55e" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Code Banner */}
              <div
                style={{
                  position: 'absolute',
                  top: 70,
                  left: 60,
                  padding: '12px 22px',
                  borderRadius: 16,
                  backgroundColor: 'rgba(12, 36, 20, 0.85)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  fontFamily: "'SF Mono', monospace",
                  fontSize: 18,
                  color: '#86efac',
                  lineHeight: 1.6,
                }}
              >
                <div>ease: <span style={{ color: '#fef08a' }}>"power2.inOut"</span></div>
                <div>duration: <span style={{ color: '#ffffff' }}>1</span></div>
              </div>

              {/* Glowing Bezier Trajectory Line */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path
                  d="M 120 420 C 350 420, 480 200, 720 200"
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 12px #a3e635)"
                />
              </svg>

              {/* Ghosted Motion Trail of Mascot */}
              <div style={{ position: 'absolute', left: 140, top: 290, opacity: 0.2 }}>
                <MotionLabMascot frame={frame} scale={0.75} expression="happy" />
              </div>
              <div style={{ position: 'absolute', left: 280, top: 250, opacity: 0.35 }}>
                <MotionLabMascot frame={frame} scale={0.85} expression="happy" />
              </div>
              <div style={{ position: 'absolute', left: 450, top: 160, opacity: 0.55 }}>
                <MotionLabMascot frame={frame} scale={0.95} expression="happy" />
              </div>
              <div style={{ position: 'absolute', left: 620, top: 80, zIndex: 10 }}>
                <MotionLabMascot frame={frame} scale={1.15} action="jump" expression="happy" />
              </div>
            </div>
          )}

          {/* Visual: turntable (07 video-shotcraft) */}
          {card.visualType === 'turntable' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Glowing Turntable Pedestal */}
              <div
                style={{
                  position: 'relative',
                  width: 360,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, #302618 0%, #161208 100%)',
                  border: '3px solid #f59e0b',
                  boxShadow: '0 0 32px rgba(245, 158, 11, 0.4), inset 0 2px 8px rgba(255, 220, 150, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Rotating Turntable Ring */}
                <div
                  style={{
                    position: 'absolute',
                    width: 320,
                    height: 80,
                    borderRadius: '50%',
                    border: '2px dashed rgba(245, 158, 11, 0.65)',
                    transform: `rotate(${frame * 2}deg)`,
                  }}
                />

                {/* Mascot standing on pedestal winking */}
                <div style={{ position: 'absolute', bottom: 35 }}>
                  <MotionLabMascot frame={frame} expression="wink" action="turntable" scale={1.25} />
                </div>
              </div>
            </div>
          )}

          {/* Visual: threejs-grid (09 Three.js) */}
          {card.visualType === 'threejs-grid' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Shading mode pills */}
              <div style={{ position: 'absolute', top: 70, left: 60, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '6px 14px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>• wireframe</div>
                <div style={{ padding: '6px 14px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>• flatShading</div>
                <div style={{ padding: '6px 14px', borderRadius: 12, backgroundColor: 'rgba(6, 182, 212, 0.25)', border: '1px solid #06b6d4', color: '#22d3ee', fontWeight: 700, fontSize: 14 }}>● PBR</div>
              </div>

              {/* 3D Perspective Grid */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 60,
                  width: '90%',
                  height: 220,
                  transform: 'perspective(400px) rotateX(60deg)',
                  background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0) 70%)',
                  borderTop: '2px solid rgba(6, 182, 212, 0.4)',
                  backgroundImage: `
                    linear-gradient(rgba(6, 182, 212, 0.35) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6, 182, 212, 0.35) 1px, transparent 1px)
                  `,
                  backgroundSize: '36px 36px',
                }}
              />

              {/* 3D Glossy Mascot */}
              <MotionLabMascot frame={frame} expression="star" scale={1.3} style={{ zIndex: 10, marginTop: -30 }} />
            </div>
          )}

          {/* Visual: comfyui-graph (13 ComfyUI) */}
          {card.visualType === 'comfyui-graph' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', padding: '40px 20px', boxSizing: 'border-box' }}>
              {/* Node 1: Load Model */}
              <div
                style={{
                  position: 'absolute',
                  left: 40,
                  top: 80,
                  width: 170,
                  borderRadius: 12,
                  backgroundColor: '#1e1c2e',
                  border: '1px solid #7c3aed',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  fontSize: 13,
                  fontFamily: "'SF Pro Display', sans-serif",
                }}
              >
                <div style={{ backgroundColor: '#6d28d9', padding: '6px 10px', color: '#ffffff', fontWeight: 700 }}>• Load Model</div>
                <div style={{ padding: '8px 10px', color: '#c4b5fd', fontSize: 12 }}>paint_v2</div>
              </div>

              {/* Node 2: Prompt */}
              <div
                style={{
                  position: 'absolute',
                  left: 40,
                  top: 190,
                  width: 190,
                  borderRadius: 12,
                  backgroundColor: '#262014',
                  border: '1px solid #d97706',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  fontSize: 13,
                }}
              >
                <div style={{ backgroundColor: '#b45309', padding: '6px 10px', color: '#ffffff', fontWeight: 700 }}>• Prompt</div>
                <div style={{ padding: '8px 10px', color: '#fde68a', fontSize: 12 }}>happy orange crab, oil paint</div>
              </div>

              {/* Node 3: Sampler */}
              <div
                style={{
                  position: 'absolute',
                  left: 260,
                  top: 110,
                  width: 200,
                  borderRadius: 12,
                  backgroundColor: '#2a1a2e',
                  border: '1px solid #db2777',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  fontSize: 13,
                }}
              >
                <div style={{ backgroundColor: '#be185d', padding: '6px 10px', color: '#ffffff', fontWeight: 700 }}>• Sampler</div>
                <div style={{ padding: '8px 10px', color: '#fbcfe8', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>steps: 20</div>
                  <div>cfg: 7.0</div>
                </div>
              </div>

              {/* Node 4: Diffusion Latent Image Preview */}
              <div
                style={{
                  position: 'absolute',
                  right: 40,
                  top: 80,
                  width: 240,
                  height: 240,
                  borderRadius: 14,
                  backgroundColor: '#121422',
                  border: '1px solid #38bdf8',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ backgroundColor: '#0284c7', padding: '6px 10px', color: '#ffffff', fontWeight: 700, fontSize: 13 }}>• Preview Image</div>
                <div
                  style={{
                    flex: 1,
                    backgroundImage: `
                      radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.4) 0%, transparent 60%),
                      radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(250, 204, 21, 0.4) 0%, transparent 50%)
                    `,
                    backgroundSize: '16px 16px',
                    filter: 'contrast(1.6)',
                  }}
                />
              </div>

              {/* Glowing Bezier Wire Connections */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 210 115 C 235 115, 235 135, 260 135" fill="none" stroke="#a855f7" strokeWidth="4" />
                <path d="M 230 220 C 245 220, 245 155, 260 155" fill="none" stroke="#f59e0b" strokeWidth="4" />
                <path d="M 460 135 C 500 135, 500 120, 540 120" fill="none" stroke="#ec4899" strokeWidth="4" />
              </svg>
            </div>
          )}

          {/* Visual: ffmpeg-funnel (15 FFmpeg) */}
          {card.visualType === 'ffmpeg-funnel' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Funnel Geometry */}
              <svg width="240" height="180" viewBox="0 0 200 160">
                <polygon points="20,10 180,10 120,100 120,150 80,150 80,100" fill="url(#goldGrad)" stroke="#facc15" strokeWidth="3" />
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>

              {/* MP4 render bar */}
              <div
                style={{
                  marginTop: 20,
                  width: 320,
                  padding: '10px 18px',
                  borderRadius: 14,
                  backgroundColor: 'rgba(250, 204, 21, 0.15)',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: "'SF Mono', monospace",
                  fontSize: 16,
                  color: '#fef08a',
                }}
              >
                <span>▶ MP4</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>clawd.mp4</span>
              </div>
            </div>
          )}

          {/* Fallback default mascot */}
          {['spotlight', 'camera-grid', 'anime-stagger', 'design-taste', 'blender-stage', 'blender-mcp', 'anatomy-rig', 'whisper-wave', 'mediabunny-player'].includes(card.visualType) && (
            <MotionLabMascot frame={frame} expression="happy" scale={1.25} />
          )}
        </div>

        {/* Card Bottom Meta & Typography */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                fontSize: 48,
                fontWeight: 900,
                color: card.accentColor || '#f97316',
              }}
            >
              {card.id}
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                fontSize: 48,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}
            >
              {card.title}
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: 26,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              marginBottom: 10,
              lineHeight: 1.4,
            }}
          >
            {card.subtitle}
          </div>

          <div
            style={{
              fontFamily: "'SF Mono', Menlo, Consolas, monospace",
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.45)',
            }}
          >
            {card.repo}
          </div>
        </div>
      </div>

      {/* Bottom CTA Button: Install */}
      <div
        style={{
          marginTop: 20,
          width: '100%',
          height: 64,
          borderRadius: 32,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 243, 230, 0.65) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(240, 180, 140, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: '#1a1824',
          cursor: 'pointer',
        }}
      >
        <span>↓</span>
        <span>Install</span>
      </div>
    </div>
  );
};
