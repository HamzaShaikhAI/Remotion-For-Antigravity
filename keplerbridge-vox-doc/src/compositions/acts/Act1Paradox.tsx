import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { SiliconDieGraphic } from '../components/SiliconDieGraphic';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act1Paradox: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Audio Narration and SFX */}
      <Audio src={staticFile('audio/act1_paradox.mp3')} volume={1.0} />
      <Audio src={staticFile('sfx/riser.wav')} volume={0.2} />
      <Sequence from={20}>
        <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
      </Sequence>
      <Sequence from={180}>
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
          {/* Act Badge */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT I // THE PLANNED-OBSOLESCENCE PARADOX
            </span>
          </div>

          {/* Kinetic Headline */}
          <KineticSplitText
            text="THE DIRECTX 12 WALL"
            fontSize={64}
            color="#ffffff"
            style={{ marginBottom: 30 }}
          />

          <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
            {/* Editorial Card */}
            <VoxCalloutBox
              title="Frozen at Feature Level 11_0"
              tag="HARDWARE DILEMMA"
              delay={15}
              highlightColor="#facc15"
            >
              When modern game engines mandate DirectX 12 and Shader Model 6,
              working GPUs like the <strong>NVIDIA GeForce GT 740, GTX 780, and GTX TITAN</strong>
              are locked out overnight.
              <br /><br />
              The silicon is intact. The VRAM is ample. But the official WDDM driver halts at
              <strong style={{ color: '#ef4444' }}> D3D_FEATURE_LEVEL_11_0 (0xB000)</strong>.
            </VoxCalloutBox>

            {/* Die Schematic */}
            <SiliconDieGraphic delay={25} unlocked={false} />
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
