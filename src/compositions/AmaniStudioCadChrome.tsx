import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CadTechnicalBlueprint,
  LiquidChromeEmblem,
  BrandLockup,
} from '../engines/cadchrome';

export const AmaniStudioCadChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // TIMELINE PHASES (1080 frames @ 30 FPS = 36.0s)
  // Phase 1: Blueprint Self-Draw & Calipers (0 - 360 frames)
  // Phase 2: Liquid Chrome Materialization  (360 - 600 frames)
  // Phase 3: 3D Extrusion & Macro Orbit     (600 - 840 frames)
  // Phase 4: Climax Frontal Lockup          (840 - 1080 frames)

  // 1. Vector Drawing Progress (0 to 1 over first 120 frames)
  const drawProgress = interpolate(frame, [15, 140], [0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Blueprint wireframe opacity: 1.0 during Phase 1, crossfading out in Phase 2
  const blueprintOpacity = interpolate(frame, [360, 440], [1.0, 0.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Liquid Chrome Surface Opacity: crossfades in during Phase 2
  const chromeOpacity = interpolate(frame, [360, 440], [0.0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. 3D Extrusion Depth: 0 in Phase 1 & 2, extrudes to 1.0 in Phase 3
  const extrusionSpring = spring({
    frame: frame - 580,
    fps,
    config: { damping: 16, stiffness: 80 },
  });
  const extrusionDepth = interpolate(extrusionSpring, [0, 1], [0.0, 1.0], {
    extrapolateRight: 'clamp',
  });

  // 4. Camera Orbit & Macro Push Physics (Phase 3 -> Phase 4)
  // Phase 3 Macro: tilts to rotateX=22, rotateY=-28, zooms to 2.4x
  // Phase 4 Lockup: returns to rotateX=0, rotateY=0, settles to scale=0.72
  let camRotateX = 0;
  let camRotateY = 0;
  let camScale = 1.0;
  let camOffsetY = 0;
  let dofBlur = 0;

  if (frame < 580) {
    // 2D Blueprint & Flat Materialization
    camRotateX = 0;
    camRotateY = 0;
    camScale = interpolate(frame, [0, 360], [0.95, 1.05], { extrapolateRight: 'clamp' });
    camOffsetY = 0;
    dofBlur = 0;
  } else if (frame < 840) {
    // Phase 3: Macro Tilt & Push-in
    const macroSpring = spring({
      frame: frame - 580,
      fps,
      config: { damping: 18, stiffness: 70 },
    });
    camRotateX = interpolate(macroSpring, [0, 1], [0, 24]);
    camRotateY = interpolate(macroSpring, [0, 1], [0, -32]);
    camScale = interpolate(macroSpring, [0, 1], [1.0, 2.35]);
    camOffsetY = interpolate(macroSpring, [0, 1], [0, -60]);
    dofBlur = interpolate(macroSpring, [0.3, 0.8], [0, 1.5]);
  } else {
    // Phase 4: Final Lockup Frontal Settle
    const settleSpring = spring({
      frame: frame - 840,
      fps,
      config: { damping: 18, stiffness: 90 },
    });
    camRotateX = interpolate(settleSpring, [0, 1], [24, 0]);
    camRotateY = interpolate(settleSpring, [0, 1], [-32, 0]);
    camScale = interpolate(settleSpring, [0, 1], [2.35, 0.72]);
    camOffsetY = interpolate(settleSpring, [0, 1], [-60, -90]);
    dofBlur = interpolate(settleSpring, [0, 0.4], [1.5, 0], { extrapolateRight: 'clamp' });
  }

  // Reflection light sweep angle
  const reflectionAngle = interpolate(frame, [360, 1080], [0, 180]);

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        backgroundColor: '#05070a',
        overflow: 'hidden',
        perspective: 1600,
      }}
    >
      {/* Background Technical Grid (lingering throughout for industrial precision) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }}>
        <defs>
          <pattern id="bgGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrid)" />
      </svg>

      {/* Camera Rig Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${camOffsetY}px)`,
          filter: dofBlur > 0.1 ? `blur(${dofBlur}px)` : 'none',
        }}
      >
        {/* Layer 1: CAD Technical Blueprint (Drawing & Calipers) */}
        {blueprintOpacity > 0.01 && (
          <CadTechnicalBlueprint
            frame={frame}
            drawProgress={drawProgress}
            opacity={blueprintOpacity}
            style={{ transform: `scale(${camScale})`, transformOrigin: 'center center' }}
          />
        )}

        {/* Layer 2: Liquid Chrome 3D Emblem */}
        {chromeOpacity > 0.01 && (
          <LiquidChromeEmblem
            frame={frame}
            opacity={chromeOpacity}
            extrusionDepth={extrusionDepth}
            rotateX={camRotateX}
            rotateY={camRotateY}
            scale={camScale}
            reflectionAngle={reflectionAngle}
          />
        )}
      </div>

      {/* Layer 3: Final Brand Lockup (amani/studio) in Phase 4 */}
      {frame >= 830 && (
        <BrandLockup frame={frame} entranceFrame={840} brandName="amani" brandSuffix="/studio" />
      )}
    </AbsoluteFill>
  );
};
