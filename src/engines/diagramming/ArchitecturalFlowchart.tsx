import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SelfDrawingSvgPath } from './SelfDrawingSvgPath';

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  color?: string;
  icon?: string;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
  curved?: boolean;
}

export interface ArchitecturalFlowchartProps {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  title?: string;
}

export const ArchitecturalFlowchart: React.FC<ArchitecturalFlowchartProps> = ({
  nodes,
  connections,
  title = "Distributed Architecture & Flow",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#090d16',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* Background Blueprint Grid */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
        }}
      >
        <defs>
          <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#archGrid)" />
      </svg>

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 50,
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * -20}px)`,
        }}
      >
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#38bdf8', fontWeight: 700 }}>
          System Telemetry & Architecture
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </div>

      {/* SVG Connecting Paths & Flowing Packets */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const cx1 = fromNode.x + dx * 0.5;
          const cy1 = fromNode.y;
          const cx2 = fromNode.x + dx * 0.5;
          const cy2 = toNode.y;

          const pathD = conn.curved
            ? `M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`
            : `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

          // Travelling data packet position along curve
          const loopDuration = 90;
          const packetPhase = ((frame + idx * 25) % loopDuration) / loopDuration;
          const px = interpolate(packetPhase, [0, 1], [fromNode.x, toNode.x]);
          const py = interpolate(packetPhase, [0, 1], [fromNode.y, toNode.y]);

          return (
            <React.Fragment key={`${conn.from}-${conn.to}-${idx}`}>
              <SelfDrawingSvgPath
                pathData={pathD}
                strokeColor="url(#cableGrad)"
                strokeWidth={2.5}
                startFrame={15 + idx * 10}
                durationInFrames={45}
                glow
                glowColor="rgba(56, 189, 248, 0.4)"
              />
              {/* Animated Data Packet Pulse */}
              <circle
                cx={px}
                cy={py}
                r={4.5}
                fill="#ffffff"
                style={{
                  filter: 'drop-shadow(0 0 6px #38bdf8)',
                  opacity: frame > 25 ? 1 : 0,
                }}
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Interactive Architecture Nodes */}
      {nodes.map((node, i) => {
        const nodeSpring = spring({
          frame: frame - (10 + i * 8),
          fps,
          config: { damping: 12, stiffness: 120 },
        });

        const scale = Math.max(0, nodeSpring);
        const pulse = Math.sin((frame + i * 15) * 0.1) * 2;
        const color = node.color || '#3b82f6';

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: scale,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 72 + pulse,
                height: 72 + pulse,
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: `2px solid ${color}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 20px ${color}55, inset 0 0 12px ${color}33`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: color,
                  opacity: 0.9,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                  color: '#ffffff',
                }}
              >
                {node.icon || node.label.charAt(0)}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{node.label}</div>
              {node.sublabel && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>
                  {node.sublabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
