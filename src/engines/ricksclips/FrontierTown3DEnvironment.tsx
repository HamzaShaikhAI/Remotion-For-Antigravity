import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface FrontierTown3DEnvironmentProps {
  sceneType?: 'street_day' | 'street_sunset' | 'saloon_interior' | 'telegraph_interior';
  cameraPanX?: number;
  cameraZoom?: number;
}

export const FrontierTown3DEnvironment: React.FC<FrontierTown3DEnvironmentProps> = ({
  sceneType = 'street_day',
  cameraPanX = 0,
  cameraZoom = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ========================================================
  // SCENE 1 & 2: 3D WESTERN FRONTIER TOWN STREET (Day / Sunset)
  // ========================================================
  if (sceneType === 'street_day' || sceneType === 'street_sunset') {
    const isSunset = sceneType === 'street_sunset';

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transform: `scale(${cameraZoom}) translateX(${cameraPanX}px)`,
          transformOrigin: 'center center',
        }}
      >
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          <defs>
            {/* Sky Gradients */}
            <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="65%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="35%" stopColor="#be185d" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>

            {/* Dirt Road Perspective Gradient */}
            <linearGradient id="dirtRoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isSunset ? '#9a3412' : '#ca8a04'} />
              <stop offset="100%" stopColor={isSunset ? '#431407' : '#eab308'} />
            </linearGradient>

            {/* Distant Mesa Gradients */}
            <linearGradient id="mesaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isSunset ? '#f97316' : '#ea580c'} />
              <stop offset="100%" stopColor={isSunset ? '#7c2d12' : '#9a3412'} />
            </linearGradient>
          </defs>

          {/* 1. SKY */}
          <rect width="1080" height="1100" fill={isSunset ? 'url(#sunsetSky)' : 'url(#daySky)'} />

          {/* Sun / Clouds */}
          {!isSunset ? (
            <>
              {/* Fluffy White Clouds */}
              <ellipse cx="240" cy="280" rx="140" ry="60" fill="#ffffff" opacity="0.95" />
              <ellipse cx="320" cy="250" rx="90" ry="50" fill="#ffffff" opacity="0.95" />
              <ellipse cx="780" cy="380" rx="180" ry="70" fill="#ffffff" opacity="0.9" />
              <ellipse cx="880" cy="340" rx="110" ry="55" fill="#ffffff" opacity="0.9" />
            </>
          ) : (
            <>
              {/* Glowing Sunset Orb */}
              <circle cx="280" cy="520" r="160" fill="#fef08a" opacity="0.8" />
              <circle cx="280" cy="520" r="90" fill="#ffffff" />
            </>
          )}

          {/* 2. DISTANT DESERT MESAS & CANYONS */}
          <path
            d="M -100 850 L 150 720 L 320 750 L 520 680 L 750 740 L 960 700 L 1180 850 Z"
            fill="url(#mesaGrad)"
            opacity="0.85"
          />

          {/* Saguaro Cacti Silhouettes */}
          <g fill={isSunset ? '#451a03' : '#14532d'} opacity="0.9">
            <rect x="420" y="740" width="12" height="90" rx="6" />
            <path d="M 410 770 L 410 750" stroke={isSunset ? '#451a03' : '#14532d'} strokeWidth="8" strokeLinecap="round" />
            <path d="M 438 785 L 438 765" stroke={isSunset ? '#451a03' : '#14532d'} strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* 3. DUSTY 3D DIRT STREET WITH LINEAR PERSPECTIVE */}
          {/* Vanishing Point at (540, 780) */}
          <polygon points="500,780 580,780 1200,1920 -120,1920" fill="url(#dirtRoad)" />

          {/* Wagon Wheel Ruts in Dirt */}
          <path
            d="M 525 780 Q 560 1200 320 1920"
            fill="none"
            stroke={isSunset ? '#291004' : '#a16207'}
            strokeWidth="12"
            opacity="0.4"
          />
          <path
            d="M 555 780 Q 640 1200 840 1920"
            fill="none"
            stroke={isSunset ? '#291004' : '#a16207'}
            strokeWidth="12"
            opacity="0.4"
          />

          {/* Scattered Pebbles & Dust Motes */}
          {Array.from({ length: 18 }, (_, i) => {
            const pX = (i * 68 + 120) % 960;
            const pY = 1100 + ((i * 47) % 750);
            return (
              <circle
                key={i}
                cx={pX}
                cy={pY}
                r={3 + (i % 3) * 2}
                fill={isSunset ? '#291004' : '#78350f'}
                opacity="0.35"
              />
            );
          })}

          {/* 4. LEFT BUILDINGS (Blue Telegraph Office & Saloon) */}
          <g>
            {/* Front Building (Blue Storefront / Telegraph) */}
            <polygon points="-80,320 380,560 360,1180 -120,1140" fill="#1e3a8a" />
            <polygon points="380,560 520,740 500,1080 360,1180" fill="#172554" />
            {/* Wooden Boardwalk / Porch */}
            <polygon points="-120,1140 360,1180 500,1080 480,1110 340,1220 -120,1190" fill="#78350f" />
            {/* Storefront Sign Board */}
            <polygon points="-40,420 340,610 330,680 -50,510" fill="#f8fafc" />
            <text x="50" y="580" fill="#0f172a" fontSize="32" fontWeight="900" fontFamily="sans-serif" transform="rotate(18, 50, 580)">
              TELEGRAPH
            </text>
            {/* Window */}
            <polygon points="60,690 220,780 200,980 40,890" fill="#e2e8f0" stroke="#0f172a" strokeWidth="6" />
          </g>

          {/* 5. RIGHT BUILDINGS (Red Saloon & General Store) */}
          <g>
            <polygon points="1160,400 700,640 710,1140 1200,1120" fill="#991b1b" />
            <polygon points="700,640 580,750 590,1060 710,1140" fill="#7f1d1d" />
            {/* Wooden Boardwalk */}
            <polygon points="710,1140 1200,1120 1200,1160 690,1180" fill="#78350f" />
            {/* Porch Pillars */}
            <line x1="720" y1="820" x2="720" y2="1140" stroke="#451a03" strokeWidth="12" />
            <line x1="860" y1="760" x2="860" y2="1130" stroke="#451a03" strokeWidth="12" />
            {/* Barrel */}
            <ellipse cx="680" cy="1160" rx="20" ry="32" fill="#78350f" stroke="#451a03" strokeWidth="4" />
          </g>

          {/* 6. TELEGRAPH POLES & SAGGING CATENARY POWER LINES */}
          <g>
            {/* Left Telegraph Pole */}
            <line x1="420" y1="620" x2="420" y2="920" stroke="#1c1917" strokeWidth="10" />
            <line x1="380" y1="660" x2="460" y2="660" stroke="#1c1917" strokeWidth="8" />
            {/* Right Telegraph Pole */}
            <line x1="680" y1="560" x2="680" y2="880" stroke="#1c1917" strokeWidth="10" />
            <line x1="640" y1="600" x2="720" y2="600" stroke="#1c1917" strokeWidth="8" />

            {/* Sagging Power Lines Crossing the Sky */}
            <path d="M -100 480 Q 200 680 420 660" fill="none" stroke="#09090b" strokeWidth="2.5" />
            <path d="M 420 660 Q 550 630 680 600" fill="none" stroke="#09090b" strokeWidth="2.5" />
            <path d="M 680 600 Q 900 520 1180 420" fill="none" stroke="#09090b" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // ========================================================
  // SCENE 3: SALOON INTERIOR (Poker Table, Cards, Stew, Lamp)
  // ========================================================
  if (sceneType === 'saloon_interior') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#1c1917',
          overflow: 'hidden',
        }}
      >
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <defs>
            {/* Warm Hanging Lamp Amber Cone */}
            <radialGradient id="lampCone" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1c1917" stopOpacity="0.95" />
            </radialGradient>
            {/* Wooden Table Texture */}
            <radialGradient id="tableWood" cx="45%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#a16207" />
              <stop offset="75%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
          </defs>

          {/* Dark Saloon Walls & Blue Twilight Windows in Background */}
          <rect width="1080" height="1920" fill="#292524" />
          {/* Deep Blue Night Windows */}
          <rect x="80" y="240" width="220" height="420" rx="10" fill="#1e3a8a" stroke="#78350f" strokeWidth="14" />
          <line x1="190" y1="240" x2="190" y2="660" stroke="#78350f" strokeWidth="10" />
          <line x1="80" y1="450" x2="300" y2="450" stroke="#78350f" strokeWidth="10" />

          {/* 3D Circular Wooden Poker Table */}
          <ellipse
            cx="540"
            cy="1380"
            rx="460"
            ry="380"
            fill="url(#tableWood)"
            stroke="#291004"
            strokeWidth="20"
          />

          {/* Playing Cards on Table */}
          <g transform="translate(480, 1180) rotate(-15)">
            <rect x="0" y="0" width="56" height="84" rx="4" fill="#ffffff" stroke="#09090b" strokeWidth="2" />
            <text x="8" y="24" fill="#dc2626" fontSize="20" fontWeight="900">A♥</text>
          </g>
          <g transform="translate(560, 1190) rotate(12)">
            <rect x="0" y="0" width="56" height="84" rx="4" fill="#ffffff" stroke="#09090b" strokeWidth="2" />
            <text x="8" y="24" fill="#09090b" fontSize="20" fontWeight="900">K♠</text>
          </g>
          <g transform="translate(630, 1210) rotate(35)">
            <rect x="0" y="0" width="56" height="84" rx="4" fill="#ffffff" stroke="#09090b" strokeWidth="2" />
            <text x="8" y="24" fill="#dc2626" fontSize="20" fontWeight="900">Q♦</text>
          </g>

          {/* Poker Chip Stacks */}
          <g transform="translate(740, 1340)">
            {Array.from({ length: 6 }, (_, i) => (
              <ellipse key={i} cx="0" cy={-i * 7} rx="24" ry="10" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <ellipse key={i} cx="52" cy={-i * 7} rx="24" ry="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            ))}
          </g>

          {/* Ceramic Stew Bowls & Tin Coffee Mugs */}
          <g transform="translate(320, 1180)">
            <ellipse cx="0" cy="0" rx="38" ry="22" fill="#78350f" stroke="#451a03" strokeWidth="4" />
            <ellipse cx="0" cy="0" rx="30" ry="16" fill="#ca8a04" />
          </g>
          <g transform="translate(720, 1140)">
            <ellipse cx="0" cy="0" rx="38" ry="22" fill="#78350f" stroke="#451a03" strokeWidth="4" />
            <ellipse cx="0" cy="0" rx="30" ry="16" fill="#ca8a04" />
          </g>

          {/* Overhead Hanging Brass Lamp */}
          <line x1="540" y1="0" x2="540" y2="380" stroke="#09090b" strokeWidth="6" />
          <path d="M 380 480 L 700 480 L 590 380 L 490 380 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="6" />
          {/* Amber Light Pool */}
          <ellipse cx="540" cy="1380" rx="520" ry="420" fill="url(#lampCone)" pointerEvents="none" />
        </svg>
      </div>
    );
  }

  // ========================================================
  // SCENE 4: TELEGRAPH OFFICE INTERIOR (Night & Volumetric Light)
  // ========================================================
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0c4a6e', // Deep Teal / Blue Night Room
        overflow: 'hidden',
      }}
    >
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="moonlightBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Arch Vault Ceiling */}
        <path d="M 0 0 L 1080 0 L 1080 1920 L 0 1920 Z" fill="#082f49" />
        <path d="M 120 1920 L 120 480 C 120 220, 960 220, 960 480 L 960 1920 Z" fill="#0369a1" />

        {/* Sign on Wall */}
        <g transform="translate(320, 260)">
          <rect x="0" y="0" width="340" height="60" rx="6" fill="#082f49" stroke="#38bdf8" strokeWidth="3" />
          <text x="24" y="40" fill="#f8fafc" fontSize="22" fontWeight="900" fontFamily="sans-serif">
            THINK BEFORE YOU DRAW
          </text>
        </g>

        {/* Two Circular Porthole Windows (Resembling Eyes!) */}
        <g transform="translate(340, 560)">
          {/* Window Frame */}
          <circle cx="0" cy="0" r="140" fill="#0284c7" stroke="#082f49" strokeWidth="18" />
          <circle cx="0" cy="0" r="115" fill="#38bdf8" />
          {/* Eyebrow Awning */}
          <path d="M -130 -80 Q 0 -130 130 -80" fill="none" stroke="#082f49" strokeWidth="24" strokeLinecap="round" />
        </g>

        <g transform="translate(740, 560)">
          <circle cx="0" cy="0" r="140" fill="#0284c7" stroke="#082f49" strokeWidth="18" />
          <circle cx="0" cy="0" r="115" fill="#38bdf8" />
          <path d="M -130 -80 Q 0 -130 130 -80" fill="none" stroke="#082f49" strokeWidth="24" strokeLinecap="round" />
        </g>

        {/* Volumetric Moonlight Beams streaming from windows */}
        <polygon points="230,560 450,560 620,1650 60,1650" fill="url(#moonlightBeam)" />
        <polygon points="630,560 850,560 1020,1650 460,1650" fill="url(#moonlightBeam)" />

        {/* Telegraph Operator Desk */}
        <polygon points="60,1280 1020,1280 980,1680 100,1680" fill="#0f172a" stroke="#0284c7" strokeWidth="4" />
        {/* Antique Telegraph Key Machine */}
        <rect x="520" y="1230" width="110" height="50" rx="4" fill="#ca8a04" stroke="#09090b" strokeWidth="4" />
        <circle cx="550" cy="1225" r="8" fill="#09090b" />
        <line x1="550" y1="1225" x2="600" y2="1245" stroke="#09090b" strokeWidth="6" />

        {/* Stool with Sign */}
        <g transform="translate(760, 1420)">
          <ellipse cx="0" cy="0" rx="60" ry="24" fill="#082f49" stroke="#38bdf8" strokeWidth="3" />
          <line x1="-30" y1="0" x2="-35" y2="160" stroke="#082f49" strokeWidth="10" />
          <line x1="30" y1="0" x2="35" y2="160" stroke="#082f49" strokeWidth="10" />
          <rect x="-45" y="40" width="90" height="40" fill="#0284c7" rx="3" />
          <text x="-40" y="65" fill="#f8fafc" fontSize="13" fontWeight="900">NOBODY HOME</text>
        </g>
      </svg>
    </div>
  );
};
