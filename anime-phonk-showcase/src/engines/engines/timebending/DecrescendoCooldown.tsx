import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DecrescendoCooldownProps {
  children: React.ReactNode;
  cooldownStartFrame: number;
  totalDurationFrames: number;
  finalColdText?: string;
}

/**
 * The "Decrescendo" Editor (Ending Algorithm)
 *
 * Prevents abrupt ending cuts by providing a 5-second cooldown phase:
 * slow fade to black, desaturation decay, and final cold sheathe typography.
 */
export const DecrescendoCooldown: React.FC<DecrescendoCooldownProps> = ({
  children,
  cooldownStartFrame,
  totalDurationFrames,
  finalColdText = 'END OF CLASH',
}) => {
  const frame = useCurrentFrame();

  const isCooldown = frame >= cooldownStartFrame;
  if (!isCooldown) {
    return <>{children}</>;
  }

  const localFrame = frame - cooldownStartFrame;
  const cooldownDuration = totalDurationFrames - cooldownStartFrame;
  const progress = Math.min(1, localFrame / cooldownDuration);

  // Progressive fade to black and desaturation
  const fadeToBlack = interpolate(progress, [0, 0.7, 1.0], [0, 0.65, 0.98]);
  const desaturation = interpolate(progress, [0, 0.8], [1, 0.2]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: `saturate(${desaturation}) brightness(${1 - fadeToBlack * 0.5})`,
        }}
      >
        {children}
      </div>

      {/* Fade overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: fadeToBlack,
          pointerEvents: 'none',
        }}
      />

      {/* Final Cold Sheathe Typography */}
      {progress > 0.4 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            fontSize: '38px',
            color: '#FFFFFF',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            opacity: interpolate(progress, [0.4, 0.7, 0.95], [0, 1, 0.4]),
            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
          }}
        >
          {finalColdText}
        </div>
      )}
    </AbsoluteFill>
  );
};
