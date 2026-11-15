import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface HeistVectorMapProps {
  progress?: number;
  showPolice?: boolean;
}

export const HeistVectorMap: React.FC<HeistVectorMapProps> = ({
  progress = 1.0,
  showPolice = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stop-motion quantization for map elements
  const stopMotionFps = 16;
  const quantizedFrame = Math.floor(frame * (stopMotionFps / fps));

  // Siren alternating strobe frequency
  const sirenPhase = quantizedFrame % 4;
  const redSiren = sirenPhase < 2;
  const blueSiren = !redSiren;

  // Car route progress animation (0 to 1)
  const routeAnim = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  // Calculate coordinates along route
  // Vince's route: starts at (540, 500) -> West to (240, 500) -> South to (240, 720)
  const vinceX = interpolate(routeAnim, [0, 0.5, 1], [540, 240, 240]);
  const vinceY = interpolate(routeAnim, [0, 0.5, 1], [500, 500, 720]);

  // You route: starts at (540, 500) -> East to (780, 500) -> South to (780, 720)
  const youX = interpolate(routeAnim, [0, 0.5, 1], [540, 780, 780]);
  const youY = interpolate(routeAnim, [0, 0.5, 1], [500, 500, 720]);

  // Police car follows slightly behind "You"
  const policeAnim = spring({
    frame: frame - 15,
    fps,
    config: { damping: 16, stiffness: 80 },
  });
  const policeX = interpolate(policeAnim, [0, 0.5, 1], [600, 880, 880], { extrapolateLeft: 'clamp' });
  const policeY = interpolate(policeAnim, [0, 0.5, 1], [500, 500, 640], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09101A',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Blueprint City Grid Background */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1080 1920"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#132032" strokeWidth="1.5" />
          </pattern>
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Blueprint Base Grid */}
        <rect width="1080" height="1920" fill="url(#grid)" />

        {/* Urban Blocks & Buildings */}
        <g stroke="#1E2E44" strokeWidth="3" fill="#0E1825">
          {/* North blocks */}
          <rect x="120" y="200" width="220" height="110" rx="8" />
          <rect x="380" y="200" width="320" height="110" rx="8" />
          <rect x="740" y="200" width="220" height="110" rx="8" />

          {/* Central Blocks */}
          <rect x="120" y="410" width="180" height="180" rx="8" />
          <rect x="340" y="410" width="180" height="180" rx="8" />
          <rect x="560" y="410" width="180" height="180" rx="8" />
          <rect x="780" y="410" width="180" height="180" rx="8" />

          {/* South Blocks */}
          <rect x="120" y="640" width="180" height="180" rx="8" />
          <rect x="340" y="640" width="180" height="180" rx="8" />
          <rect x="560" y="640" width="180" height="180" rx="8" />
          <rect x="780" y="640" width="180" height="180" rx="8" />

          {/* Motel Complex (L-shaped) */}
          <path d="M 440 980 L 720 980 L 720 1200 L 600 1200 L 600 1080 L 440 1080 Z" fill="#132032" stroke="#253850" strokeWidth="4" />
        </g>

        {/* Streetlight Radial Glows */}
        <circle cx="240" cy="500" r="60" fill="rgba(251, 191, 36, 0.08)" />
        <circle cx="540" cy="500" r="70" fill="rgba(251, 191, 36, 0.08)" />
        <circle cx="780" cy="500" r="60" fill="rgba(251, 191, 36, 0.08)" />
        <circle cx="240" cy="720" r="60" fill="rgba(251, 191, 36, 0.08)" />
        <circle cx="780" cy="720" r="60" fill="rgba(251, 191, 36, 0.08)" />

        {/* Bank Compound at (540, 360) */}
        <g transform="translate(480, 340)">
          {/* Neoclassical Bank Icon */}
          <rect x="0" y="0" width="120" height="80" rx="6" fill="#1A293E" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Bank Columns */}
          <line x1="24" y1="25" x2="24" y2="70" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <line x1="48" y1="25" x2="48" y2="70" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="25" x2="72" y2="70" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <line x1="96" y1="25" x2="96" y2="70" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          {/* Bank Pediment */}
          <polygon points="10,22 60,4 110,22" fill="#38BDF8" />
        </g>

        {/* Bank Location Pin */}
        <g transform="translate(540, 325)">
          <path d="M 0 0 C -14 -14 -14 -32 0 -44 C 14 -32 14 -14 0 0 Z" fill="#FAF7F2" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="0" cy="-26" r="6" fill="#0F172A" />
          {/* Bank Pill Tag */}
          <rect x="-42" y="-76" width="84" height="26" rx="6" fill="#0F172A" stroke="#FAF7F2" strokeWidth="1.5" />
          <text x="0" y="-58" textAnchor="middle" fill="#FAF7F2" fontSize="13" fontWeight="900" letterSpacing="0.1em">
            BANK
          </text>
        </g>

        {/* Vince Neon Route (Orange) */}
        <path
          d="M 540 500 L 240 500 L 240 860"
          fill="none"
          stroke="#F97316"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-orange)"
          opacity="0.9"
        />

        {/* You Neon Route (White/Cyan) */}
        <path
          d="M 540 500 L 780 500 L 780 940 L 680 1020"
          fill="none"
          stroke="#FAF7F2"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-cyan)"
          opacity="0.95"
        />

        {/* Vince's Car Icon & Badge */}
        <g transform={`translate(${vinceX}, ${vinceY})`}>
          <rect x="-18" y="-30" width="36" height="60" rx="8" fill="#1E293B" stroke="#F97316" strokeWidth="3" />
          {/* Headlights */}
          <circle cx="-10" cy="26" r="3" fill="#FDE047" />
          <circle cx="10" cy="26" r="3" fill="#FDE047" />
          {/* Vince Badge */}
          <rect x="-40" y="-62" width="80" height="24" rx="6" fill="#0F172A" stroke="#F97316" strokeWidth="2" />
          <text x="0" y="-46" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="900" letterSpacing="0.1em">
            VINCE
          </text>
        </g>

        {/* You Car Icon & Badge */}
        <g transform={`translate(${youX}, ${youY})`}>
          <rect x="-18" y="-30" width="36" height="60" rx="8" fill="#0F172A" stroke="#FAF7F2" strokeWidth="3" />
          {/* Headlights */}
          <circle cx="-10" cy="26" r="3" fill="#FEF08A" />
          <circle cx="10" cy="26" r="3" fill="#FEF08A" />
          {/* You Badge */}
          <rect x="-35" y="-62" width="70" height="24" rx="6" fill="#0F172A" stroke="#FAF7F2" strokeWidth="2" />
          <text x="0" y="-46" textAnchor="middle" fill="#FAF7F2" fontSize="12" fontWeight="900" letterSpacing="0.1em">
            YOU
          </text>
        </g>

        {/* Police Cruiser with Strobe Siren */}
        {showPolice && (
          <g transform={`translate(${policeX}, ${policeY})`}>
            <rect x="-16" y="-28" width="32" height="56" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Siren Lightbar */}
            <rect x="-12" y="-4" width="11" height="8" rx="2" fill={redSiren ? '#EF4444' : '#7F1D1D'} />
            <rect x="1" y="-4" width="11" height="8" rx="2" fill={blueSiren ? '#3B82F6' : '#1E3A8A'} />
            {/* Alternating Strobe Halo */}
            <circle
              cx="0"
              cy="0"
              r="34"
              fill={redSiren ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.35)'}
            />
          </g>
        )}

        {/* Motel Destination Badge */}
        <g transform="translate(680, 1020)">
          <rect x="-60" y="-22" width="120" height="44" rx="10" fill="#0F172A" stroke="#EC4899" strokeWidth="3" />
          <text x="0" y="7" textAnchor="middle" fill="#EC4899" fontSize="20" fontWeight="900" letterSpacing="0.15em">
            MOTEL
          </text>
        </g>
      </svg>

      {/* Top Header: "THE PLAN" */}
      <div
        style={{
          position: 'absolute',
          top: '135px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#F8FAFC',
            margin: 0,
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          THE PLAN
        </h1>

        {/* Tactical Checklist */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'left',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ color: '#F97316', fontWeight: 900, fontSize: '18px' }}>1</span>
            <span style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '18px', letterSpacing: '0.06em' }}>
              SPLIT UP
            </span>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '18px' }}>2</span>
            <span style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '18px', letterSpacing: '0.06em' }}>
              LOSE ANY TAIL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
