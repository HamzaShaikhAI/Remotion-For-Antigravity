import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebMercatorProjection, GeoCoordinate } from './WebMercatorProjection';
import { SelfDrawingSvgPath } from '../diagramming/SelfDrawingSvgPath';

export interface KineticMapRouteProps {
  origin?: GeoCoordinate;
  destination?: GeoCoordinate;
  title?: string;
  theme?: 'dark-tactical' | 'satellite-cyan' | 'obsidian-amber';
}

export const KineticMapRoute: React.FC<KineticMapRouteProps> = ({
  origin = { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
  destination = { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  title = 'Trans-Pacific Low-Latency Fiber Arc',
  theme = 'satellite-cyan',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Project coordinates to screen
  const startPt = WebMercatorProjection.project(origin.lat, origin.lng, width, height);
  const endPt = WebMercatorProjection.project(destination.lat, destination.lng, width, height);

  const { pathD } = WebMercatorProjection.getGeodesicArc(startPt, endPt, 160);

  // Flight progress along arc
  const routeSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16, stiffness: 60 },
  });

  const progress = Math.min(1, Math.max(0, routeSpring));

  // Bezier point calculation for marker position
  const midX = (startPt.x + endPt.x) / 2;
  const midY = (startPt.y + endPt.y) / 2 - 160;

  const currentX = (1 - progress) * (1 - progress) * startPt.x + 2 * (1 - progress) * progress * midX + progress * progress * endPt.x;
  const currentY = (1 - progress) * (1 - progress) * startPt.y + 2 * (1 - progress) * progress * midY + progress * progress * endPt.y;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#050811',
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, #0c1527 0%, #03060c 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* Background World Lat/Long Grid Lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.12,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`lat-${i}`}
            x1="0"
            y1={(height / 8) * i}
            x2={width}
            y2={(height / 8) * i}
            stroke="#38bdf8"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={`lng-${i}`}
            x1={(width / 12) * i}
            y1="0"
            x2={(width / 12) * i}
            y2={height}
            stroke="#38bdf8"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 50,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#38bdf8', fontWeight: 700 }}>
          Geographic Telemetry & Route Vector
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          {origin.name} ({origin.lat}°, {origin.lng}°) ➔ {destination.name} ({destination.lat}°, {destination.lng}°)
        </div>
      </div>

      {/* Map Paths & Markers */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Geodesic Flight Path */}
        <SelfDrawingSvgPath
          pathData={pathD}
          strokeColor="#38bdf8"
          strokeWidth={3.5}
          startFrame={20}
          durationInFrames={60}
          glow
          glowColor="rgba(56, 189, 248, 0.6)"
        />

        {/* Origin Pin */}
        <circle cx={startPt.x} cy={startPt.y} r={7} fill="#38bdf8" style={{ filter: 'drop-shadow(0 0 10px #38bdf8)' }} />
        <circle
          cx={startPt.x}
          cy={startPt.y}
          r={7 + (frame % 30) * 1.5}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={1.5}
          opacity={1 - (frame % 30) / 30}
        />

        {/* Destination Pin */}
        <circle cx={endPt.x} cy={endPt.y} r={7} fill="#10b981" style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
        <circle
          cx={endPt.x}
          cy={endPt.y}
          r={7 + ((frame + 15) % 30) * 1.5}
          fill="none"
          stroke="#10b981"
          strokeWidth={1.5}
          opacity={1 - ((frame + 15) % 30) / 30}
        />

        {/* Traveling Geodesic Pulse / Aircraft Marker */}
        {frame > 20 && (
          <g transform={`translate(${currentX}, ${currentY})`}>
            <circle r={9} fill="#ffffff" style={{ filter: 'drop-shadow(0 0 12px #38bdf8)' }} />
            <circle r={18} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.7} />
          </g>
        )}
      </svg>

      {/* Origin City Label */}
      <div
        style={{
          position: 'absolute',
          left: startPt.x + 14,
          top: startPt.y - 12,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '4px 10px',
          borderRadius: 6,
          border: '1px solid #38bdf8',
          fontSize: 13,
          fontWeight: 700,
          color: '#f8fafc',
          backdropFilter: 'blur(8px)',
        }}
      >
        {origin.name}
      </div>

      {/* Destination City Label */}
      <div
        style={{
          position: 'absolute',
          left: endPt.x + 14,
          top: endPt.y - 12,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '4px 10px',
          borderRadius: 6,
          border: '1px solid #10b981',
          fontSize: 13,
          fontWeight: 700,
          color: '#f8fafc',
          backdropFilter: 'blur(8px)',
        }}
      >
        {destination.name}
      </div>
    </div>
  );
};
