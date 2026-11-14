import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';

export interface WtfHookProps {
  climaxTeaserFrame: React.ReactNode;
  mainTimeline: React.ReactNode;
  teaserDurationFrames?: number; // default 30 frames (0.5s @ 60fps)
}

/**
 * The "WTF" Hook Generator
 *
 * Duplicates a high-octane climax frame to play for exactly 0.5s at 0.0s,
 * creating an intense curiosity gap that freezes the viewer's thumb from scrolling.
 */
export const WtfHookGenerator: React.FC<WtfHookProps> = ({
  climaxTeaserFrame,
  mainTimeline,
  teaserDurationFrames = 30,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 0.0s - 0.5s: Climax Teaser Shock Flash */}
      <Sequence from={0} durationInFrames={teaserDurationFrames}>
        <div
          style={{
            width: '100%',
            height: '100%',
            filter: 'contrast(1.4) brightness(1.15)',
          }}
        >
          {climaxTeaserFrame}
        </div>
      </Sequence>

      {/* 0.5s Onward: Main Narrative Timeline */}
      <Sequence from={teaserDurationFrames}>
        {mainTimeline}
      </Sequence>
    </AbsoluteFill>
  );
};
