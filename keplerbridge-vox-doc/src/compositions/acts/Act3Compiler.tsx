import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame } from 'remotion';
import { VoxGridPaper } from '../components/VoxGridPaper';
import { VoxCalloutBox } from '../components/VoxCalloutBox';
import { BytecodeFlowGraphic } from '../components/BytecodeFlowGraphic';
import { KineticSplitText } from '../../plugins/rea-typography';

export const Act3Compiler: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/act3_compiler.mp3')} volume={1.0} />
      <Sequence from={15}>
        <Audio src={staticFile('sfx/typewriter.wav')} volume={0.3} />
      </Sequence>
      <Sequence from={240}>
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
                backgroundColor: '#a855f7',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 4,
                letterSpacing: 1.5,
              }}
            >
              ACT III // THE SHADER LOWERING ENGINE
            </span>
          </div>

          <KineticSplitText
            text="DECOMPILING LLVM BITCODE"
            fontSize={64}
            color="#ffffff"
            style={{ marginBottom: 30 }}
          />

          <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
            <VoxCalloutBox
              title="DXIL to DXBC Bytecode Lowering"
              tag="COMPILER SUBSYSTEM"
              delay={15}
              highlightColor="#a855f7"
            >
              Modern games encode shaders in <strong>Shader Model 6.0 DXIL</strong>, which Kepler silicon cannot execute.
              <br /><br />
              KeplerBridge embeds a bounded decompiler that:
              <br />
              • Disassembles LLVM SSA intermediate representation<br />
              • Reconstructs Control Flow Graphs (CFG)<br />
              • Re-emits <strong>Shader Model 5.0 DXBC</strong><br />
              • Caches compiled bytecode using 64-bit FNV-1a hashes, cutting shader latency from <strong>48 ms down to 0.2 ms</strong>.
            </VoxCalloutBox>

            <BytecodeFlowGraphic delay={25} />
          </div>
        </div>
      </VoxGridPaper>
    </AbsoluteFill>
  );
};
