import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SelfDrawingSvgPath } from './SelfDrawingSvgPath';

export interface DataPoint {
  label: string;
  value: number; // 0 to 100
  color?: string;
}

export interface AnimatedDataChartProps {
  type: 'bar' | 'line' | 'donut';
  title?: string;
  subtitle?: string;
  data: DataPoint[];
}

export const AnimatedDataChart: React.FC<AnimatedDataChartProps> = ({
  type = 'bar',
  title = "System Throughput & Scalability",
  subtitle = "Real-time frame dispatch across Chromium workers",
  data,
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
        backgroundColor: '#070a12',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 40,
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * -20}px)`,
        }}
      >
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#38bdf8', fontWeight: 700 }}>
          Telemetry Metrics
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '8px 0 0' }}>
          {subtitle}
        </p>
      </div>

      {/* Render Chart Type */}
      {type === 'bar' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 32,
            height: 320,
            padding: '20px 40px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 16,
            border: '1px solid #1e293b',
          }}
        >
          {data.map((item, idx) => {
            const barSpring = spring({
              frame: frame - (15 + idx * 6),
              fps,
              config: { damping: 12, stiffness: 80 },
            });

            const heightPercent = Math.max(0, Math.min(100, item.value * barSpring));
            const barColor = item.color || '#3b82f6';

            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: barColor }}>
                  {Math.round(heightPercent)}%
                </div>
                <div
                  style={{
                    width: 48,
                    height: 240,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      backgroundColor: barColor,
                      borderRadius: 8,
                      boxShadow: `0 0 16px ${barColor}66`,
                    }}
                  />
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'line' && (
        <div
          style={{
            width: 720,
            height: 320,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 16,
            border: '1px solid #1e293b',
            position: 'relative',
            padding: 30,
            boxSizing: 'border-box',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 660 260">
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Compute SVG Path */}
            {(() => {
              const stepX = 660 / (data.length - 1 || 1);
              const points = data.map((d, i) => {
                const x = i * stepX;
                const y = 240 - (d.value / 100) * 200;
                return { x, y };
              });

              let lineD = `M ${points[0].x} ${points[0].y}`;
              for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cx1 = prev.x + (curr.x - prev.x) / 2;
                const cy1 = prev.y;
                const cx2 = prev.x + (curr.x - prev.x) / 2;
                const cy2 = curr.y;
                lineD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
              }

              return (
                <>
                  <SelfDrawingSvgPath
                    pathData={lineD}
                    strokeColor="#38bdf8"
                    strokeWidth={3.5}
                    startFrame={15}
                    durationInFrames={50}
                    glow
                  />
                  {points.map((p, idx) => {
                    const dotSpring = spring({
                      frame: frame - (30 + idx * 6),
                      fps,
                      config: { damping: 12, stiffness: 120 },
                    });
                    return (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={6 * Math.max(0, dotSpring)}
                        fill="#ffffff"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
                      />
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      )}
    </div>
  );
};
