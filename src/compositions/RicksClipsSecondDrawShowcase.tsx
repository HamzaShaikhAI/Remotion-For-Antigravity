import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
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
          <FrontierTown3DEnvironment sceneType="street_day" cameraZoom={1.05} />

          {/* Cowboy 1 Standing in Dusty Street Midground */}
          <div
            style={{
              position: 'absolute',
              bottom: 420,
              right: 180,
              zIndex: 10,
            }}
          >
            <WesternStickmanRig
              expression="smug"
              pose="stand"
              scale={1.0}
              costume={{
                vestColor: '#92400e',
                shirtColor: '#0d9488',
                hasMustache: true,
                hasStraw: true,
              }}
            />
          </div>

          {/* High-Velocity Bullet Flying in Foreground */}
          {frame < 120 && (
            <BulletFlybyEffect progress={Math.min(1, frame / 90)} />
          )}
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: MEDIUM CLOSE-UP SMUG COWBOY (Frames 240 - 450)  */}
      {/* ======================================================== */}
      {frame >= 240 && frame < 450 && (
        <AbsoluteFill>
          <FrontierTown3DEnvironment sceneType="street_day" cameraZoom={1.35} cameraPanX={-80} />

          {/* Close-Up Cowboy 1 Framing Head & Torso */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: width / 2 - 240,
              zIndex: 15,
            }}
          >
            <WesternStickmanRig
              expression="smug"
              pose="stand"
              scale={1.85}
              costume={{
                vestColor: '#92400e',
                shirtColor: '#0d9488',
                hasMustache: true,
                hasStraw: true,
                hasHolster: true,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THINKING PUDDLE & STANDOFF (Frames 450 - 720)   */}
      {/* ======================================================== */}
      {frame >= 450 && frame < 720 && (
        <AbsoluteFill>
          <FrontierTown3DEnvironment sceneType="street_day" cameraZoom={1.15} />

          {/* Distant Cowboy 1 down the street */}
          <div
            style={{
              position: 'absolute',
              bottom: 840,
              left: width / 2 - 40,
              zIndex: 5,
            }}
          >
            <WesternStickmanRig
              expression="neutral"
              pose="duel_ready"
              scale={0.35}
              costume={{ vestColor: '#92400e', shirtColor: '#0d9488' }}
            />
          </div>

          {/* Puddle on Ground with Reflection */}
          <div
            style={{
              position: 'absolute',
              bottom: 440,
              left: width / 2 - 120,
              width: 240,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#fed7aa',
              border: '6px solid #ca8a04',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 8,
            }}
          >
            {/* Reflected Face in Water */}
            <div style={{ opacity: 0.35, transform: 'scale(0.6) rotate(180deg)' }}>
              <WesternStickmanRig expression="thinking" pose="stand" scale={0.5} />
            </div>
          </div>

          {/* Foreground Cowboy 2 (Thinking Pose with Hand on Chin) */}
          <div
            style={{
              position: 'absolute',
              bottom: 240,
              left: 120,
              zIndex: 15,
            }}
          >
            <WesternStickmanRig
              expression="thinking"
              pose="thinking"
              scale={1.5}
              costume={{
                hatColor: '#09090b',
                hatBandColor: '#dc2626',
                hasPoncho: true,
                hasBandolier: true,
                hasMustache: false,
                hasStraw: false,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: SUNSET DOUBLE KNOCKOUT (Frames 720 - 1050)       */}
      {/* ======================================================== */}
      {frame >= 720 && frame < 1050 && (
        <AbsoluteFill>
          <FrontierTown3DEnvironment sceneType="street_sunset" cameraZoom={1.1} />

          {/* Knockout hit impact spring */}
          {(() => {
            const hitProgress = Math.min(1, (frame - 720) / 45);

            return (
              <>
                {/* Cowboy 1 Fallen on Ground (Right) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 380,
                    right: 80,
                    zIndex: 12,
                  }}
                >
                  <WesternStickmanRig
                    expression="knockout"
                    pose="knockout"
                    scale={1.3}
                    flipX={true}
                    hatFlyProgress={hitProgress}
                    costume={{ vestColor: '#92400e', shirtColor: '#0d9488' }}
                  />
                </div>

                {/* Cowboy 2 Fallen on Ground (Left) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 420,
                    left: 60,
                    zIndex: 12,
                  }}
                >
                  <WesternStickmanRig
                    expression="knockout"
                    pose="knockout"
                    scale={1.25}
                    hatFlyProgress={hitProgress}
                    costume={{
                      hatColor: '#09090b',
                      hasPoncho: true,
                      hasMustache: false,
                    }}
                  />
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 4A: SALOON POKER TABLE (Frames 1050 - 1380)        */}
      {/* ======================================================== */}
      {frame >= 1050 && frame < 1380 && (
        <AbsoluteFill>
          <FrontierTown3DEnvironment sceneType="saloon_interior" />

          {/* Foreground Cowboy with Smartphone (Bottom Left) */}
          <div
            style={{
              position: 'absolute',
              bottom: 220,
              left: 40,
              zIndex: 20,
            }}
          >
            <WesternStickmanRig
              expression="neutral"
              pose="stand"
              scale={1.6}
              costume={{ hatColor: '#09090b', hasPoncho: true, hasMustache: false }}
            />
            {/* Smartphone in Hand */}
            <div
              style={{
                position: 'absolute',
                top: 240,
                right: 40,
                width: 72,
                height: 120,
                backgroundColor: '#0f172a',
                borderRadius: 8,
                border: '3px solid #64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
                transform: 'rotate(-25deg)',
              }}
            >
              <div
                style={{
                  width: '84%',
                  height: '84%',
                  backgroundColor: '#0284c7',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 900,
                  fontFamily: 'sans-serif',
                }}
              >
                6:42
              </div>
            </div>
          </div>

          {/* Background Cowboy A (Shocked Reaction) */}
          <div
            style={{
              position: 'absolute',
              top: 540,
              left: 480,
              zIndex: 10,
            }}
          >
            <WesternStickmanRig
              expression="shocked"
              pose="stand"
              scale={0.9}
              costume={{ hatColor: '#78350f', shirtColor: '#9333ea', hasMustache: false }}
            />
          </div>

          {/* Background Cowboy B (Shocked Reaction) */}
          <div
            style={{
              position: 'absolute',
              top: 520,
              right: 120,
              zIndex: 10,
            }}
          >
            <WesternStickmanRig
              expression="shocked"
              pose="stand"
              scale={0.9}
              costume={{ hatColor: '#09090b', shirtColor: '#eab308', hasMustache: false }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 4B: TELEGRAPH OFFICE MOONLIGHT (Frames 1380 - 1684)  */}
      {/* ======================================================== */}
      {frame >= 1380 && (
        <AbsoluteFill>
          <FrontierTown3DEnvironment sceneType="telegraph_interior" />
        </AbsoluteFill>
      )}

      {/* High-Impact Viral Word-Synced Captions */}
      <RicksClipsCaptions />
    </AbsoluteFill>
  );
};
