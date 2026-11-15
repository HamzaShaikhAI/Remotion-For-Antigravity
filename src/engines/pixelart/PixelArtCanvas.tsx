import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, Img } from 'remotion';
import type { SliderControls, RainParticle, SplashRing, FireflyParticle } from './types.ts';

interface PixelArtCanvasProps {
  sliders?: Partial<SliderControls>;
  width?: number;
  height?: number;
  baseImageSrc?: string;
  showOverlayHud?: boolean;
  enableCrtScanlines?: boolean;
}

export const PixelArtCanvas: React.FC<PixelArtCanvasProps> = ({
  sliders = {},
  width = 772,
  height = 1024,
  baseImageSrc,
  showOverlayHud = true,
  enableCrtScanlines = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active slider coefficients
  const motionFactor = sliders.motionIntensity ?? 1.0;
  const envFactor = sliders.environmentalMotion ?? 1.0;
  const ambientFactor = sliders.ambientEffects ?? 1.0;

  const effectiveFrame = frame * motionFactor;

  // Native Grid dimensions (386x512)
  const gridW = 386;
  const gridH = 512;

  // Precomputed deterministic rain particles (140 discrete lines)
  const rainParticles: RainParticle[] = useMemo(() => {
    const list: RainParticle[] = [];
    for (let i = 0; i < 140; i++) {
      list.push({
        x: (i * 37 + 13) % gridW,
        y: (i * 53 + 7) % gridH,
        length: 8 + (i % 7) * 2,
        speed: 12 + (i % 5) * 3,
        alpha: 0.35 + (i % 4) * 0.15,
        depth: i % 3,
      });
    }
    return list;
  }, []);

  // Precomputed splash rings
  const splashRings: SplashRing[] = useMemo(() => {
    const list: SplashRing[] = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        x: (i * 71 + 29) % gridW,
        y: 400 + (i * 23) % 110,
        phase: (i * 5) % 12,
      });
    }
    return list;
  }, []);

  // Precomputed firefly mist particles
  const fireflies: FireflyParticle[] = useMemo(() => {
    const list: FireflyParticle[] = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        x: 140 + (i * 31) % 220,
        y: 100 + (i * 41) % 320,
        orbitRadius: 4 + (i % 5) * 3,
        freq: 0.05 + (i % 4) * 0.02,
        phase: i * 0.7,
      });
    }
    return list;
  }, []);

  // 1. Organic Shoji Screen & Lantern Flicker
  const pulse = Math.sin(effectiveFrame * 0.35) * 0.5 + Math.cos(effectiveFrame * 0.72) * 0.3;
  const glowAlpha = Math.max(0, (0.18 + pulse * 0.08) * ambientFactor);
  const lanternPulseRadius = 36 * ambientFactor;

  // 2. Moon halo breathing
  const moonPulse = Math.sin(effectiveFrame * 0.1) * 0.1 + 0.9;

  // 3. Water surface horizontal shimmer bands (Lake region y: 396 to 512)
  const shimmerBands = useMemo(() => {
    const bands: { y: number; x: number; w: number; alpha: number; color: string }[] = [];
    const chop = envFactor * 1.5;
    for (let y = 396; y < gridH; y += 4) {
      const rowOffset = Math.sin(y * 0.15 + effectiveFrame * 0.4) * 3 * chop;
      const shimmer = Math.cos(y * 0.2 - effectiveFrame * 0.3) * 0.5 + 0.5;
      if (shimmer > 0.6) {
        const alpha = (shimmer - 0.6) * 0.45 * chop;
        // Warm golden shoji reflection directly beneath ryokan
        bands.push({
          y,
          x: Math.floor(100 + rowOffset),
          w: 120,
          alpha,
          color: '#f59e0b',
        });
        // Cool blue water reflection
        bands.push({
          y,
          x: Math.floor(240 + rowOffset),
          w: 60,
          alpha: alpha * 0.5,
          color: '#94a3b8',
        });
      }
    }
    return bands;
  }, [effectiveFrame, envFactor]);

  // 4. Multi-Plane Volumetric Lake Mist (Near and far rolling fog scanlines)
  const mistLayers = useMemo(() => {
    const layers = [
      { y: 412, speed: 0.35, width: 220, alpha: 0.12 * envFactor },
      { y: 438, speed: 0.55, width: 260, alpha: 0.16 * envFactor },
      { y: 468, speed: 0.25, width: 190, alpha: 0.10 * envFactor },
      { y: 492, speed: 0.40, width: 240, alpha: 0.14 * envFactor },
    ];
    return layers.map((layer, idx) => {
      const offsetX = Math.floor((effectiveFrame * layer.speed * 2) % (gridW + layer.width) - layer.width);
      const breathing = Math.sin(effectiveFrame * 0.15 + idx) * 0.04;
      return {
        ...layer,
        x: offsetX,
        effectiveAlpha: Math.max(0, layer.alpha + breathing),
      };
    });
  }, [effectiveFrame, envFactor]);

  // 5. Roof Eaves Water Drips (3 rhythmic dripping points)
  const eavesDrips = useMemo(() => {
    const dripSources = [
      { startX: 68, startY: 295, targetY: 395, phase: 0 },
      { startX: 142, startY: 305, targetY: 405, phase: 8 },
      { startX: 185, startY: 320, targetY: 412, phase: 16 },
    ];

    return dripSources.map((drip) => {
      const cycle = 24; // Drip cycle every 24 frames
      const age = (effectiveFrame + drip.phase) % cycle;
      const progress = age / cycle;
      const currentY = Math.floor(drip.startY + Math.pow(progress, 2) * (drip.targetY - drip.startY));
      const splashProgress = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
      return {
        ...drip,
        currentY,
        progress,
        splashProgress,
      };
    });
  }, [effectiveFrame]);

  const imageSrc = baseImageSrc || staticFile('images/ryokan_pixel_art_base.jpg');

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: '#050810',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* 1. Base Pixel Art Image (2x Nearest-Neighbor Scaled) */}
      <Img
        src={imageSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />

      {/* 2. SVG Pixel-Locked Animation Layer (Coordinates mapped to 386x512 grid) */}
      <svg
        viewBox="0 0 386 512"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          shapeRendering: 'crispEdges',
          pointerEvents: 'none',
        }}
      >
        <defs>
          {/* Outdoor Lantern Radial Glow */}
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.45 * ambientFactor} />
            <stop offset="35%" stopColor="#f97316" stopOpacity={0.3 * ambientFactor} />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>

          {/* Moon Atmospheric Halo */}
          <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity={0.35 * ambientFactor} />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>

          {/* Lake Volumetric Mist Linear Gradient */}
          <linearGradient id="mistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0" />
            <stop offset="40%" stopColor="#cbd5e1" stopOpacity="1" />
            <stop offset="60%" stopColor="#cbd5e1" stopOpacity="1" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Moon Breathing Halo (x: 216, y: 196) */}
        {ambientFactor > 0.05 && (
          <circle
            cx="216"
            cy="196"
            r={24 * moonPulse * ambientFactor}
            fill="url(#moonHalo)"
          />
        )}

        {/* Shoji Screen Amber Pulse (Lower Window x: 95..155, y: 325..380) */}
        {ambientFactor > 0.05 && (
          <rect
            x="95"
            y="325"
            width="60"
            height="55"
            fill="#fbbf24"
            fillOpacity={glowAlpha}
          />
        )}

        {/* Shoji Screen Amber Pulse (Upper Window x: 82..146, y: 215..285) */}
        {ambientFactor > 0.05 && (
          <rect
            x="82"
            y="215"
            width="64"
            height="70"
            fill="#fde68a"
            fillOpacity={glowAlpha * 0.8}
          />
        )}

        {/* Outdoor Lantern Radial Glow (x: 172, y: 295) */}
        {ambientFactor > 0.05 && (
          <circle
            cx="172"
            cy="295"
            r={lanternPulseRadius}
            fill="url(#lanternGlow)"
          />
        )}

        {/* Volumetric Lake Mist Scanlines */}
        {envFactor > 0.1 &&
          mistLayers.map((mist, idx) => (
            <rect
              key={`mist-${idx}`}
              x={mist.x}
              y={mist.y}
              width={mist.width}
              height="3"
              fill="url(#mistGrad)"
              fillOpacity={mist.effectiveAlpha}
            />
          ))}

        {/* Lake Surface Shimmer Reflection Bands */}
        {envFactor > 0.05 &&
          shimmerBands.map((band, idx) => (
            <rect
              key={`shimmer-${idx}`}
              x={band.x}
              y={band.y}
              width={band.w}
              height="2"
              fill={band.color}
              fillOpacity={band.alpha}
            />
          ))}

        {/* Roof Eaves Drips & Ground Splashes */}
        {envFactor > 0.15 &&
          eavesDrips.map((drip, idx) => {
            if (drip.splashProgress > 0) {
              // Splash ring on lake rock
              const rx = Math.floor(1 + drip.splashProgress * 4);
              const ry = Math.floor(1 + drip.splashProgress * 1.5);
              const alpha = (1 - drip.splashProgress) * 0.7;
              return (
                <ellipse
                  key={`eaves-splash-${idx}`}
                  cx={drip.startX}
                  cy={drip.targetY}
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="1"
                  strokeOpacity={alpha}
                />
              );
            }

            // Falling pixel droplet
            return (
              <rect
                key={`eaves-drip-${idx}`}
                x={drip.startX}
                y={drip.currentY}
                width="1"
                height="3"
                fill="#e2e8f0"
                fillOpacity={0.8}
              />
            );
          })}

        {/* Splash Rings on Water Surface Contact */}
        {envFactor > 0.1 &&
          splashRings.map((ring, idx) => {
            const age = (effectiveFrame + ring.phase) % 12;
            if (age >= 8) return null;
            const rx = Math.floor(2 + age * 1.2 * envFactor);
            const ry = Math.floor(1 + age * 0.4 * envFactor);
            const alpha = (1 - age / 8) * 0.6 * envFactor;

            return (
              <ellipse
                key={`splash-${idx}`}
                cx={ring.x}
                cy={ring.y}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="#bae6fd"
                strokeWidth="1"
                strokeOpacity={alpha}
              />
            );
          })}

        {/* Procedural Rain Streaks (12 FPS discrete phase) */}
        {envFactor > 0.05 &&
          rainParticles.slice(0, Math.floor(140 * envFactor)).map((p, idx) => {
            const curY = (p.y + effectiveFrame * p.speed) % (gridH + 30) - 20;
            const curX = Math.floor(p.x + curY * 0.05);

            return (
              <line
                key={`rain-${idx}`}
                x1={curX}
                y1={Math.floor(curY)}
                x2={curX + 1}
                y2={Math.floor(curY + p.length)}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeOpacity={p.alpha}
              />
            );
          })}

        {/* Floating Ambient Firefly Mist Particles */}
        {ambientFactor > 0.1 &&
          fireflies.map((f, idx) => {
            const fx = Math.floor(f.x + Math.sin(effectiveFrame * f.freq + f.phase) * f.orbitRadius);
            const fy = Math.floor(f.y + Math.cos(effectiveFrame * f.freq + f.phase) * f.orbitRadius);
            const glow = (Math.sin(effectiveFrame * 0.2 + f.phase) * 0.5 + 0.5) * ambientFactor;
            if (glow <= 0.3) return null;

            return (
              <rect
                key={`firefly-${idx}`}
                x={fx}
                y={fy}
                width="2"
                height="2"
                fill="#fde047"
                fillOpacity={glow * 0.8}
              />
            );
          })}
      </svg>

      {/* 3. Retro CRT Scanline Shader Filter */}
      {enableCrtScanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.06) 0px, rgba(0, 0, 0, 0.06) 2px, transparent 2px, transparent 4px)',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* 4. Optional Overlay HUD (Native 12 FPS Timecode & Resolution) */}
      {showOverlayHud && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            display: 'flex',
            gap: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: 1,
            color: 'rgba(255, 255, 255, 0.45)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            padding: '4px 8px',
            borderRadius: 4,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span>386×512 @ 12FPS</span>
          <span>FRAME: {frame}</span>
        </div>
      )}
    </div>
  );
};
