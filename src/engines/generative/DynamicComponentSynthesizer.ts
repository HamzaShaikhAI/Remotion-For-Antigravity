import fs from 'fs';
import path from 'path';

export type GenerativeArchetype = 'saas' | 'data' | 'tech' | 'abstract';

export interface ComponentSynthesisOptions {
  title: string;
  subtitle?: string;
  archetype?: GenerativeArchetype;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  durationInSeconds?: number;
  fps?: number;
  outputPath?: string;
}

export class DynamicComponentSynthesizer {
  /**
   * Generates a fully-typed, standalone Remotion composition TSX code based on archetype.
   */
  public static synthesize(options: ComponentSynthesisOptions): string {
    const {
      title,
      subtitle = "Autonomous Generative Architecture",
      archetype = 'saas',
      aspectRatio = '16:9',
      durationInSeconds = 5,
      fps = 30,
    } = options;

    const totalFrames = durationInSeconds * fps;
    const isVertical = aspectRatio === '9:16';
    const width = isVertical ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    switch (archetype) {
      case 'saas':
        return this.generateSaasTemplate(title, subtitle, totalFrames, fps, width, height);
      case 'data':
        return this.generateDataTemplate(title, subtitle, totalFrames, fps, width, height);
      case 'tech':
        return this.generateTechTemplate(title, subtitle, totalFrames, fps, width, height);
      case 'abstract':
      default:
        return this.generateAbstractTemplate(title, subtitle, totalFrames, fps, width, height);
    }
  }

  private static generateSaasTemplate(title: string, subtitle: string, duration: number, fps: number, w: number, h: number): string {
    return `import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GeneratedSaasComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const cardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const cursorProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15, stiffness: 70 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, #1e1b4b 0%, #030712 70%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
        padding: 40,
      }}
    >
      {/* SaaS Header */}
      <div
        style={{
          textAlign: 'center',
          transform: \`translateY(\${(1 - titleSpring) * -30}px)\`,
          opacity: titleSpring,
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#60a5fa', fontWeight: 700 }}>
          Next-Gen Platform
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 900, margin: '12px 0 0', letterSpacing: '-0.03em' }}>
          ${title}
        </h1>
        <p style={{ fontSize: 20, color: '#94a3b8', margin: '12px 0 0', fontWeight: 400 }}>
          ${subtitle}
        </p>
      </div>

      {/* Glassmorphic Product Card */}
      <div
        style={{
          width: '80%',
          maxWidth: 880,
          height: 380,
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
          backdropFilter: 'blur(20px)',
          transform: \`scale(\${Math.max(0, cardSpring)})\`,
          opacity: cardSpring,
          position: 'relative',
          display: 'flex',
          padding: 30,
          boxSizing: 'border-box',
          gap: 24,
        }}
      >
        <div style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 12, padding: 20, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ height: 16, width: '40%', backgroundColor: '#38bdf8', borderRadius: 4, opacity: 0.8 }} />
          <div style={{ height: 8, width: '80%', backgroundColor: '#475569', borderRadius: 4, marginTop: 16 }} />
          <div style={{ height: 8, width: '60%', backgroundColor: '#475569', borderRadius: 4, marginTop: 10 }} />
        </div>
        <div style={{ flex: 1.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 12, padding: 20, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ height: 16, width: '60%', backgroundColor: '#818cf8', borderRadius: 4, opacity: 0.8 }} />
          <div style={{ height: 140, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 8, marginTop: 20, border: '1px dashed #6366f1' }} />
        </div>

        {/* Animated Mouse Cursor */}
        <div
          style={{
            position: 'absolute',
            left: interpolate(cursorProgress, [0, 1], [100, 480]),
            top: interpolate(cursorProgress, [0, 1], [300, 180]),
            width: 24,
            height: 24,
            opacity: frame > 35 ? 1 : 0,
            pointerEvents: 'none',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L11 20L14 13L21 10L4 4Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
`;
  }

  private static generateDataTemplate(title: string, subtitle: string, duration: number, fps: number, w: number, h: number): string {
    return `import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GeneratedDataComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const kpis = [
    { label: "Throughput", value: 98.4, unit: "k/sec", color: "#38bdf8" },
    { label: "Latency", value: 1.2, unit: "ms", color: "#10b981" },
    { label: "Accuracy", value: 99.9, unit: "%", color: "#8b5cf6" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0d14',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
        padding: 40,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40, opacity: titleSpring }}>
        <h1 style={{ fontSize: 52, fontWeight: 900, margin: 0 }}>${title}</h1>
        <p style={{ fontSize: 18, color: '#94a3b8', marginTop: 10 }}>${subtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: 24, width: '80%', maxWidth: 900 }}>
        {kpis.map((kpi, idx) => {
          const kpiSpring = spring({
            frame: frame - (15 + idx * 8),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={kpi.label}
              style={{
                flex: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 16,
                border: '1px solid #1e293b',
                padding: 24,
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                transform: \`scale(\${Math.max(0, kpiSpring)})\`,
                opacity: kpiSpring,
              }}
            >
              <div style={{ fontSize: 13, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: kpi.color, marginTop: 12 }}>
                {kpi.value}
                <span style={{ fontSize: 20, color: '#64748b', marginLeft: 4 }}>{kpi.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
`;
  }

  private static generateTechTemplate(title: string, subtitle: string, duration: number, fps: number, w: number, h: number): string {
    return `import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GeneratedTechComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Fira Code", monospace',
        color: '#38bdf8',
        padding: 40,
      }}
    >
      <div style={{ textAlign: 'center', opacity: titleSpring }}>
        <div style={{ fontSize: 13, letterSpacing: '0.2em' }}>[ SYSTEM INITIALIZED ]</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f8fafc', marginTop: 12 }}>${title}</h1>
        <p style={{ fontSize: 18, color: '#64748b', marginTop: 8 }}>${subtitle}</p>
      </div>
    </AbsoluteFill>
  );
};
`;
  }

  private static generateAbstractTemplate(title: string, subtitle: string, duration: number, fps: number, w: number, h: number): string {
    return `import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GeneratedAbstractComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
      }}
    >
      <div style={{ textAlign: 'center', transform: \`scale(\${titleSpring})\`, opacity: titleSpring }}>
        <h1 style={{
          fontSize: 64,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
        }}>
          ${title}
        </h1>
        <p style={{ fontSize: 24, color: '#94a3b8', marginTop: 16 }}>${subtitle}</p>
      </div>
    </AbsoluteFill>
  );
};
`;
  }
}
