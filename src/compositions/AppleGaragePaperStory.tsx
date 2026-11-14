import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { PaperCharacterCutout } from '../components/PaperCharacterCutout';
import { KeyframeLockedSFX } from '../engines/audio/KeyframeLockedSFX';

export interface AppleGarageStoryProps {
  title?: string;
}

export const AppleGaragePaperStory: React.FC<AppleGarageStoryProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rule 3: 16 FPS Stop-Motion Framerate Quantization
  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // 15 seconds total (900 frames @ 60 FPS) split across 5 scenes (180 frames / 3.0s each)
  const SCENE_DURATION_FRAMES = 180;
  const TOTAL_SCENES = 5;

  const currentScene = Math.min(
    Math.floor(frame / SCENE_DURATION_FRAMES),
    TOTAL_SCENES - 1
  );
  const sceneLocalFrame = frame % SCENE_DURATION_FRAMES;
  const sceneLocalQuantized = Math.floor(sceneLocalFrame * (stopMotionFps / fps));

  // Snappy spring entrance per scene (quantized at 16fps)
  const entrance = spring({
    frame: sceneLocalQuantized,
    fps: stopMotionFps,
    config: { damping: 11, stiffness: 220, mass: 0.8 },
  });

  // Script scenes mapped to 2.5D paper card layouts
  const scenes = [
    {
      title: 'What if a garage could build the future?',
      subtitle: 'In 1976, friends Steve Jobs & Wozniak built the Apple 1.',
      tag: 'SCENE 01 // THE GARAGE SPARK',
      accent: '#EF4444',
      year: '1976',
    },
    {
      title: 'Sold for $666.66',
      subtitle: 'Handcrafted in a California garage on bare circuit boards.',
      tag: 'SCENE 02 // $666.66 PRICE TAG',
      accent: '#F59E0B',
      year: 'HANDMADE',
    },
    {
      title: 'The Apple 2 Took Off',
      subtitle: 'Color, sound, and simplicity made a cold machine feel human.',
      tag: 'SCENE 03 // THE BREAKTHROUGH',
      accent: '#10B981',
      year: '1977',
    },
    {
      title: 'The Third Founder',
      subtitle: 'Ronald Wayne sold his 10% share for just $800 after 12 days.',
      tag: 'SCENE 04 // 10% FOR $800',
      accent: '#6366F1',
      year: '12 DAYS',
    },
    {
      title: 'The Garage Dream',
      subtitle: 'A mind forever voyaging through strange seas of thought alone.',
      tag: 'SCENE 05 // ENDURING LEGACY',
      accent: '#EC4899',
      year: 'INFINITY',
    },
  ];

  const activeScene = scenes[currentScene];

  // 3D Camera Rig & Harmonic Desk Drift Mechanics
  // Push-in zoom from 1.0 -> 1.10 across the entire 15s narrative
  const cameraZoom = interpolate(frame, [0, 900], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  // Quantized harmonic desk drift (stepped at 16 FPS for tangible workbench wobble)
  const driftTime = quantizedFrame / stopMotionFps;
  const driftX = Math.sin(driftTime * 0.75) * 14;
  const driftY = Math.cos(driftTime * 0.6) * 10;
  const driftRotZ = Math.sin(driftTime * 0.45) * 0.75;
  const driftTiltX = Math.cos(driftTime * 0.5) * 1.2;

  // Paper card subtle hover float
  const cardYOffset = interpolate(entrance, [0, 1], [40, 0]);
  const cardRotation = -1.5 + Math.sin(quantizedFrame * 0.3) * 0.6;
  const textRotation = 0.8 + Math.cos(quantizedFrame * 0.35) * 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E4DFD5',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Keyframe Locked SFX on Scene Changes */}
      {scenes.map((_, idx) => (
        <KeyframeLockedSFX
          key={idx}
          triggerFrame={idx * SCENE_DURATION_FRAMES}
          sfxFile="sfx/ui-click.wav"
          volume={0.8}
        />
      ))}

      {/* 3D Camera Perspective Wrapper */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Camera Rig Stage */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            transform: `scale(${cameraZoom}) translate3d(${driftX}px, ${driftY}px, 0px) rotateZ(${driftRotZ}deg) rotateX(${driftTiltX}deg)`,
            transformOrigin: '50% 48%',
          }}
        >
          {/* Rule 1: Cutting Mat / Textured Desk Background */}
          <AbsoluteFill
            style={{
              backgroundImage: `url(${staticFile('textures/green-cutting-mat.png')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.94,
            }}
          />

          {/* Rough Paper Noise Texture Overlay */}
          <AbsoluteFill
            style={{
              opacity: 0.18,
              mixBlendMode: 'multiply',
              backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Vintage Drafting Tape Sticker Header */}
          <div
            style={{
              position: 'absolute',
              top: '6%',
              left: '50%',
              transform: 'translateX(-50%) rotate(-0.5deg)',
              background: '#FEF3C7',
              border: '2px dashed #D97706',
              padding: '8px 24px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 900,
                color: '#92400E',
                letterSpacing: '0.1em',
              }}
            >
              ★ ARCHIVE DOC: 1976 CUPERTINO GARAGE ★
            </span>
          </div>

          {/* Rule 2: Big-Head Cutout Character Card with Thick Sticker Border */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '50%',
              transform: `translateX(-50%) translateY(${cardYOffset}px) rotate(${cardRotation}deg)`,
              background: '#FAF7F2',
              padding: '24px 28px',
              borderRadius: '20px',
              border: `6px solid ${activeScene.accent}`,
              boxShadow:
                '0 28px 45px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.22)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '460px',
              zIndex: 20,
            }}
          >
            {/* Automated Talking Cutout Mouth-Flap Avatar */}
            <PaperCharacterCutout isSpeaking={true} size={170} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              <span
                style={{
                  background: activeScene.accent,
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                }}
              >
                {activeScene.year}
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#0F172A',
                  letterSpacing: '0.04em',
                }}
              >
                {activeScene.tag}
              </span>
            </div>
          </div>

          {/* Rule 4: Heavy Kinetic Typography (Hard Offset Box Shadow) */}
          <div
            style={{
              position: 'absolute',
              bottom: '16%',
              left: '6%',
              right: '6%',
              textAlign: 'center',
              background: '#FAF7F2',
              padding: '36px 32px',
              border: '5px solid #0F172A',
              boxShadow: '10px 10px 0px #0F172A',
              transform: `rotate(${textRotation}deg)`,
              zIndex: 30,
            }}
          >
            <h1
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: '#0F172A',
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              {activeScene.title}
            </h1>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#475569',
                marginTop: '18px',
                marginBottom: 0,
                lineHeight: 1.35,
              }}
            >
              {activeScene.subtitle}
            </p>
          </div>

          {/* Bottom Desk Tools Decorative Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 800,
              color: '#F8FAFC',
              background: '#0F172A',
              padding: '6px 18px',
              borderRadius: '999px',
              letterSpacing: '0.08em',
              opacity: 0.88,
              zIndex: 40,
            }}
          >
            16 FPS STOP-MOTION // 3D CAMERA RIG
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
