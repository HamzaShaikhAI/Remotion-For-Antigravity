import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AmbientMeshBackground } from './components/AmbientMeshBackground';
import { MacTerminalWindow } from './components/MacTerminalWindow';
import { AnnotationBadge } from './components/AnnotationBadge';
import { ReelOverlay } from './components/ReelOverlay';

export const CodeWalkthroughReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Smooth camera zoom and pan starting at frame 90
  const zoomSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.8 },
  });

  // Scale: 1.0 -> 1.35
  const cameraScale = interpolate(zoomSpring, [0, 1], [1.0, 1.35]);

  // Pan to focus on lines 4-7 and create room for the annotation badge
  const cameraTranslateY = interpolate(zoomSpring, [0, 1], [0, -110]);
  const cameraTranslateX = interpolate(zoomSpring, [0, 1], [0, 20]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#070A13',
        overflow: 'hidden',
      }}
    >
      {/* 1. Ambient Mesh Background */}
      <AmbientMeshBackground />

      {/* 2. Top and Bottom Mobile Safe Zone Overlays */}
      <ReelOverlay />

      {/* 3. Camera Rig (Zoom and Pan Controller for Terminal and Focal Content) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${cameraTranslateX}px, ${cameraTranslateY}px) scale(${cameraScale})`,
          transformOrigin: '540px 840px',
        }}
      >
        {/* Sleek macOS Dark Terminal */}
        <MacTerminalWindow />
      </div>

      {/* 4. Spring-Animated Annotation Badge (Placed in optimal vertical focus) */}
      <div
        style={{
          position: 'absolute',
          top: 1140,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 60,
        }}
      >
        <AnnotationBadge />
      </div>
    </div>
  );
};
