import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';

export interface MotionLabMascotProps {
  frame: number;
  expression?: 'star' | 'wink' | 'happy' | 'neutral';
  scale?: number;
  bobIntensity?: number;
  action?: 'idle' | 'jump' | 'turntable' | 'peek';
  style?: React.CSSProperties;
}

export const MotionLabMascot: React.FC<MotionLabMascotProps> = ({
  frame,
  expression = 'star',
  scale = 1.0,
  bobIntensity = 1.0,
  action = 'idle',
  style = {},
}) => {
  const { fps } = useVideoConfig();

  // Idle breathing & floating bob
  const idleY = Math.sin(frame * 0.1) * 6 * bobIntensity;
  const earWiggle = Math.sin(frame * 0.15) * 3;

  // Jump Squash & Stretch physics
  let jumpY = 0;
  let stretchX = 1;
  let stretchY = 1;
  if (action === 'jump') {
    const jumpCycle = (frame % 60) / 60;
    jumpY = -Math.sin(jumpCycle * Math.PI) * 45;
    if (jumpCycle < 0.15) {
      stretchX = 1.15;
      stretchY = 0.85; // squash before takeoff
    } else if (jumpCycle < 0.6) {
      stretchX = 0.92;
      stretchY = 1.12; // stretch in air
    } else {
      stretchX = 1.08;
      stretchY = 0.94; // landing compression
    }
  }

  // Turntable rotation physics
  let rotateY = 0;
  if (action === 'turntable') {
    rotateY = (frame * 1.5) % 360;
  }

  // Peeking from bottom physics
  let peekY = 0;
  if (action === 'peek') {
    peekY = Math.sin(frame * 0.08) * 8;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 180,
        height: 150,
        transform: `translate3d(0px, ${idleY + jumpY + peekY}px, 0px) scale(${scale * stretchX}, ${scale * stretchY})`,
        transformStyle: 'preserve-3d',
        transformOrigin: 'bottom center',
        ...style,
      }}
    >
      {/* Soft Ambient Ground Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: -18,
          left: '12%',
          width: '76%',
          height: 24,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.28)',
          filter: 'blur(8px)',
          transform: `scale(${1 - (jumpY / -45) * 0.35})`,
        }}
      />

      {/* 4 Little Stubby Pill Legs */}
      <div style={{ position: 'absolute', bottom: -8, left: 24, width: 22, height: 24, borderRadius: 10, backgroundColor: '#c8533c', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: -8, left: 56, width: 22, height: 24, borderRadius: 10, backgroundColor: '#c8533c', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: -8, left: 100, width: 22, height: 24, borderRadius: 10, backgroundColor: '#c8533c', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: -8, left: 132, width: 22, height: 24, borderRadius: 10, backgroundColor: '#c8533c', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)' }} />

      {/* Left Ear */}
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: 48,
          width: 22,
          height: 28,
          borderRadius: '12px 6px 6px 12px',
          background: 'linear-gradient(135deg, #f0836c 0%, #d45942 100%)',
          boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.2)',
          transform: `rotate(${earWiggle}deg)`,
        }}
      />

      {/* Right Ear */}
      <div
        style={{
          position: 'absolute',
          right: -14,
          top: 48,
          width: 22,
          height: 28,
          borderRadius: '6px 12px 12px 6px',
          background: 'linear-gradient(135deg, #f0836c 0%, #d45942 100%)',
          boxShadow: 'inset -2px 2px 4px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.2)',
          transform: `rotate(${-earWiggle}deg)`,
        }}
      />

      {/* Main 3D Rounded Rectangular Body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 36,
          background: 'linear-gradient(180deg, #f68c76 0%, #e86e55 45%, #cf5039 100%)',
          boxShadow: `
            inset 0 4px 8px rgba(255, 255, 255, 0.65),
            inset 0 -8px 12px rgba(130, 30, 20, 0.45),
            inset -4px 0 6px rgba(180, 50, 30, 0.35),
            inset 4px 0 6px rgba(255, 170, 150, 0.5),
            0 16px 32px rgba(160, 50, 30, 0.35)
          `,
          overflow: 'hidden',
        }}
      >
        {/* Specular Top-Light Glaze */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: '12%',
            width: '76%',
            height: 28,
            borderRadius: 20,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Soft Pink Cheek Blushes */}
        <div
          style={{
            position: 'absolute',
            top: 76,
            left: 20,
            width: 26,
            height: 14,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 100, 100, 0.4)',
            filter: 'blur(3px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 76,
            right: 20,
            width: 26,
            height: 14,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 100, 100, 0.4)',
            filter: 'blur(3px)',
          }}
        />

        {/* Eyes & Facial Expression */}
        {expression === 'star' && (
          <div style={{ position: 'absolute', top: 48, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            {/* Left Star Eye */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1e1818">
              <path d="M12 0 C12 6, 6 12, 0 12 C6 12, 12 18, 12 24 C12 18, 18 12, 24 12 C18 12, 12 6, 12 0 Z" />
            </svg>
            {/* Right Star Eye */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1e1818">
              <path d="M12 0 C12 6, 6 12, 0 12 C6 12, 12 18, 12 24 C12 18, 18 12, 24 12 C18 12, 12 6, 12 0 Z" />
            </svg>
          </div>
        )}

        {expression === 'wink' && (
          <div style={{ position: 'absolute', top: 48, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 42px' }}>
            {/* Left Winking Eye */}
            <svg width="26" height="16" viewBox="0 0 24 14" fill="none" stroke="#1e1818" strokeWidth="4" strokeLinecap="round">
              <path d="M 2 10 Q 12 0 22 10" />
            </svg>
            {/* Right Open Eye */}
            <div style={{ width: 14, height: 22, borderRadius: 5, backgroundColor: '#1e1818', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 3, left: 3, width: 5, height: 5, borderRadius: 2, backgroundColor: '#ffffff' }} />
            </div>
          </div>
        )}

        {expression === 'happy' && (
          <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 42px' }}>
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="#1e1818" strokeWidth="4" strokeLinecap="round">
              <path d="M 2 10 Q 12 2 22 10" />
            </svg>
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="#1e1818" strokeWidth="4" strokeLinecap="round">
              <path d="M 2 10 Q 12 2 22 10" />
            </svg>
          </div>
        )}

        {expression === 'neutral' && (
          <div style={{ position: 'absolute', top: 50, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 44px' }}>
            <div style={{ width: 14, height: 18, borderRadius: 7, backgroundColor: '#1e1818' }} />
            <div style={{ width: 14, height: 18, borderRadius: 7, backgroundColor: '#1e1818' }} />
          </div>
        )}

        {/* Happy Smiling Mouth with Pink Tongue */}
        <div
          style={{
            position: 'absolute',
            top: 82,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 32,
            height: 18,
            borderRadius: '0 0 16px 16px',
            backgroundColor: '#1e1818',
            overflow: 'hidden',
          }}
        >
          {/* Tongue */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 22,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#fb7185',
            }}
          />
        </div>
      </div>
    </div>
  );
};
