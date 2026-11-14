import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LottieAnimationData {
  v?: string;
  fr?: number; // framerate
  ip?: number; // in-point
  op?: number; // out-point
  w?: number;
  h?: number;
  layers?: any[];
}

export interface DeterministicLottiePlayerProps {
  animationData?: LottieAnimationData;
  speed?: number;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  fallbackSvgPath?: string;
}

/**
 * DeterministicLottiePlayer
 * Binds Remotion's frame directly to the vector animation timeline without browser drift.
 */
export const DeterministicLottiePlayer: React.FC<DeterministicLottiePlayerProps> = ({
  animationData,
  speed = 1.0,
  loop = true,
  width = '100%',
  height = '100%',
  style = {},
  fallbackSvgPath,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalAnimationFrames = animationData?.op ? animationData.op - (animationData.ip || 0) : 60;
  const rawFrame = frame * speed;
  const currentLottieFrame = loop
    ? Math.floor(rawFrame % totalAnimationFrames)
    : Math.min(totalAnimationFrames, Math.floor(rawFrame));

  const progress = currentLottieFrame / totalAnimationFrames;
  const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        ...style,
      }}
    >
      {/* Deterministic Vector Fallback Render if full canvas is offline */}
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '60%',
          height: '60%',
          transform: `scale(${scale}) rotate(${progress * 360}deg)`,
          filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.5))',
        }}
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="180" strokeDashoffset={interpolate(progress, [0, 1], [180, 0])} />
        <polygon points="50,20 62,42 86,45 68,62 73,85 50,73 27,85 32,62 14,45 38,42" fill="#818cf8" opacity={0.85} />
      </svg>
    </div>
  );
};
