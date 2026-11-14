import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'wipe' | 'flip' | 'zoom-blur' | 'glitch';

export interface TransitionSeriesProps {
  children: [React.ReactNode, React.ReactNode];
  type?: TransitionType;
  /** Duration of transition in frames */
  durationInFrames?: number;
  /** Frame at which the transition begins */
  transitionStartFrame: number;
}

/**
 * Deterministic Transitions Series Engine
 * Drop-in transcendence over @remotion/transitions with pure spring physics and zero dependency overhead.
 */
export const TransitionSeries: React.FC<TransitionSeriesProps> = ({
  children,
  type = 'slide-left',
  durationInFrames = 20,
  transitionStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - transitionStartFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.8 },
  });

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const isBefore = frame < transitionStartFrame;
  const isAfter = frame >= transitionStartFrame + durationInFrames;

  if (isBefore) {
    return <>{children[0]}</>;
  }

  if (isAfter) {
    return <>{children[1]}</>;
  }

  let styleA: React.CSSProperties = { position: 'absolute', inset: 0 };
  let styleB: React.CSSProperties = { position: 'absolute', inset: 0 };

  switch (type) {
    case 'fade':
      styleA.opacity = 1 - clampedProgress;
      styleB.opacity = clampedProgress;
      break;

    case 'slide-left':
      styleA.transform = `translate3d(${-clampedProgress * 100}%, 0, 0)`;
      styleB.transform = `translate3d(${(1 - clampedProgress) * 100}%, 0, 0)`;
      break;

    case 'slide-right':
      styleA.transform = `translate3d(${clampedProgress * 100}%, 0, 0)`;
      styleB.transform = `translate3d(${-(1 - clampedProgress) * 100}%, 0, 0)`;
      break;

    case 'slide-up':
      styleA.transform = `translate3d(0, ${-clampedProgress * 100}%, 0)`;
      styleB.transform = `translate3d(0, ${(1 - clampedProgress) * 100}%, 0)`;
      break;

    case 'wipe':
      styleA.clipPath = `inset(0 0 0 ${clampedProgress * 100}%)`;
      styleB.clipPath = `inset(0 ${(1 - clampedProgress) * 100}% 0 0)`;
      break;

    case 'flip':
      styleA.transform = `perspective(1200px) rotateY(${clampedProgress * 90}deg)`;
      styleA.opacity = clampedProgress > 0.5 ? 0 : 1;
      styleB.transform = `perspective(1200px) rotateY(${-(1 - clampedProgress) * 90}deg)`;
      styleB.opacity = clampedProgress > 0.5 ? 1 : 0;
      break;

    case 'zoom-blur': {
      const scaleA = interpolate(clampedProgress, [0, 1], [1, 2.5]);
      const scaleB = interpolate(clampedProgress, [0, 1], [0.4, 1]);
      styleA.transform = `scale(${scaleA})`;
      styleA.opacity = 1 - clampedProgress;
      styleA.filter = `blur(${clampedProgress * 16}px)`;
      styleB.transform = `scale(${scaleB})`;
      styleB.opacity = clampedProgress;
      styleB.filter = `blur(${(1 - clampedProgress) * 16}px)`;
      break;
    }

    case 'glitch': {
      const sliceOffset = Math.sin(frame * 12.3) * (1 - Math.abs(clampedProgress - 0.5) * 2) * 40;
      styleA.transform = `translate3d(${sliceOffset}px, 0, 0)`;
      styleA.opacity = 1 - clampedProgress;
      styleB.transform = `translate3d(${-sliceOffset}px, 0, 0)`;
      styleB.opacity = clampedProgress;
      break;
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={styleA}>{children[0]}</div>
      <div style={styleB}>{children[1]}</div>
    </div>
  );
};
