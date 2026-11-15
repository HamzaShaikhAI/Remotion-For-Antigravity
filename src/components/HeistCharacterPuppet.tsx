import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type PuppetExpression = 'normal' | 'intense' | 'sleeping' | 'smirk' | 'shock';
export type PuppetHandsPose = 'none' | 'steering' | 'pointing' | 'sleeping' | 'curtain-pull';

export interface LeaderCalloutConfig {
  badgeTitle: string;
  badgeSubtitle?: string;
  accentColor?: string;
  badgeOffset?: { x: number; y: number };
  targetOffset?: { x: number; y: number };
}

export interface HeistCharacterPuppetProps {
  expression?: PuppetExpression;
  hasBeanie?: boolean;
  hasMustache?: boolean;
  handsPose?: PuppetHandsPose;
  headSize?: number;
  callout?: LeaderCalloutConfig;
  stopMotionFps?: number;
}

export const HeistCharacterPuppet: React.FC<HeistCharacterPuppetProps> = ({
  expression = 'normal',
  hasBeanie = false,
  hasMustache = false,
  handsPose = 'none',
  headSize = 140,
  callout,
  stopMotionFps = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quantized 16 FPS stop-motion frame
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));
  const headWobble = Math.sin(quantizedFrame * 1.8) * 1.5;

  // Callout entrance spring
  const calloutProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <div
      style={{
        position: 'relative',
        width: `${headSize}px`,
        height: `${headSize}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Head Container with Stop-Motion Wobble */}
      <div
        style={{
          width: `${headSize}px`,
          height: `${headSize}px`,
          position: 'relative',
          transform: `rotate(${headWobble}deg)`,
          transformOrigin: '50% 85%',
        }}
      >
        {/* Paper Meme Head Base */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#FAF7F2',
            border: '4.5px solid #0F172A',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), inset 0 -4px 8px rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Beanie Cap (if enabled) */}
          {hasBeanie && (
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-10px',
                right: '-10px',
                height: '52%',
                backgroundColor: '#1E293B',
                borderBottom: '4px solid #0F172A',
                borderRadius: '50% 50% 12% 12%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '6px',
              }}
            >
              {/* Beanie Rib Texture */}
              <div
                style={{
                  width: '90%',
                  height: '80%',
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #0F172A 0px, #0F172A 3px, transparent 3px, transparent 8px)',
                  opacity: 0.7,
                }}
              />
            </div>
          )}

          {/* Hair swoosh (if not wearing beanie) */}
          {!hasBeanie && (
            <svg
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '55%' }}
              viewBox="0 0 100 55"
            >
              <path
                d="M 6 35 C 15 10 40 2 60 5 C 75 8 92 20 95 35 C 80 20 65 24 50 18 C 35 12 18 22 6 35 Z"
                fill="#0F172A"
              />
            </svg>
          )}

          {/* Facial Features (Eyes, Brows, Mouth) */}
          <div
            style={{
              position: 'absolute',
              top: hasBeanie ? '52%' : '48%',
              left: 0,
              right: 0,
              height: '45%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Eyes Row */}
            {expression === 'sleeping' ? (
              // Curved sleeping closed eyelids
              <div style={{ display: 'flex', gap: '28px', marginTop: '2px' }}>
                <svg width="22" height="12" viewBox="0 0 22 12">
                  <path d="M 2 3 Q 11 11 20 3" fill="none" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
                <svg width="22" height="12" viewBox="0 0 22 12">
                  <path d="M 2 3 Q 11 11 20 3" fill="none" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
            ) : expression === 'shock' ? (
              // Wide shock circular eyes
              <div style={{ display: 'flex', gap: '22px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#FAF7F2', border: '3.5px solid #0F172A' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0F172A', margin: '1px' }} />
                </div>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#FAF7F2', border: '3.5px solid #0F172A' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0F172A', margin: '1px' }} />
                </div>
              </div>
            ) : (
              // Normal / Intense / Smirk Dot Eyes
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0F172A' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0F172A' }} />
              </div>
            )}

            {/* Mustache (for Vince) */}
            {hasMustache && (
              <div
                style={{
                  width: '26px',
                  height: '6px',
                  backgroundColor: '#0F172A',
                  borderRadius: '3px',
                  marginTop: '6px',
                  transform: 'rotate(-2deg)',
                }}
              />
            )}

            {/* Mouth */}
            <div
              style={{
                marginTop: hasMustache ? '2px' : '6px',
                width: expression === 'shock' ? '14px' : expression === 'smirk' ? '20px' : '16px',
                height: expression === 'shock' ? '14px' : '4px',
                borderRadius: expression === 'shock' ? '50%' : '3px',
                backgroundColor: '#0F172A',
                transform: expression === 'smirk' ? 'rotate(8deg)' : 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Optional Paper Mitten Hands */}
      {handsPose === 'curtain-pull' && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '-36px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FAF7F2',
            border: '4px solid #0F172A',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
          }}
        >
          {/* Thumb indent */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '2px',
              width: '12px',
              height: '16px',
              borderRadius: '6px',
              border: '2px solid #0F172A',
              backgroundColor: '#FAF7F2',
            }}
          />
        </div>
      )}

      {handsPose === 'sleeping' && (
        <div
          style={{
            position: 'absolute',
            bottom: '-70px',
            display: 'flex',
            gap: '16px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '4px solid #0F172A',
            }}
          />
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '4px solid #0F172A',
            }}
          />
        </div>
      )}

      {/* Leader Line Callout Badge (e.g. YOUR PARTNER: VINCE) */}
      {callout && (
        <div
          style={{
            position: 'absolute',
            top: `${callout.badgeOffset?.y || -90}px`,
            left: `${callout.badgeOffset?.x || -180}px`,
            opacity: calloutProgress,
            transform: `scale(${calloutProgress})`,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          {/* Badge Container */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Color Accent Stripe */}
            <div
              style={{
                width: '6px',
                backgroundColor: callout.accentColor || '#EC4899',
              }}
            />
            {/* Badge Content */}
            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: callout.accentColor || '#EC4899',
                  textTransform: 'uppercase',
                }}
              >
                {callout.badgeSubtitle || 'TARGET IDENTIFIED'}
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#F8FAFC',
                  textTransform: 'uppercase',
                }}
              >
                {callout.badgeTitle}
              </span>
            </div>
          </div>

          {/* SVG Leader Line connecting Badge to Target Dot */}
          <svg
            style={{
              position: 'absolute',
              top: '100%',
              left: '60%',
              width: '180px',
              height: '90px',
              overflow: 'visible',
            }}
          >
            <polyline
              points="0,0 40,30 110,65"
              fill="none"
              stroke={callout.accentColor || '#EC4899'}
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {/* Target Dot */}
            <circle cx="110" cy="65" r="5" fill={callout.accentColor || '#EC4899'} />
            <circle
              cx="110"
              cy="65"
              r="10"
              fill="none"
              stroke={callout.accentColor || '#EC4899'}
              strokeWidth="1.5"
              opacity={0.6}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
