import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { UniversalResponsiveContainer } from '../engines/multiformat/UniversalResponsiveContainer';

// =====================================================================
// RICKS CLIPS 2.5D CARTOON CHARACTER COMPONENT
// Flat 2D simple cut-out character with contact shadows in 3D environment
// =====================================================================
interface RicksCharacterProps {
  frame: number;
  scale?: number;
  speaking?: boolean;
  pose?: 'standing' | 'dragging' | 'screaming' | 'pointing';
  x?: number;
  y?: number;
}

export const RicksCharacter: React.FC<RicksCharacterProps> = ({
  frame,
  scale = 1,
  speaking = true,
  pose = 'standing',
  x = 0,
  y = 0,
}) => {
  // Breathing & slight idle sway
  const breathe = Math.sin(frame * 0.12) * 3;
  const blink = (frame % 85 > 78) ? 0.1 : 1;
  const mouthOpen = speaking ? Math.abs(Math.sin(frame * 0.45)) * 6 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -100%) translateY(${breathe}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {/* 2D Cutout Figure Container */}
      <div
        style={{
          width: 140 * scale,
          height: 320 * scale,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Perfectly Round White Head */}
        <div
          style={{
            width: 86 * scale,
            height: 86 * scale,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: `${2.8 * scale}px solid #111827`,
            position: 'relative',
            zIndex: 10,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          {/* Left Eye */}
          <div
            style={{
              position: 'absolute',
              top: 36 * scale,
              left: 24 * scale,
              width: 7 * scale,
              height: 7 * scale * blink,
              borderRadius: '50%',
              backgroundColor: '#111827',
            }}
          />
          {/* Right Eye */}
          <div
            style={{
              position: 'absolute',
              top: 36 * scale,
              right: 24 * scale,
              width: 7 * scale,
              height: 7 * scale * blink,
              borderRadius: '50%',
              backgroundColor: '#111827',
            }}
          />
          {/* Simple Mouth */}
          <div
            style={{
              position: 'absolute',
              bottom: 22 * scale,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16 * scale,
              height: (speaking ? 4 + mouthOpen : 3) * scale,
              borderRadius: speaking ? '0 0 10px 10px' : '2px',
              backgroundColor: speaking ? '#991b1b' : '#111827',
              border: `${1.5 * scale}px solid #111827`,
            }}
          />
        </div>

        {/* Neck */}
        <div
          style={{
            width: 12 * scale,
            height: 8 * scale,
            backgroundColor: '#ffffff',
            borderLeft: `${2.5 * scale}px solid #111827`,
            borderRight: `${2.5 * scale}px solid #111827`,
            marginTop: -2 * scale,
          }}
        />

        {/* Torso with Plain Simple Clothes */}
        <div
          style={{
            width: 68 * scale,
            height: 110 * scale,
            backgroundColor: '#334155', // Plain dark slate tunic
            border: `${2.8 * scale}px solid #111827`,
            borderRadius: `${6 * scale}px`,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Simple Tunic Collar */}
          <div
            style={{
              width: 24 * scale,
              height: 14 * scale,
              borderBottom: `${2 * scale}px solid #111827`,
              borderLeft: `${2 * scale}px solid #111827`,
              borderRight: `${2 * scale}px solid #111827`,
              borderRadius: '0 0 8px 8px',
            }}
          />

          {/* Left Arm */}
          <div
            style={{
              position: 'absolute',
              top: 4 * scale,
              left: -16 * scale,
              width: 18 * scale,
              height: 85 * scale,
              backgroundColor: '#334155',
              border: `${2.5 * scale}px solid #111827`,
              borderRadius: 10 * scale,
              transform: pose === 'screaming' ? 'rotate(-60deg)' : 'rotate(8deg)',
              transformOrigin: 'top center',
            }}
          />
          {/* Right Arm */}
          <div
            style={{
              position: 'absolute',
              top: 4 * scale,
              right: -16 * scale,
              width: 18 * scale,
              height: 85 * scale,
              backgroundColor: '#334155',
              border: `${2.5 * scale}px solid #111827`,
              borderRadius: 10 * scale,
              transform: pose === 'screaming' ? 'rotate(60deg)' : pose === 'pointing' ? 'rotate(-45deg)' : 'rotate(-8deg)',
              transformOrigin: 'top center',
            }}
          />
        </div>

        {/* Legs & Plain Shoes */}
        <div style={{ display: 'flex', gap: 14 * scale, marginTop: -2 * scale }}>
          <div
            style={{
              width: 18 * scale,
              height: 90 * scale,
              backgroundColor: '#1e293b',
              border: `${2.5 * scale}px solid #111827`,
              borderRadius: '0 0 6px 6px',
            }}
          />
          <div
            style={{
              width: 18 * scale,
              height: 90 * scale,
              backgroundColor: '#1e293b',
              border: `${2.5 * scale}px solid #111827`,
              borderRadius: '0 0 6px 6px',
            }}
          />
        </div>
      </div>

      {/* Realistic Soft Contact Shadow on Floor */}
      <div
        style={{
          width: 160 * scale,
          height: 24 * scale,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)',
          marginTop: -10 * scale,
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

// =====================================================================
// 3D HERO PROP: ANCIENT BRONZE SEISMOSCOPE JAR (Zhang Heng 132 AD)
// Rich 3D shading, 8 Dragons holding balls, 8 Frogs, and pendulum core
// =====================================================================
interface SeismoscopeProps {
  frame: number;
  scale?: number;
  ballsDroppedCount?: number;
  showCrossSection?: boolean;
  x?: number;
  y?: number;
}

export const BronzeSeismoscope: React.FC<SeismoscopeProps> = ({
  frame,
  scale = 1,
  ballsDroppedCount = 0,
  showCrossSection = false,
  x = 0,
  y = 0,
}) => {
  // Pendulum swing oscillation
  const pendulumSwing = Math.sin(frame * 0.15) * (showCrossSection ? 22 : 4);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 40,
      }}
    >
      {/* 3D Vessel Container */}
      <div
        style={{
          position: 'relative',
          width: 380 * scale,
          height: 480 * scale,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'drop-shadow(0 35px 45px rgba(0, 0, 0, 0.6))',
        }}
      >
        {/* Main Bronze Urn Body */}
        <div
          style={{
            position: 'absolute',
            width: 320 * scale,
            height: 420 * scale,
            borderRadius: '50% 50% 45% 45% / 35% 35% 65% 65%',
            background: showCrossSection
              ? 'linear-gradient(90deg, #451a03 0%, #1e293b 40%, #0f172a 60%, #451a03 100%)'
              : 'radial-gradient(circle at 35% 30%, #fde047 0%, #d97706 25%, #92400e 60%, #451a03 100%)',
            boxShadow: 'inset 0 10px 25px rgba(254, 240, 138, 0.6), inset 0 -20px 40px rgba(0,0,0,0.8)',
            border: `${4 * scale}px solid #b45309`,
            overflow: 'hidden',
          }}
        >
          {/* Ancient Inscribed Cloud & Dragon Texture Bands */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: 0,
              right: 0,
              height: 24 * scale,
              borderTop: '2px dashed #fef08a',
              borderBottom: '2px dashed #fef08a',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '65%',
              left: 0,
              right: 0,
              height: 36 * scale,
              borderTop: '3px solid #78350f',
              borderBottom: '3px solid #78350f',
              opacity: 0.5,
            }}
          />

          {/* CROSS-SECTION VIEW: SUSPENDED HEAVY PENDULUM & RODS */}
          {showCrossSection && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center' }}>
              {/* Central Suspension Cable */}
              <div
                style={{
                  position: 'absolute',
                  top: 20 * scale,
                  width: 3 * scale,
                  height: 180 * scale,
                  backgroundColor: '#f59e0b',
                  transform: `rotate(${pendulumSwing}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Heavy Bronze Pendulum Bob */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                    width: 75 * scale,
                    height: 75 * scale,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #fde047 0%, #b45309 60%, #451a03 100%)',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
                  }}
                />
              </div>

              {/* 8 Radial Trigger Rods */}
              {[-65, -35, -10, 10, 35, 65].map((angle, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: 210 * scale,
                    width: 140 * scale,
                    height: 4 * scale,
                    backgroundColor: '#d97706',
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'left center',
                    boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Golden Dragons on Perimeter (Left and Right profiles) */}
        {[-140, 140].map((dragX, i) => {
          const isLeft = dragX < 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 140 * scale,
                left: `calc(50% + ${dragX * scale}px)`,
                transform: `translateX(-50%) scaleX(${isLeft ? 1 : -1})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Sculpted Golden Dragon Head */}
              <div
                style={{
                  width: 50 * scale,
                  height: 38 * scale,
                  background: 'linear-gradient(135deg, #fde047 0%, #b45309 100%)',
                  borderRadius: '16px 24px 6px 6px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Dragon Red Specular Eye */}
                <div style={{ position: 'absolute', top: 8 * scale, right: 12 * scale, width: 6 * scale, height: 6 * scale, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                
                {/* Dragon Jaws holding bronze ball */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -16 * scale,
                    width: 22 * scale,
                    height: 22 * scale,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #ca8a04 50%, #451a03 100%)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
                    opacity: ballsDroppedCount > i ? 0 : 1, // Drops when triggered
                    transition: 'opacity 0.2s ease',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* 8 Open-Mouthed Bronze Frogs around Base */}
        <div
          style={{
            position: 'absolute',
            bottom: -30 * scale,
            display: 'flex',
            gap: 55 * scale,
            zIndex: 10,
          }}
        >
          {[-1, 0, 1].map((frogIdx) => (
            <div
              key={frogIdx}
              style={{
                width: 55 * scale,
                height: 48 * scale,
                borderRadius: '50% 50% 20% 20%',
                background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #a16207 60%, #451a03 100%)',
                boxShadow: '0 8px 14px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Open Frog Mouth Catching the Ball */}
              <div
                style={{
                  position: 'absolute',
                  top: 10 * scale,
                  width: 28 * scale,
                  height: 16 * scale,
                  borderRadius: '50%',
                  backgroundColor: '#1c1917',
                  border: `${2 * scale}px solid #78350f`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Fallen Bronze Ball sitting in mouth */}
                {ballsDroppedCount > 0 && (
                  <div
                    style={{
                      width: 18 * scale,
                      height: 18 * scale,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #fde047 0%, #b45309 100%)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.8)',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Prop Soft Ground Shadow */}
      <div
        style={{
          width: 440 * scale,
          height: 50 * scale,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 80%)',
          marginTop: -10 * scale,
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
};

// =====================================================================
// NARRATION SEGMENTS DATA (17 SCENES, 1950 FRAMES @ 30FPS = 65.0s)
// =====================================================================
export const SEISMO_BEATS = [
  { id: 'seismo_01', start: 0, dur: 143, text: "He put a bronze ball in a dragon's mouth and told the emperor if this ever falls out, run.", env: 'THRONE_ROOM', audioSrc: staticFile('audio/seismo_paced/seismo_01.wav') },
  { id: 'seismo_02', start: 143, dur: 61, text: "The whole court burst out laughing.", env: 'COURT_LAUGH', audioSrc: staticFile('audio/seismo_paced/seismo_02.wav') },
  { id: 'seismo_03', start: 204, dur: 179, text: "You see, there were eight dragons coiled around a giant bronze jar, each holding a ball over a frog's open mouth.", env: 'SEISMO_HERO', audioSrc: staticFile('audio/seismo_paced/seismo_03.wav') },
  { id: 'seismo_04', start: 383, dur: 122, text: "But the emperor had the biggest army in the world and he wasn't about to run from a jar.", env: 'EMPEROR_ARMY', audioSrc: staticFile('audio/seismo_paced/seismo_04.wav') },
  { id: 'seismo_05', start: 505, dur: 165, text: "Weeks later, a ball fell, but nothing happened. Not even a ripple in the emperor's wine.", env: 'WINE_CUP', audioSrc: staticFile('audio/seismo_paced/seismo_05.wav') },
  { id: 'seismo_06', start: 670, dur: 54, text: "Now they laughed even harder.", env: 'COURT_LAUGH_2', audioSrc: staticFile('audio/seismo_paced/seismo_06.wav') },
  { id: 'seismo_07', start: 724, dur: 151, text: "The emperor called it the world's most expensive toy and threw the inventor out of the city, jar and all.", env: 'EXPELLED', audioSrc: staticFile('audio/seismo_paced/seismo_07.wav') },
  { id: 'seismo_08', start: 875, dur: 98, text: "So he dragged it up a hill outside the walls and lived there alone.", env: 'MOONLIT_HILL', audioSrc: staticFile('audio/seismo_paced/seismo_08.wav') },
  { id: 'seismo_09', start: 973, dur: 138, text: "Then one night a ball dropped. Then another. Then all eight at once.", env: 'NIGHT_DROP', audioSrc: staticFile('audio/seismo_paced/seismo_09.wav') },
  { id: 'seismo_10', start: 1111, dur: 89, text: "He ran to the city gates screaming for everyone to get out.", env: 'GATES_RUN', audioSrc: staticFile('audio/seismo_paced/seismo_10.wav') },
  { id: 'seismo_11', start: 1200, dur: 119, text: "“Hey, it's the toy guy. Did your frogs get hungry again?”", env: 'GUARDS_MOCK', audioSrc: staticFile('audio/seismo_paced/seismo_11.wav') },
  { id: 'seismo_12', start: 1319, dur: 76, text: "The guards laughed him all the way back up the hill.", env: 'GUARDS_LAUGH', audioSrc: staticFile('audio/seismo_paced/seismo_12.wav') },
  { id: 'seismo_13', start: 1395, dur: 76, text: "The next morning the palace was a pile of rubble.", env: 'PALACE_RUBBLE', audioSrc: staticFile('audio/seismo_paced/seismo_13.wav') },
  { id: 'seismo_14', start: 1471, dur: 107, text: "Inside the jar hung a heavy pendulum with a rod pointing at each dragon.", env: 'CROSS_SECTION', audioSrc: staticFile('audio/seismo_paced/seismo_14.wav') },
  { id: 'seismo_15', start: 1578, dur: 176, text: "The slightest nudge and the pendulum swung into a rod. The rod snapped the dragon's jaw open and the ball dropped.", env: 'PENDULUM_TRIGGER', audioSrc: staticFile('audio/seismo_paced/seismo_15.wav') },
  { id: 'seismo_16', start: 1754, dur: 67, text: "One ball meant a nudge from far away.", env: 'FAR_EARTHQUAKE', audioSrc: staticFile('audio/seismo_paced/seismo_16.wav') },
  { id: 'seismo_17', start: 1821, dur: 129, text: "All eight meant the biggest earthquake the empire had ever seen was right underneath them.", env: 'CLIMAX_THRONE', audioSrc: staticFile('audio/seismo_paced/seismo_17.wav') },
];

// =====================================================================
// MAIN 2.5D SHORTS COMPOSITION
// =====================================================================
export const ZhangHengSeismoscopeShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active narrative beat
  const activeBeat = useMemo(() => {
    for (let i = SEISMO_BEATS.length - 1; i >= 0; i--) {
      if (frame >= SEISMO_BEATS[i].start) return SEISMO_BEATS[i];
    }
    return SEISMO_BEATS[0];
  }, [frame]);

  // Subtle camera push-in
  const cameraZoom = 1 + (frame / 1950) * 0.08;

  // Ball drop physics count
  const ballsDropped = useMemo(() => {
    if (frame >= 1050) return 8; // All eight at once
    if (frame >= 1010) return 2; // Then another
    if (frame >= 973) return 1;  // Then one night a ball dropped
    if (frame >= 505 && frame < 724) return 1; // Weeks later a ball fell
    return 0;
  }, [frame]);

  // Screen shake on night earthquake climax (Frames 973–1110)
  const shakeX = (frame >= 973 && frame <= 1110) ? Math.sin(frame * 1.8) * 8 : 0;
  const shakeY = (frame >= 973 && frame <= 1110) ? Math.cos(frame * 2.1) * 6 : 0;

  return (
    <UniversalResponsiveContainer>
      <AbsoluteFill
        style={{
          width: 1080,
          height: 1920,
          backgroundColor: '#0a0d14',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: '#ffffff',
          transform: `scale(${cameraZoom}) translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* ------------------------------------------------------------- */}
        {/* AUDIO ENGINE: SYNCHRONIZED NARRATION & SOUND DESIGN           */}
        {/* ------------------------------------------------------------- */}
        {/* Soft Dramatic Low-Frequency Cinematic Ambient Drone */}
        <Audio src={staticFile('audio/one_conversation_score.wav')} volume={0.35} />

        {/* 17 Frame-Accurate Paced Narration Stems */}
        {SEISMO_BEATS.map((beat) => (
          <Sequence key={beat.id} from={beat.start} durationInFrames={beat.dur}>
            <Audio src={beat.audioSrc} volume={1.0} />
          </Sequence>
        ))}

        {/* Diegetic Metallic Impact Clangs on Ball Drops */}
        <Sequence from={515} durationInFrames={40}>
          <Audio src={staticFile('sfx/clash.wav')} volume={0.8} />
        </Sequence>
        <Sequence from={980} durationInFrames={45}>
          <Audio src={staticFile('sfx/clash.wav')} volume={0.85} />
        </Sequence>
        <Sequence from={1055} durationInFrames={60}>
          <Audio src={staticFile('sfx/fpv_impact.wav')} volume={1.0} />
        </Sequence>

        {/* ------------------------------------------------------------- */}
        {/* RICH 3D ENVIRONMENT 1: IMPERIAL THRONE ROOM (Warm Reds/Golds) */}
        {/* ------------------------------------------------------------- */}
        {(activeBeat.env === 'THRONE_ROOM' || activeBeat.env === 'EMPEROR_ARMY' || activeBeat.env === 'CLIMAX_THRONE') && (
          <AbsoluteFill style={{ zIndex: 1 }}>
            {/* Rich Imperial Red Gradient Wall */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 35%, #7f1d1d 0%, #450a0a 60%, #1c0505 100%)',
              }}
            />

            {/* Carved Gold Imperial Dragon Pillars */}
            <div style={{ position: 'absolute', top: 0, bottom: 400, left: 60, width: 80, background: 'linear-gradient(90deg, #78350f 0%, #f59e0b 50%, #451a03 100%)', borderRadius: '0 0 12px 12px', boxShadow: '15px 0 30px rgba(0,0,0,0.6)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 400, right: 60, width: 80, background: 'linear-gradient(90deg, #451a03 0%, #f59e0b 50%, #78350f 100%)', borderRadius: '0 0 12px 12px', boxShadow: '-15px 0 30px rgba(0,0,0,0.6)' }} />

            {/* Polished Lacquered Imperial Wooden Floor */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 600,
                background: 'linear-gradient(180deg, #1c0505 0%, #291b0c 40%, #0f0a05 100%)',
                borderTop: '6px solid #d97706',
                boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.8)',
              }}
            />

            {/* Volumetric Lantern Light Rays */}
            <div
              style={{
                position: 'absolute',
                top: -100,
                left: '20%',
                width: 600,
                height: 1200,
                background: 'conic-gradient(from 160deg at 50% 0%, rgba(254, 240, 138, 0.15) 0deg, transparent 40deg)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />
          </AbsoluteFill>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ENVIRONMENT 2: HERO BRONZE SEISMOSCOPE STAGE                   */}
        {/* ------------------------------------------------------------- */}
        {(activeBeat.env === 'SEISMO_HERO' || activeBeat.env === 'WINE_CUP') && (
          <AbsoluteFill style={{ zIndex: 1 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 45%, #451a03 0%, #1c0a02 70%, #080301 100%)',
              }}
            />
            {/* Cinematic Warm Film-Crew Studio Lighting Spotlight */}
            <div
              style={{
                position: 'absolute',
                top: 200,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 700,
                height: 700,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(254, 215, 170, 0.25) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </AbsoluteFill>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ENVIRONMENT 3: MOONLIT HILL OUTSIDE THE CITY WALLS            */}
        {/* ------------------------------------------------------------- */}
        {(activeBeat.env === 'EXPELLED' || activeBeat.env === 'MOONLIT_HILL' || activeBeat.env === 'NIGHT_DROP' || activeBeat.env === 'GATES_RUN' || activeBeat.env === 'GUARDS_MOCK' || activeBeat.env === 'GUARDS_LAUGH') && (
          <AbsoluteFill style={{ zIndex: 1 }}>
            {/* Deep Dark Blue Night Sky */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
              }}
            />

            {/* Glowing Full Moon */}
            <div
              style={{
                position: 'absolute',
                top: 180,
                right: 140,
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 70%, #94a3b8 100%)',
                boxShadow: '0 0 50px rgba(255, 255, 255, 0.5), 0 0 100px rgba(56, 189, 248, 0.25)',
              }}
            />

            {/* Ancient Stone City Wall Silhouettes */}
            <div
              style={{
                position: 'absolute',
                bottom: 500,
                left: 0,
                right: 0,
                height: 350,
                backgroundColor: '#090d16',
                clipPath: 'polygon(0% 20%, 30% 15%, 30% 0%, 45% 0%, 45% 15%, 70% 10%, 70% 0%, 85% 0%, 85% 10%, 100% 18%, 100% 100%, 0% 100%)',
              }}
            />

            {/* Moonlit Grassy Hill Slope */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: -100,
                right: -100,
                height: 650,
                borderRadius: '50% 50% 0 0 / 25% 25% 0 0',
                background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
                boxShadow: '0 -15px 30px rgba(0,0,0,0.8)',
              }}
            />
          </AbsoluteFill>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ENVIRONMENT 4: DESTROYED PALACE RUBBLE THE NEXT MORNING       */}
        {/* ------------------------------------------------------------- */}
        {activeBeat.env === 'PALACE_RUBBLE' && (
          <AbsoluteFill style={{ zIndex: 1 }}>
            {/* Pale Smoky Daylight Sky */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #94a3b8 0%, #64748b 40%, #334155 100%)',
              }}
            />

            {/* Rising Dust and Smoke Plumes */}
            <div
              style={{
                position: 'absolute',
                bottom: 400,
                left: '20%',
                width: 600,
                height: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            {/* Fallen Columns & Broken Masonry Rubble Pile */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 700,
                background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                clipPath: 'polygon(0% 40%, 15% 30%, 35% 55%, 55% 25%, 75% 45%, 100% 30%, 100% 100%, 0% 100%)',
              }}
            />
          </AbsoluteFill>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ENVIRONMENT 5: INTERNAL MECHANISM (Technical Cross-Section)   */}
        {/* ------------------------------------------------------------- */}
        {(activeBeat.env === 'CROSS_SECTION' || activeBeat.env === 'PENDULUM_TRIGGER' || activeBeat.env === 'FAR_EARTHQUAKE') && (
          <AbsoluteFill style={{ zIndex: 1 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 70%, #020617 100%)',
              }}
            />
            {/* Holographic Technical Blueprint Grid */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </AbsoluteFill>
        )}

        {/* ------------------------------------------------------------- */}
        {/* HERO PROP: 3D BRONZE SEISMOSCOPE DISPLAY                      */}
        {/* ------------------------------------------------------------- */}
        <BronzeSeismoscope
          frame={frame}
          scale={activeBeat.env === 'SEISMO_HERO' || activeBeat.env === 'CROSS_SECTION' ? 1.45 : 1.1}
          ballsDroppedCount={ballsDropped}
          showCrossSection={activeBeat.env === 'CROSS_SECTION' || activeBeat.env === 'PENDULUM_TRIGGER'}
          x={540}
          y={activeBeat.env === 'CROSS_SECTION' ? 950 : 1080}
        />

        {/* ------------------------------------------------------------- */}
        {/* 2D CUTOUT CHARACTER: RICKS CLIPS NARRATOR / INVENTOR          */}
        {/* ------------------------------------------------------------- */}
        <RicksCharacter
          frame={frame}
          scale={activeBeat.env === 'THRONE_ROOM' || activeBeat.env === 'CLIMAX_THRONE' ? 1.4 : 1.15}
          speaking={true}
          pose={activeBeat.env === 'GATES_RUN' ? 'screaming' : activeBeat.env === 'EXPELLED' ? 'dragging' : 'standing'}
          x={activeBeat.env === 'THRONE_ROOM' || activeBeat.env === 'CLIMAX_THRONE' ? 540 : 280}
          y={1550}
        />

        {/* ------------------------------------------------------------- */}
        {/* DYNAMIC VIRAL CAPTIONS (Clean White Text on Black Pill)        */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            bottom: 300, // Enforces 280px+ TikTok/Shorts bottom safe clearance
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 90,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 24,
              padding: '16px 32px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
              maxWidth: 920,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {activeBeat.text}
            </span>
          </div>
        </div>

        {/* Top Channel Pill Header */}
        <div
          style={{
            position: 'absolute',
            top: 75,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 30,
            padding: '8px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 90,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#f8fafc', textTransform: 'uppercase' }}>
            ANCIENT ENGINEERING · 132 AD
          </span>
        </div>
      </AbsoluteFill>
    </UniversalResponsiveContainer>
  );
};
