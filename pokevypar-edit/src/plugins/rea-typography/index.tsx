import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import React from 'react';

export const KineticSplitText: React.FC<{
  text: string;
  delayPerLetter?: number;
  style?: React.CSSProperties;
}> = ({ text, delayPerLetter = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split('');

  return (
    <div style={{ display: 'flex', overflow: 'hidden', ...style }}>
      {letters.map((char, index) => {
        const charFrame = Math.max(0, frame - index * delayPerLetter);
        const entranceSpring = spring({
          frame: charFrame,
          fps,
          config: { damping: 10, stiffness: 180 },
        });

        const translateY = interpolate(entranceSpring, [0, 1], [60, 0]);
        const opacity = interpolate(entranceSpring, [0, 1], [0, 1]);
        const rotate = interpolate(entranceSpring, [0, 1], [15, 0]);

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
              opacity,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const Typewriter: React.FC<{ text: string; speed?: number; color?: string }> = ({
  text,
  speed = 2,
  color = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.min(text.length, Math.floor(frame / speed));
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 30, color, letterSpacing: 1, minHeight: 40 }}>
      {text.slice(0, charsToShow)}
      <span style={{ opacity: showCursor ? 1 : 0, color: '#00f5ff' }}>_</span>
    </div>
  );
};
