import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimePixelAction, ANIME_OP_175BPM } from './types.ts';

export interface AnimePixelSpriteProps {
  frame?: number;
  action?: AnimePixelAction;
  scale?: number;
  pixelScale?: number;
  direction?: 'left' | 'right' | string;
  flipX?: boolean;
  sparkles?: boolean;
  style?: React.CSSProperties;
}

export const AnimePixelSprite: React.FC<AnimePixelSpriteProps> = ({
  frame: frameProp,
  action = 'ready',
  scale = 1.0,
  pixelScale,
  direction = 'right',
  flipX = false,
  sparkles = false,
  style = {},
}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameProp !== undefined ? frameProp : currentFrame;
  const { fps } = useVideoConfig();

  const isFlipped = flipX || direction === 'left';
  const effectiveScale = pixelScale !== undefined ? pixelScale / 4 : scale;

  // 175 BPM Beat synchronization
  const beatProgress = (frame % ANIME_OP_175BPM.framesPerBeat) / ANIME_OP_175BPM.framesPerBeat;
  const beatIndex = Math.floor(frame / ANIME_OP_175BPM.framesPerBeat);

  // Rhythmic bounce on every downbeat
  const bounceY = Math.sin(beatProgress * Math.PI) * -8;
  const swayX = Math.sin(beatIndex * 0.5 * Math.PI) * 6;

  // Running cycle (4 frames: 0, 1, 2, 3)
  const runCycle = Math.floor((frame * 0.4) % 4);

  // Dance arm positions
  const armOffset = Math.sin(beatIndex * Math.PI) > 0 ? -1 : 1;

  return (
    <div
      style={{
        position: 'relative',
        width: 120,
        height: 160,
        transform: `scale(${effectiveScale * (isFlipped ? -1 : 1)}, ${effectiveScale}) translateY(${action === 'dance' || action === 'ready' ? bounceY : 0}px)`,
        transformOrigin: 'bottom center',
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {/* 8-bit / 16-bit SVG Pixel Sprite Grid */}
      <svg
        width="120"
        height="160"
        viewBox="0 0 30 40"
        style={{
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
        }}
      >
        {/* Sparkles overlay */}
        {sparkles && (
          <g opacity={0.7 + 0.3 * Math.sin(frame * 0.25)}>
            <rect x="2" y="8" width="2" height="2" fill="#facc15" />
            <rect x="26" y="6" width="2" height="2" fill="#facc15" />
            <rect x="24" y="24" width="2" height="2" fill="#67e8f9" />
          </g>
        )}
        {/* Cat Ears */}
        {/* Left Ear */}
        <polygon points="7,2 11,2 12,8 6,8" fill="#a78bfa" />
        <polygon points="8,4 10,4 11,7 7,7" fill="#ffffff" />
        {/* Right Ear */}
        <polygon points="19,2 23,2 24,8 18,8" fill="#a78bfa" />
        <polygon points="20,4 22,4 23,7 19,7" fill="#ffffff" />

        {/* Long Lavender Hair Twin Tails */}
        <rect x="4" y="10" width="4" height="24" fill="#8b5cf6" />
        <rect x="3" y="14" width="2" height="18" fill="#7c3aed" />
        <rect x="22" y="10" width="4" height="24" fill="#8b5cf6" />
        <rect x="25" y="14" width="2" height="18" fill="#7c3aed" />

        {/* Head Base */}
        <rect x="8" y="7" width="14" height="12" fill="#fed7aa" />

        {/* Front Bangs */}
        <rect x="7" y="6" width="16" height="5" fill="#a78bfa" />
        <rect x="9" y="10" width="2" height="3" fill="#8b5cf6" />
        <rect x="19" y="10" width="2" height="3" fill="#8b5cf6" />
        <rect x="14" y="9" width="2" height="3" fill="#8b5cf6" />

        {/* Eyes & Expression */}
        {action === 'ready' || action === 'wave' ? (
          <>
            {/* Left Eye: Open Red Anime Eye */}
            <rect x="10" y="11" width="3" height="3" fill="#ef4444" />
            <rect x="11" y="11" width="1" height="1" fill="#ffffff" />
            {/* Right Eye: Winking Angle */}
            <rect x="17" y="12" width="4" height="1" fill="#1e1b4b" />
            <rect x="18" y="11" width="2" height="1" fill="#1e1b4b" />
          </>
        ) : action === 'run' ? (
          <>
            {/* Focused Running Eyes */}
            <rect x="10" y="11" width="3" height="2" fill="#ef4444" />
            <rect x="17" y="11" width="3" height="2" fill="#ef4444" />
          </>
        ) : (
          <>
            {/* Happy Dancing Eyes (^ ^) */}
            <rect x="9" y="12" width="4" height="1" fill="#1e1b4b" />
            <rect x="10" y="11" width="2" height="1" fill="#1e1b4b" />
            <rect x="17" y="12" width="4" height="1" fill="#1e1b4b" />
            <rect x="18" y="11" width="2" height="1" fill="#1e1b4b" />
          </>
        )}

        {/* Cute Smiling Mouth */}
        <rect x="14" y="15" width="2" height="1" fill="#b91c1c" />

        {/* Red Crop Top with Bow */}
        <rect x="10" y="19" width="10" height="5" fill="#ef4444" />
        <rect x="13" y="19" width="4" height="2" fill="#ffffff" />
        <rect x="14" y="21" width="2" height="2" fill="#dc2626" />

        {/* Midriff Skin */}
        <rect x="11" y="24" width="8" height="2" fill="#fed7aa" />

        {/* Denim Shorts */}
        <rect x="10" y="26" width="10" height="4" fill="#1d4ed8" />
        <rect x="11" y="30" width="8" height="1" fill="#3b82f6" />

        {/* Animated Tail */}
        <path
          d={`M 20 28 Q ${25 + swayX * 0.5} ${24 + bounceY * 0.5} 27 18`}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
        />

        {/* Arms & Hands */}
        {action === 'wave' ? (
          <>
            {/* Left Arm at side */}
            <rect x="8" y="20" width="2" height="6" fill="#ef4444" />
            <rect x="8" y="26" width="2" height="2" fill="#fed7aa" />
            {/* Right Arm Waving Up */}
            <rect x="20" y="16" width="2" height="6" fill="#ef4444" />
            <rect x="22" y="14" width="3" height="3" fill="#fed7aa" />
          </>
        ) : action === 'dance' ? (
          <>
            {/* Alternating Pumping Dance Arms */}
            <rect x="7" y={armOffset > 0 ? 17 : 21} width="3" height="4" fill="#ef4444" />
            <rect x="7" y={armOffset > 0 ? 15 : 25} width="3" height="3" fill="#fed7aa" />
            <rect x="20" y={armOffset > 0 ? 21 : 17} width="3" height="4" fill="#ef4444" />
            <rect x="20" y={armOffset > 0 ? 25 : 15} width="3" height="3" fill="#fed7aa" />
          </>
        ) : (
          <>
            {/* Default Resting Arms */}
            <rect x="8" y="20" width="2" height="6" fill="#ef4444" />
            <rect x="8" y="26" width="2" height="2" fill="#fed7aa" />
            <rect x="20" y="20" width="2" height="6" fill="#ef4444" />
            <rect x="20" y="26" width="2" height="2" fill="#fed7aa" />
          </>
        )}

        {/* Legs & Red Sneakers */}
        {action === 'run' ? (
          runCycle === 0 ? (
            <>
              {/* Frame 0: Stride Left Forward, Right Back */}
              <rect x="9" y="31" width="3" height="5" fill="#fed7aa" />
              <rect x="7" y="36" width="5" height="3" fill="#dc2626" />
              <rect x="18" y="31" width="3" height="4" fill="#fed7aa" />
              <rect x="19" y="35" width="5" height="3" fill="#dc2626" />
            </>
          ) : runCycle === 1 ? (
            <>
              {/* Frame 1: Passing position */}
              <rect x="11" y="31" width="3" height="6" fill="#fed7aa" />
              <rect x="10" y="37" width="4" height="3" fill="#dc2626" />
              <rect x="16" y="31" width="3" height="6" fill="#fed7aa" />
              <rect x="16" y="37" width="4" height="3" fill="#dc2626" />
            </>
          ) : runCycle === 2 ? (
            <>
              {/* Frame 2: Stride Right Forward, Left Back */}
              <rect x="18" y="31" width="3" height="5" fill="#fed7aa" />
              <rect x="18" y="36" width="5" height="3" fill="#dc2626" />
              <rect x="9" y="31" width="3" height="4" fill="#fed7aa" />
              <rect x="6" y="35" width="5" height="3" fill="#dc2626" />
            </>
          ) : (
            <>
              {/* Frame 3: High jump apex */}
              <rect x="10" y="30" width="3" height="5" fill="#fed7aa" />
              <rect x="9" y="35" width="4" height="3" fill="#dc2626" />
              <rect x="17" y="30" width="3" height="5" fill="#fed7aa" />
              <rect x="17" y="35" width="4" height="3" fill="#dc2626" />
            </>
          )
        ) : (
          <>
            {/* Standing Legs */}
            <rect x="11" y="31" width="3" height="6" fill="#fed7aa" />
            <rect x="10" y="37" width="4" height="3" fill="#dc2626" />
            <rect x="16" y="31" width="3" height="6" fill="#fed7aa" />
            <rect x="16" y="37" width="4" height="3" fill="#dc2626" />
          </>
        )}
      </svg>
    </div>
  );
};
