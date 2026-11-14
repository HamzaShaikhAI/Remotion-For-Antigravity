import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { TelemetryMeter } from '../components/TelemetryMeter';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act5Conformance: React.FC = () => {
  const frame = useCurrentFrame();

  const games = [
    { name: 'Palworld', engine: 'Unreal Engine 5.1', fps: '22–32 FPS', status: 'PLAYABLE' },
    { name: 'Stray', engine: 'Unreal Engine 4.27', fps: '28–38 FPS', status: 'PLAYABLE' },
    { name: 'Devil May Cry 5', engine: 'RE Engine (D3D12)', fps: '35–48 FPS', status: 'PLAYABLE' },
    { name: 'God of War (2018)', engine: 'Santa Monica Engine', fps: '24–32 FPS', status: 'PLAYABLE' },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/act5_conformance.mp3')} volume={1.0} />
      <Sequence from={20} durationInFrames={30}>
        <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
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
                backgroundColor: '#22c55e',
                color: '#000000',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT V // HARDWARE CONFORMANCE & TESTING
            </span>
          </div>

          <KineticSplitText
            text="86 TITLES TESTED ON PHYSICAL SILICON"
            fontSize={64}
            color="#ffffff"
            style={{ marginBottom: 30 }}
          />

          <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
            {/* Game Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 560 }}>
              {games.map((g, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#111827',
                    border: '2px solid #1e293b',
                    borderRadius: 8,
                    padding: '14px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{g.engine}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#facc15' }}>{g.fps}</div>
                    <span style={{ fontSize: 10, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                      {g.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TelemetryMeter
                targetFps={32.4}
                gpuName="Reference NVIDIA GeForce GT 740 (GK208B)"
                resolution="720p Low (DDR3 14.4 GB/s)"
                delay={15}
              />

              <div
                style={{
                  backgroundColor: 'rgba(250, 204, 21, 0.1)',
                  border: '2px dashed #facc15',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: '#facc15',
                  textAlign: 'center',
                }}
              >
                ★ AMD FSR 1.0 Spatial Upscaling Integrated ★<br />
                Compensates for legacy DDR3 memory bandwidth
              </div>
            </div>
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
