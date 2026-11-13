import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

export const RadialAudioVisualizer: React.FC<{
  cx?: number;
  cy?: number;
}> = ({ cx = 540, cy = 410 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring scaling for the visualizer
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85, mass: 0.9 },
  });

  const baseScale = enterSpring;
  const pulseScale = 1 + Math.sin(frame * 0.2) * 0.035;
  const currentScale = baseScale * pulseScale;

  // 48 radial bars oscillating via layered sine/cosine waves
  const BAR_COUNT = 48;
  const innerRadius = 145;

  const bars = React.useMemo(() => {
    return Array.from({ length: BAR_COUNT }).map((_, i) => {
      const angle = (i / BAR_COUNT) * 2 * Math.PI - Math.PI / 2;

      // Layered sine/cosine waves as requested
      const primary = Math.sin(frame * 0.2 + i);
      const harmonic1 = Math.cos(frame * 0.12 - i * 0.5) * 0.7;
      const harmonic2 = Math.sin(frame * 0.3 + i * 0.8) * 0.4;
      const voiceEnergy = Math.sin(frame * 0.18) * 0.35 + 0.65;

      const normalized = Math.max(0, (primary + harmonic1 + harmonic2 + 2.1) / 4.2);
      const barLength = 16 + normalized * 105 * voiceEnergy;

      const x1 = cx + Math.cos(angle) * innerRadius;
      const y1 = cy + Math.sin(angle) * innerRadius;
      const x2 = cx + Math.cos(angle) * (innerRadius + barLength);
      const y2 = cy + Math.sin(angle) * (innerRadius + barLength);

      // Color interpolation across the circle: cyan -> blue -> magenta -> cyan
      const hue = (180 + (i / BAR_COUNT) * 140) % 360;
      const strokeColor = `hsl(${hue}, 100%, 60%)`;

      return { id: i, x1, y1, x2, y2, strokeColor, barLength };
    });
  }, [frame, cx, cy]);

  // Decibel meter display
  const decibels = (-14.5 + Math.sin(frame * 0.22) * 4.8).toFixed(1);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#141E33" />
            <stop offset="70%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#070A12" />
          </radialGradient>

          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circular Ring Outline */}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius - 4}
          fill="none"
          stroke="#00F5FF"
          strokeWidth="2"
          opacity={0.4}
          filter="url(#neon-glow)"
        />

        {/* 48 Oscillating Radial Spectrum Bars */}
        <g filter="url(#neon-glow)" transform={`scale(${currentScale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {bars.map((bar) => (
            <line
              key={bar.id}
              x1={bar.x1}
              y1={bar.y1}
              x2={bar.x2}
              y2={bar.y2}
              stroke={bar.strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
        </g>

        {/* Center Disc / Core Capsule */}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius - 10}
          fill="url(#core-grad)"
          stroke="rgba(0, 245, 255, 0.5)"
          strokeWidth="2"
        />

        {/* Inner Waveform Graphic inside Core */}
        <g transform={`translate(${cx - 50}, ${cy - 40}) scale(${currentScale})`} style={{ transformOrigin: '50px 40px' }}>
          {/* Animated mini sound bars */}
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const barH = 12 + Math.abs(Math.sin(frame * 0.25 + idx * 0.9)) * 36;
            return (
              <rect
                key={idx}
                x={idx * 16}
                y={40 - barH / 2}
                width="8"
                height={barH}
                rx="4"
                fill="#00F5FF"
                opacity={0.85}
              />
            );
          })}
        </g>

        {/* Live Audio Telemetry inside Core */}
        <text
          x={cx}
          y={cy + 42}
          textAnchor="middle"
          fill="#00F5FF"
          fontFamily='"JetBrains Mono", monospace'
          fontSize="18"
          fontWeight="800"
          letterSpacing="0.08em"
        >
          {decibels} dB
        </text>
        <text
          x={cx}
          y={cy + 64}
          textAnchor="middle"
          fill="#64748B"
          fontFamily='"JetBrains Mono", monospace'
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.12em"
        >
          48-CH SPECTRUM
        </text>
      </svg>
    </div>
  );
};
