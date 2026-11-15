import React from 'react';

interface PixelArtHeaderProps {
  title?: string;
  subtitle?: string;
  gridInfo?: string;
}

export const PixelArtHeader: React.FC<PixelArtHeaderProps> = ({
  title = 'LIVING ANIMATED PIXEL ART',
  subtitle = 'CLAUDE FABLE 5.2 / PROCEDURAL CANVASES & LAYERED 12 FPS SIMULATION',
  gridInfo = '512PX GRID • 2X SCALE (772×1024) • ~100 INDEXED COLORS',
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 8,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Top Badge & Telemetry Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(234, 88, 12, 0.15)',
            border: '1px solid rgba(234, 88, 12, 0.4)',
            color: '#f97316',
            padding: '3px 10px',
            borderRadius: 999,
            fontWeight: 800,
          }}
        >
          CLAUDE FABLE 5.2
        </span>
        <span style={{ color: '#64748b' }}>•</span>
        <span style={{ color: '#94a3b8' }}>ENGINE XXX</span>
        <span style={{ color: '#64748b' }}>•</span>
        <span style={{ color: '#38bdf8' }}>{gridInfo}</span>
      </div>

      {/* Main Studio Title */}
      <h1
        style={{
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: -0.5,
          margin: 0,
          color: '#ffffff',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
        }}
      >
        {title}
      </h1>

      {/* Subtitle & Directing Paradigm */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1.2,
          color: '#94a3b8',
          textTransform: 'uppercase',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
