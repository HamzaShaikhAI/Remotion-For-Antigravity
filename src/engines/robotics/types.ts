/**
 * Types & Contracts for Industrial Robotics & Subsea HUD Simulator Engine (Engine XXVII)
 * Replicating the Pelagos OC-8 Robotic Cephalopod Field Simulator.
 */

export type DroneOperatingMode =
  | 'JETTING'
  | 'HOLDING'
  | 'SIPHON_OPEN'
  | 'TEARDOWN'
  | 'DEPARTING';

export type DroneAssemblyTab =
  | 'HERO'
  | 'OPTICS'
  | 'MANTLE'
  | 'ARM R2'
  | 'SIPHON'
  | 'BEAK';

export interface DroneTelemetry {
  operatingMode: DroneOperatingMode;
  statusText: string;
  mantlePressureKpa: number;
  thrustN: number;
  pulseHz: number;
  batteryPct: number;
  drawW: number;
  cellV: number;
  motorTempC: number;
  depthM: number;
  vsMs: number;
  pitchDeg: number;
  rollDeg: number;
  speedMs: number;
  activeAssembly: DroneAssemblyTab;
  display: {
    labels: boolean;
    exploded: boolean;
    jetWake: boolean;
    turntable: boolean;
  };
  armCurls: {
    r1: number | 'DETACHED';
    r2: number | 'DETACHED';
    r3: number | 'DETACHED';
    r4: number | 'DETACHED';
    l1: number | 'DETACHED';
    l2: number | 'DETACHED';
    l3: number | 'DETACHED';
    l4: number | 'DETACHED';
  };
  operatorAction: string;
}
