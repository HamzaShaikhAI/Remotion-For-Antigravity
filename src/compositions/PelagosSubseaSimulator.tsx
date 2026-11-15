import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile, Audio } from 'remotion';
import { PelagosCephalopod3D, SubseaTelemetryHUD, DroneTelemetry, DroneOperatingMode } from '../engines/robotics';
import { motionTokens } from '../tokens/motion';

export const PelagosSubseaSimulator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Determine current act and operational parameters across 1500 frames (25s @ 60fps)
  let mode: DroneOperatingMode = 'JETTING';
  let statusText = 'JETTING';
  let operatorAction = 'INBOUND • JET ASSIST';
  let activeAssembly: any = 'HERO';
  let mantlePressure = 16;
  let thrust = 8;
  let pulseHz = 1.8;
  let speed = 0.97;
  let depth = 12.31;
  let vsMs = 0.18;
  let pitchDeg = -71.84;
  let rollDeg = 12.64;
  let showLabels = false;
  let exploded = false;
  let turntable = false;
  let jetWake = true;
  let explodedProgress = 0;

  // Arm curl default percentages
  let armCurls: any = {
    r1: 31,
    r2: 14,
    r3: 38,
    r4: 28,
    l1: 28,
    l2: 38,
    l3: 22,
    l4: 24,
  };

  if (frame < 300) {
    // Act 1: Jetting Inbound
    mode = 'JETTING';
    statusText = 'JETTING';
    operatorAction = 'INBOUND • JET ASSIST';
    activeAssembly = 'HERO';
    jetWake = true;
  } else if (frame >= 300 && frame < 660) {
    // Act 2: Isolate Mantle & Holding Stance
    mode = 'HOLDING';
    statusText = 'HOLDING';
    operatorAction = 'OPERATOR • ISOLATE MANTLE';
    activeAssembly = 'MANTLE';
    thrust = 6;
    pulseHz = 0.0;
    speed = 0.04;
    depth = 12.43;
    vsMs = -0.03;
    pitchDeg = 0.91;
    rollDeg = 1.98;
    jetWake = false;
    armCurls = {
      r1: 100,
      r2: 87,
      r3: 100,
      r4: 100,
      l1: 86,
      l2: 100,
      l3: 92,
      l4: 93,
    };
  } else if (frame >= 660 && frame < 960) {
    // Act 3: Isolate Siphon Manipulator
    mode = 'SIPHON_OPEN';
    statusText = 'SIPHON OPEN';
    operatorAction = 'OPERATOR • ISOLATE SIPHON';
    activeAssembly = 'SIPHON';
    showLabels = true;
    thrust = 6;
    pulseHz = 0.0;
    speed = 0.06;
    depth = 12.43;
    armCurls = {
      r1: 100,
      r2: 100,
      r3: 100,
      r4: 100,
      l1: 100,
      l2: 100,
      l3: 99,
      l4: 100,
    };
  } else if (frame >= 960 && frame < 1320) {
    // Act 4: Teardown / Exploded Turntable View
    mode = 'TEARDOWN';
    statusText = 'TEARDOWN';
    operatorAction = 'OPERATOR • EXPLODED ON';
    activeAssembly = 'HERO';
    showLabels = true;
    exploded = true;
    turntable = true;
    jetWake = false;

    // Explode transition spring
    const explodeSpring = spring({
      frame: frame - 960,
      fps,
      config: motionTokens.spring.explode,
    });
    explodedProgress = explodeSpring;

    armCurls = {
      r1: 'DETACHED',
      r2: 'DETACHED',
      r3: 'DETACHED',
      r4: 'DETACHED',
      l1: 'DETACHED',
      l2: 'DETACHED',
      l3: 'DETACHED',
      l4: 'DETACHED',
    };
  } else {
    // Act 5: Hero Release & Departure
    mode = 'DEPARTING';
    statusText = 'DEPARTING';
    operatorAction = 'OPERATOR • HERO • RELEASE';
    activeAssembly = 'HERO';
    jetWake = true;
    thrust = 6;
    mantlePressure = 18;
    pulseHz = 1.8;
    speed = 2.01;
    depth = 11.77;
    vsMs = -0.53;
    pitchDeg = -74.0;
    rollDeg = -12.6;
    armCurls = {
      r1: 32,
      r2: 18,
      r3: 23,
      r4: 26,
      l1: 22,
      l2: 32,
      l3: 29,
      l4: 19,
    };
  }

  const telemetry: DroneTelemetry = {
    operatingMode: mode,
    statusText,
    mantlePressureKpa: mantlePressure,
    thrustN: thrust,
    pulseHz,
    batteryPct: Math.max(78, 87 - Math.floor((frame / 1500) * 8)),
    drawW: mode === 'TEARDOWN' ? 23.2 : mode === 'SIPHON_OPEN' ? 16.4 : 9.4,
    cellV: 3.72,
    motorTempC: 22 + Math.floor((frame / 1500) * 8),
    depthM: depth,
    vsMs,
    pitchDeg,
    rollDeg,
    speedMs: speed,
    activeAssembly,
    display: {
      labels: showLabels,
      exploded,
      jetWake,
      turntable,
    },
    armCurls,
    operatorAction,
  };

  // Determine active photorealistic 3D simulator plate based on frame
  let activePlate = 'assets/robotics/pelagos_hero_render.png';
  let plateScale = 1.0;
  let plateY = Math.sin(frame * 0.05) * 6;

  if (frame >= 300 && frame < 960) {
    activePlate = 'assets/robotics/pelagos_mantle_isolate.png';
    plateScale = 1.0 + (frame - 300) * 0.0001;
    plateY = Math.sin(frame * 0.03) * 3;
  } else if (frame >= 960 && frame < 1320) {
    activePlate = 'assets/robotics/pelagos_exploded_view.png';
    plateScale = 1.02;
    plateY = Math.sin(frame * 0.04) * 4;
  } else if (frame >= 1320) {
    activePlate = 'assets/robotics/pelagos_hero_render.png';
    plateScale = 1.0 + (frame - 1320) * 0.0004;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      {/* Authentic Subsea Hydro-Audio Track */}
      <Audio src={staticFile('audio/pelagos_subsea_25s.mp3')} volume={0.92} />

      {/* Photorealistic 3D Robot Simulator Plate with hydrodynamic breathing */}
      <AbsoluteFill
        style={{
          transform: `scale(${plateScale}) translateY(${plateY}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile(activePlate)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
