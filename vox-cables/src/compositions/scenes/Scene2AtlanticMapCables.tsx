import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const Scene2AtlanticMapCables: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cable drawing progression across Atlantic Ocean
  const cableLength = 1200;
  const cableOffset = interpolate(frame, [10, 75], [cableLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spring animations for latency & capacity badges
  const nycSpring = spring({ frame: Math.max(0, frame - 16), fps, config: { damping: 10, stiffness: 180 } });
  const latencySpring = spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 9, stiffness: 190 } });
  const ukSpring = spring({ frame: Math.max(0, frame - 68), fps, config: { damping: 10, stiffness: 180 } });
  const capacitySpring = spring({ frame: Math.max(0, frame - 82), fps, config: { damping: 11, stiffness: 170 } });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* SVG Map of the Atlantic Ocean and Surrounding Continents */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="cableGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
        </defs>

        {/* North America Continent Silhouette (Stylized Brutalist Shape) */}
        <path
          d="M 120 160 L 360 160 L 410 240 L 460 340 L 380 430 L 410 520 L 380 620 L 330 760 L 260 840 L 140 840 Z"
          fill="#E7DFD5"
          stroke="#18181B"
          strokeWidth="3.5"
          style={{ filter: 'drop-shadow(6px 6px 0px rgba(24, 24, 27, 0.2))' }}
        />
        <text x="210" y="470" fontFamily="Georgia, serif" fontSize="24" fontWeight="800" fill="#18181B" letterSpacing="3">
          NORTH AMERICA
        </text>

        {/* Europe / UK / Iberian Silhouette */}
        <path
          d="M 1430 220 L 1520 160 L 1640 180 L 1740 250 L 1740 540 L 1620 620 L 1480 600 L 1420 500 L 1450 360 L 1380 320 Z"
          fill="#E7DFD5"
          stroke="#18181B"
          strokeWidth="3.5"
          style={{ filter: 'drop-shadow(6px 6px 0px rgba(24, 24, 27, 0.2))' }}
        />
        <text x="1510" y="420" fontFamily="Georgia, serif" fontSize="24" fontWeight="800" fill="#18181B" letterSpacing="3">
          WESTERN EUROPE
        </text>

        {/* Ocean Compass / Graticule Coordinates */}
        <line x1="880" y1="180" x2="880" y2="900" stroke="#18181B" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
        <line x1="450" y1="520" x2="1400" y2="520" stroke="#18181B" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
        <text x="830" y="220" fontFamily="monospace" fontSize="16" fontWeight="700" fill="#71717A" letterSpacing="4">
          ATLANTIC TRENCH // 30°W
        </text>

        {/* Transatlantic Submarine Cable 1: Grace Hopper (NYC -> Bude, UK) */}
        <path
          d="M 380 430 C 660 380, 1020 340, 1420 350"
          fill="none"
          stroke="#18181B"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 380 430 C 660 380, 1020 340, 1420 350"
          fill="none"
          stroke="url(#cableGlow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={cableLength}
          strokeDashoffset={cableOffset}
          style={{ filter: 'drop-shadow(0 0 12px #00F5FF)' }}
        />

        {/* Transatlantic Submarine Cable 2: Dunant (Virginia -> France) */}
        <path
          d="M 400 480 C 700 450, 1080 430, 1440 450"
          fill="none"
          stroke="#18181B"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 400 480 C 700 450, 1080 430, 1440 450"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={cableLength}
          strokeDashoffset={cableOffset}
          style={{ filter: 'drop-shadow(0 0 10px #06B6D4)' }}
        />

        {/* Transatlantic Submarine Cable 3: MAREA (Virginia -> Bilbao, Spain) */}
        <path
          d="M 410 520 C 680 520, 1040 520, 1460 530"
          fill="none"
          stroke="#18181B"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 410 520 C 680 520, 1040 520, 1460 530"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={cableLength}
          strokeDashoffset={cableOffset}
          style={{ filter: 'drop-shadow(0 0 8px #38BDF8)' }}
        />

        {/* Landing Terminal Points */}
        <circle cx="380" cy="430" r="8" fill="#FACC15" stroke="#18181B" strokeWidth="3" />
        <circle cx="1420" cy="350" r="8" fill="#FACC15" stroke="#18181B" strokeWidth="3" />
      </svg>

      {/* Spring Badge 1: New York Landing Terminal */}
      <div
        style={{
          position: 'absolute',
          left: 260,
          top: 360,
          transform: `scale(${nycSpring})`,
          backgroundColor: '#FFFFFF',
          border: '3px solid #18181B',
          boxShadow: '5px 5px 0 #18181B',
          padding: '8px 16px',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#18181B' }}>
          TERMINAL // NEW YORK (40.7° N)
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#71717A' }}>Cable Landing Station</div>
      </div>

      {/* Spring Badge 2: Mid-Atlantic Latency Callout (Highlighter-Yellow Box) */}
      <div
        style={{
          position: 'absolute',
          left: '42%',
          top: '38%',
          transform: `scale(${latencySpring}) rotate(-2deg)`,
          backgroundColor: '#FACC15',
          border: '4px solid #18181B',
          boxShadow: '8px 8px 0 #18181B',
          padding: '16px 28px',
          textAlign: 'center',
          zIndex: 20,
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: '#18181B', letterSpacing: 2 }}>
          TRANSATLANTIC TRANSIT TIME
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#18181B', letterSpacing: -1, margin: '4px 0' }}>
          58.2 ms
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#18181B' }}>
          NYC ➔ LONDON FIBER TRANSIT
        </div>
      </div>

      {/* Spring Badge 3: UK Landing Terminal */}
      <div
        style={{
          position: 'absolute',
          right: 280,
          top: 280,
          transform: `scale(${ukSpring})`,
          backgroundColor: '#FFFFFF',
          border: '3px solid #18181B',
          boxShadow: '5px 5px 0 #18181B',
          padding: '8px 16px',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#18181B' }}>
          TERMINAL // BUDE, UK (50.8° N)
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#71717A' }}>Grace Hopper Subsea Landing</div>
      </div>

      {/* Spring Badge 4: Bandwidth Capacity Metric */}
      <div
        style={{
          position: 'absolute',
          right: 180,
          bottom: 120,
          transform: `scale(${capacitySpring})`,
          backgroundColor: '#18181B',
          color: '#FACC15',
          border: '3px solid #18181B',
          boxShadow: '6px 6px 0 #FACC15',
          padding: '12px 24px',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
          TOTAL SUBSEA HIGHWAY CAPACITY
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#FACC15', letterSpacing: -1 }}>
          400 Terabits/sec
        </div>
      </div>
    </div>
  );
};
