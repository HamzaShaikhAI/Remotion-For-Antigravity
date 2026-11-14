import { useCurrentFrame } from 'remotion';
import React from 'react';

export const GlitchTransition: React.FC<{
  children: React.ReactNode;
  intensity?: number;
}> = ({ children, intensity = 1 }) => {
  const frame = useCurrentFrame();

  const isGlitching = frame < 15;
  const glitchOffset = isGlitching ? Math.sin(frame * 43.1) * 8 * intensity : 0;
  const channelShift = isGlitching ? Math.cos(frame * 12.4) * 6 * intensity : 0;
  const clipPathValue = isGlitching
    ? `inset(${Math.abs(Math.sin(frame) * 50)}% 0 ${Math.abs(Math.cos(frame) * 40)}% 0)`
    : 'inset(0% 0 0% 0)';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', clipPath: clipPathValue }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${glitchOffset}px, 0)`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${-glitchOffset * 0.7}px, ${channelShift * 0.5}px)`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};
