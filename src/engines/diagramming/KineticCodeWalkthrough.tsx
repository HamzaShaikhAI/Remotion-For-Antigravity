import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CodeLine {
  number: number;
  text: string;
  isHighlighted?: boolean;
}

export interface KineticCodeWalkthroughProps {
  filename?: string;
  language?: string;
  lines: CodeLine[];
  activeLineRange?: [number, number];
  calloutTitle?: string;
  calloutDescription?: string;
}

export const KineticCodeWalkthrough: React.FC<KineticCodeWalkthroughProps> = ({
  filename = "src/pipeline/inference.ts",
  language = "typescript",
  lines,
  activeLineRange = [3, 5],
  calloutTitle = "Zero-Copy Tensor Memory Mapping",
  calloutDescription = "Passes raw Vulkan memory handles directly to Chromium without intermediate IPC serialization.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const spotlightSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 16, stiffness: 85 },
  });

  const calloutOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0d14',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Fira Code", "JetBrains Mono", Menlo, Consolas, monospace',
        color: '#e2e8f0',
        padding: 60,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          opacity: 0.08,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Code Editor Window Container */}
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          backgroundColor: '#0f172a',
          borderRadius: 14,
          border: '1px solid #1e293b',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          transform: `scale(${windowSpring})`,
          opacity: windowSpring,
        }}
      >
        {/* Editor Title Bar */}
        <div
          style={{
            height: 44,
            backgroundColor: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #334155',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>

          <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
            {filename}
          </div>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>
            {language}
          </div>
        </div>

        {/* Code Content */}
        <div style={{ padding: '24px 20px', fontSize: 15, lineHeight: 1.7, position: 'relative' }}>
          {lines.map((line, idx) => {
            const isTarget = line.number >= activeLineRange[0] && line.number <= activeLineRange[1];

            // Typing reveal effect
            const lineRevealFrame = 15 + idx * 4;
            const isRevealed = frame >= lineRevealFrame;

            return (
              <div
                key={line.number}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isRevealed ? (isTarget ? 1 : 0.45) : 0,
                  transition: 'opacity 0.2s ease',
                  backgroundColor: isTarget && frame > 30 ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                  padding: '2px 8px',
                  borderRadius: 4,
                  borderLeft: isTarget && frame > 30 ? '3px solid #38bdf8' : '3px solid transparent',
                }}
              >
                <div
                  style={{
                    width: 32,
                    color: isTarget ? '#38bdf8' : '#475569',
                    userSelect: 'none',
                    textAlign: 'right',
                    marginRight: 20,
                    fontWeight: 600,
                  }}
                >
                  {line.number}
                </div>
                <div style={{ flex: 1, whiteSpace: 'pre' }}>
                  {line.text}
                </div>
              </div>
            );
          })}

          {/* Animated Callout Badge */}
          {frame > 30 && (
            <div
              style={{
                position: 'absolute',
                right: 28,
                bottom: 24,
                width: 360,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid #38bdf8',
                boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.25)',
                borderRadius: 10,
                padding: '16px 20px',
                backdropFilter: 'blur(12px)',
                opacity: calloutOpacity,
                transform: `translateY(${(1 - spotlightSpring) * 15}px)`,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#38bdf8', fontWeight: 700 }}>
                Inspection Spotlight
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
                {calloutTitle}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
                {calloutDescription}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
