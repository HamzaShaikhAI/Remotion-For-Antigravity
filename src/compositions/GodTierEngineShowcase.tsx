import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  SubjectAwareDynamicCrop,
  RotoscopeSandwich,
  AudioDucker,
  WhisperKineticTypography,
  PlasmaAuraShader,
  ColorGradeLUT,
  DepthParallaxStage,
  WhisperWord,
} from '../engines';
import { ChadEmojiOverlay } from '../plugins/rea-chad-overlay';

export const GodTierEngineShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. WhisperX Syllable Timestamps for Hormozi Kinetic Typography
  const words: WhisperWord[] = [
    { word: 'THE', start: 0.2, end: 0.6 },
    { word: 'FUTURE', start: 0.6, end: 1.1, highlight: true },
    { word: 'OF', start: 1.1, end: 1.4 },
    { word: 'VIDEO', start: 1.4, end: 1.9, highlight: true, emoji: '⚡' },
    { word: 'IS', start: 1.9, end: 2.2 },
    { word: 'MATHEMATICAL', start: 2.2, end: 3.2, highlight: true, emoji: '🧠' },
    { word: 'UNLEASH', start: 3.2, end: 3.7 },
    { word: 'INFINITE', start: 3.7, end: 4.2, highlight: true },
    { word: 'AURA', start: 4.2, end: 5.5, highlight: true, emoji: '🗿' },
  ];

  // 2. YOLOv8 / MediaPipe Bounding Box Tracking Points
  const trackingPoints = [
    { frame: 0, x: 0.45, y: 0.48 },
    { frame: 90, x: 0.52, y: 0.46 },
    { frame: 180, x: 0.48, y: 0.50 },
    { frame: 300, x: 0.50, y: 0.48 },
  ];

  // 3. Audio Ducking Triggers (Duck background volume when 808 drop or speech hits)
  const duckTriggers = [
    { frame: 60, durationFrames: 45, duckLevel: 0.2 },
    { frame: 180, durationFrames: 60, duckLevel: 0.15 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#050508' }}>
      {/* Engine IV: Color Grading LUT */}
      <ColorGradeLUT lut="cyberpunk-neon" intensity={0.85}>
        {/* Engine IV: Depth Parallax 3D Camera */}
        <DepthParallaxStage depthIntensity={0.6}>
          {/* Engine I: Subject-Aware Dynamic Cropping */}
          <SubjectAwareDynamicCrop trackingPoints={trackingPoints} zoomScale={1.18}>
            {/* Engine I: Semantic Rotoscoping 3D Sandwich */}
            <RotoscopeSandwich
              /* Layer 1: Background Ambient Environment */
              background={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 40%, #1a0b36 0%, #060212 85%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.25,
                      backgroundImage: 'radial-gradient(#00F0FF 1.5px, transparent 1.5px)',
                      backgroundSize: '36px 36px',
                    }}
                  />
                </div>
              }
              /* Layer 2: Middle Sandwich Layer (Kinetic Typography BEHIND character) */
              middleLayer={
                <div style={{ transform: 'translateY(-60px)' }}>
                  <WhisperKineticTypography
                    words={words}
                    activeColor="#00F0FF"
                    inactiveColor="#FFFFFF"
                    fontSize={76}
                  />
                </div>
              }
              /* Layer 3: Foreground Character Stage & Aura Effects */
              foreground={
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Engine IV: WebGL 60fps Plasma Aura Shader */}
                  <PlasmaAuraShader colorA="#00F0FF" colorB="#FF007F" intensity={0.65} />

                  {/* Character Silhouette / Hero Element */}
                  <div
                    style={{
                      width: '420px',
                      height: '520px',
                      borderRadius: '24px',
                      border: '2px solid rgba(0,240,255,0.4)',
                      boxShadow: '0 0 60px rgba(0,240,255,0.25)',
                      background: 'linear-gradient(180deg, rgba(10,10,30,0.8) 0%, rgba(5,5,15,0.95) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div style={{ fontSize: '92px', marginBottom: '16px' }}>⚡</div>
                    <div
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 900,
                        fontSize: '32px',
                        color: '#00F0FF',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      REA ENGINE V2.2
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '8px',
                      }}
                    >
                      5-ENGINE DECENTRALIZED ARCHITECTURE
                    </div>
                  </div>

                  {/* Bass-Reactive Chad / Moyai Aura Badge */}
                  <div style={{ position: 'absolute', bottom: '160px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <ChadEmojiOverlay
                      triggerFrame={60}
                      durationInFrames={300}
                      variant="chad"
                      caption="+1,000,000 AURA"
                      accentColor="#00f0ff"
                    />
                  </div>
                </div>
              }
              /* Layer 4: Cinematic Atmosphere Overlay */
              overlay={
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.7) 100%)',
                  }}
                />
              }
            />
          </SubjectAwareDynamicCrop>
        </DepthParallaxStage>
      </ColorGradeLUT>

      {/* Engine II: Psychoacoustic Sidechain Audio Ducking */}
      <AudioDucker triggers={duckTriggers} baseVolume={0.9}>
        {(volume) => (
          <Sequence from={0} durationInFrames={360}>
            <Audio src={staticFile('audio/active-phonk.mp3')} volume={volume} />
          </Sequence>
        )}
      </AudioDucker>
    </AbsoluteFill>
  );
};
