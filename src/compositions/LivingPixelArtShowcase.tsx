import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { PixelArtCanvas, PixelArtInteractiveControls, PixelArtHeader } from '../engines/pixelart/index.ts';

/**
 * 1. Pure Living Pixel Art Loop (772x1024 @ 12 FPS, 120 frames = 10.0s)
 * Exactly reproduces the Claude Fable 5.2 video export output:
 * - 2x resolution of 386x512 grid (772x1024)
 * - 12 FPS strict seamless loop
 * - Pure animation without interface overlays
 */
export const LivingPixelArtLoop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#050810' }}>
      <PixelArtCanvas
        width={772}
        height={1024}
        showOverlayHud={false}
        sliders={{
          motionIntensity: 1.0,
          environmentalMotion: 1.0,
          ambientEffects: 1.0,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 2. Living Pixel Art Studio Showcase (1200x1600 @ 12 FPS, 120 frames = 10.0s)
 * Shows the full interactive studio with header, live viewport, and real-time modulated sliders:
 * - Phase 1 (Frames 0-30): Default Balanced Parameters (1.0x / 1.0x / 1.0x)
 * - Phase 2 (Frames 31-60): Heavy Environmental Surge (Rain Density 1.8x, Water Chop)
 * - Phase 3 (Frames 61-90): Ambient Night Glow (Lantern Flicker 1.9x, Shoji Amber Pulse)
 * - Phase 4 (Frames 91-120): Production Video Export Trigger & Countdown Simulation
 */
export const LivingPixelArtStudioShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic slider automation across showcase phases
  let motionVal = 1.0;
  let envVal = 1.0;
  let ambientVal = 1.0;
  let isRecording = false;

  if (frame < 30) {
    // Phase 1: Balanced
    motionVal = 1.0;
    envVal = 1.0;
    ambientVal = 1.0;
  } else if (frame < 60) {
    // Phase 2: Environmental Motion Boost
    envVal = interpolate(frame, [30, 45, 60], [1.0, 1.85, 1.6], { extrapolateRight: 'clamp' });
    motionVal = 1.2;
    ambientVal = 0.9;
  } else if (frame < 90) {
    // Phase 3: Ambient Glow Boost
    envVal = 1.1;
    motionVal = 0.85;
    ambientVal = interpolate(frame, [60, 75, 90], [0.9, 1.95, 1.7], { extrapolateRight: 'clamp' });
  } else {
    // Phase 4: Export trigger
    envVal = 1.2;
    motionVal = 1.0;
    ambientVal = 1.2;
    isRecording = true;
  }

  const recordingRemainingSec = Math.max(1, 10 - Math.floor((frame - 90) / 3));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090b10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 60px 40px 60px',
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Studio Header */}
      <PixelArtHeader
        title="LIVING ANIMATED PIXEL ART"
        subtitle="CLAUDE FABLE 5.2 • HARMONIC 12 FPS DISPLACEMENT WAVE & WATER SHIMMER"
        gridInfo="386×512 GRID • 2X SCALE (772×1024) • ~100 INDEXED COLORS"
      />

      {/* Main Pixel Canvas Frame */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#000000',
          borderRadius: 20,
          padding: '16px 16px 20px 16px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px #1e2638',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Mac Viewport Titlebar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 8px 8px 8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
          <div style={{ color: '#cbd5e1', fontWeight: 600, letterSpacing: 1 }}>
            JAPANESE RYOKAN RAIN • 772×1024 (12 FPS)
          </div>
          <div style={{ color: '#f97316' }}>
            {String(Math.floor(frame / 12)).padStart(2, '0')}:{String(frame % 12).padStart(2, '0')}:00
          </div>
        </div>

        {/* The Living Pixel Canvas */}
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
          {isRecording && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                backgroundColor: 'rgba(220, 38, 38, 0.95)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                }}
              />
              <span>REC 00:0{recordingRemainingSec}</span>
            </div>
          )}

          <PixelArtCanvas
            width={772}
            height={1024}
            showOverlayHud={true}
            sliders={{
              motionIntensity: motionVal,
              environmentalMotion: envVal,
              ambientEffects: ambientVal,
            }}
          />
        </div>

        {/* Telemetry Strip */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#64748b',
            paddingTop: 4,
          }}
        >
          <span>PALETTE: ~100 INDEXED COLORS</span>
          <span>SHADERS: SINE WAVE DISPLACEMENT &amp; SPLASH PHASING</span>
          <span>NEAREST-NEIGHBOR: CRISP EDGES</span>
        </div>
      </div>

      {/* Interactive Sliders & Action Dock */}
      <div style={{ width: '100%', maxWidth: 960 }}>
        <PixelArtInteractiveControls
          sliders={{
            motionIntensity: motionVal,
            environmentalMotion: envVal,
            ambientEffects: ambientVal,
          }}
          activeDurationSec={10}
          isRecording={isRecording}
          isPlaying={true}
        />
      </div>
    </AbsoluteFill>
  );
};
