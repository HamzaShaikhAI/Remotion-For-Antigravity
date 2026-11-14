import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

// =====================================================================
// COLOR SYSTEM (Kurzgesagt-inspired Palette)
// =====================================================================
const PALETTE = {
  deepSpace: '#09134B',
  nebulaPurple: '#180A59',
  electricBlue: '#243CDB',
  amethyst: '#6535A8',
  cyanGaze: '#22D7DA',
  bioTeal: '#33B9D7',
  solarOrange: '#FF851D',
  cosmicPink: '#ED4BA4',
  canaryYellow: '#FFD244',
  periwinkle: '#8CAAF7',
  starlightWhite: '#F8FAFC',
};

// =====================================================================
// NARRATION BEATS TIMELINE (Paced to 60.0s @ 60fps = 3600 Frames)
// =====================================================================
export const NEUTRON_BEATS = [
  {
    id: 'neutron_01',
    start: 0,
    dur: 553,
    audioSrc: staticFile('audio/neutron_paced/neutron_01.wav'),
    caption: 'Imagine floating in deep space holding an ordinary kitchen teaspoon. Harmless, right? Well, dip that spoon into a neutron star, and things get terrifying.',
    act: 'HOOK',
  },
  {
    id: 'neutron_02',
    start: 553,
    dur: 477,
    audioSrc: staticFile('audio/neutron_paced/neutron_02.wav'),
    caption: 'Because a single teaspoon of this material weighs roughly five billion kilograms. That is the entire mass of Mount Everest, packed into five milliliters.',
    act: 'SCALE',
  },
  {
    id: 'neutron_03',
    start: 1030,
    dur: 549,
    audioSrc: staticFile('audio/neutron_paced/neutron_03.wav'),
    caption: 'How can anything be this dense? It all starts when a massive star runs out of fuel. Without outward nuclear pressure, gravity violently crushes the entire core inward.',
    act: 'COLLAPSE',
  },
  {
    id: 'neutron_04',
    start: 1579,
    dur: 558,
    audioSrc: staticFile('audio/neutron_paced/neutron_04.wav'),
    caption: 'In everyday atoms, ninety-nine percent of the volume is completely empty space. But here, electrons are hammered directly into protons, fusing into solid neutrons.',
    act: 'ATOMIC',
  },
  {
    id: 'neutron_05',
    start: 2137,
    dur: 413,
    audioSrc: staticFile('audio/neutron_paced/neutron_05.wav'),
    caption: 'The result is a city-sized atomic nucleus spinning hundreds of times per second, with surface gravity two hundred billion times stronger than Earth.',
    act: 'PULSAR',
  },
  {
    id: 'neutron_06',
    start: 2550,
    dur: 434,
    audioSrc: staticFile('audio/neutron_paced/neutron_06.wav'),
    caption: 'If you dropped that teaspoon from just one meter high, it would strike the surface at millions of kilometers per hour, unleashing the fury of a nuclear bomb.',
    act: 'IMPACT',
  },
  {
    id: 'neutron_07',
    start: 2984,
    dur: 616, // extends through frame 3600
    audioSrc: staticFile('audio/neutron_paced/neutron_07.wav'),
    caption: "In this bizarre cosmic graveyard, the rules of ordinary matter completely shatter. The universe isn't just strange—it's denser than we can possibly imagine.",
    act: 'EPILOGUE',
  },
];

// =====================================================================
// ORIGINAL 2D GEOMETRIC CHARACTER: "THE SEEKER"
// Rigged with breathing, eye blinking, pupil tracking, arm gesturing
// =====================================================================
interface SeekerProps {
  frame: number;
  scale?: number;
  pose?: 'curious' | 'shocked' | 'examining' | 'shielding' | 'enlightened';
  x: number;
  y: number;
  flipX?: boolean;
}

