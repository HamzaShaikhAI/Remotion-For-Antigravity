import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { RicksClipsCaption, RICKSCLIPS_CAPTIONS } from './types';

interface RicksClipsCaptionsProps {
  captions?: RicksClipsCaption[];
}

export const RicksClipsCaptions: React.FC<RicksClipsCaptionsProps> = ({
  captions = RICKSCLIPS_CAPTIONS,
}) => {
  const frame = useCurrentFrame();

  // Find active caption
  const activeCaption = captions.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
  );

  if (!activeCaption) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 1320,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat', 'Impact', 'Arial Black', sans-serif",
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
          WebkitTextStroke: '8px #000000',
          textShadow: '0 6px 20px rgba(0, 0, 0, 0.9)',
          textAlign: 'center',
          letterSpacing: 1.5,
          lineHeight: 1.1,
          padding: '0 40px',
        }}
      >
        {activeCaption.text}
      </span>
    </div>
  );
};
