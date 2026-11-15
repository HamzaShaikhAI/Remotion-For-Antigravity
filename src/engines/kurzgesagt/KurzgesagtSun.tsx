// src/engines/kurzgesagt/KurzgesagtSun.tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SunGranule } from './types';

export interface KurzgesagtSunProps {
  cx?: number;
  cy?: number;
  radius?: number;
  vanishTriggerFrame?: number; // Frame where the vanish sequence initiates
  isVanished?: boolean;
}

export const KurzgesagtSun: React.FC<KurzgesagtSunProps> = ({
  cx = 0,
  cy = 540,
  radius = 300,
  vanishTriggerFrame,
  isVanished = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rotation of ray wedges (slow majestic drift)
  const rayRotation = (frame / fps) * 6; // 6 degrees/sec

  // Generate 28 drifting glowing granules deterministically
  const granules: SunGranule[] = useMemo(() => {
    const list: SunGranule[] = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i * 2.399) % (Math.PI * 2);
      const distance = 0.15 + (i % 8) * 0.095;
      const size = 6 + (i % 5) * 4;
      const driftSpeed = 0.02 + (i % 6) * 0.01;
      const phase = (i * 1.71) % (Math.PI * 2);
      list.push({ id: i, angle, distance, size, driftSpeed, phase });
    }
    return list;
  }, []);

  // Vanish physics sequence:
  // 1. Swells 6% for 0.22s (~7 frames @ 30fps)
  // 2. Collapses to 0 in 0.33s (~10 frames)
  // 3. White flash + expanding shockwave ring
  let currentRadius = radius;
  let sunOpacity = 1.0;
  let flashOpacity = 0.0;
  let shockwaveRadius = 0;
  let shockwaveOpacity = 0;

  if (vanishTriggerFrame !== undefined && frame >= vanishTriggerFrame) {
    const t = frame - vanishTriggerFrame;
    const swellFrames = Math.round(0.22 * fps); // ~7 frames
    const collapseFrames = Math.round(0.33 * fps); // ~10 frames

    if (t < swellFrames) {
      // Swell 6%
      const swellProgress = t / swellFrames;
      currentRadius = radius * (1.0 + 0.06 * Math.sin(swellProgress * Math.PI));
    } else if (t < swellFrames + collapseFrames) {
      // Collapse rapidly
      const collapseProgress = (t - swellFrames) / collapseFrames;
      const easedCollapse = collapseProgress * collapseProgress * collapseProgress;
      currentRadius = radius * 1.06 * (1.0 - easedCollapse);
      if (currentRadius < 0) currentRadius = 0;
    } else {
      currentRadius = 0;
      sunOpacity = 0;
    }

    // Flash & shockwave triggers at the collapse moment (swellFrames + collapseFrames)
    const flashStart = swellFrames + collapseFrames;
    if (t >= flashStart && t < flashStart + 30) {
      const shockT = t - flashStart;
      flashOpacity = interpolate(shockT, [0, 2, 8], [0, 0.9, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      shockwaveRadius = interpolate(shockT, [0, 30], [radius * 0.5, radius * 3.5]);
      shockwaveOpacity = interpolate(shockT, [0, 30], [0.85, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  } else if (isVanished) {
    currentRadius = 0;
    sunOpacity = 0;
  }

  // Ray wedges (18 count)
  const numRays = 18;
  const rayAngle = 360 / numRays;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1920 1080"
      >
        <defs>
          {/* Sun Core Radial Gradient with Offset Highlight */}
          <radialGradient
            id="sun-gradient"
            cx="42%"
            cy="42%"
            r="58%"
            fx="36%"
            fy="36%"
          >
            <stop offset="0%" stopColor="#fff7dc" />
            <stop offset="45%" stopColor="#ffc857" />
            <stop offset="100%" stopColor="#ff8f4a" />
          </radialGradient>

          {/* Halo Glow Filters */}
          <radialGradient id="halo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc857" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#ff8f4a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff8f4a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {sunOpacity > 0 && currentRadius > 0 && (
          <g transform={`translate(${cx}, ${cy})`} opacity={sunOpacity}>
            {/* 4 Additive Halo Rings at 2.1x, 1.76x, 1.48x, 1.23x */}
            <circle
              cx="0"
              cy="0"
              r={currentRadius * 2.1}
              fill="none"
              stroke="#ffc857"
              strokeWidth="28"
              opacity="0.08"
              style={{ mixBlendMode: 'screen' }}
            />
            <circle
              cx="0"
              cy="0"
              r={currentRadius * 1.76}
              fill="none"
              stroke="#ffc857"
              strokeWidth="20"
              opacity="0.12"
              style={{ mixBlendMode: 'screen' }}
            />
            <circle
              cx="0"
              cy="0"
              r={currentRadius * 1.48}
              fill="none"
              stroke="#ffd98a"
              strokeWidth="16"
              opacity="0.18"
              style={{ mixBlendMode: 'screen' }}
            />
            <circle
              cx="0"
              cy="0"
              r={currentRadius * 1.23}
              fill="none"
              stroke="#fff7dc"
              strokeWidth="12"
              opacity="0.25"
              style={{ mixBlendMode: 'screen' }}
            />

            {/* 18 Faint Rotating Ray Wedges */}
            <g transform={`rotate(${rayRotation})`}>
              {Array.from({ length: numRays }).map((_, i) => {
                const angle = i * rayAngle;
                return (
                  <path
                    key={i}
                    d={`M 0 0 L ${currentRadius * 2.4 * Math.cos(((angle - 4) * Math.PI) / 180)} ${
                      currentRadius * 2.4 * Math.sin(((angle - 4) * Math.PI) / 180)
                    } A ${currentRadius * 2.4} ${currentRadius * 2.4} 0 0 1 ${
                      currentRadius * 2.4 * Math.cos(((angle + 4) * Math.PI) / 180)
                    } ${currentRadius * 2.4 * Math.sin(((angle + 4) * Math.PI) / 180)} Z`}
                    fill="#ffc857"
                    opacity="0.06"
                    style={{ mixBlendMode: 'screen' }}
                  />
                );
              })}
            </g>

            {/* Sun Core Disc (No outline, clean pure gradient) */}
            <circle cx="0" cy="0" r={currentRadius} fill="url(#sun-gradient)" />

            {/* 28 Drifting Glowing Granules on Sun Surface */}
            {granules.map((g) => {
              const currentAngle = g.angle + (frame / fps) * g.driftSpeed;
              const gx = currentRadius * g.distance * Math.cos(currentAngle);
              const gy = currentRadius * g.distance * Math.sin(currentAngle);
              const granulePulse =
                0.65 + 0.35 * Math.sin((frame / fps) * 3 + g.phase);

              return (
                <circle
                  key={g.id}
                  cx={gx}
                  cy={gy}
                  r={g.size * (currentRadius / radius)}
                  fill="#ffffff"
                  opacity={granulePulse * 0.45}
                  style={{ mixBlendMode: 'overlay' }}
                />
              );
            })}
          </g>
        )}

        {/* Shockwave Ring on Collapse */}
        {shockwaveOpacity > 0 && (
          <g transform={`translate(${cx}, ${cy})`}>
            <circle
              cx="0"
              cy="0"
              r={shockwaveRadius}
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
              opacity={shockwaveOpacity}
            />
            <circle
              cx="0"
              cy="0"
              r={shockwaveRadius * 0.85}
              fill="none"
              stroke="#ffc857"
              strokeWidth="12"
              opacity={shockwaveOpacity * 0.5}
            />
          </g>
        )}

        {/* White Flash Overlay */}
        {flashOpacity > 0 && (
          <rect
            x="0"
            y="0"
            width="1920"
            height="1080"
            fill="#ffffff"
            opacity={flashOpacity}
          />
        )}
      </svg>
    </div>
  );
};
