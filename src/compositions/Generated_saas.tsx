import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GeneratedSAASComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#121214',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
        padding: 40,
      }}
    >
      <div style={{ textAlign: 'center', transform: 'scale(' + titleSpring + ')', opacity: titleSpring }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#38bdf8', fontWeight: 900 }}>
          Generated saas Archetype
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, margin: '12px 0 0' }}>Cloud Compute Mesh</h1>
        <p style={{ fontSize: 18, color: '#94a3b8', marginTop: 10 }}>Autonomous Architecture</p>
      </div>
    </AbsoluteFill>
  );
};