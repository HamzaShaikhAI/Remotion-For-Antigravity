import React from 'react';

export const BrowserMockup: React.FC<{
  title?: string;
  url?: string;
  children: React.ReactNode;
}> = ({ title = 'Antigravity Studio', url = 'https://antigravity.google.dev', children }) => {
  return (
    <div
      style={{
        width: '90%',
        maxWidth: 1200,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #334155',
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            backgroundColor: '#1e293b',
            padding: '4px 12px',
            borderRadius: 6,
            color: '#94a3b8',
            fontSize: 13,
            fontFamily: 'monospace',
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', minHeight: 600 }}>{children}</div>
    </div>
  );
};
