import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
  Img,
} from 'remotion';
import {
  WesternStickmanRig,
  FrontierTown3DEnvironment,
  BulletFlybyEffect,
  RicksClipsCaptions,
} from '../engines/ricksclips';

export const RicksClipsSecondDrawShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Scene timing partitions across 1684 frames (56.13s @ 30fps)
  // Scene 1: Frames 0 - 240   (The Golden Rule & Bullet Flyby)
  // Scene 2A: Frames 240 - 450 (Medium Close-Up Smug Cowboy)
  // Scene 2B: Frames 450 - 720 (Thinking Puddle Reflection & Distant Standoff)
  // Scene 3: Frames 720 - 1050 (Sunset Double Knockout & Flying Hats)
  // Scene 4A: Frames 1050 - 1380 (Saloon Poker Table & Smartphone Twist)
  // Scene 4B: Frames 1380 - 1684 (Telegraph Office Moonlight & Final Payoff)

  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b', overflow: 'hidden' }}>
      {/* Authentic Narration & Sound Design Audio */}
      <Audio src={staticFile('audio/ricksclips_second_draw_56s.mp3')} volume={0.96} />

      {/* ======================================================== */}
      {/* SCENE 1: THE GOLDEN RULE & BULLET FLYBY (Frames 0 - 240) */}
      {/* ======================================================== */}
      {frame < 240 && (
        <AbsoluteFill>
          {/* Photorealistic 3D Western Frontier Street & Gun Holster Foreground Plate */}
          <AbsoluteFill
            style={{
              transform: `scale(${1.0 + frame * 0.0003})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile('assets/ricksclips/western_bullet_holster.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: MEDIUM CLOSE-UP & DUEL STANDOFF (Frames 240 - 720)*/}
      {/* ======================================================== */}
      {frame >= 240 && frame < 720 && (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `scale(${1.0 + (frame - 240) * 0.0002})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile('assets/ricksclips/western_draw_duel.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 3 & 4: SALOON KNOCKOUT & PAYOFF (Frames 720 - 1684)  */}
      {/* ======================================================== */}
      {frame >= 720 && (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `scale(${1.0 + (frame - 720) * 0.0001})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile('assets/ricksclips/western_saloon_knockout.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* High-Impact Viral Word-Synced Captions (Active from Scene 2 onwards) */}
      {frame >= 240 && <RicksClipsCaptions />}
    </AbsoluteFill>
  );
};
