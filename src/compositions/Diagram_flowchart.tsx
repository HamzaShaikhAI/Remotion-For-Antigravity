import React from 'react';
import { Composition } from 'remotion';
import { ArchitecturalFlowchart, KineticCodeWalkthrough, AnimatedDataChart } from '../engines/diagramming';

export const DiagramComposition: React.FC = () => {
  return (
    <ArchitecturalFlowchart
      title="Distributed Real-Time Neural Pipeline"
      nodes={[
        { id: 'ingest', label: 'Video Ingest', sublabel: '60fps H.264', x: 280, y: 320, color: '#38bdf8' },
        { id: 'vulkan', label: 'Vulkan RIFE', sublabel: '192fps Tensor Flow', x: 680, y: 320, color: '#818cf8' },
        { id: 'qa', label: 'Gemini VLM QA', sublabel: 'Multimodal Safety', x: 1080, y: 320, color: '#10b981' },
        { id: 'mux', label: 'Master Concat', sublabel: 'EBU R128 Loudness', x: 1480, y: 320, color: '#f59e0b' },
      ]}
      connections={[
        { from: 'ingest', to: 'vulkan', curved: true },
        { from: 'vulkan', to: 'qa', curved: true },
        { from: 'qa', to: 'mux', curved: true },
      ]}
    />
  );
};
