import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const VoxCalloutBox: React.FC<{
  title: string;
  tag?: string;
  children: React.ReactNode;
  delay?: number;
  highlightColor?: string;
  style?: React.CSSProperties;
}> = ({
  title,
  tag = 'ARCHITECTURAL DIRECTIVE',
  children,
  delay = 0,
  highlightColor = '#facc15',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 160 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.85, 1.0]);
  const opacity = interpolate(popSpring, [0, 1], [0, 1]);
  const translateY = interpolate(popSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        backgroundColor: '#161d2e',
        border: `3px solid ${highlightColor}`,
        boxShadow: `8px 8px 0px #000000, 0 20px 40px rgba(0, 0, 0, 0.6)`,
        borderRadius: 8,
        padding: '24px 28px',
        maxWidth: 720,
        position: 'relative',
        ...style,
      }}
    >
      {/* Top Tag Header */}
      <div
        style={{
          display: 'inline-block',
          backgroundColor: highlightColor,
          color: '#000000',
          fontSize: 12,
          fontWeight: 900,
          fontFamily: 'monospace',
          letterSpacing: 1.2,
          padding: '4px 10px',
          borderRadius: 4,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {tag}
      </div>

      <h3
        style={{
          margin: '0 0 12px 0',
          fontSize: 28,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: -0.5,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          color: '#cbd5e1',
          fontSize: 18,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
};
