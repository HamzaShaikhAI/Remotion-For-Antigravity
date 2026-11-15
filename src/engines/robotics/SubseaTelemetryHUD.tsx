import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { DroneTelemetry } from './types';

interface SubseaTelemetryHUDProps {
  telemetry: DroneTelemetry;
}

export const SubseaTelemetryHUD: React.FC<SubseaTelemetryHUDProps> = ({ telemetry }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Timecode calculation (00:00:SS)
  const totalSeconds = Math.floor(frame / fps);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const timecode = `00:${minutes}:${seconds}`;

  // Pulse sine wave for Jet graph
  const pulseWave = Math.sin((frame * telemetry.pulseHz * 2 * Math.PI) / fps);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        fontFamily: "'SF Mono', 'Courier New', monospace",
        color: '#334155',
        pointerEvents: 'none',
      }}
    >
      {/* Background Reticle Grid Dots */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.18,
        }}
      >
        <defs>
          <pattern id="hud-cross-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <text x="20" y="24" fill="#64748b" fontSize="12" textAnchor="middle">
              +
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hud-cross-dots)" />
      </svg>

      {/* ======================================================== */}
      {/* TOP HEADER BAR                                           */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 68,
          backgroundColor: '#ffffff',
          borderBottom: '1.5px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          boxSizing: 'border-box',
          zIndex: 20,
        }}
      >
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Orange Brand Badge */}
          <div
            style={{
              backgroundColor: '#ea580c',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: 4,
              fontWeight: 900,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: 1.5,
            }}
          >
            <span>🐙</span>
            <span>OC-8</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#09090b', letterSpacing: 1 }}>
                Pelagos OC-8
              </span>
              <span style={{ color: '#ea580c', fontWeight: 900 }}>/</span>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                ROBOTIC CEPHALOPOD • EIGHT-ARM SUBSEA DRONE
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.5 }}>
              SOFT-ARM MANIPULATOR / FIELD SIMULATOR
            </div>
          </div>
        </div>

        {/* Top Telemetry Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 12 }}>
          {/* Jet Load Meter */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 3 }}>JET LOAD 38%</div>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 12,
                    backgroundColor: i < 5 ? '#ea580c' : '#e2e8f0',
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sim ID */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>SIM ID</div>
            <div style={{ fontWeight: 800, color: '#09090b' }}>OC8-0731</div>
          </div>

          {/* Runtime */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>RUNTIME</div>
            <div style={{ fontWeight: 800, color: '#09090b' }}>{timecode}</div>
          </div>

          {/* Status */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>STATUS</div>
            <div style={{ fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#16a34a' }} />
              <span>{telemetry.statusText}</span>
            </div>
          </div>

          {/* Operator */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>OPERATOR</div>
            <div style={{ fontWeight: 800, color: '#09090b' }}>TANK 2 • M.S.</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LEFT COLUMN: TELEMETRY METERS (01, 02, 03)               */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 84,
          left: 28,
          width: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Widget 01: JET */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| JET</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>01</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#09090b', lineHeight: 1 }}>
                {telemetry.mantlePressureKpa} <span style={{ fontSize: 12 }}>KPA</span>
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>MANTLE PRESSURE</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#09090b', lineHeight: 1 }}>
                {telemetry.thrustN} <span style={{ fontSize: 12 }}>N</span>
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>THRUST</div>
            </div>
          </div>

          {/* Oscillating Sine Wave Graph */}
          <div style={{ height: 44, width: '100%', marginTop: 8, position: 'relative' }}>
            <svg width="100%" height="44" viewBox="0 0 190 44">
              <path
                d={`M 0 22 Q 47.5 ${22 - pulseWave * 14} 95 22 T 190 22`}
                fill="none"
                stroke="#ea580c"
                strokeWidth="2"
              />
              <line x1="0" y1="22" x2="190" y2="22" stroke="#e2e8f0" strokeDasharray="3 3" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
            <span>PULSE {telemetry.pulseHz} HZ</span>
            <span>SIPHON {telemetry.pulseHz > 0 ? 'ACTIVE' : 'IDLE'}</span>
          </div>
        </div>

        {/* Widget 02: POWER */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| POWER</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>02</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#09090b', lineHeight: 1 }}>
                {telemetry.batteryPct}%
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>BATTERY</div>
            </div>
            {/* Battery Level Segments */}
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 16,
                    backgroundColor: i < Math.floor(telemetry.batteryPct / 12.5) ? '#10b981' : '#e2e8f0',
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              fontSize: 10,
              color: '#64748b',
              borderTop: '1px solid #f1f5f9',
              paddingTop: 6,
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>DRAW </span>
              {telemetry.drawW} W
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>CELL </span>
              {telemetry.cellV} V
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>MOTOR </span>
              {telemetry.motorTempC} °C
            </div>
          </div>
        </div>

        {/* Widget 03: ARM CURL */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| ARM CURL</span>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                backgroundColor: telemetry.operatingMode === 'TEARDOWN' ? '#ea580c' : '#10b981',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: 3,
              }}
            >
              {telemetry.operatingMode === 'TEARDOWN'
                ? 'DETACHED'
                : telemetry.operatingMode === 'HOLDING'
                ? 'CURLING'
                : 'TRAILING'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10 }}>
            {Object.entries(telemetry.armCurls).map(([k, val]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{k}</span>
                {val === 'DETACHED' ? (
                  <span style={{ color: '#ea580c', fontWeight: 800, fontSize: 9 }}>DETACHED</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 80, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${val}%`,
                          height: '100%',
                          backgroundColor: val > 80 ? '#ea580c' : '#09090b',
                        }}
                      />
                    </div>
                    <span style={{ width: 26, textAlign: 'right', fontWeight: 700 }}>{val}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: CONTROLS & STATUS (04, 05, 06, 07)         */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 84,
          right: 28,
          width: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Widget 04: DEPTH & ARTIFICIAL HORIZON */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| DEPTH</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>04</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Horizon Reticle */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '1.5px solid #cbd5e1',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <line
                style={{
                  width: 38,
                  height: 2,
                  backgroundColor: '#ea580c',
                  position: 'absolute',
                  transform: `rotate(${telemetry.rollDeg}deg)`,
                }}
              />
              <circle cx="26" cy="26" r="3" fill="#ea580c" />
            </div>

            <div style={{ fontSize: 10, color: '#64748b' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>DEPTH </span>
                <span style={{ fontWeight: 800, color: '#09090b' }}>{telemetry.depthM} M</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>V/S </span>
                {telemetry.vsMs > 0 ? `+${telemetry.vsMs}` : telemetry.vsMs} M/S
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>PITCH </span>
                {telemetry.pitchDeg}°
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>SPEED </span>
                {telemetry.speedMs} M/S
              </div>
            </div>
          </div>
        </div>

        {/* Widget 05: ASSEMBLIES TABS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| ASSEMBLIES</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>05</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {(['HERO', 'OPTICS', 'MANTLE', 'ARM R2', 'SIPHON', 'BEAK'] as const).map((tab) => {
              const isActive = telemetry.activeAssembly === tab;
              return (
                <div
                  key={tab}
                  style={{
                    backgroundColor: isActive ? '#ea580c' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '6px 0',
                    textAlign: 'center',
                    borderRadius: 3,
                    border: isActive ? '1px solid #c2410c' : '1px solid #e2e8f0',
                  }}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 06: DISPLAY TOGGLES */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| DISPLAY</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>06</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              { label: 'LABELS', active: telemetry.display.labels },
              { label: 'EXPLODED', active: telemetry.display.exploded },
              { label: 'JET WAKE', active: telemetry.display.jetWake },
              { label: 'TURNTABLE', active: telemetry.display.turntable },
            ].map((tog) => (
              <div
                key={tog.label}
                style={{
                  backgroundColor: tog.active ? '#ea580c' : '#f8fafc',
                  color: tog.active ? '#ffffff' : '#64748b',
                  fontSize: 9,
                  fontWeight: 800,
                  padding: '6px 0',
                  textAlign: 'center',
                  borderRadius: 3,
                  border: tog.active ? '1px solid #c2410c' : '1px solid #e2e8f0',
                }}
              >
                {tog.label}
              </div>
            ))}
          </div>
        </div>

        {/* Widget 07: SUBSYSTEMS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| SUBSYSTEMS</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>07</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 9 }}>
            {[
              { id: '01', name: 'OPTIC ARRAY', state: telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : 'TRACKING' },
              { id: '02', name: 'MANTLE SHELL', state: telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : 'SEALED' },
              { id: '03', name: 'PUMP CORE', state: telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : 'RUNNING' },
              { id: '04', name: 'ARM CHAINS', state: telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : '8/8 LIVE' },
              { id: '05', name: 'SIPHON', state: telemetry.operatingMode === 'SIPHON_OPEN' ? 'OPEN' : telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : 'IDLE' },
              { id: '06', name: 'BEAK', state: telemetry.operatingMode === 'TEARDOWN' ? 'DETACHED' : 'SEALED' },
            ].map((sub) => {
              const isDetached = sub.state === 'DETACHED';
              const isGreen = sub.state === 'TRACKING' || sub.state === 'SEALED' || sub.state === 'RUNNING' || sub.state === '8/8 LIVE';
              return (
                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b' }}>
                    <span style={{ color: '#94a3b8' }}>{sub.id} </span>
                    {sub.name}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      backgroundColor: isDetached ? '#ea580c' : isGreen ? '#16a34a' : '#f59e0b',
                      color: '#ffffff',
                      padding: '2px 5px',
                      borderRadius: 2,
                    }}
                  >
                    {sub.state}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CENTER FLOATING OPERATING MODE BANNER                    */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 280,
          zIndex: 15,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2 }}>
          OPERATING MODE
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            color: '#ea580c',
            letterSpacing: 2,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {telemetry.operatingMode.replace('_', ' ')}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
          {telemetry.operatorAction}
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM PANEL: OPERATION LOG & SCRUBBER (08)              */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 28,
          right: 28,
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 6,
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 900, color: '#09090b', fontSize: 13 }}>| OPERATION LOG</span>
            <span style={{ color: '#ea580c', fontSize: 11, fontWeight: 700 }}>
              {telemetry.operatorAction}
            </span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>08</span>
        </div>

        {/* Timeline Scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Pause Button */}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 4,
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            ||
          </div>

          {/* Time Scrubber Line */}
          <div style={{ flex: 1, height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, position: 'relative' }}>
            <div
              style={{
                width: `${(frame / 1500) * 100}%`,
                height: '100%',
                backgroundColor: '#ea580c',
                borderRadius: 2,
              }}
            />
            {/* Scrubber Knob */}
            <div
              style={{
                position: 'absolute',
                top: -5,
                left: `${(frame / 1500) * 100}%`,
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '3px solid #ea580c',
                transform: 'translateX(-50%)',
              }}
            />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
            {timecode} / 00:00:25
          </div>
        </div>
      </div>

      {/* Global Technical Watermark Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 28,
          right: 28,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9,
          color: '#94a3b8',
          letterSpacing: 1,
        }}
      >
        <span>FIELD SIMULATOR • PROCEDURAL MODEL • 8 ARMS • 2 OPTICS • 1 SIPHON</span>
        <span>PELAGOS MARINE ROBOTICS • DEEP LAB //////</span>
      </div>
    </div>
  );
};
