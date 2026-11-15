import React from 'react';
import { useCurrentFrame } from 'remotion';
import { RicksClipsCaption, RICKSCLIPS_CAPTIONS } from './types.ts';
import { SafeTextContainer } from '../typography/SafeTextContainer.tsx';

interface RicksClipsCaptionsProps {
  captions?: RicksClipsCaption[];
}

/**
 * RicksClipsCaptions
 * Zero-Overflow word-synced captions engineered for mobile 9:16 (1080x1920) screens.
 * Uses SafeTextContainer with autoScale={true} so long phrases dynamically scale down
 * from 72px to fit inside the horizontal viewport without truncation or line clipping.
 */
export const RicksClipsCaptions: React.FC<RicksClipsCaptionsProps> = ({
  captions = RICKSCLIPS_CAPTIONS,
}) => {
  const frame = useCurrentFrame();

  // Find active caption
  const activeCaption = captions.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
  );

  if (!activeCaption) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 1320,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50,
        padding: '0 40px',
        boxSizing: 'border-box',
      }}
    >
      <SafeTextContainer
        text={activeCaption.text}
        containerWidth={980}
        maxLines={2}
        autoScale={true}
        baseFontSize={72}
        minFontSize={42}
        fontFamily="'Montserrat', 'Impact', 'Arial Black', sans-serif"
        fontWeight={900}
        color="#ffffff"
        textAlign="center"
        letterSpacing={1.5}
        lineHeight={1.1}
        textStyle={{
          WebkitTextStroke: '8px #000000',
          paintOrder: 'stroke fill',
          textShadow: '0 6px 20px rgba(0, 0, 0, 0.9)',
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
};
