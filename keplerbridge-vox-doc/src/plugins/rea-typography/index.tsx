import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import React from 'react';

export const KineticSplitText: React.FC<{
  text: string;
  delayPerLetter?: number;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, delayPerLetter = 2, color = '#ffffff', fontSize = 64, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split('');

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 900,
        fontSize,
        color,
        ...style,
      }}
    >
      {letters.map((char, index) => {
        const charSpring = spring({
          frame: frame - index * delayPerLetter,
          fps,
          config: { damping: 12, mass: 0.8, stiffness: 150 },
        });

        const translateY = interpolate(charSpring, [0, 1], [80, 0]);
        const opacity = interpolate(charSpring, [0, 0.4, 1], [0, 0.8, 1]);
        const scale = interpolate(charSpring, [0, 0.7, 1], [0.5, 1.1, 1]);

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
