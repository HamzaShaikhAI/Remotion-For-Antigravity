import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { MotionLabCategory } from './types.ts';

export interface MotionLabNavProps {
  currentCategory: MotionLabCategory;
  actNumber: string; // "01 / 04"
  actTitle: string; // "Video"
  installedCount: number; // 0..16
  frame: number;
  hideDock?: boolean;
}

const TABS: { id: MotionLabCategory; label: string }[] = [
  { id: 'video', label: 'VIDEO' },
  { id: 'motion', label: 'MOTION' },
  { id: '3d', label: '3D' },
  { id: 'finish', label: 'FINISH' },
];

export const MotionLabNav: React.FC<MotionLabNavProps> = ({
  currentCategory,
  actNumber,
  actTitle,
  installedCount,
  frame,
  hideDock = false,
}) => {
  const { fps } = useVideoConfig();

  // Active tab index for dock pill glide
  const activeIndex = TABS.findIndex((t) => t.id === currentCategory);

  // SVG Circular progress ring calculation
  const totalSkills = 16;
  const progressRatio = installedCount / totalSkills;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <>
      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        {/* Left: Motion Lab Studio Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 26px',
            borderRadius: 28,
            backgroundColor: 'rgba(255, 255, 255, 0.42)',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* 8-bit Crab Pixel Icon */}
          <svg width="28" height="22" viewBox="0 0 14 11" fill="#e2583e">
            <rect x="0" y="2" width="2" height="3" />
            <rect x="12" y="2" width="2" height="3" />
            <rect x="2" y="0" width="10" height="9" rx="1" />
            <rect x="3" y="3" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="3" width="2" height="2" fill="#ffffff" />
            <rect x="4" y="4" width="1" height="1" fill="#1e1818" />
            <rect x="10" y="4" width="1" height="1" fill="#1e1818" />
            <rect x="2" y="9" width="2" height="2" />
            <rect x="5" y="9" width="2" height="2" />
            <rect x="7" y="9" width="2" height="2" />
            <rect x="10" y="9" width="2" height="2" />
          </svg>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: '#1e1c2e',
              letterSpacing: -0.5,
            }}
          >
            Motion Lab <span style={{ fontWeight: 500, color: '#4a485e' }}>Studio</span>
          </span>
        </div>

        {/* Right: Installed Skills Counter with Circular Progress Ring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            borderRadius: 28,
            backgroundColor: 'rgba(255, 255, 255, 0.42)',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            fontFamily: "'SF Mono', Menlo, Consolas, monospace",
            fontSize: 22,
            fontWeight: 700,
            color: '#1e1c2e',
          }}
        >
          {/* Progress Circle SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="12" cy="12" r={radius} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
            <circle
              cx="12"
              cy="12"
              r={radius}
              fill="none"
              stroke="#ea580c"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span>
            {String(installedCount).padStart(2, '0')} / {totalSkills} installed
          </span>
        </div>
      </div>

      {/* Section Title (Top Left) */}
      {!hideDock && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: 70,
            zIndex: 90,
          }}
        >
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: 22,
              fontWeight: 700,
              color: 'rgba(30, 28, 46, 0.65)',
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            {actNumber}
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              fontSize: 84,
              fontWeight: 900,
              color: '#14121e',
              letterSpacing: -2,
              lineHeight: 1.0,
            }}
          >
            {actTitle}
          </div>
        </div>
      )}

      {/* Bottom Floating Glass Dock */}
      {!hideDock && (
        <div
          style={{
            position: 'absolute',
            bottom: 45,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 76,
            borderRadius: 38,
            backgroundColor: 'rgba(255, 255, 255, 0.38)',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12), inset 0 2px 6px rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            boxSizing: 'border-box',
            zIndex: 100,
          }}
        >
          {TABS.map((tab, idx) => {
            const isActive = tab.id === currentCategory;
            return (
              <div
                key={tab.id}
                style={{
                  flex: 1,
                  height: '100%',
                  borderRadius: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255,255,255,0.9)' : 'none',
                  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                  fontSize: 22,
                  fontWeight: isActive ? 800 : 700,
                  color: isActive ? '#14121e' : 'rgba(30, 28, 46, 0.6)',
                  letterSpacing: 1.5,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
