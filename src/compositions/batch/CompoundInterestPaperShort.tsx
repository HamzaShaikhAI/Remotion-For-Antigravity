import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { PaperCharacterCutout } from '../../components/PaperCharacterCutout';
import { PaperCameraRig } from '../../components/PaperCameraRig';
import { KeyframeLockedSFX } from '../../engines/audio/KeyframeLockedSFX';

export const CompoundInterestPaperShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));
  const currentScene = Math.floor(quantizedFrame / 32);

  const entrance = spring({
    frame: quantizedFrame % 32,
    fps: stopMotionFps,
    config: { damping: 11, stiffness: 220, mass: 0.8 },
  });

  const scenes = [
    {
      title: 'The 8th Wonder of the World',
      subtitle: "He who understands it, earns it; he who doesn't, pays it.",
    },
    {
      title: 'Linear vs Exponential',
      subtitle: 'Year 1 feels like nothing. Year 20 feels like pure magic.',
    },
    {
      title: 'The Cost of Waiting',
      subtitle: 'Starting at 20 vs 30 cuts your final retirement nest egg in half.',
    },
    {
      title: 'Let Time Do the Heavy Lifting',
      subtitle: 'Consistency beats timing every single time.',
    },
  ];

  const activeScene = scenes[Math.min(currentScene, scenes.length - 1)];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E4DFD5',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      <KeyframeLockedSFX
        triggerFrame={currentScene * 32}
        sfxFile="sfx/ui-click.wav"
        volume={0.8}
      />

      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('textures/green-cutting-mat.png')})`,
          backgroundSize: 'cover',
          opacity: 0.92,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.18,
          mixBlendMode: 'multiply',
          backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
        }}
      />

      <PaperCameraRig sceneIndex={currentScene}>
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            transform: `translateX(-50%) translateY(${interpolate(
              entrance,
              [0, 1],
              [30, 0]
            )}px) rotate(-1.2deg)`,
            background: '#FAF7F2',
            padding: '20px',
            borderRadius: '16px',
            border: '6px solid #10B981',
            boxShadow:
              '0 24px 35px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '440px',
          }}
        >
          <PaperCharacterCutout isSpeaking={true} size={160} />
          <span
            style={{
              marginTop: '14px',
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '18px',
              color: '#0F172A',
            }}
          >
            COMPOUND // SCENE 0{currentScene + 1}
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '6%',
            right: '6%',
            textAlign: 'center',
            background: '#FAF7F2',
            padding: '32px 28px',
            border: '5px solid #0F172A',
            boxShadow: '10px 10px 0px #0F172A',
            transform: `rotate(1.1deg)`,
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 900,
              color: '#0F172A',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {activeScene.title}
          </h1>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#475569',
              marginTop: '16px',
              marginBottom: 0,
            }}
          >
            {activeScene.subtitle}
          </p>
        </div>
      </PaperCameraRig>
    </AbsoluteFill>
  );
};
