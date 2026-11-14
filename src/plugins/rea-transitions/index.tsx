import { useCurrentFrame } from 'remotion';
import React from 'react';

export const GlitchTransition: React.FC<{
  children: React.ReactNode;
  intensity?: number;
}> = ({ children, intensity = 1 }) => {
  const frame = useCurrentFrame();

  // Trigger glitch effect only during the first 15 frames of the component mount
  const isGlitching = frame < 15;
  const glitchOffset = isGlitching ? Math.sin(frame * 43.1) * 8 * intensity : 0;
  const channelShift = isGlitching ? Math.cos(frame * 12.4) * 6 * intensity : 0;
  const clipPathValue = isGlitching
    ? `inset(${Math.abs(Math.sin(frame) * 50)}% 0 ${Math.abs(Math.cos(frame) * 40)}% 0)`
    : 'inset(0% 0 0% 0)';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', clipPath: clipPathValue }}>
      {/* Cyan Channel Shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${channelShift}px, 0px)`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 2px #00f5ff)',
          opacity: isGlitching ? 0.8 : 1,
        }}
      >
        {children}
      </div>

      {/* Magenta Channel Shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${-channelShift}px, ${glitchOffset}px)`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 2px #ff0055)',
          opacity: isGlitching ? 0.8 : 1,
        }}
      >
        {children}
      </div>

      {/* Main Base Layer */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};
