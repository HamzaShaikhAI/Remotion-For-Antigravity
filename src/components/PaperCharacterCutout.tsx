import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { renderBrandIcon } from '../assets/brand';

export interface PaperCharacterProps {
  isSpeaking?: boolean;
  size?: number;
  characterType?: 'steve' | 'woz' | 'claude';
  accentColor?: string;
}

export const PaperCharacterCutout: React.FC<PaperCharacterProps> = ({
  isSpeaking = true,
  size = 160,
  characterType = 'claude',
  accentColor = '#EF4444',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quantize to 16 FPS stop-motion feel
  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // Deterministic mouth cycling state (0: Closed, 1: Open 'O', 2: Wide Smile, 3: Half-Open)
  const mouthCycle = quantizedFrame % 8;
  let mouthState = 0;
  if (isSpeaking) {
    if (mouthCycle === 0 || mouthCycle === 4) mouthState = 0; // Closed
    else if (mouthCycle === 1 || mouthCycle === 5) mouthState = 1; // Open 'O'
    else if (mouthCycle === 2 || mouthCycle === 6) mouthState = 2; // Wide Smile
    else mouthState = 3; // Half-Open
  }

  // Micro head-bob jitter (stop-motion tactile wobble)
  const headWobble = Math.sin(quantizedFrame * 1.5) * 1.8;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#CBD5E1',
        border: '4px solid #0F172A',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `rotate(${headWobble}deg)`,
      }}
    >
      {/* Avatar Graphic */}
      <div style={{ transform: 'scale(0.85)' }}>
        {renderBrandIcon('claudeStar', size * 0.75)}
      </div>

      {/* Programmatic Cutout Paper Mouth Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: mouthState === 2 ? '36px' : mouthState === 1 ? '24px' : '20px',
          height: mouthState === 1 ? '20px' : mouthState === 3 ? '12px' : '6px',
          backgroundColor: '#0F172A',
          borderRadius: mouthState === 1 ? '50%' : '4px',
          border: '2px solid #FAF7F2',
          transition: 'none', // Hard stop-motion snap (no CSS smoothing)
        }}
      />
    </div>
  );
};
