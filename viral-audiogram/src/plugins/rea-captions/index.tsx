import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CaptionWord {
  word: string;
  startInFrames: number;
  endInFrames: number;
}

export const AnimatedCaptions: React.FC<{
  words: CaptionWord[];
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  highlightPill?: boolean;
}> = ({
  words,
  activeColor = '#00F5FF',
  inactiveColor = '#94A3B8',
  fontSize = 42,
  highlightPill = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        padding: '20px 40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 800,
        fontSize,
        lineHeight: 1.4,
      }}
    >
      {words.map((item, index) => {
        const isActive = frame >= item.startInFrames && frame <= item.endInFrames;

        // Bouncy spring scale driven by Remotion physics
        const wordSpring = spring({
          frame: frame - item.startInFrames,
          fps,
          config: { damping: 10, mass: 0.5, stiffness: 170 },
        });

        // Bouncy scale up to 1.22 on entrance, resting at 1.15
        const scale = isActive
          ? interpolate(wordSpring, [0, 1], [0.95, 1.18])
          : 1.0;

        const color = isActive ? activeColor : inactiveColor;
        const textShadow = isActive ? `0 0 24px ${activeColor}, 0 0 40px ${activeColor}` : 'none';

        return (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              transform: `scale(${scale})`,
              textShadow,
              backgroundColor: isActive && highlightPill ? 'rgba(0, 245, 255, 0.16)' : 'transparent',
              border: isActive && highlightPill ? `2px solid ${activeColor}` : '2px solid transparent',
              borderRadius: 14,
              padding: isActive && highlightPill ? '4px 18px' : '4px 8px',
              boxShadow: isActive && highlightPill ? `0 0 30px rgba(0, 245, 255, 0.45)` : 'none',
              transformOrigin: 'center center',
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
