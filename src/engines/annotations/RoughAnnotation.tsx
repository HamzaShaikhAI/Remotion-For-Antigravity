import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type AnnotationType = 'underline' | 'box' | 'circle' | 'highlight';

export interface RoughAnnotationProps {
  children: React.ReactNode;
  type?: AnnotationType;
  color?: string;
  strokeWidth?: number;
  startFrame?: number;
  durationInFrames?: number;
  roughness?: number;
}

export const RoughAnnotation: React.FC<RoughAnnotationProps> = ({
  children,
  type = 'underline',
  color = '#f59e0b',
  strokeWidth = 3.5,
  startFrame = 10,
  durationInFrames = 25,
  roughness = 2.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const clamped = Math.min(1, Math.max(0, progress));

  // Generate deterministic hand-drawn wobbly path based on type
  const getAnnotationPath = (): string => {
    switch (type) {
      case 'underline': {
        const p1 = `M 0 ${20 + Math.sin(1) * roughness}`;
        const p2 = `Q 50 ${20 + Math.sin(2) * roughness * 1.5}, 100 ${20 + Math.sin(3) * roughness}`;
        return `${p1} ${p2}`;
      }
      case 'box': {
        return `M 2 4 Q 50 ${2 + Math.sin(1) * roughness}, 98 4 Q ${98 + Math.sin(2) * roughness} 50, 98 96 Q 50 ${96 + Math.sin(3) * roughness}, 2 96 Q ${2 + Math.sin(4) * roughness} 50, 2 4`;
      }
      case 'circle': {
        return `M 50 4 C 80 4, 98 25, 98 50 C 98 75, 75 96, 50 96 C 25 96, 2 75, 2 50 C 2 25, 25 4, 50 4`;
      }
      case 'highlight':
      default: {
        return `M 0 50 L 100 50`;
      }
    }
  };

  const pathD = getAnnotationPath();
  const pathLength = 400;
  const dashOffset = interpolate(clamped, [0, 1], [pathLength, 0]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: type === 'underline' ? '80%' : 0,
          left: 0,
          width: '100%',
          height: type === 'underline' ? '40%' : '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 4px ${color}88)`,
          }}
        />
      </svg>
    </span>
  );
};
