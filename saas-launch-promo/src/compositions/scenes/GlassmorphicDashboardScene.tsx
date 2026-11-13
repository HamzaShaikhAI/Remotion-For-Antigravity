import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const GlassmorphicDashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // High-damping spring entrance physics
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  // 3D Perspective tilt coordinates
  const baseRotX = interpolate(enterSpring, [0, 1], [16, 2]);
  const baseRotY = interpolate(enterSpring, [0, 1], [-22, -3]);
  const scale = interpolate(enterSpring, [0, 1], [0.86, 1.0]);
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Subtle continuous floating harmonic tilt
  const rotX = baseRotX + Math.sin(frame * 0.035) * 1.4;
  const rotY = baseRotY + Math.cos(frame * 0.03) * 1.8;

  // Simultaneous Ticking KPI Counters
  const arrValue = Math.floor(
    interpolate(frame, [15, 85], [0, 4820000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const uptimeValue = interpolate(frame, [15, 75], [92.0, 99.98], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(2);

  const workflowsValue = Math.floor(
    interpolate(frame, [15, 90], [12000, 142500], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // SVG Growth Curve strokeDashoffset animation
  const curveLength = 1200;
  const strokeOffset = interpolate(frame, [25, 115], [curveLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const curveProgress = interpolate(frame, [25, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1400,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 3D Tilting Glassmorphic Container */}
      <div
        style={{
          width: 1240,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 40px 90px -20px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(255, 255, 255, 0.8)',
          transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
          opacity: cardOpacity,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* macOS-Style Window Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: 'rgba(248, 250, 252, 0.8)',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ marginLeft: 16, fontSize: 13, fontWeight: 600, color: '#64748B' }}>
              Antigravity Analytics Cloud // Production Environment
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#EFF6FF',
              padding: '4px 14px',
              borderRadius: 9999,
              color: '#2563EB',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563EB' }} />
            LIVE TELEMETRY ACTIVE
          </div>
        </div>

        {/* Dashboard Body */}
        <div style={{ padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 3 KPI Counters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {/* KPI 1: ARR */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>Annual Recurring Revenue</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#10B981',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  +34.2% YoY
                </span>
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#0F172A', letterSpacing: -1 }}>
                ${arrValue.toLocaleString()}
              </div>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Verified across 84 enterprise accounts</span>
            </div>

            {/* KPI 2: Service Uptime */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>Global Service Uptime</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  SLA Guaranteed
                </span>
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#0F172A', letterSpacing: -1 }}>
                {uptimeValue}%
              </div>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Zero unscheduled downtime in 365 days</span>
            </div>

            {/* KPI 3: Autonomous Workflows */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>Active Swarm Workflows</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#8B5CF6',
                    backgroundColor: '#F5F3FF',
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Real-time
                </span>
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#0F172A', letterSpacing: -1 }}>
                {workflowsValue.toLocaleString()}
              </div>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Parallel agent execution nodes</span>
            </div>
          </div>

          {/* SVG Revenue Growth Curve Chart */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                  Cumulative Revenue Growth (ARR)
                </h3>
                <span style={{ fontSize: 13, color: '#64748B' }}>12-month exponential enterprise adoption</span>
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563EB' }} />
                  Actual Growth
                </span>
              </div>
            </div>

            {/* Dynamic SVG Chart */}
            <div style={{ position: 'relative', width: '100%', height: 210 }}>
              <svg width="100%" height="210" viewBox="0 0 1150 210" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Area gradient under the curve */}
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Stroke gradient */}
                  <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="40" x2="1150" y2="40" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="1150" y2="100" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="1150" y2="160" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Area under curve */}
                <path
                  d="M 0 190 C 220 185, 380 145, 540 120 C 700 95, 880 45, 1150 15 L 1150 200 L 0 200 Z"
                  fill="url(#areaGradient)"
                  style={{ opacity: curveProgress }}
                />

                {/* Dynamic Bezier Revenue Stroke (strokeDashoffset animation) */}
                <path
                  d="M 0 190 C 220 185, 380 145, 540 120 C 700 95, 880 45, 1150 15"
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={curveLength}
                  strokeDashoffset={strokeOffset}
                  style={{ filter: 'drop-shadow(0 6px 12px rgba(37, 99, 235, 0.3))' }}
                />

                {/* Animated Peak Glow Circle at the end of the line */}
                {curveProgress > 0.85 && (
                  <circle
                    cx="1150"
                    cy="15"
                    r="8"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    style={{
                      filter: 'drop-shadow(0 0 10px #2563EB)',
                      transformOrigin: '1150px 15px',
                    }}
                  />
                )}
              </svg>

              {/* X-Axis Month Labels */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#94A3B8',
                }}
              >
                <span>JAN</span>
                <span>MAR</span>
                <span>MAY</span>
                <span>JUL</span>
                <span>SEP</span>
                <span>NOV</span>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>TODAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
