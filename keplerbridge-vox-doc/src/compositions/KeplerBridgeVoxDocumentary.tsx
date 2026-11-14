import React from 'react';
import { Series } from 'remotion';
import { Act1Paradox } from './acts/Act1Paradox';
import { Act2Proxy } from './acts/Act2Proxy';
import { Act3Compiler } from './acts/Act3Compiler';
import { Act4Batching } from './acts/Act4Batching';
import { Act5Conformance } from './acts/Act5Conformance';
import { Act6Mission } from './acts/Act6Mission';

/**
 * Master 6-Act KeplerBridge Vox Technical Documentary
 * Total Duration: 4,172 frames @ 30fps (~139 seconds)
 */
export const KeplerBridgeVoxDocumentary: React.FC = () => {
  return (
    <Series>
      {/* Act 1: The Silicon Planned-Obsolescence Paradox (25.37s) */}
      <Series.Sequence durationInFrames={777}>
        <Act1Paradox />
      </Series.Sequence>

      {/* Act 2: The 64-bit Drop-in DLL Proxy Architecture (24.58s) */}
      <Series.Sequence durationInFrames={753}>
        <Act2Proxy />
      </Series.Sequence>

      {/* Act 3: The DXIL-to-DXBC Compiler Lowering Engine (28.06s) */}
      <Series.Sequence durationInFrames={857}>
        <Act3Compiler />
      </Series.Sequence>

      {/* Act 4: Command Batching & Immediate Execution (21.05s) */}
      <Series.Sequence durationInFrames={647}>
        <Act4Batching />
      </Series.Sequence>

      {/* Act 5: Real-World Conformance Across 86 PC Titles (21.43s) */}
      <Series.Sequence durationInFrames={658}>
        <Act5Conformance />
      </Series.Sequence>

      {/* Act 6: Silicon Preservation & Open Source Future (15.48s) */}
      <Series.Sequence durationInFrames={480}>
        <Act6Mission />
      </Series.Sequence>
    </Series>
  );
};
