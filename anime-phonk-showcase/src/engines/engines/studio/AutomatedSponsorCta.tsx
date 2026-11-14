import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SponsorCtaProps {
  ctaText: string;
  subText?: string;
  badgeLabel?: string;
  triggerFrame: number;
  durationInFrames?: number; // default 150 frames (2.5s @ 60fps)
  accentColor?: string;
}

/**
 * Automated Sponsor & Call-to-Action Injection
 *
 * Dynamically overlays an aesthetic, branded 2.5s CTA card immediately
 * post-climax when high audience engagement is reached.
 */
export const AutomatedSponsorCta: React.FC<SponsorCtaProps> = ({
  ctaText,
  subText = 'TAP LINK IN BIO FOR 4K WALLPAPER',
  badgeLabel = 'EXCLUSIVE DROP',
  triggerFrame,
  durationInFrames = 150,
  accentColor = '#FFE600',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isVisible = frame >= triggerFrame && frame < triggerFrame + durationInFrames;
  if (!isVisible) return null;

  const localFrame = frame - triggerFrame;

  // Spring punch entrance
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  const exitOpacity = interpolate(
    localFrame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        right: '5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 24px',
        backgroundColor: 'rgba(5, 5, 12, 0.92)',
        border: `2px solid ${accentColor}`,
        borderRadius: '16px',
        boxShadow: `0 0 35px ${accentColor}44`,
        transform: `scale(${entrance})`,
        opacity: exitOpacity,
        zIndex: 80,
      }}
    >
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          fontSize: '14px',
          color: '#000000',
          backgroundColor: accentColor,
          padding: '4px 12px',
          borderRadius: '20px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        {badgeLabel}
      </div>

      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 800,
          fontSize: '24px',
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '1px',
        }}
      >
        {ctaText}
      </div>

      {subText && (
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.75)',
            textAlign: 'center',
            letterSpacing: '2px',
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};
