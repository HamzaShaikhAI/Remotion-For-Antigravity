import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { BrowserMockup } from '../../plugins/rea-mockups';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act2Proxy: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/act2_proxy.mp3')} volume={1.0} />
      <Sequence from={15} durationInFrames={30}>
        <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
      </Sequence>
      <Sequence from={120} durationInFrames={45}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.2} />
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
                backgroundColor: '#00f5ff',
                color: '#000000',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT II // THE 64-BIT PROXY ARCHITECTURE
            </span>
          </div>

          <KineticSplitText
            text="ZERO DRIVER MODS. PURE USERSPACE."
            fontSize={64}
            color="#ffffff"
            style={{ marginBottom: 30 }}
          />

          <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
            <VoxCalloutBox
              title="Drop-In DLL Interception"
              tag="SYSTEM DESIGN"
              delay={15}
              highlightColor="#00f5ff"
            >
              KeplerBridge deploys as a standalone <strong>d3d12.dll proxy</strong> directly alongside the game executable.
              <br /><br />
              • Intercepts <code>D3D12CreateDevice</code> and claims FL 12_0<br />
              • Instantiates native Direct3D 11 device on immediate context<br />
              • Clamps capabilities to <strong>Resource Binding Tier 1</strong><br />
              • Prevents bindless crash vectors without touching Windows kernel files.
            </VoxCalloutBox>

            {/* Folder Layout Mockup */}
            <div style={{ width: 540 }}>
              <BrowserMockup url="C:\Games\Palworld\Binaries\Win64\" theme="dark">
                <div style={{ padding: 24, fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0' }}>
                  <div style={{ color: '#94a3b8', marginBottom: 12 }}>Directory Contents (Offline Game Folder):</div>
                  <div style={{ padding: '8px 12px', backgroundColor: '#1e293b', borderRadius: 6, marginBottom: 8 }}>
                    📁 Palworld-Win64-Shipping.exe (Original Unmodified D3D12 Executable)
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(0, 245, 255, 0.15)', border: '1px solid #00f5ff', borderRadius: 6, marginBottom: 8, color: '#00f5ff', fontWeight: 800 }}>
                    ⚡ d3d12.dll (KeplerBridge 64-bit Proxy)
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: '#1e293b', borderRadius: 6, marginBottom: 8 }}>
                    ⚙️ kepler_bridge.ini (Feature Level &amp; FSR Configuration)
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: '#1e293b', borderRadius: 6, color: '#22c55e' }}>
                    📄 kepler_bridge.log (Telemetry &amp; Execution Replay Trace)
                  </div>
                </div>
              </BrowserMockup>
            </div>
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
