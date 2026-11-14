import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { UniversalResponsiveContainer } from '../engines/multiformat/UniversalResponsiveContainer';

export const LocalAiVsCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Total Duration: 30 seconds = 900 frames @ 30fps (or 1800 frames @ 60fps)
  // Normalizing timing using frame progress
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Animated line chart progress (0 to 1 over frames 30 to 140)
  const lineProgress = interpolate(frame, [30, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Telemetry Metrics reveal (frames 140 to 450)
  const metricsEntrance = spring({
    frame: Math.max(0, frame - 140),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Phase 3: Conclusion / Victory lockup (frames 450 to 900)
  const conclusionEntrance = spring({
    frame: Math.max(0, frame - 450),
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  // Latency counters
  const cloudLatency = Math.min(840, Math.floor(frame * 6));
  const localLatency = Math.min(12, Math.floor(frame * 0.15) + 4);

  return (
    <UniversalResponsiveContainer>
      <AbsoluteFill
        style={{
          backgroundColor: '#f8fafc',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          overflow: 'hidden',
        }}
      >
        {/* ------------------------------------------------------------- */}
        {/* ROUGH PAPER TEXTURE OVERLAY                                   */}
        {/* ------------------------------------------------------------- */}
        <AbsoluteFill
          style={{
            opacity: 0.18,
            mixBlendMode: 'multiply',
            backgroundImage: `url(${staticFile('textures/paper-rough.png')})`,
            backgroundSize: 'cover',
            pointerEvents: 'none',
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* TOP HUD / SAFE-ZONE HEADER                                    */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: entrance,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563eb', boxShadow: '0 0 10px #2563eb' }} />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>
              TECH DISRUPTION BRIEF · 2026
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '4px 12px', borderRadius: 20 }}>
            LOCAL NPU ERA
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACCENT BLUE FLOW LINE & GRAPH                                 */}
        {/* ------------------------------------------------------------- */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Subtle Grid Lines */}
          <line x1="80" y1="900" x2="1000" y2="900" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="80" y1="1200" x2="1000" y2="1200" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />

          {/* Cloud Cost / Latency Ascending Line (Red) */}
          <path
            d="M 120 1250 Q 540 1150 960 750"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeDasharray="2000"
            strokeDashoffset={2000 * (1 - lineProgress)}
            opacity="0.4"
          />

          {/* Local AI Efficiency Descending Curve (Electric Blue) */}
          <path
            d="M 120 750 Q 480 820 960 1320"
            fill="none"
            stroke="#2563eb"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="2000"
            strokeDashoffset={2000 * (1 - lineProgress)}
            filter="drop-shadow(0 6px 12px rgba(37, 99, 235, 0.35))"
          />

          {/* Dynamic Data Point Node on Blue Curve */}
          {lineProgress > 0.05 && (
            <circle
              cx={120 + lineProgress * 840}
              cy={750 + lineProgress * 570 + Math.sin(lineProgress * Math.PI) * 50}
              r="10"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="4"
              filter="drop-shadow(0 4px 8px rgba(37, 99, 235, 0.5))"
            />
          )}
        </svg>

        {/* ------------------------------------------------------------- */}
        {/* KINETIC DUAL-FONT TYPOGRAPHY & HERO SECTION                   */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: 70,
            right: 140, // 15% right safe-zone buffer for TikTok/Shorts icons
            transform: `translateY(${interpolate(entrance, [0, 1], [40, 0])}px)`,
            opacity: entrance,
            zIndex: 30,
          }}
        >
          <h1
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            The Death of{' '}
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                color: '#2563eb',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(37, 99, 235, 0.3)',
              }}
            >
              Cloud AI.
            </span>
          </h1>

          <p
            style={{
              fontSize: 26,
              color: '#475569',
              marginTop: 22,
              lineHeight: 1.45,
              fontWeight: 500,
              maxWidth: 720,
            }}
          >
            Why high-density local silicon is replacing centralized data centers forever.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PHASE 2: TELEMETRY METRIC COMPARISON (Frames 140–450)         */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: 70,
            right: 140,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            transform: `translateY(${interpolate(metricsEntrance, [0, 1], [30, 0])}px)`,
            opacity: metricsEntrance,
            zIndex: 30,
          }}
        >
          {/* Cloud API Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>
                CENTRALIZED CLOUD API
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                {cloudLatency} ms Latency
              </div>
            </div>
            <span style={{ fontSize: 28 }}>☁️ ❌</span>
          </div>

          {/* Local NPU Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #2563eb',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 12px 32px rgba(37, 99, 235, 0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                DEVICE-NATIVE LOCAL NPU
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
                {localLatency} ms Instant Response
              </div>
            </div>
            <span style={{ fontSize: 32 }}>⚡ 🛡️</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PHASE 3: CONCLUSION & CALL TO ACTION                          */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            bottom: 300, // 280px+ TikTok/Shorts bottom clearance
            left: 70,
            right: 140,
            backgroundColor: '#0f172a',
            borderRadius: 20,
            padding: '24px 30px',
            color: '#ffffff',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
            transform: `translateY(${interpolate(conclusionEntrance, [0, 1], [30, 0])}px)`,
            opacity: conclusionEntrance,
            zIndex: 35,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>
            VERDICT
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, lineHeight: 1.3 }}>
            Zero API bills. Zero cloud downtime. Zero data leaks.
          </div>
        </div>

        {/* Bottom Safe Zone Indicator Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#94a3b8',
            letterSpacing: '0.08em',
            zIndex: 40,
          }}
        >
          REA MULTIFORMAT ENGINE · SAFE ZONES PRESERVED
        </div>
      </AbsoluteFill>
    </UniversalResponsiveContainer>
  );
};
