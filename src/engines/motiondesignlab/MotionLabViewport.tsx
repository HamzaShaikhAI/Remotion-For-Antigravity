import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { MotionLabControlId } from './types';

interface MotionLabViewportProps {
  activeControl: MotionLabControlId;
}

export const MotionLabViewport: React.FC<MotionLabViewportProps> = ({ activeControl }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Timecode calculation
  const totalSeconds = (frame / fps).toFixed(1);
  const framesMod = (frame % fps).toString().padStart(2, '0');
  const secMod = Math.floor(frame / fps).toString().padStart(2, '0');
  const timecode = `00:00:${secMod}:${framesMod}`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 290,
        left: 56,
        right: 56,
        height: 800,
        backgroundColor: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 15,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Viewport Top Window Bar */}
      <div
        style={{
          height: 48,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: "'SF Mono', monospace",
          fontSize: 13,
          color: '#64748b',
        }}
      >
        {/* Left: Traffic Lights & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f87171' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fbbf24' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#34d399' }} />
          </div>
          <span style={{ fontWeight: 800, color: '#09090b', letterSpacing: 1.5 }}>
            MOTION LAB / PREVIEW
          </span>
        </div>

        {/* Center: Active Control Name */}
        <div style={{ color: '#d97706', fontWeight: 800, letterSpacing: 2 }}>
          {activeControl.replace('_', '-')}
        </div>

        {/* Right: Duration & Timecode */}
        <div style={{ display: 'flex', gap: 20 }}>
          <span>{totalSeconds}s / 15.0s</span>
          <span style={{ fontWeight: 800, color: '#09090b' }}>{timecode}</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: activeControl === 'SPACING' ? '#f8fafc' : '#09090b',
          overflow: 'hidden',
        }}
      >
        {/* ======================================================== */}
        {/* SIMULATION 1: SPACING (Bouncing Ball Ghost Trajectory)   */}
        {/* ======================================================== */}
        {activeControl === 'SPACING' && (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Trajectory Ghost Circles (Slow In, Slow Out Spacing Arc) */}
            <svg width="100%" height="100%" viewBox="0 0 1400 680" style={{ position: 'absolute' }}>
              {/* Floor Baseline */}
              <line x1="120" y1="520" x2="1280" y2="520" stroke="#09090b" strokeWidth="4" />

              {/* Parabolic Guide Path */}
              <path
                d="M 280 520 Q 520 80 760 520"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4 6"
              />

              {/* 11 Ghost Arcs showing deceleration at apex (Slow in, slow out) */}
              {Array.from({ length: 11 }, (_, i) => {
                const t = i / 10;
                // Parabolic point with ease at apex
                const gX = 280 + t * 480;
                const gY = 520 - 440 * (4 * t * (1 - t));
                return (
                  <circle
                    key={i}
                    cx={gX}
                    cy={gY}
                    r={36}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="2 4"
                    opacity={0.7}
                  />
                );
              })}

              {/* "slow in, slow out" cursive note */}
              <text x="360" y="160" fill="#2563eb" fontSize="24" fontFamily="'Caveat', 'Segoe Script', cursive" fontWeight="700">
                slow in, slow out ➔
              </text>

              {/* "squash!" callout at floor */}
              <text x="740" y="580" fill="#f43f5e" fontSize="26" fontFamily="'Caveat', 'Segoe Script', cursive" fontWeight="700">
                \ squash!
              </text>
            </svg>

            {/* Live Animated Blue Bouncing Ball */}
            {(() => {
              const cycle = (frame % 45) / 45;
              const ballX = 280 + cycle * 480;
              const ballY = 520 - 440 * (4 * cycle * (1 - cycle));
              const isFloor = cycle < 0.08 || cycle > 0.92;
              const scaleX = isFloor ? 1.4 : 1.0;
              const scaleY = isFloor ? 0.65 : 1.0;

              return (
                <div
                  style={{
                    position: 'absolute',
                    left: ballX,
                    top: ballY - 36,
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 60%, #1e40af 100%)',
                    transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`,
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
                  }}
                />
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* SIMULATION 2: TYPOGRAPHY (3D Kinetic Spinning Type)      */}
        {/* ======================================================== */}
        {activeControl === 'TYPOGRAPHY' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: 1200,
            }}
          >
            {/* 3D Spinning Typography */}
            {(() => {
              const spinFrame = (frame - 110) % 60;
              const rotY = interpolate(spinFrame, [0, 45, 60], [0, 360, 450]);

              return (
                <div
                  style={{
                    fontSize: 220,
                    fontWeight: 900,
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    color: '#ffffff',
                    letterSpacing: 8,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    transform: `rotateY(${rotY}deg)`,
                    textShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 80px rgba(255,255,255,0.2)',
                  }}
                >
                  SPIN
                </div>
              );
            })()}

            {/* Cursive Note */}
            <div
              style={{
                marginTop: 20,
                color: '#38bdf8',
                fontSize: 28,
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
              }}
            >
              rotateY 450°
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SIMULATION 3: FOLLOW-THROUGH (Procedural Particle Comet) */}
        {/* ======================================================== */}
        {activeControl === 'FOLLOW_THROUGH' && (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Subtle Dot Matrix Background */}
            <svg width="100%" height="100%" style={{ position: 'absolute' }}>
              <defs>
                <pattern id="view-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#334155" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#view-dots)" />
            </svg>

            {/* Undulating Comet Head & Trailing Particles */}
            <svg width="100%" height="100%" viewBox="0 0 1400 680" style={{ position: 'absolute' }}>
              {Array.from({ length: 42 }, (_, i) => {
                const lag = i * 2.2;
                const pFrame = (frame * 1.5 - lag);
                const pX = 700 + Math.cos(pFrame * 0.05) * 320 + Math.sin(pFrame * 0.1) * 80;
                const pY = 340 + Math.sin(pFrame * 0.06) * 180 + Math.cos(pFrame * 0.08) * 60;
                const pRadius = Math.max(3, 24 - i * 0.55);
                const pOpacity = Math.max(0.1, 1 - i / 42);
                const pColor = i < 10 ? '#38bdf8' : i < 24 ? '#ec4899' : '#fb7185';

                return (
                  <circle
                    key={i}
                    cx={pX}
                    cy={pY}
                    r={pRadius}
                    fill={pColor}
                    opacity={pOpacity}
                    filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))"
                  />
                );
              })}

              <text x="820" y="440" fill="#38bdf8" fontSize="28" fontFamily="'Caveat', cursive" fontWeight="700">
                fol ➔ follow-through
              </text>
            </svg>
          </div>
        )}

        {/* ======================================================== */}
        {/* SIMULATION 4: ANTICIPATION (Motion Smear Pullback)        */}
        {/* ======================================================== */}
        {activeControl === 'ANTICIPATION' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Cyan Motion Smear Beam */}
            {(() => {
              const antCycle = (frame % 30) / 30;
              // Pull down (0-0.3), snap up (0.3-0.7), settle (0.7-1.0)
              const scaleY = antCycle < 0.3 ? 0.7 : antCycle < 0.6 ? 2.8 : 1.0;
              const offsetY = antCycle < 0.3 ? 60 : antCycle < 0.6 ? -120 : 0;

              return (
                <div
                  style={{
                    width: 32,
                    height: 140,
                    borderRadius: 16,
                    background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                    transform: `translateY(${offsetY}px) scaleY(${scaleY})`,
                    boxShadow: '0 0 40px rgba(56, 189, 248, 0.8)',
                    transition: 'transform 0.05s ease',
                  }}
                />
              );
            })()}

            {/* Cursive Label */}
            <div
              style={{
                position: 'absolute',
                top: 240,
                right: 520,
                color: '#38bdf8',
                fontSize: 28,
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
              }}
            >
              anticipation ➔
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM TIMELINE SCRUBBER & DIAMOND KEYFRAMES             */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 48,
            right: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Diamond Track */}
          <div style={{ flex: 1, height: 2, backgroundColor: '#334155', position: 'relative' }}>
            {/* 6 Diamond Keyframes */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((t, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: -5,
                  left: `${t * 100}%`,
                  width: 10,
                  height: 10,
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #09090b',
                  transform: 'rotate(45deg) translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Active Playhead Diamond */}
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: `${((frame % 456) / 456) * 100}%`,
                width: 16,
                height: 16,
                backgroundColor: '#ea580c',
                border: '2px solid #ffffff',
                transform: 'rotate(45deg) translate(-50%, -50%)',
                boxShadow: '0 0 10px rgba(234, 88, 12, 0.8)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
