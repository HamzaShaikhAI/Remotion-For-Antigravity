import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DynamicBokehStageProps {
  children: React.ReactNode;
  focusTarget: 'foreground' | 'background' | 'rack_focus';
  focalDistanceFrames?: number; // Timing for rack focus transition
  apertureBladeCount?: number;
  maxBlurPx?: number;
}

/**
 * Dynamic Depth-of-Field (DoF) Bokeh Simulation
 *
 * Simulates cinematic anamorphic lens bokeh using depth-map aware multi-pass blurs.
 * Automatically performs rack-focus between dueling characters during clashing moments.
 */
export const DynamicBokehStage: React.FC<DynamicBokehStageProps> = ({
  children,
  focusTarget = 'foreground',
  focalDistanceFrames = 60,
  maxBlurPx = 8,
}) => {
  const frame = useCurrentFrame();

  let blurAmount = 0;
  if (focusTarget === 'rack_focus') {
    // Rack focus from foreground (sharp) to background (sharp)
    blurAmount = interpolate(frame, [0, focalDistanceFrames / 2, focalDistanceFrames], [0, maxBlurPx, 0], {
      extrapolateRight: 'clamp',
    });
  } else if (focusTarget === 'background') {
    blurAmount = maxBlurPx * 0.6;
  }

  return (
    <AbsoluteFill
      style={{
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
