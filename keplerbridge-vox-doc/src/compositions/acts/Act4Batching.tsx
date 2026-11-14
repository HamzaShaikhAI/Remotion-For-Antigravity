import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act4Batching: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/act4_batching.mp3')} volume={1.0} />
      <Sequence from={20} durationInFrames={30}>
        <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
      </Sequence>
      <Sequence from={150} durationInFrames={45}>
        <Audio src={staticFile('sfx/riser.wav')} volume={0.2} />
      </Sequence>

      <VoxGridPaper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 100px',
            height: '100%',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT IV // COMMAND BATCHING & REPLAY
            </span>
          </div>

          <KineticSplitText
            text="SERIALIZING ASYNC COMMAND QUEUES"
            fontSize={64}
            color="#ffffff"
            style={{ marginBottom: 30 }}
          />

          <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
            <VoxCalloutBox
              title="120–180 ns Dispatch Loop"
              tag="EXECUTION CORE"
              delay={15}
              highlightColor="#3b82f6"
            >
              DirectX 12 records draw commands across multi-threaded worker pools,
              but DirectX 11 mandates a single <strong>immediate device context</strong>.
              <br /><br />
              KeplerBridge solves this mismatch via zero-lock contiguous <code>CommandBatch</code> vectors.
              During <code>ExecuteCommandLists()</code>, batched states replay linearly with minimal CPU overhead.
            </VoxCalloutBox>

            {/* Architecture Card */}
            <div
              style={{
                width: 540,
                backgroundColor: '#0a0e1a',
                border: '3px solid #3b82f6',
                borderRadius: 12,
                padding: 24,
                fontFamily: 'monospace',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: 14, marginBottom: 16 }}>
                MEMORY &amp; COMPUTE PIPELINE SPECIFICATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: '#e2e8f0' }}>
                <div style={{ padding: 12, backgroundColor: '#1e293b', borderRadius: 6, borderLeft: '4px solid #facc15' }}>
                  <strong>Slot cb13 Staging:</strong> Dynamic scratch constant buffer for high-frequency root constant updates.
                </div>
                <div style={{ padding: 12, backgroundColor: '#1e293b', borderRadius: 6, borderLeft: '4px solid #00f5ff' }}>
                  <strong>Slots 0–7 Multi-UAVs:</strong> Concurrent compute shader bindings with atomic counter resets.
                </div>
                <div style={{ padding: 12, backgroundColor: '#1e293b', borderRadius: 6, borderLeft: '4px solid #22c55e' }}>
                  <strong>DXGI Fallback:</strong> Discard swap effect mapping &amp; tearing sanitization for WDDM 2.7.
                </div>
              </div>
            </div>
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
