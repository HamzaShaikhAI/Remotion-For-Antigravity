import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { DroneOperatingMode } from './types';
import { motionTokens } from '../../tokens/motion';

interface PelagosCephalopod3DProps {
  mode: DroneOperatingMode;
  showLabels?: boolean;
  explodedProgress?: number; // 0 (assembled) to 1 (fully exploded)
  turntable?: boolean;
  jetWake?: boolean;
}

export const PelagosCephalopod3D: React.FC<PelagosCephalopod3DProps> = ({
  mode,
  showLabels = false,
  explodedProgress = 0,
  turntable = false,
  jetWake = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle underwater hydro-buoyancy breathing
  const waveCycle = Math.sin(frame * 0.05);
  const floatY = waveCycle * 8;
  const floatPitch = Math.cos(frame * 0.04) * 3;

  // Turntable spin when active
  const turnAngle = turntable ? (frame * 0.8) % 360 : 0;
  const turnScaleX = turntable ? Math.cos((turnAngle * Math.PI) / 180) : 1;

  // Exploded separation distance
  const explodeDist = explodedProgress * 120;

  // 8 Arm configurations (angles and curled states)
  const armAngles = [
    { id: 'R1', baseAngle: 25, side: 1, length: 220 },
    { id: 'R2', baseAngle: 55, side: 1, length: 250 },
    { id: 'R3', baseAngle: 85, side: 1, length: 240 },
    { id: 'R4', baseAngle: 115, side: 1, length: 210 },
    { id: 'L1', baseAngle: -25, side: -1, length: 220 },
    { id: 'L2', baseAngle: -55, side: -1, length: 250 },
    { id: 'L3', baseAngle: -85, side: -1, length: 240 },
    { id: 'L4', baseAngle: -115, side: -1, length: 210 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 800,
        height: 600,
        transform: `translate(-50%, -50%) translateY(${floatY}px) rotate(${floatPitch}deg) scaleX(${turnScaleX})`,
        pointerEvents: 'none',
      }}
    >
      <svg width="800" height="600" viewBox="-400 -300 800 600" style={{ overflow: 'visible' }}>
        <defs>
          {/* Sphere Head Radial Shading */}
          <radialGradient id="mantleShade" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
          {/* Dark Optic Eye Lens */}
          <radialGradient id="opticLens" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          {/* Metallic Joint Gradients */}
          <linearGradient id="armJointMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#e2e8f0" />
            <stop offset="55%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          {/* Orange Hazard Accent */}
          <linearGradient id="orangeAccent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* JET WAKE (Bubbles & Cavitation Trails)                     */}
        {/* ======================================================== */}
        {jetWake && (
          <g opacity="0.65">
            {Array.from({ length: 18 }, (_, i) => {
              const bProgress = ((frame * 6 + i * 28) % 400);
              const bX = -120 - bProgress;
              const bY = Math.sin(frame * 0.2 + i) * 35;
              const bRadius = 3 + (i % 4) * 2.5;
              return (
                <circle
                  key={i}
                  cx={bX}
                  cy={bY}
                  r={bRadius}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity={1 - bProgress / 400}
                />
              );
            })}
          </g>
        )}

        {/* ======================================================== */}
        {/* INNER PUMP CORE & TURBINE ROTOR (Visible in Exploded/Siphon) */}
        {/* ======================================================== */}
        <g transform={`translate(${explodeDist * 0.4}, ${explodeDist * -0.5})`}>
          {/* Cylindrical Pump Core */}
          <rect
            x="-45"
            y="-35"
            width="90"
            height="70"
            rx="12"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="3"
          />
          {/* Spinning Turbine Rotor Spokes */}
          <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#ea580c" strokeWidth="2" />
          {Array.from({ length: 7 }, (_, i) => {
            const spokeAngle = ((i * 360) / 7 + frame * 4) % 360;
            const sRad = (spokeAngle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={Math.cos(sRad) * 22}
                y2={Math.sin(sRad) * 22}
                stroke="#f97316"
                strokeWidth="2.5"
              />
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* 8 ARTICULATED ROBOTIC ARMS                               */}
        {/* ======================================================== */}
        <g>
          {armAngles.map((arm, aIdx) => {
            // Calculate posture based on operating mode
            let targetSpread = 1;
            let curlFactor = 0.3;
            let sweepX = 0;
            let sweepY = 0;

            if (mode === 'JETTING' || mode === 'DEPARTING') {
              // Hydrodynamic trailing sweep backwards
              sweepX = -180 - aIdx * 12;
              sweepY = (aIdx - 3.5) * 28;
              targetSpread = 0.4;
              curlFactor = 0.15;
            } else if (mode === 'HOLDING' || mode === 'SIPHON_OPEN') {
              // Starfish crawler stance with curled tips
              sweepX = Math.cos((arm.baseAngle * Math.PI) / 180) * 240 * arm.side;
              sweepY = Math.sin((arm.baseAngle * Math.PI) / 180) * 160 + 90;
              targetSpread = 1.0;
              curlFactor = 0.9;
            } else if (mode === 'TEARDOWN') {
              // Radially exploded apart
              sweepX = Math.cos((arm.baseAngle * Math.PI) / 180) * (320 + explodeDist) * arm.side;
              sweepY = Math.sin((arm.baseAngle * Math.PI) / 180) * (240 + explodeDist);
              curlFactor = 0.1;
            }

            // Arm Segments
            const segCount = 4;
            const segments = Array.from({ length: segCount }, (_, s) => {
              const segProgress = (s + 1) / segCount;
              const segX = sweepX * segProgress;
              const segY = sweepY * segProgress + Math.sin(frame * 0.08 + aIdx) * 6;
              const segRadius = 18 - s * 2.5;
              return { s, segX, segY, segRadius };
            });

            return (
              <g key={arm.id}>
                {/* Arm Base Hub connection */}
                <circle
                  cx={arm.side * 45}
                  cy={35 + (aIdx % 4) * 12}
                  r={12}
                  fill="#334155"
                  stroke="#64748b"
                  strokeWidth="2"
                />

                {/* Connecting Mechanical Links / Hydraulic Cables */}
                <path
                  d={`M ${arm.side * 45} ${35 + (aIdx % 4) * 12} Q ${sweepX * 0.4} ${sweepY * 0.3} ${sweepX} ${sweepY}`}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${arm.side * 45} ${35 + (aIdx % 4) * 12} Q ${sweepX * 0.4} ${sweepY * 0.3} ${sweepX} ${sweepY}`}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />

                {/* Segment Shells */}
                {segments.map((seg) => (
                  <g
                    key={seg.s}
                    transform={`translate(${seg.segX}, ${seg.segY})`}
                  >
                    {/* Segment body */}
                    <rect
                      x={-seg.segRadius}
                      y={-seg.segRadius * 0.8}
                      width={seg.segRadius * 2}
                      height={seg.segRadius * 1.6}
                      rx="4"
                      fill="url(#armJointMetal)"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Orange joint ring */}
                    <line
                      x1={-seg.segRadius}
                      y1="0"
                      x2={seg.segRadius}
                      y2="0"
                      stroke="#ea580c"
                      strokeWidth="2.5"
                    />
                    {/* Suction wheel link */}
                    <circle cx="0" cy={seg.segRadius * 0.9} r="4" fill="#09090b" stroke="#ea580c" strokeWidth="1" />
                  </g>
                ))}

                {/* Arm Tip Curl */}
                {curlFactor > 0.5 && (
                  <path
                    d={`M ${sweepX} ${sweepY} C ${sweepX + 25 * arm.side} ${sweepY + 30}, ${sweepX + 35 * arm.side} ${sweepY - 15}, ${sweepX + 15 * arm.side} ${sweepY - 5}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* TELESCOPING SIPHON MANIPULATOR (Active in Siphon Open)    */}
        {/* ======================================================== */}
        {mode === 'SIPHON_OPEN' && (
          <g transform="translate(0, 75)">
            {/* Sleeve 1 */}
            <rect x="-22" y="0" width="44" height="35" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            {/* Sleeve 2 (Telescoped) */}
            <rect x="-16" y="30" width="32" height="40" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            {/* Sleeve 3 / Gripper Beak */}
            <rect x="-10" y="65" width="20" height="30" rx="2" fill="#0f172a" stroke="#ea580c" strokeWidth="2" />
            {/* Gripper Pincers */}
            <path d="M -10 95 L -18 120 L -6 115 Z" fill="#ea580c" />
            <path d="M 10 95 L 18 120 L 6 115 Z" fill="#ea580c" />
          </g>
        )}

        {/* ======================================================== */}
        {/* MANTLE HEAD SPHERE (Left & Right Split Shells)            */}
        {/* ======================================================== */}
        <g>
          {/* Left Shell Hemisphere */}
          <path
            d="M 0 -110 A 110 110 0 0 0 0 110 Z"
            fill="url(#mantleShade)"
            stroke="#94a3b8"
            strokeWidth="3"
            transform={`translate(${-explodeDist}, 0)`}
          />
          {/* Left Rivet Bolts */}
          {Array.from({ length: 7 }, (_, i) => {
            const angle = 90 + (i * 180) / 7;
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={Math.cos(rad) * 96 - explodeDist}
                cy={Math.sin(rad) * 96}
                r="3"
                fill="#334155"
              />
            );
          })}

          {/* Right Shell Hemisphere */}
          <path
            d="M 0 -110 A 110 110 0 0 1 0 110 Z"
            fill="url(#mantleShade)"
            stroke="#94a3b8"
            strokeWidth="3"
            transform={`translate(${explodeDist}, 0)`}
          />
          {/* Orange ID Decal Badge */}
          <g transform={`translate(${28 + explodeDist}, -40)`}>
            <rect x="0" y="0" width="46" height="18" rx="3" fill="#ea580c" />
            <text x="7" y="13" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">
              OC-8
            </text>
          </g>

          {/* Main Forward Optical Eye Port */}
          <g transform={`translate(${55 + explodeDist * 0.8}, 10)`}>
            {/* Outer Bezel */}
            <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
            {/* Orange Hazard Ring */}
            <circle cx="0" cy="0" r="34" fill="none" stroke="#ea580c" strokeWidth="5" />
            {/* Deep Glass Lens */}
            <circle cx="0" cy="0" r="28" fill="url(#opticLens)" />
            {/* Glare Reflection Highlight */}
            <ellipse cx="-8" cy="-8" rx="8" ry="4" fill="#ffffff" opacity="0.4" transform="rotate(-30)" />
          </g>
        </g>

        {/* ======================================================== */}
        {/* CALLOUT LABELS & LEADER LINES                            */}
        {/* ======================================================== */}
        {showLabels && (
          <g fontFamily="'Courier New', monospace" fontSize="12" fontWeight="700">
            {/* Siphon Label */}
            {mode === 'SIPHON_OPEN' && (
              <g transform="translate(-180, 160)">
                <line x1="0" y1="0" x2="160" y2="-40" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="-10" y="-14" width="160" height="20" fill="#000000" rx="3" />
                <text x="0" y="0" fill="#facc15">■ SIPHON / TELESCOPING</text>
              </g>
            )}

            {/* Exploded Callouts */}
            {mode === 'TEARDOWN' && (
              <>
                {/* Pump Core */}
                <g transform="translate(140, -180)">
                  <line x1="0" y1="0" x2="-100" y2="120" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                  <rect x="-10" y="-14" width="130" height="20" fill="#000000" rx="3" />
                  <text x="0" y="0" fill="#facc15">■ PUMP CORE</text>
                </g>
                {/* Arm Links */}
                <g transform="translate(-320, 20)">
                  <line x1="0" y1="0" x2="120" y2="0" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                  <rect x="-10" y="-14" width="120" height="20" fill="#000000" rx="3" />
                  <text x="0" y="0" fill="#facc15">■ ARM LINKS</text>
                </g>
                {/* Optics */}
                <g transform="translate(180, 20)">
                  <line x1="0" y1="0" x2="-80" y2="0" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                  <rect x="-10" y="-14" width="110" height="20" fill="#000000" rx="3" />
                  <text x="0" y="0" fill="#facc15">■ OPTICS</text>
                </g>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
