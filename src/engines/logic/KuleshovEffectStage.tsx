import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';

export interface KuleshovEffectStageProps {
  destructionScene: React.ReactNode;
  neutralFaceScene: React.ReactNode;
  cutFrame: number;
  totalDurationFrames: number;
  subtleZoom?: boolean;
}

/**
 * The Kuleshov Effect Generator
 *
 * Juxtaposes a violent clash or explosion immediately before a neutral,
 * emotionless character close-up. The human subconscious projects cold ruthlessness
 * and calculation onto the blank expression.
 */
export const KuleshovEffectStage: React.FC<KuleshovEffectStageProps> = ({
  destructionScene,
  neutralFaceScene,
  cutFrame,
  totalDurationFrames,
  subtleZoom = true,
}) => {
  const frame = useCurrentFrame();

  const faceDuration = totalDurationFrames - cutFrame;
  const localFaceFrame = Math.max(0, frame - cutFrame);
  const zoomScale = subtleZoom
    ? interpolate(localFaceFrame, [0, faceDuration], [1.0, 1.08], { extrapolateRight: 'clamp' })
    : 1.0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#020205' }}>
      {/* 1. Act I: Destruction Climax */}
      <Sequence from={0} durationInFrames={cutFrame}>
        {destructionScene}
      </Sequence>

      {/* 2. Act II: Cold Neutral Face (Kuleshov Projection) */}
      <Sequence from={cutFrame} durationInFrames={faceDuration}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoomScale})`,
            filter: 'contrast(1.2) brightness(0.95)',
          }}
        >
          {neutralFaceScene}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