export const SeekerCharacter: React.FC<SeekerProps> = ({
  frame,
  scale = 1,
  pose = 'curious',
  x,
  y,
  flipX = false,
}) => {
  // Breathing and idle sway
  const breathe = Math.sin(frame * 0.08) * 4;
  const headTilt = Math.sin(frame * 0.04) * 4;
  const isBlinking = frame % 190 > 182;

  // Eyeball tracking
  const pupilOffsetX = pose === 'shocked' ? 0 : Math.sin(frame * 0.05) * 5;
  const pupilOffsetY = pose === 'shocked' ? -2 : Math.cos(frame * 0.06) * 3;

  // Wing/arm gesture dynamics
  const wingAngleLeft = pose === 'shocked' ? -45 : pose === 'shielding' ? -70 : Math.sin(frame * 0.1) * 12 - 10;
  const wingAngleRight = pose === 'shocked' ? 45 : pose === 'examining' ? -35 : Math.sin(frame * 0.1 + 1) * 12 + 10;

  // Body scale squish on shock
  const bodySquishX = pose === 'shocked' ? 0.9 + Math.sin(frame * 0.4) * 0.05 : 1;
  const bodySquishY = pose === 'shocked' ? 1.15 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${flipX ? -scale : scale}, ${scale}) translateY(${breathe}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {/* Dynamic Halo on Enlightened */}
      {pose === 'enlightened' && (
        <div
          style={{
            position: 'absolute',
            top: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 210, 68, 0.4) 0%, transparent 70%)',
            filter: 'blur(10px)',
            transform: `scale(${1 + Math.sin(frame * 0.1) * 0.1})`,
          }}
        />
      )}

      {/* Main Body (Pear-shaped geometric vector) */}
      <div
        style={{
          width: 130,
          height: 160,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${bodySquishX}, ${bodySquishY}) rotate(${headTilt}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Back Torso Silhouette */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: 120,
            height: 150,
            borderRadius: '60px 60px 45px 45px',
            background: 'linear-gradient(180deg, #8CAAF7 0%, #3B82F6 100%)',
            boxShadow: 'inset 0 -15px 25px rgba(15, 23, 42, 0.4)',
          }}
        />

        {/* Belly Patch (Teal/Cyan Contrast) */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            width: 76,
            height: 90,
            borderRadius: '40px 40px 30px 30px',
            background: 'linear-gradient(180deg, #22D7DA 0%, #0284C7 100%)',
            boxShadow: 'inset 0 4px 10px rgba(255, 255, 255, 0.4)',
          }}
        />

        {/* Big Expressive Geometric Eyes */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            display: 'flex',
            gap: 16,
            zIndex: 10,
          }}
        >
          {/* Left Eye */}
          <div
            style={{
              width: 32,
              height: isBlinking ? 4 : 36,
              borderRadius: isBlinking ? 2 : '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {!isBlinking && (
              <div
                style={{
                  width: pose === 'shocked' ? 10 : 18,
                  height: pose === 'shocked' ? 10 : 18,
                  borderRadius: '50%',
                  backgroundColor: '#09134B',
                  transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                  position: 'relative',
                }}
              >
                {/* Pupil Light Catch Glint */}
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Eye */}
          <div
            style={{
              width: 32,
              height: isBlinking ? 4 : 36,
              borderRadius: isBlinking ? 2 : '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {!isBlinking && (
              <div
                style={{
                  width: pose === 'shocked' ? 10 : 18,
                  height: pose === 'shocked' ? 10 : 18,
                  borderRadius: '50%',
                  backgroundColor: '#09134B',
                  transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Cute Stylized Beak / Mouth */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            width: 18,
            height: pose === 'shocked' ? 16 : 10,
            borderRadius: pose === 'shocked' ? '50%' : '0 0 12px 12px',
            backgroundColor: pose === 'shocked' ? '#09134B' : '#FF851D',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />

        {/* Left Articulated Wing */}
        <div
          style={{
            position: 'absolute',
            left: -18,
            top: 70,
            width: 28,
            height: 60,
            borderRadius: '20px 0 20px 20px',
            background: 'linear-gradient(180deg, #8CAAF7 0%, #2563EB 100%)',
            transformOrigin: 'top right',
            transform: `rotate(${wingAngleLeft}deg)`,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        />

        {/* Right Articulated Wing (Holding Teaspoon if examining) */}
        <div
          style={{
            position: 'absolute',
            right: -18,
            top: 70,
            width: 28,
            height: 60,
            borderRadius: '0 20px 20px 20px',
            background: 'linear-gradient(180deg, #8CAAF7 0%, #2563EB 100%)',
            transformOrigin: 'top left',
            transform: `rotate(${wingAngleRight}deg)`,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          {/* Prop: Floating Kitchen Teaspoon */}
          {(pose === 'curious' || pose === 'examining') && (
            <div
              style={{
                position: 'absolute',
                bottom: -15,
                right: -25,
                transform: 'rotate(25deg)',
              }}
            >
              {/* Silver/Gold Teaspoon Handle */}
              <div
                style={{
                  width: 6,
                  height: 48,
                  background: 'linear-gradient(90deg, #F8FAFC 0%, #CBD5E1 50%, #94A3B8 100%)',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              />
              {/* Spoon Bowl */}
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: -8,
                  width: 22,
                  height: 18,
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at 35% 35%, #FFFFFF 0%, #CBD5E1 60%, #64748B 100%)',
                  boxShadow: '0 0 12px rgba(34, 215, 218, 0.6)',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cute Peg Legs */}
      <div style={{ display: 'flex', gap: 28, marginTop: -4 }}>
        <div
          style={{
            width: 10,
            height: 22,
            borderRadius: 5,
            backgroundColor: '#FF851D',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          }}
        />
        <div
          style={{
            width: 10,
            height: 22,
            borderRadius: 5,
            backgroundColor: '#FF851D',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Soft Ground / Floating Contact Shadow */}
      <div
        style={{
          width: 110,
          height: 18,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(9, 19, 75, 0.7) 0%, transparent 75%)',
          filter: 'blur(5px)',
          marginTop: 6,
        }}
      />
    </div>
  );
};

// =====================================================================
// HERO VECTOR PROP: GIANT TEASPOON & MOUNT EVEREST COMPARISON
// =====================================================================
const ScaleComparisonView: React.FC<{ frame: number }> = ({ frame }) => {
  // Giant brass balance scale tipping violently under the teaspoon
  const tipAngle = interpolate(frame, [560, 680], [0, 24], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scaleVibe = frame > 680 ? Math.sin(frame * 0.3) * 1.5 : 0;

  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: 'none' }}>
      {/* Central Pillar of Balance Scale */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 32,
          height: 480,
          background: 'linear-gradient(90deg, #78350F 0%, #F59E0B 50%, #451A03 100%)',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
        }}
      />
      {/* Triangular Base */}
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 220,
          height: 50,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          background: 'linear-gradient(180deg, #F59E0B 0%, #78350F 100%)',
        }}
      />

      {/* Rotating Scale Arm */}
      <div
        style={{
          position: 'absolute',
          bottom: 660,
          left: '50%',
          width: 860,
          height: 20,
          marginLeft: -430,
          background: 'linear-gradient(180deg, #FCD34D 0%, #D97706 100%)',
          borderRadius: 10,
          transform: `rotate(${tipAngle + scaleVibe}deg)`,
          transformOrigin: 'center center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Left Pan: Mount Everest (Huge Mountain Model) */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Suspension Wire */}
          <div style={{ width: 3, height: 120, backgroundColor: '#CBD5E1' }} />
          {/* Plate */}
          <div style={{ width: 260, height: 16, borderRadius: 8, backgroundColor: '#D97706' }} />
          {/* Mount Everest Stylized Geometric Mountain */}
          <div
            style={{
              position: 'relative',
              width: 240,
              height: 200,
              marginTop: -200,
              clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)',
              background: 'linear-gradient(180deg, #F8FAFC 0%, #64748B 40%, #1E293B 100%)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            }}
          >
            {/* Mountain Contour Ridge */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              }}
            />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#F8FAFC', marginTop: 12, textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
            MT. EVEREST
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#38BDF8' }}>5,000,000,000,000 KG</span>
        </div>

        {/* Right Pan: The 5ml Kitchen Teaspoon */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Suspension Wire */}
          <div style={{ width: 3, height: 120, backgroundColor: '#CBD5E1' }} />
          {/* Plate */}
          <div style={{ width: 260, height: 16, borderRadius: 8, backgroundColor: '#D97706' }} />
          {/* Glowing Ultra-Dense Spoon */}
          <div
            style={{
              position: 'relative',
              width: 90,
              height: 120,
              marginTop: -100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 38,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #22D7DA 0%, #243CDB 60%, #09134B 100%)',
                boxShadow: '0 0 35px #22D7DA, 0 0 70px #243CDB',
                border: '3px solid #FFFFFF',
              }}
            />
            <div style={{ width: 8, height: 60, background: '#CBD5E1', borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#FCD34D', marginTop: 12, textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
            1 TEASPOON (5 mL)
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#FF851D' }}>EQUALS ENTIRE MOUNTAIN</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// SCENE 3 & 5: PULSAR & RELATIVISTIC LENSING ENGINE
// =====================================================================
const PulsarEngine: React.FC<{ frame: number; active: boolean }> = ({ frame, active }) => {
  if (!active) return null;

  const spinAngle = (frame * 18) % 360;
  const pulseScale = 1 + Math.sin(frame * 0.3) * 0.05;

  return (
    <AbsoluteFill style={{ zIndex: 5, pointerEvents: 'none' }}>
      {/* Relativistic Gravitational Lensing Distortion Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: '4px dashed rgba(34, 215, 218, 0.4)',
          boxShadow: 'inset 0 0 80px rgba(36, 60, 219, 0.5), 0 0 100px rgba(34, 215, 218, 0.3)',
          filter: 'blur(1px)',
        }}
      />

      {/* Relativistic Magnetic Jet Beams */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1400,
          height: 50,
          marginLeft: -700,
          marginTop: -25,
          transform: `rotate(${spinAngle}deg)`,
          transformOrigin: 'center center',
          background: 'linear-gradient(90deg, transparent 0%, #22D7DA 35%, #FFFFFF 50%, #22D7DA 65%, transparent 100%)',
          filter: 'blur(8px)',
          opacity: 0.85,
        }}
      />

      {/* The City-Sized Core (Neutron Star Sphere) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #22D7DA 40%, #243CDB 75%, #09134B 100%)',
          boxShadow: '0 0 60px #22D7DA, 0 0 120px #243CDB',
          border: '4px solid #FFFFFF',
        }}
      >
        {/* Surface Grid Latitude Lines Showing High-Velocity Rotation */}
        <div
          style={{
            position: 'absolute',
            inset: 15,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            transform: `rotate(${frame * 4}deg)`,
          }}
        />
      </div>

      {/* Real-time Telemetry Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          right: 80,
          backgroundColor: 'rgba(9, 19, 75, 0.85)',
          border: '2px solid #22D7DA',
          borderRadius: 16,
          padding: '16px 28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', letterSpacing: '0.15em' }}>
          ASTROPHYSICAL TELEMETRY
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
          ROTATION: 716 Hz
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#FFD244', marginTop: 4 }}>
          GRAVITY: 200,000,000,000× Earth
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// SCENE 4: QUANTUM ATOM COLLAPSE (Electrons fused into Neutrons)
// =====================================================================
const QuantumAtomCollapse: React.FC<{ frame: number; active: boolean }> = ({ frame, active }) => {
  if (!active) return null;

  // Collapse progress over frames 1579 -> 2137
  const progress = interpolate(frame, [1600, 1950], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const orbitRadius = interpolate(progress, [0, 1], [320, 25]);
  const electronOpacity = interpolate(progress, [0.8, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Electron Orbit Shells */}
        <div
          style={{
            position: 'absolute',
            width: orbitRadius * 2,
            height: orbitRadius * 2,
            borderRadius: '50%',
            border: '3px dashed #22D7DA',
            opacity: electronOpacity,
            transform: `rotate(${frame * 3}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: orbitRadius * 1.6,
            height: orbitRadius * 1.6,
            borderRadius: '50%',
            border: '2px dashed #8CAAF7',
            opacity: electronOpacity,
            transform: `rotate(${-frame * 4}deg)`,
          }}
        />

        {/* Orbiting Electron Particles */}
        {electronOpacity > 0 && (
          <>
            <div
              style={{
                position: 'absolute',
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#22D7DA',
                boxShadow: '0 0 20px #22D7DA',
                transform: `rotate(${frame * 5}deg) translateX(${orbitRadius}px)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#FFD244',
                boxShadow: '0 0 20px #FFD244',
                transform: `rotate(${frame * 5 + 180}deg) translateX(${orbitRadius}px)`,
              }}
            />
          </>
        )}

        {/* Atomic Nucleus: Protons & Neutrons Clustered */}
        <div
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: progress > 0.85
              ? 'radial-gradient(circle, #22D7DA 0%, #243CDB 80%)'
              : 'radial-gradient(circle, #ED4BA4 0%, #FF851D 80%)',
            boxShadow: progress > 0.85 ? '0 0 50px #22D7DA' : '0 0 40px #ED4BA4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>
            {progress > 0.85 ? 'SOLID NEUTRONS' : '99.999% EMPTY SPACE'}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// SCENE 6: 1-METER DROP & NUCLEAR EXPLOSION
// =====================================================================
const NuclearImpactView: React.FC<{ frame: number; active: boolean }> = ({ frame, active }) => {
  if (!active) return null;

  // Drop animation triggers around frame 2620
  const dropY = interpolate(frame, [2600, 2680], [200, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exploded = frame >= 2680;
  const blastScale = spring({
    frame: frame - 2680,
    fps: 60,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: 'none' }}>
      {!exploded ? (
        /* Dropping Teaspoon with Motion Blur Streak */
        <div
          style={{
            position: 'absolute',
            top: dropY,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Gravitational Acceleration Motion Smear */}
          <div
            style={{
              width: 8,
              height: 140,
              background: 'linear-gradient(180deg, transparent 0%, #22D7DA 100%)',
              filter: 'blur(4px)',
            }}
          />
          {/* Glowing Ultra-Dense Sphere */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 0 35px #22D7DA, 0 0 70px #243CDB',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 900, color: '#FF851D', marginTop: 10 }}>
            SPEED: 7,000,000 KM/H
          </span>
        </div>
      ) : (
        /* Expanding Stylized Geometric Mushroom Cloud */
        <div
          style={{
            position: 'absolute',
            bottom: 240,
            left: '50%',
            transform: `translateX(-50%) scale(${blastScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Top Fireball Cap */}
          <div
            style={{
              width: 520,
              height: 320,
              borderRadius: '260px 260px 80px 80px',
              background: 'radial-gradient(ellipse at 50% 60%, #FFD244 0%, #FF851D 45%, #ED4BA4 80%, #6535A8 100%)',
              boxShadow: '0 0 100px #FF851D, 0 0 200px #ED4BA4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
              NUCLEAR DETONATION
            </span>
          </div>

          {/* Fireball Stem */}
          <div
            style={{
              width: 140,
              height: 240,
              background: 'linear-gradient(180deg, #FF851D 0%, #ED4BA4 60%, #243CDB 100%)',
              boxShadow: '0 0 60px #FF851D',
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// =====================================================================
// MAIN 16:9 60 FPS EXPLAINER COMPOSITION (1920x1080)
// =====================================================================
export const NeutronStarExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active narrative beat
  const activeBeat = useMemo(() => {
    for (let i = NEUTRON_BEATS.length - 1; i >= 0; i--) {
      if (frame >= NEUTRON_BEATS[i].start) return NEUTRON_BEATS[i];
    }
    return NEUTRON_BEATS[0];
  }, [frame]);

  // Virtual 2D Camera Easing & Push-in
  const cameraZoom = 1 + (frame / 3600) * 0.12;
  const cameraPanX = Math.sin(frame * 0.015) * 15;
  const cameraPanY = Math.cos(frame * 0.012) * 10;

  // Screen shake on supernova collapse (Frames 1200-1350) and nuclear impact (Frames 2680-2800)
  const shakeX =
    (frame >= 1200 && frame <= 1350) || (frame >= 2680 && frame <= 2800)
      ? Math.sin(frame * 1.8) * 10
      : 0;
  const shakeY =
    (frame >= 1200 && frame <= 1350) || (frame >= 2680 && frame <= 2800)
      ? Math.cos(frame * 2.1) * 8
      : 0;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: PALETTE.deepSpace,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Montserrat, Inter, system-ui, -apple-system, sans-serif',
        color: '#FFFFFF',
        transform: `scale(${cameraZoom}) translate(${cameraPanX + shakeX}px, ${cameraPanY + shakeY}px)`,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* AUDIO ENGINE: SYNCHRONIZED NARRATION & SOUND DESIGN           */}
      {/* ------------------------------------------------------------- */}
      {/* Curious & Adventurous Cinematic Ambient Score */}
      <Audio src={staticFile('audio/one_conversation_score.wav')} volume={0.32} />

      {/* 7 Frame-Accurate Paced Narration Stems */}
      {NEUTRON_BEATS.map((beat) => (
        <Sequence key={beat.id} from={beat.start} durationInFrames={beat.dur}>
          <Audio src={beat.audioSrc} volume={1.0} />
        </Sequence>
      ))}

      {/* Diegetic Sound FX Triggers */}
      {/* Supernova Shockwave (Frame 1220) */}
      <Sequence from={1220} durationInFrames={120}>
        <Audio src={staticFile('sfx/thunder_strike.wav')} volume={0.9} />
      </Sequence>
      {/* Scale Metal Clink (Frame 680) */}
      <Sequence from={680} durationInFrames={60}>
        <Audio src={staticFile('sfx/clash.wav')} volume={0.8} />
      </Sequence>
      {/* Atomic Transformation Pop (Frame 1920) */}
      <Sequence from={1920} durationInFrames={40}>
        <Audio src={staticFile('sfx/pop_sfx.wav')} volume={0.7} />
      </Sequence>
      {/* Nuclear Detonation Blast (Frame 2680) */}
      <Sequence from={2680} durationInFrames={120}>
        <Audio src={staticFile('sfx/fpv_impact.wav')} volume={1.0} />
      </Sequence>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 1: MULTIPLANE DEEP COSMIC BACKGROUND                    */}
      {/* ------------------------------------------------------------- */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        {/* Deep Space Gradient Wash */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #180A59 0%, #09134B 65%, #03071E 100%)',
          }}
        />

        {/* Twinkling Geometric Starfield (Deterministic Pseudo-Random) */}
        {Array.from({ length: 48 }).map((_, i) => {
          const starX = (i * 137.5) % 1920;
          const starY = (i * 219.3) % 1080;
          const starSize = 3 + (i % 5);
          const starBlink = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.05 + i));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: starX,
                top: starY,
                width: starSize,
                height: starSize,
                borderRadius: '50%',
                backgroundColor: i % 4 === 0 ? PALETTE.cyanGaze : PALETTE.starlightWhite,
                opacity: starBlink,
                boxShadow: `0 0 ${starSize * 2}px ${PALETTE.cyanGaze}`,
              }}
            />
          );
        })}

        {/* Soft Volumetric Nebula Clouds */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: 900,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(101, 53, 168, 0.35) 0%, transparent 70%)',
            filter: 'blur(70px)',
            transform: `translate(${Math.sin(frame * 0.02) * 20}px, ${Math.cos(frame * 0.02) * 15}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(36, 60, 219, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </AbsoluteFill>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 2: DYNAMIC STORY ENVIRONMENTS & PHENOMENA               */}
      {/* ------------------------------------------------------------- */}
      {/* Act 2: Mount Everest Scale Comparison */}
      {activeBeat.act === 'SCALE' && <ScaleComparisonView frame={frame} />}

      {/* Act 3 & Act 5: Pulsar Core & Relativistic Lensing */}
      <PulsarEngine frame={frame} active={activeBeat.act === 'COLLAPSE' || activeBeat.act === 'PULSAR' || activeBeat.act === 'EPILOGUE'} />

      {/* Act 4: Quantum Atomic Collapse */}
      <QuantumAtomCollapse frame={frame} active={activeBeat.act === 'ATOMIC'} />

      {/* Act 6: 1-Meter Drop Nuclear Impact */}
      <NuclearImpactView frame={frame} active={activeBeat.act === 'IMPACT'} />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 3: ORIGINAL HERO CHARACTER "THE SEEKER"                 */}
      {/* ------------------------------------------------------------- */}
      <SeekerCharacter
        frame={frame}
        scale={activeBeat.act === 'HOOK' ? 1.6 : activeBeat.act === 'EPILOGUE' ? 1.4 : 1.15}
        pose={
          activeBeat.act === 'HOOK'
            ? 'curious'
            : activeBeat.act === 'SCALE' || activeBeat.act === 'IMPACT'
            ? 'shocked'
            : activeBeat.act === 'ATOMIC'
            ? 'examining'
            : activeBeat.act === 'PULSAR'
            ? 'shielding'
            : 'enlightened'
        }
        x={activeBeat.act === 'HOOK' ? 960 : activeBeat.act === 'SCALE' ? 320 : 420}
        y={activeBeat.act === 'HOOK' ? 820 : activeBeat.act === 'SCALE' ? 900 : 860}
      />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 4: KINETIC NARRATIVE CAPTIONS & TOP CHANNEL BADGE       */}
      {/* ------------------------------------------------------------- */}
      {/* Top Channel Pill Header */}
      <div
        style={{
          position: 'absolute',
          top: 45,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(9, 19, 75, 0.88)',
          border: '2px solid rgba(34, 215, 218, 0.4)',
          borderRadius: 30,
          padding: '10px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 90,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: PALETTE.cyanGaze, boxShadow: `0 0 12px ${PALETTE.cyanGaze}` }} />
        <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.12em', color: PALETTE.starlightWhite, textTransform: 'uppercase' }}>
          ASTROPHYSICS DEEP DIVE · NEUTRON STARS
        </span>
      </div>

      {/* Bottom Educational Subtitle Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 120,
          right: 120,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 90,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(9, 19, 75, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 24,
            padding: '18px 36px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
            maxWidth: 1400,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 27,
              fontWeight: 800,
              color: PALETTE.starlightWhite,
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {activeBeat.caption}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
