import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MainVideoProps {
  title: string;
  subtitle: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1.0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0f1d',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 32,
          color: '#94a3b8',
          marginTop: 20,
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
