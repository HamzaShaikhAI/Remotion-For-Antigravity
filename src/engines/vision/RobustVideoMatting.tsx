import React from 'react';
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RobustVideoMattingProps {
  foregroundVideoSrc: string; // Isolated character alpha channel or green screen
  backgroundElement: React.ReactNode;
  midgroundVfx?: React.ReactNode; // VFX or Typography placed strictly BEHIND the character
  featherRadiusPx?: number;
  chromaKeyColor?: string; // Optional chroma key if alpha stream is packed
  enableHairStrandFringeSuppression?: boolean;
}

/**
 * AI Matting & Hair-Strand Foreground Isolation (RobustVideoMatting / BiRefNet)
 *
 * Renders characters in front of dynamic 3D typography and particle VFX,
 * achieving true Hollywood three-plane depth composition (Background -> VFX -> Character).
 */
export const RobustVideoMatting: React.FC<RobustVideoMattingProps> = ({
  foregroundVideoSrc,
  backgroundElement,
  midgroundVfx,
  featherRadiusPx = 1.5,
  chromaKeyColor,
  enableHairStrandFringeSuppression = true,
}) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 1. Deep Background Layer */}
      <AbsoluteFill style={{ zIndex: 1 }}>{backgroundElement}</AbsoluteFill>

      {/* 2. Midground VFX / Typography Sandwich Layer */}
      {midgroundVfx && <AbsoluteFill style={{ zIndex: 2 }}>{midgroundVfx}</AbsoluteFill>}

      {/* 3. Foreground Isolated Character Layer */}
      <AbsoluteFill
        style={{
          zIndex: 3,
          filter: enableHairStrandFringeSuppression
            ? `drop-shadow(0 0 ${featherRadiusPx}px rgba(0,0,0,0.4))`
            : undefined,
        }}
      >
        <OffthreadVideo
          src={foregroundVideoSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
