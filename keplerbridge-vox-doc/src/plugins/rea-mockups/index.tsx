import React from 'react';

export const BrowserMockup: React.FC<{
  children: React.ReactNode;
  url?: string;
  theme?: 'dark' | 'light';
}> = ({ children, url = 'https://antigravity.google.dev', theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 18px',
          backgroundColor: isDark ? '#0a0f1d' : '#f1f5f9',
          borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
        <div
          style={{
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
