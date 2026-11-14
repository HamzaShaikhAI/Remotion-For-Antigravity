import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CanvasEffectsMatrix } from '../engines/effects/CanvasEffectsMatrix';
import { getDeterministicCameraShake } from '../engines/effects/noise';

export const CyberpunkFpvDive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- ACT 1: VERTICAL DIVE (Frames 0 - 95) ---
  const diveScale = interpolate(frame, [0, 95], [1.0, 2.3], {
    extrapolateRight: 'clamp',
  });
  const diveOpacity = interpolate(frame, [75, 95], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- ACT 2: 90-DEGREE DRIFT CORNER (Frames 85 - 175) ---
  const turnScale = interpolate(frame, [85, 175], [1.1, 2.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const turnRotation = interpolate(frame, [85, 125, 175], [0, -68, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const turnX = interpolate(frame, [85, 130, 175], [150, -180, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const turnOpacity = interpolate(frame, [85, 95, 155, 175], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- ACT 3: NIGHT MARKET INFILTRATION (Frames 165 - 240) ---
  const marketScale = interpolate(frame, [165, 240], [1.0, 1.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const marketOpacity = interpolate(frame, [165, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera shake turbulence (peaks violently during the 90-degree corner drift)
  const shakeIntensity = interpolate(frame, [0, 85, 125, 175, 240], [4, 7, 16, 6, 3]);
  const shake = getDeterministicCameraShake(frame, shakeIntensity, 0.35);

  // Dynamic Telemetry Speed & Altitude Calculation
  const speedKmh = Math.round(interpolate(frame, [0, 90, 130, 240], [180, 342, 215, 290]));
  const altitudeM = Math.max(8, Math.round(interpolate(frame, [0, 95, 175, 240], [840, 210, 45, 12])));

  // Chromatic Aberration & Lens Glitch spikes on the drift apex (Frames 115-135)
  const vfxGlitch = interpolate(frame, [110, 125, 140], [0, 0.38, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chromaticIntensity = interpolate(frame, [0, 110, 125, 145, 240], [4, 6, 22, 6, 3]);

  // Procedural Rain Streaks across the camera lens (derived deterministically)
  const rainStreaks = Array.from({ length: 28 }, (_, i) => {
    const seedX = ((i * 179.3) % width);
    const speed = 25 + (i % 5) * 8;
    const currentY = ((frame * speed + i * 85) % (height + 200)) - 100;
    const length = 40 + (i % 4) * 25;
    const angle = interpolate(frame, [85, 130, 175], [15, -45, 10]); // Rain shifts with drone tilt

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${seedX}px`,
          top: `${currentY}px`,
          width: '2.5px',
          height: `${length}px`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(56,189,248,0.7) 70%, rgba(255,255,255,0.95) 100%)',
          transform: `rotate(${angle}deg)`,
          opacity: 0.65,
          filter: 'blur(0.4px)',
          pointerEvents: 'none',
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Procedural Audio Tracks */}
      <Audio src={staticFile('sfx/fpv_riser.wav')} startFrom={0} endAt={95} volume={0.85} />
      <Audio src={staticFile('sfx/fpv_whoosh.wav')} startFrom={10} endAt={180} volume={1.0} />
      <Audio src={staticFile('sfx/fpv_impact.wav')} startFrom={0} endAt={240} volume={0.9} />

      {/* Hardware-Accelerated Canvas Effects Matrix */}
      <CanvasEffectsMatrix
        effects={[
          { type: 'chromaticAberration', intensity: chromaticIntensity },
          { type: 'barrelDistortion', intensity: 0.08 },
          { type: 'scanlines', intensity: 0.12 },
          { type: 'vhsGlitch', intensity: vfxGlitch },
          { type: 'filmGrain', intensity: 0.05 },
        ]}
      >
        <AbsoluteFill
          style={{
            transform: `translate3d(${shake.x}px, ${shake.y}px, 0) rotate(${shake.rotation}deg)`,
          }}
        >
          {/* SCENE 1: VERTICAL DIVE */}
          <AbsoluteFill style={{ opacity: diveOpacity }}>
            <Img
              src={staticFile('cyberpunk/alley_dive.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${diveScale})`,
                transformOrigin: '50% 50%',
              }}
            />
          </AbsoluteFill>

          {/* SCENE 2: 90-DEGREE DRIFT CORNER */}
          <AbsoluteFill style={{ opacity: turnOpacity }}>
            <Img
              src={staticFile('cyberpunk/corner_turn.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate3d(${turnX}px, 0, 0) scale(${turnScale}) rotate(${turnRotation}deg)`,
                transformOrigin: '55% 45%',
              }}
            />
          </AbsoluteFill>

          {/* SCENE 3: NIGHT MARKET INFILTRATION */}
          <AbsoluteFill style={{ opacity: marketOpacity }}>
            <Img
              src={staticFile('cyberpunk/night_market.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${marketScale})`,
                transformOrigin: '50% 60%',
              }}
            />
          </AbsoluteFill>

          {/* TRANSITORY ANAMORPHIC NEON GLARE */}
          <AbsoluteFill
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.15) 0%, rgba(217,70,239,0.1) 40%, transparent 75%)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />

          {/* RAIN DROPLETS ON LENS LAYER */}
          <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {rainStreaks}
          </AbsoluteFill>

          {/* CYBERPUNK FPV RACING HUD OVERLAY */}
          <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {/* Top Left: Drone ID & Mode */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 50,
                fontFamily: 'monospace',
                fontSize: 18,
                color: '#38bdf8',
                textShadow: '0 0 10px #0284c7',
                letterSpacing: 2,
              }}
            >
              <div>SYS.FPV // APEX-09</div>
              <div style={{ color: '#a855f7', fontSize: 14 }}>MODE: ACRO [HYPERSPEED]</div>
            </div>

            {/* Top Right: Telemetry Battery & Link */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                right: 50,
                textAlign: 'right',
                fontFamily: 'monospace',
                fontSize: 18,
                color: '#22c55e',
                textShadow: '0 0 10px #16a34a',
                letterSpacing: 1,
              }}
            >
              <div>98.4 FPS // LATENCY: 2MS</div>
              <div style={{ color: '#eab308', fontSize: 14 }}>FREQ: 5.8GHZ // SIGNAL: 99%</div>
            </div>

            {/* Center: Dynamic Artificial Horizon & Reticle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${turnRotation * 0.4}deg)`,
                width: 140,
                height: 140,
                border: '1.5px solid rgba(56, 189, 248, 0.45)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 10, height: 1.5, background: '#38bdf8' }} />
              <div style={{ width: 1.5, height: 10, background: '#38bdf8' }} />
              {/* Pitch ticks */}
              <div
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 1,
                  background: 'rgba(56, 189, 248, 0.6)',
                  top: 45,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 1,
                  background: 'rgba(56, 189, 248, 0.6)',
                  bottom: 45,
                }}
              />
            </div>

            {/* Bottom Bar: Telemetry Speed, Altitude & Warning */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: 50,
                right: 50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontFamily: 'monospace',
              }}
            >
              {/* Speedometer */}
              <div style={{ color: '#f43f5e', textShadow: '0 0 12px #e11d48' }}>
                <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{speedKmh}</div>
                <div style={{ fontSize: 13, color: '#fda4af', letterSpacing: 2 }}>KM/H AIRSPEED</div>
              </div>

              {/* Status Indicator */}
              <div style={{ textAlign: 'center' }}>
                {frame > 85 && frame < 155 ? (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '6px 18px',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: 2,
                      boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    ⚠ 90° VECTOR DRIFT
                  </div>
                ) : frame >= 155 ? (
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid #22c55e',
                      color: '#4ade80',
                      padding: '6px 18px',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: 2,
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    ✔ NIGHT MARKET SECTOR REACHED
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid #38bdf8',
                      color: '#7dd3fc',
                      padding: '6px 18px',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: 2,
                    }}
                  >
                    VERTICAL ALLEY DIVE
                  </div>
                )}
              </div>

              {/* Altimeter */}
              <div style={{ textAlign: 'right', color: '#38bdf8', textShadow: '0 0 12px #0284c7' }}>
                <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{altitudeM}M</div>
                <div style={{ fontSize: 13, color: '#7dd3fc', letterSpacing: 2 }}>BARO ALTITUDE</div>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </CanvasEffectsMatrix>
    </AbsoluteFill>
  );
};
