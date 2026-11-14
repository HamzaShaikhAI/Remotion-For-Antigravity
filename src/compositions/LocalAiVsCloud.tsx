import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
} from 'remotion';
import { BrandAssets, BrandIcon } from '../assets/brand';
import { KeyframeLockedSFX } from '../components/KeyframeLockedSFX';

export const LocalAiVsCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Master 140 BPM Memphis Phonk Audio Track
  const soundtrack = staticFile('audio/active-phonk.mp3');

  // Scene timing thresholds
  const s1End = 360;
  const s2End = 900;
  const s3End = 1440;

  // Kinetic Camera Jitter on scene transitions
  // Claude-grade Spring Dynamics with Kinetic Damping
  const hookSpring = spring({
    frame: frame % 360,
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090A0F',
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Background Audio */}
      <Audio src={soundtrack} volume={0.8} />

      {/* Keyframe-Locked Sound Effects */}
      <KeyframeLockedSFX transitionFrame={0} sfxSrc="sfx/whoosh-impact.wav" volume={0.85} />
      <KeyframeLockedSFX transitionFrame={360} sfxSrc="sfx/whoosh.wav" volume={0.8} />
      <KeyframeLockedSFX transitionFrame={900} sfxSrc="sfx/whoosh-impact.wav" volume={0.9} />
      <KeyframeLockedSFX transitionFrame={1440} sfxSrc="sfx/whoosh.wav" volume={0.85} />

      {/* Rough Paper / Subtle Grain Grid Overlay */}
      <AbsoluteFill
        style={{
          opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* SCENE 1: THE HOOK (0 - 6s) */}
      {frame < s1End && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <BrandIcon name="claudeStar" size={44} />
            <span style={{ fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: '#D97757', fontWeight: 700 }}>
              ANTHROPIC POWERED
            </span>
          </div>
          <h1
            style={{
              transform: `scale(${interpolate(hookSpring, [0, 1], [0.88, 1.0])})`,
              fontSize: 68,
              lineHeight: 1.1,
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            THE <span style={{ color: '#D97757', fontStyle: 'italic', fontFamily: 'serif' }}>DEATH</span> OF CLOUD
          </h1>
          <p style={{ fontSize: 28, color: '#94A3B8', marginTop: 20 }}>Why Local AI is Taking Over</p>
        </AbsoluteFill>
      )}

      {/* SCENE 2: TENSION & SPEED (6 - 15s) */}
      {frame >= s1End && frame < s2End && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <BrandIcon name="terminalCursor" size={40} />
            <span style={{ fontSize: 26, color: '#00F5FF', fontWeight: 600 }}>0.4ms LOCAL INFERENCE</span>
          </div>
          <h2 style={{ fontSize: 60, textAlign: 'center', fontWeight: 900, margin: 0 }}>
            ZERO <span style={{ color: '#00F5FF' }}>LATENCY</span>
          </h2>
          <div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
            <BrandIcon name="verifiedCheck" size={28} />
            <span style={{ fontSize: 22, color: '#CBD5E1' }}>End-to-End Encrypted Hardware</span>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 3: CLIMAX (15 - 24s) */}
      {frame >= s2End && frame < s3End && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
          <h1 style={{ fontSize: 64, textAlign: 'center', fontWeight: 900, lineHeight: 1.15 }}>
            TOTAL PRIVACY.<br />
            <span style={{ color: '#D97757', fontStyle: 'italic', fontFamily: 'serif' }}>INSTANT SCALE.</span>
          </h1>
        </AbsoluteFill>
      )}

      {/* SCENE 4: CALL TO ACTION (24 - 30s) */}
      {frame >= s3End && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
          <BrandIcon name="claudeStar" size={64} style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 52, textAlign: 'center', fontWeight: 900 }}>SHIP ON CLAUDE WITH REA</h2>
          <p style={{ fontSize: 26, color: '#94A3B8', marginTop: 12 }}>github.com/HamzaShaikhAI/Remotion-For-Antigravity</p>
        </AbsoluteFill>
      )}

      {/* SAFE ZONE CLEARANCE INDICATOR (BOTTOM 280px RESERVED) */}
      <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', letterSpacing: 2 }}>
          REA AUTONOMOUS STUDIO • 60 FPS DETERMINISTIC
        </span>
      </div>
    </AbsoluteFill>
  );
};
