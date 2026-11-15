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
import { GameHudOverlay } from '../components/GameHudOverlay';
import { HeistVectorMap } from '../components/HeistVectorMap';
import { HeistCharacterPuppet } from '../components/HeistCharacterPuppet';
import { KeyframeLockedSFX } from '../engines/audio/KeyframeLockedSFX';
import { SFXLibrary } from '../engines/audio/AdvancedAudioEngine';

export const HeistDilemmaStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Stop-motion quantization helper (16 FPS feel)
  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // Determine current active scene based on frame windows
  // Scene 1: 0 - 120 (4.0s)
  // Scene 2: 120 - 240 (4.0s)
  // Scene 3: 240 - 360 (4.0s)
  // Scene 4: 360 - 450 (3.0s)
  // Scene 5: 450 - 520 (2.3s)
  // Scene 6: 520 - 600 (2.7s)
  const isScene1 = frame >= 0 && frame < 120;
  const isScene2 = frame >= 120 && frame < 240;
  const isScene3 = frame >= 240 && frame < 360;
  const isScene4 = frame >= 360 && frame < 450;
  const isScene5 = frame >= 450 && frame < 520;
  const isScene6 = frame >= 520;

  // Camera drift physics
  const driftX = Math.sin((quantizedFrame / stopMotionFps) * 0.8) * 6;
  const driftY = Math.cos((quantizedFrame / stopMotionFps) * 0.6) * 5;

  // Rain particle positions (deterministic derivation without Math.random)
  const rainDrops = Array.from({ length: 40 }).map((_, i) => {
    const seedX = (i * 97) % 1080;
    const speed = 25 + (i % 15);
    const y = ((frame * speed + i * 230) % 2100) - 100;
    const length = 25 + (i % 20);
    const opacity = 0.2 + (i % 5) * 0.12;
    return { x: seedX, y, length, opacity };
  });

  // Heat variable for HUD
  const heatLevel = isScene5 || isScene6 ? 65 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070C14',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 1. Synchronized Keyframe-Locked Audio Engine */}
      {/* Background Cinematic Score with Sidechain Volume */}
      <Audio
        src={staticFile('audio/custom_soundtrack.mp3')}
        volume={isScene6 ? 0.35 : 0.6}
        startFrom={0}
      />

      {/* Tactile Foley & SFX Triggers */}
      {/* Scene 1: Cash flutter on backseat duffel bag */}
      <KeyframeLockedSFX triggerFrame={6} sfxFile="sfx/cash-flutter.wav" volume={0.85} />
      <KeyframeLockedSFX triggerFrame={20} sfxFile="sfx/counter-tick.wav" volume={0.6} />
      <KeyframeLockedSFX triggerFrame={35} sfxFile="sfx/counter-tick.wav" volume={0.6} />
      <KeyframeLockedSFX triggerFrame={50} sfxFile="sfx/counter-tick.wav" volume={0.6} />

      {/* Scene 2: Partner Vince entrance */}
      <KeyframeLockedSFX triggerFrame={120} sfxFile="sfx/whoosh-transition.wav" volume={0.8} />
      <KeyframeLockedSFX triggerFrame={128} sfxFile="sfx/heavy-impact.wav" volume={0.7} />

      {/* Scene 3: Map plan with police sirens */}
      <KeyframeLockedSFX triggerFrame={240} sfxFile="sfx/whoosh-transition.wav" volume={0.8} />
      <KeyframeLockedSFX triggerFrame={255} sfxFile="sfx/police-siren.wav" volume={0.75} />

      {/* Scene 4: Motel lobby bell & click */}
      <KeyframeLockedSFX triggerFrame={360} sfxFile="sfx/whoosh-transition.wav" volume={0.8} />
      <KeyframeLockedSFX triggerFrame={375} sfxFile="sfx/ui-click.wav" volume={0.85} />

      {/* Scene 5: Dye pack discovery warning beep */}
      <KeyframeLockedSFX triggerFrame={450} sfxFile="sfx/heavy-impact.wav" volume={0.8} />
      <KeyframeLockedSFX triggerFrame={458} sfxFile="sfx/dye-pack-beep.wav" volume={0.9} />
      <KeyframeLockedSFX triggerFrame={480} sfxFile="sfx/dye-pack-beep.wav" volume={0.9} />

      {/* Scene 6: Dilemma sub-bass drone and decision riser */}
      <KeyframeLockedSFX triggerFrame={520} sfxFile="sfx/dilemma-drone.wav" volume={0.95} />

      {/* 2. Global Game HUD Overlay (Persistent across narrative acts) */}
      <GameHudOverlay
        haul={8400000}
        startHaul={1112024}
        crew={2}
        heat={heatLevel}
        countDurationFrames={60}
      />

      {/* 3. Narrative Act Scenes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${driftX}px, ${driftY}px, 0px)`,
        }}
      >
        {/* ======================================================== */}
        {/* SCENE 1: Back Seat of Getaway Car with $8.4M Haul */}
        {/* ======================================================== */}
        {isScene1 && (
          <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Interior Car Silhouette & Rear Window */}
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(180deg, #09131F 0%, #172635 45%, #0A1118 100%)',
              }}
            >
              {/* Rain Streaks on Glass */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {rainDrops.map((drop, idx) => (
                  <line
                    key={idx}
                    x1={drop.x}
                    y1={drop.y}
                    x2={drop.x - 3}
                    y2={drop.y + drop.length}
                    stroke="#38BDF8"
                    strokeWidth="1.8"
                    strokeOpacity={drop.opacity}
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {/* Rear Window Frame & Car Headrest Silhouettes */}
              <div
                style={{
                  position: 'absolute',
                  top: '180px',
                  left: '80px',
                  right: '80px',
                  height: '420px',
                  borderRadius: '120px 120px 40px 40px',
                  border: '18px solid #060B12',
                  boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8), 0 20px 60px rgba(0,0,0,0.9)',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #112338 0%, #0F3147 60%, #1A475C 100%)',
                }}
              >
                {/* Wet Highway streetlights in distance */}
                <div
                  style={{
                    position: 'absolute',
                    top: '140px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #FDE047 0%, rgba(253, 224, 71, 0) 70%)',
                    opacity: 0.8,
                  }}
                />
              </div>

              {/* Backseat Duffel Bags with Cash Cutouts */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '260px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '740px',
                  height: '480px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '40px',
                }}
              >
                {/* Left Duffel Bag */}
                <div
                  style={{
                    width: '320px',
                    height: '240px',
                    borderRadius: '32px',
                    background: '#1E293B',
                    border: '5px solid #0F172A',
                    position: 'relative',
                    boxShadow: '0 24px 50px rgba(0,0,0,0.7)',
                    transform: 'rotate(-4deg)',
                  }}
                >
                  {/* Unzipped Pocket with Overflowing Cash */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      right: '20px',
                      height: '90px',
                      borderRadius: '16px',
                      background: '#0F172A',
                      border: '3px solid #334155',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Banded Cash Stacks Cutout */}
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '75px',
                          height: '34px',
                          background: '#86EFAC',
                          border: '2px solid #0F172A',
                          borderRadius: '4px',
                          position: 'relative',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                        }}
                      >
                        {/* Money Band */}
                        <div
                          style={{
                            width: '20px',
                            height: '100%',
                            background: '#FAF7F2',
                            border: '1px solid #0F172A',
                          }}
                        />
                        <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 900, color: '#0F172A' }}>
                          $100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Duffel Bag */}
                <div
                  style={{
                    width: '340px',
                    height: '260px',
                    borderRadius: '32px',
                    background: '#0F172A',
                    border: '5px solid #334155',
                    position: 'relative',
                    boxShadow: '0 24px 50px rgba(0,0,0,0.7)',
                    transform: 'rotate(5deg)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '30px',
                      right: '30px',
                      height: '110px',
                      borderRadius: '16px',
                      background: '#1E293B',
                      border: '3px solid #0F172A',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '32px',
                        fontWeight: 900,
                        color: '#4ADE80',
                        letterSpacing: '0.05em',
                      }}
                    >
                      $8,400,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#F8FAFC',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                  }}
                >
                  8.4 million dollars on your back seat.
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ======================================================== */}
        {/* SCENE 2: Partner Vince Meeting on Wet Road */}
        {/* ======================================================== */}
        {isScene2 && (
          <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(180deg, #09131E 0%, #11202E 40%, #080D14 100%)',
              }}
            >
              {/* Rain Streaks */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {rainDrops.map((drop, idx) => (
                  <line
                    key={idx}
                    x1={drop.x}
                    y1={drop.y}
                    x2={drop.x - 3}
                    y2={drop.y + drop.length}
                    stroke="#38BDF8"
                    strokeWidth="1.8"
                    strokeOpacity={drop.opacity}
                  />
                ))}
              </svg>

              {/* Muscle Car in Background with glowing red taillights */}
              <div
                style={{
                  position: 'absolute',
                  top: '420px',
                  right: '120px',
                  width: '320px',
                  height: '180px',
                  borderRadius: '24px',
                  background: '#0F172A',
                  border: '4px solid #1E293B',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: '20px',
                }}
              >
                {/* Taillights */}
                <div style={{ display: 'flex', gap: '80px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '16px',
                      borderRadius: '8px',
                      background: '#EF4444',
                      boxShadow: '0 0 20px #EF4444',
                    }}
                  />
                  <div
                    style={{
                      width: '60px',
                      height: '16px',
                      borderRadius: '8px',
                      background: '#EF4444',
                      boxShadow: '0 0 20px #EF4444',
                    }}
                  />
                </div>
              </div>

              {/* Getaway Car in Foreground (Left side, driver side open) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '180px',
                  left: '-40px',
                  width: '480px',
                  height: '520px',
                  borderRadius: '40px',
                  background: '#1E293B',
                  border: '6px solid #0F172A',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
                }}
              >
                {/* Glowing Amber Headlight Pool */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '30px',
                    width: '70px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#FDE047',
                    boxShadow: '0 0 45px #FDE047, 40px 40px 100px #F59E0B',
                  }}
                />
              </div>

              {/* Vince Character Cutout Puppet (Center-Right) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '360px',
                  left: '50%',
                  transform: 'translateX(-30px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Paper Head Puppet with Leader Callout Badge */}
                <HeistCharacterPuppet
                  expression="intense"
                  hasMustache={true}
                  hasBeanie={false}
                  headSize={160}
                  callout={{
                    badgeTitle: 'VINCE',
                    badgeSubtitle: 'YOUR PARTNER',
                    accentColor: '#EC4899',
                    badgeOffset: { x: -210, y: -110 },
                  }}
                />

                {/* Stylized Illustrated Leather Jacket Body Cutout */}
                <div
                  style={{
                    width: '180px',
                    height: '280px',
                    background: '#78350F',
                    border: '5px solid #0F172A',
                    borderRadius: '30px 30px 10px 10px',
                    marginTop: '-24px',
                    position: 'relative',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* White Mitten Hands */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      left: '-24px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#FAF7F2',
                      border: '4px solid #0F172A',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      right: '-24px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#FAF7F2',
                      border: '4px solid #0F172A',
                    }}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  width: '90%',
                }}
              >
                <span
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#F8FAFC',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                  }}
                >
                  Your partner took the second car.
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ======================================================== */}
        {/* SCENE 3: "THE PLAN" Heist Blueprint Vector Map */}
        {/* ======================================================== */}
        {isScene3 && (
          <AbsoluteFill>
            <HeistVectorMap showPolice={true} />
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '90%',
              }}
            >
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: '#F8FAFC',
                  textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                }}
              >
                The plan: split up, rendezvous at the motel.
              </span>
            </div>
          </AbsoluteFill>
        )}

        {/* ======================================================== */}
        {/* SCENE 4: Motel Stakeout & Sleeping Night Clerk */}
        {/* ======================================================== */}
        {isScene4 && (
          <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(180deg, #0A131F 0%, #162434 50%, #0D1622 100%)',
              }}
            >
              {/* Rain Window with Headlights & Pink Neon Motel Sign */}
              <div
                style={{
                  position: 'absolute',
                  top: '160px',
                  left: '60px',
                  right: '60px',
                  height: '620px',
                  borderRadius: '24px',
                  border: '14px solid #060B12',
                  boxShadow: 'inset 0 0 80px rgba(0,0,0,0.85), 0 20px 60px rgba(0,0,0,0.9)',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #11253B 0%, #0F3852 100%)',
                }}
              >
                {/* Pink Neon MOTEL Sign in Window */}
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '3px solid #EC4899',
                    boxShadow: '0 0 25px #EC4899, inset 0 0 15px #EC4899',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: '#F472B6',
                      letterSpacing: '0.15em',
                    }}
                  >
                    MOTEL
                  </span>
                </div>

                {/* Car Headlights through rain */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '120px',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: '#FDE047',
                      boxShadow: '0 0 60px #FDE047, -20px 40px 100px #F59E0B',
                    }}
                  />
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: '#FDE047',
                      boxShadow: '0 0 60px #FDE047, 20px 40px 100px #F59E0B',
                    }}
                  />
                </div>
              </div>

              {/* Status Pill Badge: "NOBODY WATCHING" */}
              <div
                style={{
                  position: 'absolute',
                  top: '200px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '2px solid #10B981',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#10B981',
                    textTransform: 'uppercase',
                  }}
                >
                  NOBODY WATCHING
                </span>
              </div>

              {/* Sleeping Night Clerk Cutout Desk */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '260px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Paper Head Sleeping (Closed curved eyes) */}
                <HeistCharacterPuppet
                  expression="sleeping"
                  handsPose="sleeping"
                  hasBeanie={false}
                  headSize={170}
                />

                {/* Desk Silhouette with CRT Monitor & Service Bell */}
                <div
                  style={{
                    width: '680px',
                    height: '240px',
                    background: '#1E293B',
                    border: '6px solid #0F172A',
                    borderRadius: '16px',
                    marginTop: '-40px',
                    position: 'relative',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
                  }}
                >
                  {/* Service Bell Cutout */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '80px',
                      width: '44px',
                      height: '28px',
                      borderRadius: '22px 22px 4px 4px',
                      background: '#FDE047',
                      border: '3px solid #0F172A',
                    }}
                  />
                  {/* Guest Registration Card */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '120px',
                      width: '80px',
                      height: '50px',
                      background: '#FAF7F2',
                      border: '2.5px solid #0F172A',
                      borderRadius: '4px',
                      transform: 'rotate(-8deg)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#0F172A' }}>GUEST</span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#F8FAFC',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                  }}
                >
                  You get there first. Nobody's watching.
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ======================================================== */}
        {/* SCENE 5: The Trap / 3D Isometric Dye Pack Reveal */}
        {/* ======================================================== */}
        {isScene5 && (
          <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'radial-gradient(circle at center, #1E1218 0%, #0A0609 80%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Isometric 3D Stack of $100 Bills Cutout */}
              <div
                style={{
                  width: '560px',
                  height: '380px',
                  position: 'relative',
                  transform: 'perspective(900px) rotateX(28deg) rotateZ(-12deg)',
                  boxShadow: '0 40px 90px rgba(0,0,0,0.95)',
                }}
              >
                {/* Stack Block Base */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#86EFAC',
                    border: '6px solid #0F172A',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Hollow Cutout Cavity inside cash stack */}
                  <div
                    style={{
                      width: '260px',
                      height: '180px',
                      background: '#090D14',
                      border: '4px solid #0F172A',
                      borderRadius: '16px',
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {/* The Red Dye Pack Explosive Unit */}
                    <div
                      style={{
                        width: '140px',
                        height: '90px',
                        background: '#DC2626',
                        border: '3px solid #0F172A',
                        borderRadius: '12px',
                        position: 'relative',
                        boxShadow: '0 0 25px #EF4444',
                      }}
                    >
                      {/* Integrated Circuit & Antenna Wire */}
                      <div
                        style={{
                          position: 'absolute',
                          right: '-28px',
                          top: '20px',
                          width: '32px',
                          height: '48px',
                          background: '#15803D',
                          border: '2px solid #0F172A',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Pulsing Target Reticle Ring */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '210px',
                        height: '210px',
                        borderRadius: '50%',
                        border: '3px dashed #EF4444',
                        boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
                        animation: 'spin 4s linear infinite',
                      }}
                    />

                    {/* Target Callout Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-65px',
                        padding: '8px 24px',
                        background: '#0F172A',
                        border: '2.5px solid #EF4444',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px #EF4444',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          color: '#EF4444',
                        }}
                      >
                        DYE PACK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    color: '#EF4444',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                  }}
                >
                  Wait... a radio dye pack?
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ======================================================== */}
        {/* SCENE 6: Climax Dilemma Anchor ("WHAT DO YOU DO?") */}
        {/* ======================================================== */}
        {isScene6 && (
          <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(180deg, #070D16 0%, #111D2D 45%, #080E17 100%)',
              }}
            >
              {/* Motel Room Window with Robber Pulling Curtain */}
              <div
                style={{
                  position: 'absolute',
                  top: '160px',
                  left: '80px',
                  right: '80px',
                  height: '680px',
                  borderRadius: '24px',
                  border: '14px solid #060B12',
                  boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9), 0 20px 60px rgba(0,0,0,0.9)',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #102438 0%, #0A1926 100%)',
                }}
              >
                {/* Glowing Pink Neon MOTEL Sign Outside */}
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    left: '50px',
                    padding: '12px 24px',
                    border: '3px solid #EC4899',
                    borderRadius: '8px',
                    boxShadow: '0 0 35px #EC4899, inset 0 0 20px #EC4899',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '36px',
                      fontWeight: 900,
                      color: '#F472B6',
                      letterSpacing: '0.15em',
                    }}
                  >
                    MOTEL
                  </span>
                </div>

                {/* Motel Bed with Overflowing Cash Duffel Bag */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '40px',
                    width: '320px',
                    height: '200px',
                    borderRadius: '20px',
                    background: '#1E293B',
                    border: '5px solid #0F172A',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '260px',
                      height: '110px',
                      borderRadius: '16px',
                      background: '#0F172A',
                      border: '3px solid #334155',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      padding: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '72px',
                          height: '32px',
                          background: '#86EFAC',
                          border: '2px solid #0F172A',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#0F172A' }}>$100</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Robber Cutout Looking Out Window with Beanie */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '140px',
                  }}
                >
                  <HeistCharacterPuppet
                    expression="shock"
                    hasBeanie={true}
                    handsPose="curtain-pull"
                    headSize={180}
                  />
                </div>
              </div>

              {/* Viral Dilemma Header: "WHAT DO YOU DO?" */}
              <div
                style={{
                  position: 'absolute',
                  top: '920px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  width: '90%',
                }}
              >
                <h1
                  style={{
                    fontSize: '68px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#F8FAFC',
                    margin: 0,
                    textTransform: 'uppercase',
                    textShadow: '0 6px 30px rgba(0,0,0,0.95)',
                  }}
                >
                  WHAT DO YOU DO?
                </h1>

                {/* Interactive Choice A / B Cards */}
                <div
                  style={{
                    marginTop: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    alignItems: 'center',
                  }}
                >
                  {/* Choice A */}
                  <div
                    style={{
                      width: '85%',
                      background: 'rgba(15, 23, 42, 0.94)',
                      border: '3px solid #38BDF8',
                      borderRadius: '18px',
                      padding: '18px 24px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        padding: '6px 14px',
                        background: '#38BDF8',
                        color: '#0F172A',
                        fontWeight: 900,
                        fontSize: '22px',
                        borderRadius: '8px',
                      }}
                    >
                      A
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        color: '#F8FAFC',
                        textTransform: 'uppercase',
                      }}
                    >
                      DUMP THE CASH & RUN
                    </span>
                  </div>

                  {/* Choice B */}
                  <div
                    style={{
                      width: '85%',
                      background: 'rgba(15, 23, 42, 0.94)',
                      border: '3px solid #EC4899',
                      borderRadius: '18px',
                      padding: '18px 24px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        padding: '6px 14px',
                        background: '#EC4899',
                        color: '#FAF7F2',
                        fontWeight: 900,
                        fontSize: '22px',
                        borderRadius: '8px',
                      }}
                    >
                      B
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        color: '#F8FAFC',
                        textTransform: 'uppercase',
                      }}
                    >
                      WARN VINCE & SPLIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#F8FAFC',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                  }}
                >
                  So:
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}
      </div>
    </AbsoluteFill>
  );
};
