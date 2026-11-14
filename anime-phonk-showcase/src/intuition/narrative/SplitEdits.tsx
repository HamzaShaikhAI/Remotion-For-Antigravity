import React from 'react';
import { Audio, Sequence, useCurrentFrame } from 'remotion';

export interface SplitEditProps {
  currentScene: React.ReactNode;
  nextScene: React.ReactNode;
  transitionFrame: number; // The visual cut point
  incomingAudioSrc?: string; // Audio track for next scene
  leadFrames?: number; // How many frames audio starts BEFORE visual cut (default 15)
  outgoingLagFrames?: number; // How many frames previous audio lingers AFTER visual cut (default 0)
}

/**
 * J-Cut & L-Cut Split Edit Engine
 * Bridges audio across visual cuts so incoming swords, dialogue, or rising bass
 * lead the video by 12-18 frames, eliminating harsh jump-cut jarring and creating
 * smooth Hollywood-grade narrative flow.
 */
export const JCutsAndLCuts: React.FC<SplitEditProps> = ({
  currentScene,
  nextScene,
  transitionFrame,
  incomingAudioSrc,
  leadFrames = 15,
  outgoingLagFrames = 0,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Visual Transition */}
      {frame < transitionFrame ? currentScene : nextScene}

      {/* J-Cut: Incoming audio plays early */}
      {incomingAudioSrc && (
        <Sequence from={transitionFrame - leadFrames}>
          <Audio src={incomingAudioSrc} />
        </Sequence>
      )}
    </div>
  );
};
