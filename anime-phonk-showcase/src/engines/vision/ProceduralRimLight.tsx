import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export interface ProceduralRimLightProps {
  children: React.ReactNode;
  lightColor?: string;
  intensity?: number;
  direction?: 'left' | 'right' | 'dual';
  pulseSpeed?: number;
}

/**
 * AI Lighting Retouching (Relight & Rim-Light Injector)
 *
 * Casts dynamic neon rim lighting (electric cyan / fiery gold) onto character silhouettes
 * to match active Phonk bassline frequencies and lightning background aesthetics.
 */
export const ProceduralRimLight: React.FC<ProceduralRimLightProps> = ({
  children,
  lightColor = '#00f5ff',
  intensity = 0.8,
  direction = 'dual',
  pulseSpeed = 0.1,
}) => {
  const frame = useCurrentFrame();
  const pulse = 1.0 + Math.sin(frame * pulseSpeed) * 0.25;
  const shadowX = direction === 'left' ? -6 : direction === 'right' ? 6 : 0;

  return (
    <AbsoluteFill
      style={{
        filter: `drop-shadow(${shadowX}px 0px ${10 * pulse * intensity}px ${lightColor})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
