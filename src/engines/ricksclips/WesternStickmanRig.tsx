import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { RicksClipsExpression, WesternCostume } from './types';
import { motionTokens } from '../../tokens/motion';

interface WesternStickmanRigProps {
  expression?: RicksClipsExpression;
  costume?: Partial<WesternCostume>;
  scale?: number;
  flipX?: boolean;
  pose?: 'stand' | 'duel_ready' | 'thinking' | 'knockout' | 'sitting';
  hatFlyProgress?: number; // 0 to 1 when hit
}

export const WesternStickmanRig: React.FC<WesternStickmanRigProps> = ({
  expression = 'neutral',
  costume = {},
  scale = 1.0,
  flipX = false,
  pose = 'stand',
  hatFlyProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle idle breathing bounce
  const breatheCycle = Math.sin((frame * 2 * Math.PI) / 45);
  const breatheY = pose === 'knockout' ? 0 : breatheCycle * 2.5;

  const defaultCostume: WesternCostume = {
    hatColor: '#fef3c7', // Cream cowboy hat
    hatBandColor: '#78350f', // Dark brown band
    vestColor: '#92400e', // Leather brown vest
    shirtColor: '#0d9488', // Teal shirt
    hasMustache: true,
    hasStraw: true,
    hasPoncho: false,
    hasBandolier: false,
    hasHolster: true,
    ...costume,
  };

  // Hat flying trajectory during knockout
  const hatX = hatFlyProgress * -140;
  const hatY = -hatFlyProgress * 220 + hatFlyProgress * hatFlyProgress * 120;
  const hatRot = hatFlyProgress * -120;

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 520,
        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1})`,
        transformOrigin: 'bottom center',
        pointerEvents: 'none',
      }}
    >
      <svg
        width="300"
        height="520"
        viewBox="-150 -320 300 520"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Head 2.5D Ambient Top Shadow */}
          <radialGradient id="headShade" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fed7aa" />
          </radialGradient>
          {/* Hat Shading */}
          <linearGradient id="hatShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>
          {/* Ground Contact Shadow Filter */}
          <filter id="groundShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* GROUND CONTACT SHADOW (Soft Realistic 3D Ground Ellipse) */}
        {/* ======================================================== */}
        <ellipse
          cx="0"
          cy="185"
          rx={pose === 'knockout' ? 95 : 55}
          ry={pose === 'knockout' ? 24 : 14}
          fill="rgba(15, 23, 42, 0.45)"
          filter="url(#groundShadowBlur)"
        />

        {/* ======================================================== */}
        {/* CHARACTER ROOT CONTAINER                                 */}
        {/* ======================================================== */}
        <g
          transform={
            pose === 'knockout'
              ? 'translate(-30, 90) rotate(-65)'
              : `translate(0, ${breatheY})`
          }
        >
          {/* 1. LEGS (Articulated Thin Dark Navy Strokes) */}
          <g stroke="#09090b" strokeWidth="6" strokeLinecap="round">
            {pose === 'stand' && (
              <>
                {/* Left Leg */}
                <line x1="-16" y1="65" x2="-20" y2="175" />
                {/* Right Leg */}
                <line x1="16" y1="65" x2="20" y2="175" />
                {/* Shoes */}
                <ellipse cx="-24" cy="180" rx="10" ry="5" fill="#09090b" />
                <ellipse cx="26" cy="180" rx="10" ry="5" fill="#09090b" />
              </>
            )}
            {pose === 'duel_ready' && (
              <>
                <line x1="-16" y1="65" x2="-32" y2="175" />
                <line x1="16" y1="65" x2="32" y2="175" />
                <ellipse cx="-38" cy="180" rx="12" ry="6" fill="#09090b" />
                <ellipse cx="38" cy="180" rx="12" ry="6" fill="#09090b" />
              </>
            )}
            {pose === 'knockout' && (
              <>
                <line x1="-16" y1="65" x2="-45" y2="160" />
                <line x1="16" y1="65" x2="35" y2="165" />
                <ellipse cx="-50" cy="165" rx="10" ry="5" fill="#09090b" />
                <ellipse cx="40" cy="170" rx="10" ry="5" fill="#09090b" />
              </>
            )}
            {pose === 'thinking' && (
              <>
                <line x1="-16" y1="65" x2="-22" y2="175" />
                <line x1="16" y1="65" x2="18" y2="175" />
                <ellipse cx="-26" cy="180" rx="10" ry="5" fill="#09090b" />
                <ellipse cx="22" cy="180" rx="10" ry="5" fill="#09090b" />
              </>
            )}
          </g>

          {/* 2. TORSO & CLOTHING */}
          <g>
            {/* Belt */}
            <rect x="-30" y="58" width="60" height="12" rx="2" fill="#451a03" stroke="#09090b" strokeWidth="3" />
            {/* Brass Belt Buckle */}
            <circle cx="0" cy="64" r="8" fill="#facc15" stroke="#78350f" strokeWidth="2" />
            <circle cx="0" cy="64" r="4" fill="#ca8a04" />

            {/* Inner Shirt */}
            <path
              d="M -26 0 L 26 0 L 28 60 L -28 60 Z"
              fill={defaultCostume.shirtColor}
              stroke="#09090b"
              strokeWidth="4"
            />

            {/* Outer Vest / Poncho */}
            {defaultCostume.hasPoncho ? (
              <path
                d="M -38 0 L 38 0 L 46 64 L -46 64 Z"
                fill="#dc2626"
                stroke="#09090b"
                strokeWidth="4"
              />
            ) : (
              <>
                {/* Left Vest Flap */}
                <path
                  d="M -28 0 L -8 0 L -12 60 L -30 60 Z"
                  fill={defaultCostume.vestColor}
                  stroke="#09090b"
                  strokeWidth="3.5"
                />
                {/* Right Vest Flap */}
                <path
                  d="M 28 0 L 8 0 L 12 60 L 30 60 Z"
                  fill={defaultCostume.vestColor}
                  stroke="#09090b"
                  strokeWidth="3.5"
                />
                {/* Golden Vest Buttons */}
                <circle cx="-18" cy="22" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
                <circle cx="-19" cy="42" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
              </>
            )}

            {/* Bandolier Ammo Loops */}
            {defaultCostume.hasBandolier && (
              <line x1="-28" y1="5" x2="28" y2="58" stroke="#fde047" strokeWidth="6" strokeDasharray="4 4" />
            )}

            {/* Holster on Right Hip with Revolver Grip */}
            {defaultCostume.hasHolster && (
              <g transform="translate(28, 48)">
                <path
                  d="M 0 0 L 14 0 L 10 38 L 0 32 Z"
                  fill="#451a03"
                  stroke="#09090b"
                  strokeWidth="3"
                />
                {/* Gun Grip */}
                <rect
                  x="2"
                  y="-16"
                  width="10"
                  height="18"
                  rx="3"
                  fill="#f8fafc"
                  stroke="#09090b"
                  strokeWidth="2.5"
                  transform="rotate(25)"
                />
                <circle cx="8" cy="-8" r="2" fill="#71717a" />
              </g>
            )}
          </g>

          {/* 3. ARMS & HANDS */}
          <g stroke="#09090b" strokeWidth="5.5" strokeLinecap="round">
            {pose === 'stand' && (
              <>
                {/* Left Arm hanging down */}
                <path d="M -26 10 Q -42 45 -34 75" fill="none" />
                <circle cx="-34" cy="77" r="7" fill="#09090b" stroke="none" />
                {/* Right Arm near hip/holster */}
                <path d="M 26 10 Q 38 35 34 68" fill="none" />
                <circle cx="34" cy="70" r="7" fill="#09090b" stroke="none" />
              </>
            )}
            {pose === 'duel_ready' && (
              <>
                {/* Ready to draw posture */}
                <path d="M -26 10 Q -48 35 -38 60" fill="none" />
                <circle cx="-38" cy="62" r="7" fill="#09090b" stroke="none" />
                {/* Right Hand hovered directly over revolver */}
                <path d="M 26 10 Q 45 32 38 52" fill="none" />
                <circle cx="38" cy="54" r="7.5" fill="#09090b" stroke="none" />
              </>
            )}
            {pose === 'thinking' && (
              <>
                {/* Hand on chin pose */}
                <path d="M -26 10 Q -38 45 -30 75" fill="none" />
                <circle cx="-30" cy="77" r="7" fill="#09090b" stroke="none" />
                {/* Arm bending up to chin */}
                <path d="M 26 10 Q 42 28 8 -22" fill="none" />
                <circle cx="8" cy="-24" r="7" fill="#09090b" stroke="none" />
              </>
            )}
            {pose === 'knockout' && (
              <>
                <path d="M -26 10 Q -60 -10 -75 25" fill="none" />
                <circle cx="-75" cy="27" r="7" fill="#09090b" stroke="none" />
                <path d="M 26 10 Q 55 -5 65 35" fill="none" />
                <circle cx="65" cy="37" r="7" fill="#09090b" stroke="none" />
              </>
            )}
          </g>

          {/* 4. OVERSIZED CIRCULAR HEAD & EXPRESSIVE FACE */}
          <g transform="translate(0, -65)">
            {/* Big Circular Head */}
            <circle
              cx="0"
              cy="0"
              r="64"
              fill="url(#headShade)"
              stroke="#09090b"
              strokeWidth="5"
            />
            {/* Top Specular Arc Highlight */}
            <path
              d="M -42 -28 A 54 54 0 0 1 42 -28"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Mustache */}
            {defaultCostume.hasMustache && (
              <g transform="translate(0, 18)">
                <path
                  d="M 0 0 C -12 -12, -26 4, -18 10 C -8 14, 0 4, 0 0 Z"
                  fill="#09090b"
                />
                <path
                  d="M 0 0 C 12 -12, 26 4, 18 10 C 8 14, 0 4, 0 0 Z"
                  fill="#09090b"
                />
              </g>
            )}

            {/* Wheat Straw */}
            {defaultCostume.hasStraw && (
              <line
                x1="-14"
                y1="16"
                x2="-48"
                y2="28"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {/* Eyebrows & Eyes according to Expression */}
            {expression === 'smug' && (
              <>
                {/* Left Eyebrow (Relaxed) */}
                <line x1="-34" y1="-16" x2="-10" y2="-18" stroke="#09090b" strokeWidth="5.5" strokeLinecap="round" />
                {/* Right Eyebrow (Arched Up) */}
                <line x1="10" y1="-26" x2="34" y2="-18" stroke="#09090b" strokeWidth="5.5" strokeLinecap="round" />
                {/* Half-Closed Eyes */}
                <path d="M -30 -6 Q -22 2 -14 -6" fill="none" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <circle cx="-22" cy="-4" r="3" fill="#09090b" />
                <path d="M 14 -6 Q 22 2 30 -6" fill="none" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <circle cx="22" cy="-4" r="3" fill="#09090b" />
              </>
            )}

            {expression === 'neutral' && (
              <>
                <line x1="-32" y1="-18" x2="-12" y2="-18" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <line x1="12" y1="-18" x2="32" y2="-18" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <circle cx="-22" cy="-4" r="5" fill="#09090b" />
                <circle cx="22" cy="-4" r="5" fill="#09090b" />
                <circle cx="-20" cy="-6" r="1.5" fill="#ffffff" />
                <circle cx="24" cy="-6" r="1.5" fill="#ffffff" />
              </>
            )}

            {expression === 'shocked' && (
              <>
                {/* High Arched Eyebrows */}
                <path d="M -34 -28 Q -22 -36 -10 -28" fill="none" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <path d="M 10 -28 Q 22 -36 34 -28" fill="none" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                {/* Big Round Eyes */}
                <circle cx="-22" cy="-10" r="14" fill="#ffffff" stroke="#09090b" strokeWidth="4" />
                <circle cx="-22" cy="-10" r="6" fill="#09090b" />
                <circle cx="22" cy="-10" r="14" fill="#ffffff" stroke="#09090b" strokeWidth="4" />
                <circle cx="22" cy="-10" r="6" fill="#09090b" />
                {/* Wide Open 'O' Mouth */}
                <ellipse cx="0" cy="22" rx="10" ry="14" fill="#09090b" />
              </>
            )}

            {expression === 'thinking' && (
              <>
                <line x1="-32" y1="-22" x2="-10" y2="-14" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <line x1="10" y1="-14" x2="32" y2="-22" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <circle cx="-20" cy="-6" r="12" fill="#ffffff" stroke="#09090b" strokeWidth="4" />
                <circle cx="-20" cy="-6" r="5" fill="#09090b" />
                <circle cx="20" cy="-6" r="12" fill="#ffffff" stroke="#09090b" strokeWidth="4" />
                <circle cx="20" cy="-6" r="5" fill="#09090b" />
              </>
            )}

            {expression === 'knockout' && (
              <>
                {/* X X Eyes */}
                <path d="M -28 -12 L -14 2 M -14 -12 L -28 2" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                <path d="M 14 -12 L 28 2 M 28 -12 L 14 2" stroke="#09090b" strokeWidth="5" strokeLinecap="round" />
                {/* Wavy Mouth */}
                <path d="M -12 18 Q 0 12 12 18" fill="none" stroke="#09090b" strokeWidth="4.5" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* 5. COWBOY HAT (Flies off during knockout) */}
          <g transform={`translate(${hatX}, ${-105 + hatY}) rotate(${hatRot})`}>
            {/* Wide Hat Brim */}
            <path
              d="M -115 0 C -70 -16, 70 -16, 115 0 C 80 18, -80 18, -115 0 Z"
              fill={defaultCostume.hatColor}
              stroke="#09090b"
              strokeWidth="5"
            />
            {/* Crown of the Hat */}
            <path
              d="M -45 -6 C -48 -45, -35 -72, 0 -76 C 35 -72, 48 -45, 45 -6 Z"
              fill={defaultCostume.hatColor}
              stroke="#09090b"
              strokeWidth="5"
            />
            {/* Crown Indentation Shading */}
            <path
              d="M -22 -62 Q 0 -54 22 -62"
              fill="none"
              stroke="#000000"
              strokeWidth="3.5"
              opacity="0.25"
            />
            {/* Dark Leather Hatband */}
            <path
              d="M -44 -12 C -20 -18, 20 -18, 44 -12 L 45 -4 C 20 -10, -20 -10, -45 -4 Z"
              fill={defaultCostume.hatBandColor}
              stroke="#09090b"
              strokeWidth="3"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
