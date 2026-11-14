import React from 'react';
import { AbsoluteFill } from 'remotion';

export interface RenderJobItem {
  id: string;
  composition: string;
  status: 'PENDING' | 'QA_AUDITING' | 'RENDERING' | 'COMPLETED' | 'REJECTED';
  grade?: string;
  durationSec: number;
}

export interface ExecutiveProducerDashboardProps {
  jobs?: RenderJobItem[];
  activeAgent: string;
}

/**
 * The "Executive Producer" Dashboard
 *
 * Visual monitoring cockpit displaying real-time render queue states,
 * AI Art Director verdicts, and multi-platform publishing pipelines.
 */
export const ExecutiveProducerDashboard: React.FC<ExecutiveProducerDashboardProps> = ({
  jobs = [
    { id: 'job_01', composition: 'ZenitsuVsKilluaShowdownV2', status: 'COMPLETED', grade: 'A', durationSec: 32 },
    { id: 'job_02', composition: 'AnimePhonkShort', status: 'QA_AUDITING', grade: 'PENDING', durationSec: 12 },
  ],
  activeAgent = 'ArtDirector-V4',
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a14',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#00f5ff', letterSpacing: '2px' }}>
          REA V4.0 // EXECUTIVE PRODUCER COCKPIT
        </h1>
        <div style={{ fontSize: '14px', color: '#888' }}>ACTIVE AGENT: <span style={{ color: '#00ff88' }}>{activeAgent}</span></div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              padding: '16px 24px',
              backgroundColor: '#121224',
              border: '1px solid #333',
              borderRadius: '8px',
              minWidth: '280px',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{job.composition}</div>
            <div style={{ color: '#aaa', marginTop: '6px' }}>Duration: {job.durationSec}s</div>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>STATUS: <b style={{ color: job.status === 'COMPLETED' ? '#00ff88' : '#ffaa00' }}>{job.status}</b></span>
              <span>GRADE: <b style={{ color: '#00f5ff' }}>{job.grade}</b></span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
