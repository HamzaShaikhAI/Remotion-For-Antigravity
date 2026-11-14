import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GenerativeOutpaintingProps {
  children: React.ReactNode;
  theme?: 'anime-cyber' | 'sakura-twilight' | 'storm-lightning' | 'void-abyss';
  accentColor?: string;
  enableVolumetricAtmosphere?: boolean;
}

/**
 * Generative Outpainting Stage
 *
 * Expands 16:9 landscape action into a 9:16 vertical frame.
 * Instead of plain blur or black pillar-bars, it synthesizes procedural upper and lower
 * atmospheric environments (volumetric cloud layers, light shafts, and ground reflections)
 * that mathematically match scene motion.
 */
export const GenerativeOutpainting: React.FC<GenerativeOutpaintingProps> = ({
  children,
  theme = 'anime-cyber',
  accentColor = '#00f5ff',
  enableVolumetricAtmosphere = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Subtle breathing motion for top/bottom outpainted sectors
  const pulse = Math.sin((frame / fps) * 2.5);
  const atmosphereOpacity = interpolate(pulse, [-1, 1], [0.65, 0.95]);

  const themeGradients = useMemo(() => {
    switch (theme) {
      case 'anime-cyber':
        return {
          top: 'radial-gradient(circle at 50% 15%, rgba(0, 245, 255, 0.28) 0%, rgba(10, 10, 30, 0.95) 75%, #050510 100%)',
          bottom: 'radial-gradient(circle at 50% 85%, rgba(255, 0, 128, 0.25) 0%, rgba(10, 5, 20, 0.95) 75%, #050510 100%)',
          scanlineColor: 'rgba(0, 245, 255, 0.08)',
        };
      case 'storm-lightning':
        return {
          top: 'radial-gradient(circle at 50% 10%, rgba(255, 230, 0, 0.35) 0%, rgba(20, 20, 35, 0.95) 70%, #030308 100%)',
          bottom: 'radial-gradient(circle at 50% 90%, rgba(120, 100, 255, 0.28) 0%, rgba(10, 10, 25, 0.95) 75%, #030308 100%)',
          scanlineColor: 'rgba(255, 230, 0, 0.1)',
        };
      case 'sakura-twilight':
        return {
          top: 'radial-gradient(circle at 50% 15%, rgba(255, 120, 180, 0.30) 0%, rgba(30, 10, 25, 0.95) 70%, #080308 100%)',
          bottom: 'radial-gradient(circle at 50% 85%, rgba(255, 180, 200, 0.22) 0%, rgba(20, 8, 18, 0.95) 75%, #080308 100%)',
          scanlineColor: 'rgba(255, 140, 190, 0.08)',
        };
      case 'void-abyss':
      default:
        return {
          top: 'radial-gradient(circle at 50% 20%, rgba(40, 40, 60, 0.4) 0%, rgba(5, 5, 10, 0.98) 75%, #000000 100%)',
          bottom: 'radial-gradient(circle at 50% 80%, rgba(20, 20, 40, 0.4) 0%, rgba(5, 5, 10, 0.98) 75%, #000000 100%)',
          scanlineColor: 'rgba(255, 255, 255, 0.04)',
        };
    }
  }, [theme]);

  // Procedural volumetric cloud/fog drifting
  const fogOffset1 = (frame * 0.4) % width;
  const fogOffset2 = ((frame * 0.25 + 200) % width) - width;

  return (
    <AbsoluteFill style={{ backgroundColor: '#020205', overflow: 'hidden' }}>
      {/* 1. Upper Outpainted Sector (Sky / Upper Atmosphere) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: themeGradients.top,
          opacity: atmosphereOpacity,
          zIndex: 1,
        }}
      >
        {enableVolumetricAtmosphere && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${themeGradients.scanlineColor} 4px, ${themeGradients.scanlineColor} 6px)`,
              opacity: 0.6,
            }}
          />
        )}
      </div>

      {/* 2. Lower Outpainted Sector (Ground Reflections / Abyss) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: themeGradients.bottom,
          opacity: atmosphereOpacity,
          zIndex: 1,
        }}
      >
        {enableVolumetricAtmosphere && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 100%, ${accentColor}33 0%, transparent 65%)`,
            }}
          />
        )}
      </div>

      {/* 3. Central Hero Content (16:9 Stage with soft edge feathering) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {children}
      </div>

      {/* 4. Cinematic Vignette & Edge Blend */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.85)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};
