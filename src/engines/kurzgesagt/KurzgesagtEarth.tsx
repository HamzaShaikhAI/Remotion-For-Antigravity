// src/engines/kurzgesagt/KurzgesagtEarth.tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { EarthRenderProps } from './types';

export const KurzgesagtEarth: React.FC<EarthRenderProps> = ({
  radius = 180,
  tiltRad = 0.26, // ~14.9 degrees
  spinDegPerSec = 0.55,
  sunPosition = { x: 0, y: 540 },
  darknessProgress = 0, // 0 = lit by sun, 1 = total night
  temperatureC = 15,
  frostProgress = 0,
  frame: overrideFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;

  const tiltDeg = (tiltRad * 180) / Math.PI;
  const rotationDeg = (frame / fps) * spinDegPerSec * 20; // scaled for noticeable orbital spin

  // Generate ~380 deterministic city lights on the night side
  const cityLights = useMemo(() => {
    const lights: { x: number; y: number; brightness: number }[] = [];
    for (let i = 0; i < 380; i++) {
      // Cluster mainly across Northern hemisphere land masses (0.2 to 0.7 radius)
      const angle = (i * 1.618) % (Math.PI * 2);
      const r = 20 + ((i * 37) % (radius * 0.85));
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle) * 0.7 - radius * 0.1; // slight north bias
      const brightness = 0.4 + (i % 5) * 0.15;
      lights.push({ x, y, brightness });
    }
    return lights;
  }, [radius]);

  // Capsule clouds array
  const clouds = useMemo(() => {
    return [
      { x: -0.4, y: -0.3, w: 0.35, h: 0.08, speed: 1.2 },
      { x: 0.1, y: -0.15, w: 0.45, h: 0.1, speed: 0.9 },
      { x: -0.3, y: 0.2, w: 0.5, h: 0.09, speed: 1.1 },
      { x: 0.2, y: 0.4, w: 0.3, h: 0.07, speed: 0.8 },
    ];
  }, []);

  // Night shadow terminator position based on sun and darknessProgress
  // Sun is to the left (x = 0), so Earth's left side is lit, right side is dark
  const terminatorOffset = (1.0 - darknessProgress) * 0.4 - 0.2; // shifts as darkness sweeps

  return (
    <div
      style={{
        position: 'relative',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        width={radius * 2.6}
        height={radius * 2.6}
        viewBox={`${-radius * 1.3} ${-radius * 1.3} ${radius * 2.6} ${radius * 2.6}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Atmosphere Outer Glow (Stronger on sunward lit side) */}
          <radialGradient id="atmo-glow" cx="40%" cy="50%" r="55%">
            <stop offset="70%" stopColor="#38bdf8" stopOpacity={0.35 * (1 - darknessProgress * 0.6)} />
            <stop offset="90%" stopColor="#0284c7" stopOpacity={0.15 * (1 - darknessProgress * 0.6)} />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>

          {/* Ocean Base Gradient (#4dc7eb to #1a66b8) */}
          <radialGradient id="ocean-grad" cx="42%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#4dc7eb" />
            <stop offset="65%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1a66b8" />
          </radialGradient>

          {/* Sphere Clip Path */}
          <clipPath id="earth-sphere-clip">
            <circle cx="0" cy="0" r={radius} />
          </clipPath>

          {/* Terminator Night Shadow Gradient with Coral Twilight Band */}
          <linearGradient
            id="night-terminator"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientTransform={`rotate(${-tiltDeg})`}
          >
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset={`${Math.max(10, (0.45 + terminatorOffset) * 100)}%`} stopColor="transparent" stopOpacity="0" />
            {/* Coral band on terminator */}
            <stop offset={`${Math.min(85, (0.52 + terminatorOffset) * 100)}%`} stopColor="#f87171" stopOpacity={0.28 * (1 - darknessProgress)} />
            {/* Deep Navy night side */}
            <stop offset={`${Math.min(95, (0.62 + terminatorOffset) * 100)}%`} stopColor="#050c18" stopOpacity={0.94} />
            <stop offset="100%" stopColor="#030712" stopOpacity="0.98" />
          </linearGradient>

          {/* Frost Growth Gradient from Poles */}
          <radialGradient id="polar-frost" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={frostProgress * 0.9} />
            <stop offset="60%" stopColor="#e0f2fe" stopOpacity={frostProgress * 0.6} />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Outer Atmosphere Glow Halo */}
        <circle cx="0" cy="0" r={radius * 1.22} fill="url(#atmo-glow)" />

        {/* 2. Earth Sphere Body */}
        <g clipPath="url(#earth-sphere-clip)">
          {/* Base Ocean Sphere */}
          <circle cx="0" cy="0" r={radius} fill="url(#ocean-grad)" />

          {/* Rotating Continents & Landmasses with Axial Tilt */}
          <g transform={`rotate(${tiltDeg})`}>
            <g transform={`translate(${((rotationDeg * 2) % (radius * 3)) - radius * 1.5}, 0)`}>
              {/* Landmass Polygons across Longitude/Latitude */}
              {[-1, 0, 1].map((rep) => (
                <g key={rep} transform={`translate(${rep * radius * 2.8}, 0)`}>
                  {/* North Continent (Greenland/Eurasia) */}
                  <path
                    d={`M ${-radius * 0.6} ${-radius * 0.4} Q ${-radius * 0.2} ${-radius * 0.7} ${radius * 0.3} ${-radius * 0.45} Q ${radius * 0.7} ${-radius * 0.3} ${radius * 0.5} ${-radius * 0.1} Q ${0} ${-radius * 0.2} ${-radius * 0.4} ${-radius * 0.1} Z`}
                    fill="#5fc47a"
                  />
                  {/* Forest Patch (#48ad6b) */}
                  <path
                    d={`M ${-radius * 0.3} ${-radius * 0.42} Q ${0} ${-radius * 0.55} ${radius * 0.25} ${-radius * 0.35} Q ${radius * 0.1} ${-radius * 0.22} ${-radius * 0.2} ${-radius * 0.25} Z`}
                    fill="#48ad6b"
                  />

                  {/* Desert Patch (#f5c75f - Sahara/Middle East) */}
                  <path
                    d={`M ${-radius * 0.1} ${-radius * 0.05} Q ${radius * 0.25} ${-radius * 0.15} ${radius * 0.45} ${-radius * 0.02} Q ${radius * 0.35} ${radius * 0.15} ${radius * 0.0} ${radius * 0.12} Z`}
                    fill="#f5c75f"
                  />

                  {/* Rainforest Belt (#3a9d62 - Amazon/Congo) */}
                  <path
                    d={`M ${-radius * 0.55} ${radius * 0.05} Q ${-radius * 0.2} ${radius * 0.0} ${-radius * 0.15} ${radius * 0.35} Q ${-radius * 0.4} ${radius * 0.55} ${-radius * 0.6} ${radius * 0.25} Z`}
                    fill="#3a9d62"
                  />

                  {/* Southern Landmass (Australia/Patagonia) */}
                  <path
                    d={`M ${radius * 0.25} ${radius * 0.3} Q ${radius * 0.55} ${radius * 0.25} ${radius * 0.5} ${radius * 0.5} Q ${radius * 0.2} ${radius * 0.6} ${radius * 0.15} ${radius * 0.4} Z`}
                    fill="#5fc47a"
                  />

                  {/* Polar Ice Caps (#f1f8ff) */}
                  {/* North Pole Ice */}
                  <ellipse cx="0" cy={-radius * 0.85} rx={radius * 0.65} ry={radius * 0.22} fill="#f1f8ff" />
                  {/* South Pole Ice */}
                  <ellipse cx="0" cy={radius * 0.88} rx={radius * 0.72} ry={radius * 0.25} fill="#f1f8ff" />
                </g>
              ))}
            </g>
          </g>

          {/* Drifting White Capsule Clouds */}
          <g transform={`rotate(${tiltDeg * 0.5})`}>
            {clouds.map((cloud, i) => {
              const cloudX = (((frame * cloud.speed + i * 220) % (radius * 3)) - radius * 1.5);
              return (
                <rect
                  key={i}
                  x={cloudX}
                  y={cloud.y * radius}
                  width={cloud.w * radius * 2}
                  height={cloud.h * radius * 2}
                  rx={cloud.h * radius}
                  fill="#ffffff"
                  opacity={0.78}
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
                />
              );
            })}
          </g>

          {/* 3. Day/Night Smoothstep Terminator Overlay */}
          <rect
            x={-radius}
            y={-radius}
            width={radius * 2}
            height={radius * 2}
            fill="url(#night-terminator)"
          />

          {/* 4. ~380 Warm City Lights on the Night Side */}
          <g opacity={Math.min(1, 0.2 + darknessProgress * 0.8)}>
            {cityLights.map((city, idx) => {
              // Only visible on the night side (right of the terminator)
              const isNightSide = city.x > radius * (-0.1 - terminatorOffset);
              if (!isNightSide) return null;
              return (
                <circle
                  key={idx}
                  cx={city.x}
                  cy={city.y}
                  r={1.4}
                  fill="#fef08a"
                  opacity={city.brightness * (0.5 + 0.5 * Math.sin(frame * 0.1 + idx))}
                />
              );
            })}
          </g>

          {/* 5. Procedural Frost Expansion when Temperature Drops */}
          {frostProgress > 0 && (
            <g opacity={frostProgress}>
              <circle cx="0" cy={-radius * 0.7} r={radius * 0.9 * frostProgress} fill="url(#polar-frost)" />
              <circle cx="0" cy={radius * 0.7} r={radius * 0.9 * frostProgress} fill="url(#polar-frost)" />
            </g>
          )}

          {/* 6. Cyan Atmosphere Rim Highlight */}
          <circle
            cx="0"
            cy="0"
            r={radius - 2}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            opacity={0.4}
          />
        </g>
      </svg>
    </div>
  );
};
