import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { renderBrandIcon } from '../assets/brand';
import { KeyframeLockedSFX } from '../engines/audio/KeyframeLockedSFX';

export const ClaudeMotionSkillsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline orchestration across 5 Acts (1,200 frames total @ 60 FPS = 20.0 seconds)
  // Act 1: 0 - 240 (0.0s - 4.0s) -> Coverflow Hero: /motion-design-skill (Category: Everything)
  // Act 2: 240 - 480 (4.0s - 8.0s) -> Coverflow Transition: /anatomy-reveal (Category: Skills)
  // Act 3: 480 - 720 (8.0s - 12.0s) -> Modal Inspector Drilldown: Exploded View + Sliders + Terminal
  // Act 4: 720 - 960 (12.0s - 16.0s) -> Coverflow Glow: three.quarks & react-postprocessing (Category: FX)
  // Act 5: 960 - 1200 (16.0s - 20.0s) -> Climax 5x4 Grid Outro + "All 20 links are in the post" CTA

  let activeAct = 1;
  let activeCategory = 'Everything';
  let eyebrowText = '20 REPOS. ONE MOTION STUDIO.';
  let counterText = '01 / 20';

  if (frame >= 960) {
    activeAct = 5;
    activeCategory = 'Export';
    eyebrowText = '20 REPOS. ONE MOTION STUDIO.';
    counterText = '20 / 20';
  } else if (frame >= 720) {
    activeAct = 4;
    activeCategory = 'FX';
    eyebrowText = 'FX - NOW MAKE IT GLOW.';
    counterText = '11 / 20';
  } else if (frame >= 480) {
    activeAct = 3;
    activeCategory = 'Skills';
    eyebrowText = 'SKILLS - TEACH IT SOME TASTE.';
    counterText = '06 / 20';
  } else if (frame >= 240) {
    activeAct = 2;
    activeCategory = 'Skills';
    eyebrowText = 'SKILLS - TEACH IT SOME TASTE.';
    counterText = '06 / 20';
  }

  // Smooth coverflow horizontal carousel offset
  const carouselSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.8 },
  });

  // Category dock tabs
  const categories = ['Everything', 'Skills', '3D', 'FX', 'Motion', 'Sound', 'Export'];
  const activeCatIndex = categories.indexOf(activeCategory);

  // Animated cursor positioning
  const cursorProgress = spring({
    frame: frame % 240,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  // Repositories roster (20 items for the 5x4 climax grid)
  const allRepos = [
    { id: '/motion-design-skill', name: '/motion-design-skill', cat: 'Skills', icon: 'bezier', bg: '#F5EBE1' },
    { id: 'ai-kit', name: 'ai-kit', cat: 'Skills', icon: 'spring', bg: '#1C1917' },
    { id: 'remotion-skills', name: 'Remotion Skills', cat: 'Skills', icon: 'terminal', bg: '#0F172A' },
    { id: '/hairline', name: '/hairline', cat: 'Skills', icon: 'grid', bg: '#F8FAFC' },
    { id: '/anatomy', name: '/anatomy', cat: 'Skills', icon: 'iso-box', bg: '#E2E8F0' },
    { id: '/anatomy-reveal', name: '/anatomy-reveal', cat: '3D', icon: 'exploded', bg: '#F3E8DC' },
    { id: 'blender-agents', name: '/blender-agents', cat: '3D', icon: 'cube', bg: '#FAF5EE' },
    { id: 'threejs', name: 'Three.js', cat: '3D', icon: 'poly', bg: '#0A0A0C' },
    { id: 'rapier', name: 'react-three-rapier', cat: '3D', icon: 'physics', bg: '#E0E7FF' },
    { id: 'react-postprocessing', name: 'react-postprocessing', cat: 'FX', icon: 'neon-ring', bg: '#090A0F' },
    { id: 'three.quarks', name: 'three.quarks', cat: 'FX', icon: 'particles', bg: '#11131F' },
    { id: 'tweakpane', name: 'Tweakpane', cat: 'FX', icon: 'sliders', bg: '#F1F5F9' },
    { id: 'gsap', name: 'GSAP', cat: 'Motion', icon: 'ease', bg: '#DCFCE7' },
    { id: 'remotion', name: 'Remotion', cat: 'Motion', icon: 'video', bg: '#0284C7' },
    { id: 'manim', name: 'Manim', cat: 'Motion', icon: 'math', bg: '#18181B' },
    { id: 'lottie', name: 'Lottie', cat: 'Motion', icon: 'vector', bg: '#FEE2E2' },
    { id: 'openverse', name: 'Openverse API', cat: 'Sound', icon: 'wave', bg: '#FEF3C7' },
    { id: 'librosa', name: 'librosa', cat: 'Sound', icon: 'transients', bg: '#1E293B' },
    { id: 'whisperx', name: 'WhisperX', cat: 'Sound', icon: 'transcript', bg: '#F8FAFC' },
    { id: 'ffmpeg', name: 'FFmpeg', cat: 'Export', icon: 'render', bg: '#18181B' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F7F4EE',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* SFX Triggers on Scene / Tab Transitions */}
      <KeyframeLockedSFX triggerFrame={0} sfxFile="sfx/ui-click.wav" volume={0.6} />
      <KeyframeLockedSFX triggerFrame={240} sfxFile="sfx/ui-click.wav" volume={0.6} />
      <KeyframeLockedSFX triggerFrame={480} sfxFile="sfx/ui-click.wav" volume={0.7} />
      <KeyframeLockedSFX triggerFrame={720} sfxFile="sfx/ui-click.wav" volume={0.6} />
      <KeyframeLockedSFX triggerFrame={960} sfxFile="sfx/fpv_impact.wav" volume={0.8} />

      {/* Ambient Chromatic Mesh Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 130, 0.28) 0%, rgba(245, 158, 130, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(186, 215, 233, 0.24) 0%, rgba(186, 215, 233, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 207, 235, 0.26) 0%, rgba(216, 207, 235, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-8%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(209, 231, 214, 0.22) 0%, rgba(209, 231, 214, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Analog Fine Texture Overlay */}
      <AbsoluteFill
        style={{
          opacity: 0.035,
          mixBlendMode: 'multiply',
          backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      {/* TOP HEADER NAVIGATION BAR */}
      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '44px',
          right: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        {/* Left Monospace Tracker */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 800,
            color: '#94A3B8',
            letterSpacing: '0.12em',
          }}
        >
          MOTION SKILLS / 001-020
        </span>

        {/* Center Floating Search Bar Input */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
            borderRadius: '9999px',
            padding: '6px 16px 6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '460px',
          }}
        >
          <span
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '9999px',
              fontFamily: 'monospace',
            }}
          >
            The stack 20
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#94A3B8',
              flex: 1,
            }}
          >
            Find your next motion skill...
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748B',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '3px 8px',
              borderRadius: '6px',
              fontFamily: 'monospace',
            }}
          >
            ⌘ K
          </span>
        </div>

        {/* Right Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 800,
              color: '#D97757',
              letterSpacing: '0.08em',
            }}
          >
            BUILT WITH
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {renderBrandIcon('claudeStar', 20)}
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              Claude
            </span>
          </div>
          <span
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '9999px',
              fontFamily: 'monospace',
            }}
          >
            FABLE 5.2
          </span>
        </div>
      </div>

      {/* EDITORIAL HERO HEADLINE */}
      {activeAct !== 3 && activeAct !== 5 && (
        <div
          style={{
            position: 'absolute',
            top: '120px',
            left: '48px',
            zIndex: 80,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 800,
              color: '#D97757',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            {eyebrowText}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ transform: 'translateY(-2px)' }}>
              {renderBrandIcon('claudeStar', 48)}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: '60px',
                  fontWeight: 900,
                  color: '#1E293B',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                Fable 5.2
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontStyle: 'italic',
                  fontSize: '56px',
                  fontWeight: 500,
                  color: '#64748B',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                motion design skills
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACT 1, 2, 4: FLOATING 3D PERSPECTIVE CARD CAROUSEL */}
      {activeAct !== 3 && activeAct !== 5 && (
        <div
          style={{
            position: 'absolute',
            top: '280px',
            left: '0',
            right: '0',
            height: '800px',
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
          }}
        >
          {/* Card 1: /motion-design-skill (Bezier Demo) */}
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '480px',
              background: '#FFFFFF',
              borderRadius: '28px',
              boxShadow:
                activeAct === 1
                  ? '0 32px 64px -12px rgba(50, 50, 93, 0.22), 0 18px 36px -18px rgba(0, 0, 0, 0.25)'
                  : '0 16px 32px rgba(0,0,0,0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              transform:
                activeAct === 1
                  ? 'translateX(-120px) scale(1.04) rotateY(0deg) translateZ(30px)'
                  : 'translateX(-480px) scale(0.9) rotateY(16deg) translateZ(-40px)',
              opacity: activeAct === 1 ? 1 : 0.6,
              transition: 'transform var(--dur-slow, 0.4s) var(--ease-enter, cubic-bezier(0.16, 1, 0.3, 1)), opacity 0.3s ease',
            }}
          >
            {/* Inner Interactive Viewport */}
            <div
              style={{
                flex: 1,
                background: '#F5EBE1',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                padding: '20px',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#78716C' }}>
                cubic-bezier(.34, 1.56, .64, 1)
              </span>
              {/* Animated Bezier Ball */}
              <div
                style={{
                  position: 'absolute',
                  right: '36px',
                  top: `${interpolate(
                    spring({ frame: frame % 120, fps, config: { damping: 9, stiffness: 180 } }),
                    [0, 1],
                    [240, 60]
                  )}px`,
                  width: '32px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#EA580C',
                  boxShadow: '0 8px 16px rgba(234, 88, 12, 0.4)',
                }}
              />
              {/* Curve Line */}
              <svg width="240" height="200" style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <path d="M 20 180 C 60 40, 160 40, 220 80" fill="none" stroke="#1E293B" strokeWidth="4" />
                <circle cx="20" cy="180" r="5" fill="#1E293B" />
                <circle cx="220" cy="80" r="5" fill="#EA580C" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#0F172A' }}>/motion-design-skill</h3>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Skills</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', background: '#F1F5F9', borderRadius: '6px', fontFamily: 'monospace' }}>
                SKILL
              </span>
            </div>
          </div>

          {/* Card 2: /anatomy-reveal (Exploded Cylinder) */}
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '480px',
              background: '#FFFFFF',
              borderRadius: '28px',
              boxShadow:
                activeAct === 2
                  ? '0 32px 64px -12px rgba(50, 50, 93, 0.22), 0 18px 36px -18px rgba(0, 0, 0, 0.25)'
                  : '0 16px 32px rgba(0,0,0,0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              transform:
                activeAct === 2
                  ? 'translateX(-120px) scale(1.04) rotateY(0deg) translateZ(30px)'
                  : activeAct === 1
                  ? 'translateX(280px) scale(0.92) rotateY(-14deg) translateZ(-20px)'
                  : 'translateX(-480px) scale(0.9) rotateY(16deg) translateZ(-40px)',
              opacity: activeAct === 2 ? 1 : 0.75,
              transition: 'transform var(--dur-slow, 0.4s) var(--ease-enter, cubic-bezier(0.16, 1, 0.3, 1)), opacity 0.3s ease',
            }}
          >
            <div
              style={{
                flex: 1,
                background: '#F3E8DC',
                borderRadius: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Stacked Cylinder Discs */}
              <div style={{ width: '130px', height: '24px', borderRadius: '50%', background: '#E2E8F0', border: '2px solid #94A3B8' }} />
              <div style={{ width: '125px', height: '18px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '120px', height: '36px', borderRadius: '12px', background: '#0F172A' }} />
              <div style={{ width: '115px', height: '16px', borderRadius: '50%', background: '#10B981' }} />
              <div style={{ width: '130px', height: '28px', borderRadius: '50%', background: '#0F172A' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#0F172A' }}>/anatomy-reveal</h3>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Skills</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', background: '#F1F5F9', borderRadius: '6px', fontFamily: 'monospace' }}>
                06
              </span>
            </div>
          </div>

          {/* Card 3: three.quarks / react-postprocessing (Neon FX) */}
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '480px',
              background: '#090A0F',
              borderRadius: '28px',
              boxShadow:
                activeAct === 4
                  ? '0 32px 64px -12px rgba(234, 88, 12, 0.3), 0 18px 36px -18px rgba(0, 0, 0, 0.5)'
                  : '0 16px 32px rgba(0,0,0,0.1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              transform:
                activeAct === 4
                  ? 'translateX(-120px) scale(1.04) rotateY(0deg) translateZ(30px)'
                  : 'translateX(620px) scale(0.85) rotateY(-22deg) translateZ(-60px)',
              opacity: activeAct === 4 ? 1 : 0.6,
              transition: 'transform var(--dur-slow, 0.4s) var(--ease-enter, cubic-bezier(0.16, 1, 0.3, 1)), opacity 0.3s ease',
            }}
          >
            <div
              style={{
                flex: 1,
                background: '#000000',
                borderRadius: '20px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Luminous Neon Ring */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '6px solid #F97316',
                  boxShadow: '0 0 40px #F97316, inset 0 0 30px #F97316',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>three.quarks</h3>
                <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>FX / Particles</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', background: 'rgba(255,255,255,0.1)', color: '#F97316', borderRadius: '6px', fontFamily: 'monospace' }}>
                11
              </span>
            </div>
          </div>

          {/* Right Inspector Detail Glass Card */}
          <div
            style={{
              position: 'absolute',
              right: '48px',
              width: '320px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              padding: '24px',
              zIndex: 60,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#94A3B8' }}>
              <span>{counterText}</span>
              <span>GITHUB ↗</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#D97757', marginTop: '14px' }}>
              {activeAct === 4 ? 'FX / PARTICLES' : 'SKILL / PRINCIPLES'}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '8px 0 10px 0' }}>
              {activeAct === 4 ? 'three.quarks' : activeAct === 2 ? '/anatomy-reveal' : '/motion-design-skill'}
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.4, margin: '0 0 20px 0' }}>
              {activeAct === 4
                ? 'High-performance particle engine and shader VFX trails.'
                : activeAct === 2
                ? 'Exploded isometric hardware views and automated reveal MP4.'
                : 'Timing, spring easing curves, and the 12 principles of animation.'}
            </p>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {renderBrandIcon('claudeStar', 16)}
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Fable 5.2</span>
              </div>
              <button
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Open ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACT 3: THE DRILLDOWN MODAL WORKBENCH (Exploded 3D + Sliders + Terminal) */}
      {activeAct === 3 && (
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '44px',
            right: '44px',
            bottom: '100px',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Top Split Studio Workbench */}
          <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
            {/* Left Column: 3D Exploded View */}
            <div
              style={{
                flex: 1.1,
                background: '#FAF5EE',
                borderRadius: '28px',
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#94A3B8' }}>
                <span>ONE PRODUCT. SIX PARTS.</span>
                <span>EXPLODED VIEW</span>
              </div>

              {/* Exploded Graphic with Callout Labels and Leader Lines */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative' }}>
                  
                  {/* Layer 01: Grille */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', right: '190px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>01</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>GRILLE</span>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                    </div>
                    <div style={{ width: '180px', height: '36px', borderRadius: '50%', background: '#F8FAFC', border: '3px solid #CBD5E1', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                  </div>

                  {/* Layer 02: Light Ring */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '170px', height: '22px', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ position: 'absolute', left: '180px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>02</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>LIGHT RING</span>
                    </div>
                  </div>

                  {/* Layer 03: Driver */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', right: '170px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>03</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>DRIVER</span>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                    </div>
                    <div style={{ width: '160px', height: '48px', borderRadius: '16px', background: '#1E293B' }} />
                  </div>

                  {/* Layer 04: Logic Board */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '150px', height: '22px', borderRadius: '50%', background: '#10B981' }} />
                    <div style={{ position: 'absolute', left: '160px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>04</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>LOGIC BOARD</span>
                    </div>
                  </div>

                  {/* Layer 05: Battery */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', right: '170px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>05</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>BATTERY</span>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                    </div>
                    <div style={{ width: '160px', height: '36px', borderRadius: '50%', background: '#CBD5E1' }} />
                  </div>

                  {/* Layer 06: Base */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '175px', height: '36px', borderRadius: '50%', background: '#0F172A' }} />
                    <div style={{ position: 'absolute', left: '185px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '40px', height: '1px', background: '#94A3B8' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#D97757' }}>06</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#475569' }}>BASE</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Scrubber Timeline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'monospace', fontSize: '13px', color: '#64748B' }}>
                <span>193 / 240</span>
                <div style={{ flex: 1, height: '4px', background: '#E2E8F0', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '80%', height: '100%', background: '#EF4444', borderRadius: '2px' }} />
                </div>
                <span>60 FPS</span>
              </div>
            </div>

            {/* Right Column: Editorial Copy + Interactive Sliders */}
            <div
              style={{
                flex: 0.9,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '28px',
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#D97757' }}>
                THE REVEAL SHOT
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 900, color: '#0F172A', margin: '10px 0 6px 0', lineHeight: 1.05 }}>
                Take it apart.
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 500, color: '#64748B' }}>On camera.</span>
              </h2>
              <p style={{ fontSize: '18px', color: '#64748B', margin: '0 0 28px 0' }}>Explode it. Spin it. Light it.</p>

              {/* Interactive Parameter Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '13px', fontWeight: 800 }}>
                    <span>EXPLODE</span>
                    <span>1.00</span>
                  </div>
                  <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '8px', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: '#0F172A', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '13px', fontWeight: 800 }}>
                    <span>ORBIT</span>
                    <span>0.86</span>
                  </div>
                  <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '8px', position: 'relative' }}>
                    <div style={{ width: '86%', height: '100%', background: '#0F172A', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '13px', fontWeight: 800 }}>
                    <span>GLOW</span>
                    <span>0.82</span>
                  </div>
                  <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '8px', position: 'relative' }}>
                    <div style={{ width: '82%', height: '100%', background: '#0F172A', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Claude Code Terminal Box */}
          <div
            style={{
              background: '#14151B',
              borderRadius: '24px',
              padding: '24px 28px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {renderBrandIcon('claudeStar', 18)}
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#CBD5E1' }}>CLAUDE CODE</span>
                <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  FABLE 5.2
                </span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748B' }}>PROMPT → REVEAL.MP4</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '17px', color: '#F8FAFC', lineHeight: 1.5 }}>
              <span style={{ color: '#D97757' }}>&gt; </span>
              /anatomy-reveal a wireless speaker, exploded view, slow orbit, labels on
              <span style={{ background: '#38BDF8', color: '#38BDF8', marginLeft: '4px' }}>█</span>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '24px', fontFamily: 'monospace', fontSize: '13px', color: '#10B981' }}>
              <span>✔ 6 parts separated</span>
              <span>✔ orbit + glow keyed · 240 frames</span>
            </div>
          </div>
        </div>
      )}

      {/* ACT 5: THE CLIMAX 5x4 REPO GRID OUTRO */}
      {activeAct === 5 && (
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '44px',
            right: '44px',
            bottom: '120px',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#D97757', letterSpacing: '0.12em' }}>
              THE COMPLETE MOTION ARSENAL
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', fontWeight: 900, color: '#0F172A', margin: '6px 0 0 0' }}>
              20 Repos. One Studio.
            </h2>
          </div>

          {/* 5x4 Matrix Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '14px',
              width: '100%',
              flex: 1,
            }}
          >
            {allRepos.map((repo, idx) => {
              const cardEntrance = spring({
                frame: (frame - 960) - idx * 2,
                fps,
                config: { damping: 14, stiffness: 180 },
              });
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    transform: `scale(${interpolate(cardEntrance, [0, 1], [0.8, 1])})`,
                    opacity: interpolate(cardEntrance, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ height: '70px', background: repo.bg, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, color: '#475569' }}>
                      {repo.id.slice(0, 12)}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {repo.name}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{repo.cat}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom High-CTR Post CTA Button */}
          <div
            style={{
              marginTop: '20px',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '14px 36px',
              borderRadius: '9999px',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 800,
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: '#10B981' }}>✔</span>
            All 20 links are in the post
          </div>
        </div>
      )}

      {/* BOTTOM CATEGORY DOCK BAR */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '44px',
          right: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em' }}>
          BROWSE → INSTALL → PROMPT → RENDER
        </span>

        {/* Floating Category Dock */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {categories.map((cat, i) => {
            const isActive = cat === activeCategory;
            return (
              <span
                key={i}
                style={{
                  background: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </span>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#D97757' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97757' }} />
          <span>{counterText}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
