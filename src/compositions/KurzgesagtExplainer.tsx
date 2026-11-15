// src/compositions/KurzgesagtExplainer.tsx
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
  KurzgesagtSpaceEnvironment,
  KurzgesagtSun,
  KurzgesagtEarth,
  KurzgesagtAstronaut,
  KurzgesagtCaptionPill,
  KurzgesagtCountdownClock,
  KurzgesagtYouPin,
  KurzgesagtThermometer,
  KurzgesagtDarknessFront,
} from '../engines/kurzgesagt';
import { KeyframeLockedSFX } from '../engines/audio/KeyframeLockedSFX';

export const KurzgesagtExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dual Clocks:
  // 1. Ambient Clock: Never rewinds (stars twinkle, earth spins, astronaut bobs)
  const ambientFrame = frame;

  // 2. Story Clock: Handles the 0.8s rewind at 24.3s (frame 729 to 753)
  const isRewindWindow = frame >= 729 && frame < 753;
  let storyFrame = frame;
  if (frame >= 753) {
    storyFrame = frame - 24; // offset after rewind
  } else if (isRewindWindow) {
    const rewindProgress = (frame - 729) / 24;
    storyFrame = 729 - rewindProgress * 60; // sweeps back 2 seconds
  }

  // Camera Log-Space Zoom & Transitions
  // 0s - 1s (0 - 30): Tight on Sun at 2.25x
  // 1.6s - 3s (48 - 90): Pull back to 1.0x revealing Earth & Astronaut
  // 5.6s - 9.6s (168 - 288): Dive to 2.3x on Earth
  // 9.6s - 12.5s (288 - 375): Pull back to 0.35x wide orbit view
  // 20.8s (624): Zoom out for 30 KM/S orbital escape
  let cameraZoom = 1.0;
  let cameraX = 0;
  let cameraY = 0;

  if (storyFrame < 30) {
    cameraZoom = 2.25;
    cameraX = 400; // focused on Sun
  } else if (storyFrame >= 30 && storyFrame < 90) {
    const t = interpolate(storyFrame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
    cameraZoom = interpolate(t, [0, 1], [2.25, 1.0]);
    cameraX = interpolate(t, [0, 1], [400, 0]);
  } else if (storyFrame >= 90 && storyFrame < 168) {
    cameraZoom = 1.0;
    cameraX = 0;
  } else if (storyFrame >= 168 && storyFrame < 288) {
    const t = interpolate(storyFrame, [168, 210], [0, 1], { extrapolateRight: 'clamp' });
    cameraZoom = interpolate(t, [0, 1], [1.0, 2.3]);
    cameraX = interpolate(t, [0, 1], [0, -450]); // focused on Earth
  } else if (storyFrame >= 288 && storyFrame < 375) {
    const t = interpolate(storyFrame, [288, 375], [0, 1], { extrapolateRight: 'clamp' });
    cameraZoom = interpolate(t, [0, 1], [2.3, 0.45]);
    cameraX = interpolate(t, [0, 1], [-450, 0]);
  } else if (storyFrame >= 375 && storyFrame < 624) {
    cameraZoom = 0.85;
    cameraX = -120;
  } else {
    cameraZoom = 0.65;
    cameraX = -200;
  }

  // 8:20 Countdown Clock Value (500 seconds down to 0)
  // Reaches Earth at 15.8s (frame 474)
  const secondsRemaining = interpolate(
    storyFrame,
    [96, 474],
    [500, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Darkness Progress on Earth: sweeps across Earth at frame 474 for 0.7s (21 frames)
  const earthDarknessProgress = interpolate(
    storyFrame,
    [474, 495],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Temperature countdown from 15°C to -70°C (frames 684 to 729)
  const temperatureC = interpolate(
    storyFrame,
    [684, 729],
    [15, -70],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const frostProgress = interpolate(
    storyFrame,
    [690, 735],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Earth Position (Orbital Escape at 30 KM/S starts at frame 624)
  const isOrbitalEscape = storyFrame >= 624;
  const escapeOffset = isOrbitalEscape
    ? (storyFrame - 624) * 12 // moves in a straight tangent line
    : 0;
  const earthX = 1380 + (isOrbitalEscape ? escapeOffset : 0);
  const earthY = 540 + (isOrbitalEscape ? -escapeOffset * 0.4 : 0);

  // Mascot Costume & Position for Sunglasses Drop at 25.2s (frame 756 callback)
  const isFinalCallback = frame >= 756;
  const mascotCostume = isFinalCallback ? 'sunglasses' : 'astronaut';
  const mascotX = isFinalCallback ? 960 : earthX - 220;
  const mascotY = isFinalCallback ? 540 : earthY + 60;
  const mascotScale = isFinalCallback ? 1.6 : 0.95;

  if (isFinalCallback) {
    cameraZoom = 1.0;
    cameraX = 0;
    cameraY = 0;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#081d2c', overflow: 'hidden' }}>
      {/* 1. Audio Engine: Royalty-Free Space Soundtrack + Keyframe SFX */}
      <Audio
        src={staticFile('audio/custom_soundtrack.mp3')}
        volume={0.55}
        startFrom={0}
      />

      {/* Synchronized Sound Effects */}
      {/* Frame 30: Sun collapse */}
      <KeyframeLockedSFX triggerFrame={30} sfxFile="sfx/heavy-impact.wav" volume={0.85} />
      {/* Frame 48: Shockwave ring */}
      <KeyframeLockedSFX triggerFrame={48} sfxFile="sfx/whoosh-transition.wav" volume={0.8} />
      {/* Frame 96: 8:20 Countdown Clock slam */}
      <KeyframeLockedSFX triggerFrame={96} sfxFile="sfx/heavy-impact.wav" volume={0.75} />
      {/* Frame 210: YOU pin drops */}
      <KeyframeLockedSFX triggerFrame={210} sfxFile="sfx/ui-click.wav" volume={0.85} />
      {/* Frame 264: Pin morphs to play click */}
      <KeyframeLockedSFX triggerFrame={264} sfxFile="sfx/ui-click.wav" volume={0.85} />
      {/* Frame 474: Darkness sweeps Earth & countdown reaches 0:00 */}
      <KeyframeLockedSFX triggerFrame={474} sfxFile="sfx/cinematic-riser.wav" volume={0.8} />
      {/* Frame 684: Frost & freezing temperature drop */}
      <KeyframeLockedSFX triggerFrame={684} sfxFile="sfx/whoosh-transition.wav" volume={0.7} />
      {/* Frame 729: Rewind whoosh */}
      <KeyframeLockedSFX triggerFrame={729} sfxFile="sfx/whoosh-impact.wav" volume={0.8} />

      {/* 2. Kurzgesagt Space Environment with 5 Parallax Nebulae & Twinkling Stars */}
      <KurzgesagtSpaceEnvironment
        cameraOffset={{ x: cameraX, y: cameraY }}
        zoom={cameraZoom}
        ambientFrameOffset={ambientFrame}
      >
        {/* World Space Container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${cameraX}px, ${cameraY}px)`,
          }}
        >
          {/* Orbital Path / Tangent Line */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* Dotted Elliptical Orbit around Sun */}
            <ellipse
              cx="0"
              cy="540"
              rx="1380"
              ry="420"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity={storyFrame < 624 ? 0.35 : 0.15}
            />

            {/* Tangent Escape Line ("30 KM/S") */}
            {isOrbitalEscape && (
              <g>
                <line
                  x1="1380"
                  y1="540"
                  x2="2200"
                  y2="260"
                  stroke="#ffd98a"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                />
                <text
                  x="1580"
                  y="440"
                  fill="#ffd98a"
                  fontFamily='"Fredoka", sans-serif'
                  fontSize="22"
                  fontWeight="700"
                  letterSpacing="3"
                >
                  30 KM/S
                </text>
              </g>
            )}

            {/* Dotted Empty Center Circle when Sun Vanishes */}
            {storyFrame >= 48 && (
              <circle
                cx="0"
                cy="540"
                r="300"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                opacity="0.4"
              />
            )}
          </svg>

          {/* The Sun (Collapses at frame 30, restored on rewind) */}
          <KurzgesagtSun
            cx={0}
            cy={540}
            radius={300}
            vanishTriggerFrame={isFinalCallback ? undefined : 30}
          />

          {/* The Darkness Front Propagation (Starts at frame 30, hits Earth at frame 474) */}
          {!isFinalCallback && (
            <KurzgesagtDarknessFront
              sunOrigin={{ x: 0, y: 540 }}
              startFrame={30}
              reachEarthFrame={474}
              earthPosition={{ x: 1380, y: 540 }}
            />
          )}

          {/* Jupiter (Appears at frame 537: "STILL SHINING FOR 1 HOUR+") */}
          {storyFrame >= 537 && (
            <div
              style={{
                position: 'absolute',
                left: '1720px',
                top: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Jupiter Sphere */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 40% 40%, #fdba74 0%, #c2410c 100%)',
                  boxShadow: '0 0 25px rgba(251, 146, 60, 0.4)',
                }}
              />
              <span
                style={{
                  marginTop: '10px',
                  fontFamily: '"Fredoka", sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#fdba74',
                  whiteSpace: 'nowrap',
                }}
              >
                JUPITER: STILL SHINING
              </span>
            </div>
          )}

          {/* Earth Body */}
          <div
            style={{
              position: 'absolute',
              left: `${earthX}px`,
              top: `${earthY}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <KurzgesagtEarth
              radius={160}
              darknessProgress={earthDarknessProgress}
              temperatureC={temperatureC}
              frostProgress={frostProgress}
              frame={ambientFrame}
            />

            {/* "YOU" Pin Drop (Frame 210 to 320) */}
            {storyFrame >= 210 && storyFrame < 340 && (
              <KurzgesagtYouPin
                x={-20}
                y={-140}
                isPlayButton={storyFrame >= 264}
                label="YOU"
                sublabel={
                  storyFrame >= 264
                    ? 'YOU PRESSED PLAY 15 SEC AGO'
                    : 'THIS LIGHT LEFT SUN 8 MIN AGO'
                }
              />
            )}
          </div>

          {/* Astronaut Mascot */}
          {storyFrame >= 48 && (
            <KurzgesagtAstronaut
              x={mascotX}
              y={mascotY}
              scale={mascotScale}
              costume={mascotCostume}
              targetLookAt={storyFrame < 168 ? { x: 0, y: 540 } : null}
              lookAtCamera={isFinalCallback}
              ambientFrame={ambientFrame}
            />
          )}
        </div>
      </KurzgesagtSpaceEnvironment>

      {/* 3. Screen-Space Infographic UI Layer */}
      {/* 8:20 Countdown Clock (Slams in at frame 96) */}
      {storyFrame >= 96 && storyFrame < 624 && (
        <div style={{ position: 'absolute', top: '56px', right: '70px', zIndex: 60 }}>
          <KurzgesagtCountdownClock
            secondsRemaining={secondsRemaining}
            startFrame={96}
            label={secondsRemaining <= 0 ? 'DARKNESS REACHED' : 'LAST LIGHT'}
          />
        </div>
      )}

      {/* Thermometer Widget during Global Freeze (Frame 684 to 750) */}
      {!isFinalCallback && storyFrame >= 684 && storyFrame < 760 && (
        <div style={{ position: 'absolute', bottom: '70px', left: '70px', zIndex: 60 }}>
          <KurzgesagtThermometer temperatureC={temperatureC} />
        </div>
      )}

      {/* Narrative Caption Pills */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          textAlign: 'center',
        }}
      >
        {storyFrame < 48 && (
          <KurzgesagtCaptionPill
            text="WHAT IF THE SUN VANISHED?"
            color="#ffd98a"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 48 && storyFrame < 96 && (
          <KurzgesagtCaptionPill
            text="FOR EIGHT MINUTES NOTHING HAPPENS"
            color="#8fd8e6"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 96 && storyFrame < 168 && (
          <KurzgesagtCaptionPill
            text="LIGHT TRAVELS AT 300,000 KM PER SECOND"
            color="#f8fafc"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 168 && storyFrame < 264 && (
          <KurzgesagtCaptionPill
            text="THE SUNLIGHT YOU SEE RIGHT NOW LEFT 8 MINUTES AGO"
            color="#ffd98a"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 264 && storyFrame < 375 && (
          <KurzgesagtCaptionPill
            text="AND GRAVITY TRAVELS AT THE EXACT SAME SPEED"
            color="#8fd8e6"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 474 && storyFrame < 537 && (
          <KurzgesagtCaptionPill
            text="THEN AT 8 MINUTES AND 20 SECONDS DARKNESS HITS"
            color="#ffd98a"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 537 && storyFrame < 624 && (
          <KurzgesagtCaptionPill
            text="JUPITER STILL REFLECTS SUNLIGHT FOR ANOTHER HOUR"
            color="#f8fafc"
            entranceProgress={1.0}
          />
        )}
        {storyFrame >= 624 && storyFrame < 684 && (
          <KurzgesagtCaptionPill
            text="WITHOUT GRAVITY EARTH FLIES OFF INTO DEEP SPACE"
            color="#8fd8e6"
            entranceProgress={1.0}
          />
        )}
        {!isFinalCallback && storyFrame >= 684 && (
          <KurzgesagtCaptionPill
            text="WITHIN WEEKS THE ENTIRE PLANET FREEZES"
            color="#8fd8e6"
            entranceProgress={1.0}
          />
        )}
        {isFinalCallback && (
          <KurzgesagtCaptionPill
            text="ENJOY THE SUNSHINE WHILE IT LASTS"
            color="#ffd98a"
            entranceProgress={1.0}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
