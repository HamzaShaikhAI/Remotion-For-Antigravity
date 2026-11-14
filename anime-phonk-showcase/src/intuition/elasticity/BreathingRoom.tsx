import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BreathingRoomInhaleProps {
  children: React.ReactNode;
  dropFrame: number;
  inhaleDurationFrames?: number; // Default 72 frames (1.2 seconds @ 60fps)
  style?: React.CSSProperties;
}

/**
 * The "Breathing Room" Suspense Engine (The Inhale Shot)
 * Enforces editorial restraint: freezes camera shake, silences ambient chaos,
 * and holds a still, quiet frame right before a massive beat drop.
 * Constant chaos is boring; contrast creates hype.
 */
export const BreathingRoomInhale: React.FC<BreathingRoomInhaleProps> = ({
  children,
  dropFrame,
  inhaleDurationFrames = 72,
  style,
}) => {
  const frame = useCurrentFrame();
  const startInhale = dropFrame - inhaleDurationFrames;

  const isInhaleActive = frame >= startInhale && frame < dropFrame;

  // Darken and vignette slightly during the inhale pause
  const darkenOpacity = isInhaleActive
    ? interpolate(frame, [startInhale, dropFrame], [0.1, 0.45], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children}
      {isInhaleActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0, 0, 0, ${darkenOpacity.toFixed(3)})`,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
    </div>
  );
};
