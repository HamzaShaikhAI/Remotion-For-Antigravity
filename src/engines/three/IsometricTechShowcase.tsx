import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Deterministic3dCanvas } from './Deterministic3dCanvas';

export interface IsometricTechShowcaseProps {
  cubeSize?: number;
  neonColor?: string;
  label?: string;
}

export const IsometricTechShowcase: React.FC<IsometricTechShowcaseProps> = ({
  cubeSize = 220,
  neonColor = '#38bdf8',
  label = 'AI INFERENCE CORE',
}) => {
  const frame = useCurrentFrame();

  const half = cubeSize / 2;
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: cubeSize,
    height: cubeSize,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: `2px solid ${neonColor}`,
    boxShadow: `0 0 25px ${neonColor}44, inset 0 0 20px ${neonColor}22`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 800,
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    backfaceVisibility: 'visible',
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Deterministic3dCanvas orbitSpeed={0.8} tiltAngle={20}>
        <div style={{ width: cubeSize, height: cubeSize, position: 'relative', transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>
            {label}
          </div>
          {/* Back */}
          <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>
            VULKAN TENSOR
          </div>
          {/* Right */}
          <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }}>
            60 FPS MASTER
          </div>
          {/* Left */}
          <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }}>
            ZERO LATENCY
          </div>
          {/* Top */}
          <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }}>
            REA 3D CORE
          </div>
          {/* Bottom */}
          <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>
            ANTIGRAVITY
          </div>
        </div>
      </Deterministic3dCanvas>
    </div>
  );
};
