import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { BrowserMockup } from '../../plugins/rea-mockups';
import { GlitchTransition } from '../../plugins/rea-transitions';

export const Scene3AgentWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Perspective 3D tilt
  const tiltSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const rotY = interpolate(tiltSpring, [0, 1], [-10, 0]);
  const rotX = interpolate(tiltSpring, [0, 1], [8, 0]);

  const agents = [
    { name: 'DirectorAgent', task: 'Synthesizing 3D Motion Paths', progress: 100, color: '#00f5ff' },
    { name: 'ShaderForge', task: 'Compiling Dynamic GPU Shaders', progress: Math.min(100, Math.floor(frame * 2.2)), color: '#a855f7' },
    { name: 'AudioEngine', task: 'Transient Peak-Lock Detection', progress: Math.min(100, Math.floor(frame * 1.8)), color: '#38bdf8' },
    { name: 'AntigravityHQ', task: 'Zero-Latency Frame Delivery', progress: 100, color: '#10b981' },
  ];

  return (
    <GlitchTransition intensity={0.6} durationInFrames={12}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
        }}
      >
        <div
          style={{
            transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
            transformStyle: 'preserve-3d',
            width: '85%',
            maxWidth: 1100,
          }}
        >
          <BrowserMockup title="DASTRAS OS // AGENT_SWARM_ORCHESTRATOR" url="antigravity://swarm/cluster-01">
            <div
              style={{
                padding: '36px 44px',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(5, 12, 28, 0.98) 100%)',
                color: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#f8fafc' }}>
                    Active Swarm Execution Pipeline
                  </h2>
                  <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 14 }}>
                    Autonomous agents rendering Remotion primitives synchronously
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ● 4/4 AGENTS HEALTHY
                </div>
              </div>

              {/* Agent Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: agent.color, fontFamily: 'monospace' }}>
                        {agent.name}
                      </span>
                      <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600 }}>
                        {agent.progress}%
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: '#94a3b8' }}>{agent.task}</div>

                    {/* Progress Track */}
                    <div style={{ width: '100%', height: 6, backgroundColor: '#0f172a', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${agent.progress}%`,
                          height: '100%',
                          backgroundColor: agent.color,
                          boxShadow: `0 0 10px ${agent.color}`,
                          transition: 'width 0.1s',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserMockup>
        </div>
      </div>
    </GlitchTransition>
  );
};
