import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, Audio } from 'remotion';
import {
  MotionLabDashboardHeader,
  MotionLabViewport,
  MotionLabBentoControls,
  MotionLabFooterLoop,
  MotionLabControlId,
} from '../engines/motiondesignlab';

export const ClaudeGsapMotionLabShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Active control cycle across 456 frames (15.2s @ 30fps)
  let activeControl: MotionLabControlId = 'SPACING';

  if (frame < 110) {
    activeControl = 'SPACING';
  } else if (frame >= 110 && frame < 225) {
    activeControl = 'TYPOGRAPHY';
  } else if (frame >= 225 && frame < 340) {
    activeControl = 'FOLLOW_THROUGH';
  } else {
    activeControl = 'ANTICIPATION';
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#fdfbf7', overflow: 'hidden' }}>
      {/* Authentic Narration & Audio Track */}
      <Audio src={staticFile('audio/gsap_motion_lab_15s.mp3')} volume={0.95} />

      {/* Top Header & Directing Terminal Prompt */}
      <MotionLabDashboardHeader />

      {/* Main Interactive Motion Viewport Window */}
      <MotionLabViewport activeControl={activeControl} />

      {/* Bottom 2x3 Bento Grid & Connected Pixel Mascot */}
      <MotionLabBentoControls activeControl={activeControl} />

      {/* Footer Loop & Audio Waveform */}
      <MotionLabFooterLoop />
    </AbsoluteFill>
  );
};
