import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act6Mission: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/act6_mission.mp3')} volume={1.0} />
      <Sequence durationInFrames={45}>
        <Audio src={staticFile('sfx/riser.wav')} volume={0.25} />
      </Sequence>
      <Sequence from={240} durationInFrames={45}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.2} />
      </Sequence>

      <VoxGridPaper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '80px 100px',
            height: '100%',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                backgroundColor: '#facc15',
                color: '#000000',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT VI // THE OPEN SOURCE MISSION
            </span>
          </div>

          <KineticSplitText
            text="PRESERVING HARDWARE SILICON"
            fontSize={68}
            color="#ffffff"
            style={{ marginBottom: 24 }}
          />

          <VoxCalloutBox
            title="Dismantling Planned Obsolescence"
            tag="OPEN SOURCE IMPACT"
            delay={15}
            highlightColor="#facc15"
            style={{ maxWidth: 840, textAlign: 'left', marginBottom: 30 }}
          >
            KeplerBridge demonstrates that arbitrary software cutoffs can be resolved through
            rigorous translation engineering. Millions of working PCs stay active, playable,
            and out of landfills.
          </VoxCalloutBox>

          {/* GitHub Repository Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              backgroundColor: '#0a0e1a',
              border: '2px solid #334155',
              borderRadius: 30,
              padding: '12px 32px',
              fontFamily: 'monospace',
              fontSize: 16,
              color: '#e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span style={{ color: '#00f5ff', fontWeight: 900 }}>github.com/HamzaShaikhAI/keplerbridge</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#facc15' }}>MIT LICENSE</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>C++20 COMPATIBILITY LAYER</span>
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
