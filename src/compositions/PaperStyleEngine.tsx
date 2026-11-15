import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
} from 'remotion';
import { renderBrandIcon } from '../assets/brand';
import { SafeTextContainer } from '../engines/typography';

export interface PaperStyleProps {
  titleText?: string;
  subtitleText?: string;
}

/**
 * 2.5D Paper Style Composition Engine
 * Encodes the viral 2.5D handmade stop-motion aesthetic:
 * 1. Flat cutting mat & textured paper desk backgrounds
 * 2. Big-head character cutout with thick sticker border & stacked drop shadows
 * 3. 16 FPS stop-motion framerate throttle (chunky quantization)
 * 4. Heavy kinetic typography with hard offset paper drop-shadows & SafeTextContainer zero-overflow containment
 * 5. High-density 1.20 hits/sec tactile foley soundtrack (paper slides, pops, tears, whooshes, clicks)
 */
export const PaperStyleEngine: React.FC<PaperStyleProps> = ({
  titleText = 'THE 2.5D PAPER REVOLUTION',
  subtitleText = 'Stop-motion jitter, tactile cutting mats, and sticker borders',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rule 3: 16 FPS Stop-Motion Framerate Throttle (quantizes 30/60fps down to chunky 16fps)
  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // Deterministic paper slide-in spring physics
  const cardEntrance = spring({
    frame: quantizedFrame,
    fps: stopMotionFps,
    config: { damping: 10, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#E4DFD5', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* Tactile 1.20 hits/sec Micro-SFX Paper Foley Track (19 cues across 480 frames) */}
      <Audio src={staticFile('audio/paper_foley_480f.wav')} volume={0.65} />

      {/* Rule 1: Flat Paper Cutting Mat / Textured Desk Background */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('textures/green-cutting-mat.png')})`,
          backgroundSize: 'cover',
          opacity: 0.9,
        }}
      />

      {/* Rough Paper Noise & Vignette Overlay */}
      <AbsoluteFill
        style={{
          opacity: 0.18,
          mixBlendMode: 'multiply',
          backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
        }}
      />

      {/* Rule 2: Big-Head Character Cutout with Thick Sticker Border & Soft Drop Shadow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(cardEntrance, [0, 1], [40, 0])}px) rotate(-2deg)`,
          background: '#FAF7F2',
          padding: '16px',
          borderRadius: '12px',
          border: '6px solid #EF4444', // Thick sticker border (red/white)
          boxShadow: '0 20px 30px rgba(0,0,0,0.35), 0 4px 6px rgba(0,0,0,0.2)', // Stacked physical drop shadows
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '420px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: '#CBD5E1',
            border: '4px solid #0F172A',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {renderBrandIcon('claudeStar', 120)}
        </div>

        {/* Zero-Overflow Character Badge */}
        <SafeTextContainer
          text="JED // 2.5D CUTOUT"
          containerWidth={380}
          maxLines={1}
          autoScale={true}
          baseFontSize={18}
          minFontSize={12}
          fontFamily="monospace"
          fontWeight={800}
          color="#0F172A"
          textAlign="center"
          style={{ marginTop: '12px' }}
        />
      </div>

      {/* Rule 4: Heavy Kinetic Typography (Slamming in with Hard Cuts & Zero-Overflow) */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          right: '8%',
          textAlign: 'center',
          background: '#FAF7F2',
          padding: '24px 32px',
          border: '5px solid #0F172A', // Strict 5px solid cardstock border
          boxShadow: '8px 8px 0px #0F172A', // Hard offset paper shadow
          transform: `rotate(1deg)`,
          overflow: 'hidden',
          boxSizing: 'border-box',
          maxHeight: '280px',
        }}
      >
        <SafeTextContainer
          text={titleText}
          containerWidth={840}
          maxLines={2}
          autoScale={true}
          baseFontSize={48}
          minFontSize={28}
          fontWeight={900}
          color="#0F172A"
          textAlign="center"
          lineHeight={1.15}
          tag="h2"
        />
        <SafeTextContainer
          text={subtitleText}
          containerWidth={840}
          maxLines={2}
          autoScale={true}
          baseFontSize={24}
          minFontSize={16}
          fontWeight={600}
          color="#475569"
          textAlign="center"
          style={{ marginTop: '12px' }}
          tag="p"
        />
      </div>
    </AbsoluteFill>
  );
};
