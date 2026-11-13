import React from 'react';

export const AnalogPaperBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5EFEB',
        overflow: 'hidden',
      }}
    >
      {/* Paper Fold Lines & Technical Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(24, 24, 27, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(24, 24, 27, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.7,
        }}
      />

      {/* Subtle Archival Vertical Fold Crease */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 2,
          backgroundColor: 'rgba(24, 24, 27, 0.08)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
        }}
      />

      {/* Brutalist Editorial Outer Border */}
      <div
        style={{
          position: 'absolute',
          inset: 24,
          border: '3px solid #18181B',
          pointerEvents: 'none',
        }}
      />

      {/* Corner Archival Technical Stamps */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 44,
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 800,
          color: '#18181B',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        [VOX ARCHIVE // BRIEFING NO. 842] &nbsp;·&nbsp; DECLASSIFIED TELECOM MAP
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 36,
          right: 44,
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 800,
          color: '#18181B',
          letterSpacing: 2,
        }}
      >
        DEPTH: 8,500M &nbsp;·&nbsp; FIBER SPEED: 200,000 KM/S
      </div>
    </div>
  );
};
