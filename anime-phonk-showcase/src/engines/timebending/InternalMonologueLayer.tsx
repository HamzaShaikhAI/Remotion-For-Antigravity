import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InternalMonologueProps {
  monologueText: string;
  speakerName?: string;
  triggerFrame: number;
  durationInFrames: number;
  accentColor?: string;
}

/**
 * Internal Monologue Synthesis Layer
 *
 * Renders cinematic internal monologue typography with letter spacing,
 * heartbeat pulse shadows, and subtle audio-reactive glow.
 */
export const InternalMonologueLayer: React.FC<InternalMonologueProps> = ({
  monologueText,
  speakerName = 'ZENITSU',
  triggerFrame,
  durationInFrames,
  accentColor = '#00f5ff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isVisible = frame >= triggerFrame && frame < triggerFrame + durationInFrames;
  if (!isVisible) return null;

  const localFrame = frame - triggerFrame;
  const progress = localFrame / durationInFrames;

  // Heartbeat pulse frequency (~75 BPM)
  const pulse = Math.sin((localFrame / fps) * Math.PI * 2.5);
  const glowRadius = interpolate(pulse, [-1, 1], [8, 24]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18%',
        left: '8%',
        right: '8%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          fontSize: '20px',
          color: accentColor,
          letterSpacing: '5px',
          textTransform: 'uppercase',
          textShadow: `0 0 ${glowRadius}px ${accentColor}`,
        }}
      >
        [ THOUGHTS: {speakerName} ]
      </div>

      <div
        style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '36px',
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: '1.35',
          textShadow: '0 4px 18px rgba(0,0,0,0.95)',
        }}
      >
        "{monologueText}"
      </div>
    </div>
  );
};
