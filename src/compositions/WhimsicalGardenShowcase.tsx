import React, { useMemo } from 'react';
import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =====================================================================
// 15 GITHUB REPO SIGNS DATA FOR THE VEGETABLE GARDEN
// =====================================================================
export interface GardenSignItem {
  id: string;
  name: string;
  path: string;
  crop: 'carrot' | 'tomato' | 'pumpkin' | 'radish' | 'sunflower' | 'cabbage' | 'sprout' | 'corn' | 'eggplant' | 'beet' | 'pepper' | 'blueberry' | 'clover' | 'daisy' | 'wheat';
  cropEmoji: string;
  color: string;
  popFrame: number;
  row: number; // for final wide grid layout
  col: number;
}

export const GARDEN_SIGNS: GardenSignItem[] = [
  // NIGHT SIGNS (0s - 12s / Frames 0 - 720)
  { id: 'rea', name: 'Rea-Video', path: 'github.com/rea-video', crop: 'carrot', cropEmoji: '🥕', color: '#ff781f', popFrame: 45, row: 0, col: 0 },
  { id: 'lemo', name: 'Lemo-Opuscar', path: 'github.com/lemo-opuscar', crop: 'tomato', cropEmoji: '🍅', color: '#ef4444', popFrame: 110, row: 0, col: 1 },
  { id: 'effect', name: 'EffectCraft', path: 'github.com/effectcraft', crop: 'pumpkin', cropEmoji: '🎃', color: '#f59e0b', popFrame: 175, row: 0, col: 2 },
  { id: 'pixelfx', name: 'PixelFX', path: 'github.com/pixelfx', crop: 'radish', cropEmoji: '🌱', color: '#ec4899', popFrame: 240, row: 0, col: 3 },
  { id: 'awesome', name: 'Awesome Opus 5.5 Videos', path: 'github.com/opus-video/awesome', crop: 'sunflower', cropEmoji: '🌻', color: '#eab308', popFrame: 310, row: 0, col: 4 },
  { id: 'hyper', name: 'HyperFrames', path: 'github.com/hyperframes', crop: 'cabbage', cropEmoji: '🥬', color: '#10b981', popFrame: 390, row: 1, col: 0 },
  { id: 'remotion', name: 'Remotion', path: 'github.com/remotion-dev/remotion', crop: 'sprout', cropEmoji: '🌿', color: '#06b6d4', popFrame: 460, row: 1, col: 1 },
  { id: 'remskills', name: 'Remotion Skills', path: 'github.com/remotion-skills', crop: 'corn', cropEmoji: '🌽', color: '#84cc16', popFrame: 530, row: 1, col: 2 },

  // DAWN & SUNRISE SIGNS (12s - 18s / Frames 720 - 1080)
  { id: 'blender', name: 'Blender MCP', path: 'github.com/blender-mcp', crop: 'eggplant', cropEmoji: '🍆', color: '#8b5cf6', popFrame: 620, row: 1, col: 3 },
  { id: 'three', name: 'Three.js', path: 'github.com/mrdoob/three.js', crop: 'beet', cropEmoji: '🫐', color: '#6366f1', popFrame: 690, row: 1, col: 4 },
  { id: 'gsap', name: 'GSAP', path: 'github.com/greensock/gsap', crop: 'pepper', cropEmoji: '🫑', color: '#22c55e', popFrame: 760, row: 2, col: 0 },
  { id: 'comfy', name: 'ComfyUI', path: 'github.com/comfyanonymous/ComfyUI', crop: 'blueberry', cropEmoji: '🍇', color: '#3b82f6', popFrame: 830, row: 2, col: 1 },
  { id: 'unslop', name: 'Unslop', path: 'github.com/unslop-ai', crop: 'clover', cropEmoji: '🍀', color: '#14b8a6', popFrame: 900, row: 2, col: 2 },
  { id: 'impeccable', name: 'Impeccable', path: 'github.com/impeccable-ui', crop: 'daisy', cropEmoji: '🌸', color: '#f43f5e', popFrame: 960, row: 2, col: 3 },
  { id: 'anthropic', name: 'Anthropic Skills', path: 'github.com/anthropics/skills', crop: 'wheat', cropEmoji: '🌾', color: '#d97706', popFrame: 1020, row: 2, col: 4 },
];

// =====================================================================
// CUTE ORANGE CARTOON CHARACTER WITH STRAW HAT
// =====================================================================
interface CuteCharacterProps {
  frame: number;
  scale?: number;
  facing?: 'right' | 'front';
  isFloating?: boolean;
  isCelebrating?: boolean;
}

export const CuteOrangeCharacter: React.FC<CuteCharacterProps> = ({
  frame,
  scale = 1,
  facing = 'right',
  isFloating = false,
  isCelebrating = false,
}) => {
  // Deterministic bounce & running cycle
  const runFreq = isFloating ? 0.08 : 0.22;
  const bobY = Math.sin(frame * runFreq) * (isFloating ? 18 : 10);
  const tiltDeg = Math.sin(frame * runFreq * 0.5) * (facing === 'front' ? 4 : 8);
  const squash = 1 + Math.sin(frame * runFreq) * 0.04;

  // Leg kicking running motion
  const leftLegAngle = Math.sin(frame * 0.24) * 32;
  const rightLegAngle = -Math.sin(frame * 0.24) * 32;

  // Blinking cycle: blink every ~130 frames
  const blink = (frame % 130 > 122) ? 0.1 : 1;

  // Hand waving for celebration
  const leftHandAngle = isCelebrating ? -50 + Math.sin(frame * 0.3) * 30 : -15;
  const rightHandAngle = isCelebrating ? 50 - Math.sin(frame * 0.3) * 30 : 15;

  return (
    <div
      style={{
        position: 'relative',
        width: 170 * scale,
        height: 200 * scale,
        transform: `translateY(${bobY}px) rotate(${tiltDeg}deg) scaleX(${facing === 'right' ? 1 : 1})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 20px 25px rgba(234, 88, 12, 0.35))',
        zIndex: 40,
      }}
    >
      {/* ----------------- STRAW HAT ----------------- */}
      <div
        style={{
          position: 'relative',
          width: 150 * scale,
          height: 60 * scale,
          zIndex: 10,
          transform: `rotate(${Math.sin(frame * 0.15) * 4}deg) translateY(${Math.sin(frame * 0.2) * 3}px)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Crown of Straw Hat */}
        <div
          style={{
            position: 'absolute',
            bottom: 12 * scale,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 75 * scale,
            height: 44 * scale,
            borderRadius: `${26 * scale}px ${26 * scale}px 6px 6px`,
            background: 'linear-gradient(180deg, #fef08a 0%, #fde047 30%, #ca8a04 100%)',
            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.6), inset 0 -4px 6px rgba(113,63,18,0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Straw Woven Texture Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(161, 98, 7, 0.2) 5px, rgba(161, 98, 7, 0.2) 7px)',
            }}
          />
          {/* Red Ribbon Band */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 10 * scale,
              backgroundColor: '#ef4444',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Wide Curved Brim of Straw Hat */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 22 * scale,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 30%, #fef08a 0%, #eab308 60%, #a16207 100%)',
            boxShadow: '0 8px 12px rgba(113, 63, 18, 0.35), inset 0 2px 4px rgba(255,255,255,0.7)',
            borderBottom: `${2 * scale}px solid #854d0e`,
          }}
        />
      </div>

      {/* ----------------- ORANGE HEAD / BODY ----------------- */}
      <div
        style={{
          position: 'relative',
          width: 125 * scale,
          height: 115 * scale,
          marginTop: -16 * scale,
          borderRadius: '50% 50% 48% 48%',
          background: 'radial-gradient(circle at 35% 28%, #ffedd5 0%, #fb923c 35%, #ea580c 80%, #9a3412 100%)',
          boxShadow: 'inset 0 -10px 18px rgba(154, 52, 18, 0.45), inset 0 8px 16px rgba(255, 255, 255, 0.75)',
          transform: `scaleX(${1 / squash}) scaleY(${squash})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {/* Rosy Peach/Coral Cheeks */}
        <div
          style={{
            position: 'absolute',
            bottom: 32 * scale,
            left: 18 * scale,
            width: 22 * scale,
            height: 12 * scale,
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 63, 94, 0.55)',
            filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 32 * scale,
            right: 18 * scale,
            width: 22 * scale,
            height: 12 * scale,
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 63, 94, 0.55)',
            filter: 'blur(2px)',
          }}
        />

        {/* Shiny Anime Dot Eyes */}
        <div
          style={{
            position: 'absolute',
            top: 42 * scale,
            left: 36 * scale,
            width: 14 * scale,
            height: 18 * scale * blink,
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 2 * scale,
          }}
        >
          {/* Specular White Catchlight */}
          <div
            style={{
              width: 5 * scale,
              height: 5 * scale,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 42 * scale,
            right: 36 * scale,
            width: 14 * scale,
            height: 18 * scale * blink,
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 2 * scale,
          }}
        >
          <div
            style={{
              width: 5 * scale,
              height: 5 * scale,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Joyful Open Smile */}
        <div
          style={{
            position: 'absolute',
            bottom: 25 * scale,
            width: 24 * scale,
            height: 14 * scale,
            borderBottom: `${4 * scale}px solid #1e293b`,
            borderRadius: '0 0 16px 16px',
            backgroundColor: '#be123c',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {/* Cute Little Pink Tongue */}
          <div
            style={{
              width: 14 * scale,
              height: 7 * scale,
              borderRadius: '50% 50% 0 0',
              backgroundColor: '#fda4af',
            }}
          />
        </div>

        {/* Cute Stubby Arms */}
        <div
          style={{
            position: 'absolute',
            left: -12 * scale,
            top: 50 * scale,
            width: 22 * scale,
            height: 22 * scale,
            borderRadius: '50%',
            backgroundColor: '#ea580c',
            boxShadow: 'inset -2px -2px 4px rgba(154,52,18,0.5)',
            transform: `rotate(${leftHandAngle}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -12 * scale,
            top: 50 * scale,
            width: 22 * scale,
            height: 22 * scale,
            borderRadius: '50%',
            backgroundColor: '#ea580c',
            boxShadow: 'inset 2px -2px 4px rgba(154,52,18,0.5)',
            transform: `rotate(${rightHandAngle}deg)`,
          }}
        />
      </div>

      {/* ----------------- RUNNING LEGS ----------------- */}
      {!isFloating && (
        <div
          style={{
            display: 'flex',
            gap: 20 * scale,
            marginTop: -8 * scale,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 18 * scale,
              height: 24 * scale,
              borderRadius: '12px',
              backgroundColor: '#c2410c',
              transform: `rotate(${leftLegAngle}deg)`,
              transformOrigin: 'top center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            }}
          />
          <div
            style={{
              width: 18 * scale,
              height: 24 * scale,
              borderRadius: '12px',
              backgroundColor: '#c2410c',
              transform: `rotate(${rightLegAngle}deg)`,
              transformOrigin: 'top center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      )}

      {/* Floating Sparkle Trail */}
      {isFloating && (
        <div
          style={{
            position: 'absolute',
            bottom: -15 * scale,
            width: 80 * scale,
            height: 12 * scale,
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 146, 60, 0.3)',
            filter: 'blur(6px)',
          }}
        />
      )}
    </div>
  );
};

// =====================================================================
// WOODEN PLANT MARKER / GARDEN SIGN COMPONENT
// =====================================================================
interface WoodenSignProps {
  sign: GardenSignItem;
  frame: number;
  fps: number;
  isWideGrid?: boolean;
}

export const WoodenSign: React.FC<WoodenSignProps> = ({
  sign,
  frame,
  fps,
  isWideGrid = false,
}) => {
  // Spring pop-up trigger
  const springOffset = frame - sign.popFrame;
  const popSpring = spring({
    frame: Math.max(0, springOffset),
    fps,
    config: { damping: 11, stiffness: 140 },
  });

  const progress = isWideGrid ? 1 : Math.max(0, Math.min(1, popSpring));
  if (progress <= 0.01 && !isWideGrid) return null;

  // Sign gentle wood wobble upon landing
  const wobble = Math.sin(Math.max(0, springOffset) * 0.3) * (1 - progress) * 8;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${progress}) translateY(${(1 - progress) * 80}px) rotate(${wobble}deg)`,
        opacity: Math.min(1, progress * 1.5),
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 14px 18px rgba(39, 24, 8, 0.4))',
      }}
    >
      {/* Wooden Sign Plaque */}
      <div
        style={{
          width: isWideGrid ? 175 : 320,
          padding: isWideGrid ? '8px 10px' : '14px 18px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #a16207 0%, #854d0e 30%, #713f12 70%, #54300a 100%)',
          border: '3px solid #b45309',
          boxShadow: 'inset 0 2px 4px rgba(254, 240, 138, 0.4), inset 0 -3px 6px rgba(0,0,0,0.5)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: isWideGrid ? 3 : 5,
        }}
      >
        {/* Woodgrain Texture Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 12px)',
            pointerEvents: 'none',
          }}
        />

        {/* Corner Iron Nail Studs */}
        <div style={{ position: 'absolute', top: 5, left: 6, width: 4, height: 4, borderRadius: '50%', backgroundColor: '#291b0c', boxShadow: '0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', top: 5, right: 6, width: 4, height: 4, borderRadius: '50%', backgroundColor: '#291b0c', boxShadow: '0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 5, left: 6, width: 4, height: 4, borderRadius: '50%', backgroundColor: '#291b0c', boxShadow: '0 1px 1px rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 5, right: 6, width: 4, height: 4, borderRadius: '50%', backgroundColor: '#291b0c', boxShadow: '0 1px 1px rgba(255,255,255,0.3)' }} />

        {/* Vegetable / Crop Sprout Perched on Sign */}
        <div
          style={{
            position: 'absolute',
            top: isWideGrid ? -14 : -20,
            right: 14,
            fontSize: isWideGrid ? 16 : 24,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            transform: `rotate(${Math.sin((frame + sign.popFrame) * 0.1) * 8}deg)`,
          }}
        >
          {sign.cropEmoji}
        </div>

        {/* GitHub Header Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: isWideGrid ? 8 : 12,
              height: isWideGrid ? 8 : 12,
              borderRadius: '50%',
              backgroundColor: sign.color,
              boxShadow: `0 0 8px ${sign.color}`,
            }}
          />
          <span
            style={{
              fontSize: isWideGrid ? 9 : 12,
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#fef08a',
              letterSpacing: '0.04em',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            REPO
          </span>
        </div>

        {/* Repo Name */}
        <div
          style={{
            fontSize: isWideGrid ? 12 : 20,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 4px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sign.name}
        </div>

        {/* GitHub Path */}
        <div
          style={{
            fontSize: isWideGrid ? 8 : 11,
            color: '#fed7aa',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)',
          }}
        >
          {sign.path}
        </div>
      </div>

      {/* Rustic Wooden Post / Stake stuck into the soil */}
      <div
        style={{
          width: isWideGrid ? 14 : 22,
          height: isWideGrid ? 28 : 50,
          background: 'linear-gradient(90deg, #54300a 0%, #713f12 50%, #452406 100%)',
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.6)',
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        }}
      />

      {/* Soil Mound with Green Sprout Leaves */}
      <div
        style={{
          position: 'relative',
          width: isWideGrid ? 36 : 60,
          height: isWideGrid ? 10 : 16,
          borderRadius: '50%',
          backgroundColor: '#38200d',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          marginTop: -4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: isWideGrid ? 8 : 12,
            marginTop: -6,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
          }}
        >
          🌱
        </span>
      </div>
    </div>
  );
};

// =====================================================================
// PROCEDURAL BACKGROUND ELEMENTS: BUTTERFLIES, BIRDS, FIREFLIES
// =====================================================================
const ProceduralFireflies: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const count = 24;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const seedX = ((i * 187.3) % 1000) + 40;
        const seedY = ((i * 243.7) % 1700) + 120;
        const driftX = Math.sin((frame + i * 25) * 0.03) * 35;
        const driftY = Math.cos((frame + i * 19) * 0.025) * 45;
        const pulse = Math.sin((frame + i * 37) * 0.09) * 0.5 + 0.5;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: seedX + driftX,
              top: seedY + driftY,
              width: 8 + (i % 4) * 2,
              height: 8 + (i % 4) * 2,
              borderRadius: '50%',
              backgroundColor: '#fef08a',
              boxShadow: `0 0 ${12 * pulse + 6}px #facc15, 0 0 ${20 * pulse + 10}px #ca8a04`,
              opacity: pulse * 0.9,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}
    </div>
  );
};

const ProceduralFlockingBirds: React.FC<{ frame: number; activeProgress: number }> = ({
  frame,
  activeProgress,
}) => {
  if (activeProgress <= 0.01) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: activeProgress }}>
      {[0, 1, 2, 3, 4].map((birdIdx) => {
        const flightTime = frame * 2.8 + birdIdx * 70;
        const birdX = 1180 - ((flightTime % 1800) * 0.9);
        const birdY = 220 + Math.sin(flightTime * 0.02 + birdIdx) * 60 + birdIdx * 35;
        const flap = Math.sin(frame * 0.35 + birdIdx) * 12;

        return (
          <div
            key={birdIdx}
            style={{
              position: 'absolute',
              left: birdX,
              top: birdY,
              transform: 'scale(0.85)',
            }}
          >
            {/* Minimalist 3D Bird Wings Silhouette */}
            <svg width="36" height="24" viewBox="0 0 36 24">
              <path
                d={`M 2 12 Q 10 ${12 - flap} 18 12 Q 26 ${12 - flap} 34 12`}
                fill="none"
                stroke="#475569"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

const ProceduralButterflies: React.FC<{ frame: number; activeProgress: number }> = ({
  frame,
  activeProgress,
}) => {
  if (activeProgress <= 0.01) return null;

  const butterflies = [
    { id: 1, baseColor: '#f43f5e', x: 220, y: 1100, speed: 0.04 },
    { id: 2, baseColor: '#38bdf8', x: 780, y: 980, speed: 0.035 },
    { id: 3, baseColor: '#facc15', x: 500, y: 1350, speed: 0.05 },
    { id: 4, baseColor: '#c084fc', x: 880, y: 1250, speed: 0.03 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: activeProgress }}>
      {butterflies.map((b) => {
        const flutter = Math.sin(frame * 0.4 + b.id * 10);
        const wingScale = Math.abs(flutter);
        const driftX = Math.sin(frame * b.speed + b.id) * 45;
        const driftY = Math.cos(frame * (b.speed * 1.2) + b.id) * 35;

        return (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: b.x + driftX,
              top: b.y + driftY,
              display: 'flex',
              alignItems: 'center',
              filter: `drop-shadow(0 4px 8px ${b.baseColor}66)`,
            }}
          >
            {/* Left Wing */}
            <div
              style={{
                width: 16,
                height: 22,
                borderRadius: '50% 10% 50% 30%',
                backgroundColor: b.baseColor,
                transform: `scaleX(${wingScale})`,
                transformOrigin: 'right center',
              }}
            />
            {/* Body */}
            <div style={{ width: 4, height: 16, borderRadius: 2, backgroundColor: '#1e293b' }} />
            {/* Right Wing */}
            <div
              style={{
                width: 16,
                height: 22,
                borderRadius: '10% 50% 30% 50%',
                backgroundColor: b.baseColor,
                transform: `scaleX(${wingScale})`,
                transformOrigin: 'left center',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================
// MAIN COMPOSITION: WHIMSICAL GARDEN SHOWCASE
// =====================================================================
export const WhimsicalGardenShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total Duration: 24.0s = 1440 frames @ 60fps
  // Phase 1: 0–6s   (0–360)    → Night Garden & First Row of Signs
  // Phase 2: 6–12s  (360–720)  → Deep Night to Early Dawn & Second Row
  // Phase 3: 12–18s (720–1080) → Twilight Dawn to Golden Sunrise & Third Row
  // Phase 4: 18–24s (1080–1440)→ Majestic Wide View of All 15 Signs Under Golden Rising Sun

  // Smooth Sky Interpolation: Night -> Dawn -> Sunrise
  // 0-600: Deep Night
  // 600-900: Night to Dawn Transition
  // 900-1140: Dawn to Golden Sunrise
  // 1140-1440: Full Warm Golden Daylight
  const nightFactor = interpolate(frame, [600, 850], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dawnFactor = interpolate(frame, [650, 850, 1050], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sunriseFactor = interpolate(frame, [880, 1140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic sky color bands across the 24-second timeline
  const skyColor0 = useMemo(() => {
    return interpolateColors(
      frame,
      [0, 600, 850, 1140],
      ['#060c1d', '#060c1d', '#3b0764', '#38bdf8']
    );
  }, [frame]);

  const skyColor50 = useMemo(() => {
    return interpolateColors(
      frame,
      [0, 600, 850, 1140],
      ['#0f172a', '#0f172a', '#701a75', '#fed7aa']
    );
  }, [frame]);

  const skyColor80 = useMemo(() => {
    return interpolateColors(
      frame,
      [0, 600, 850, 1140],
      ['#1e1b4b', '#1e1b4b', '#f43f5e', '#fef08a']
    );
  }, [frame]);

  const skyColor100 = useMemo(() => {
    return interpolateColors(
      frame,
      [0, 600, 850, 1140],
      ['#042f2e', '#042f2e', '#ca8a04', '#86efac']
    );
  }, [frame]);

  // Camera Mode: Active Run/Tracking (0–1080) vs Final Wide View (1080–1440)
  const wideTransitionProgress = spring({
    frame: Math.max(0, frame - 1080),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Calculate character camera tracking position during 0–1080
  const isNightPhase = frame < 720;
  const isDawnPhase = frame >= 720 && frame < 1080;
  const isWidePhase = frame >= 1080;

  // Active garden sign for close-up pass
  const activeSignIndex = useMemo(() => {
    for (let i = GARDEN_SIGNS.length - 1; i >= 0; i--) {
      if (frame >= GARDEN_SIGNS[i].popFrame) return i;
    }
    return 0;
  }, [frame]);

  const activeSign = GARDEN_SIGNS[activeSignIndex];

  // Dynamic Character Coordinates
  // Runs left-to-right in cycles, then takes center stage in wide view
  const characterX = useMemo(() => {
    if (isWidePhase) {
      // Settle gently at 540 (horizontal center)
      return interpolate(wideTransitionProgress, [0, 1], [340, 540]);
    }
    // Organic left to right loop across the garden scenes
    const loopProgress = (frame % 360) / 360;
    return interpolate(loopProgress, [0, 0.7, 1], [180, 720, 920]);
  }, [frame, isWidePhase, wideTransitionProgress]);

  const characterY = useMemo(() => {
    if (isWidePhase) {
      return 1520;
    }
    return 1460;
  }, [isWidePhase]);

  // Shooting Stars during Night (Frames 0–700)
  const shootingStar = useMemo(() => {
    if (frame > 750) return null;
    const shootCycle = frame % 220;
    if (shootCycle < 25) {
      const progress = shootCycle / 25;
      const startX = 850;
      const startY = 120;
      return {
        x: startX - progress * 400,
        y: startY + progress * 240,
        len: 120,
        opacity: Math.sin(progress * Math.PI),
      };
    }
    return null;
  }, [frame]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* SKY LAYER: NIGHT -> DAWN -> GOLDEN SUNRISE                    */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 70%, 
              ${isWidePhase || sunriseFactor > 0.5 ? 'rgba(254, 240, 138, 0.85)' : dawnFactor > 0.3 ? 'rgba(244, 63, 94, 0.7)' : 'rgba(30, 58, 138, 0.4)'} 0%, 
              transparent 70%
            ),
            linear-gradient(180deg, 
              ${skyColor0} 0%,
              ${skyColor50} 50%,
              ${skyColor80} 80%,
              ${skyColor100} 100%
            )
          `,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Twinkling Stars (Fades out during dawn & sunrise) */}
      {nightFactor > 0.02 && (
        <div style={{ position: 'absolute', inset: 0, opacity: nightFactor }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const starX = (i * 211.3) % 1080;
            const starY = (i * 137.9) % 850;
            const starSize = 2 + (i % 4) * 1.5;
            const twinkle = Math.sin((frame + i * 17) * 0.08) * 0.5 + 0.5;

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
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 6px rgba(255, 255, 255, ${twinkle})`,
                  opacity: 0.3 + twinkle * 0.7,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Shooting Star Trail */}
      {shootingStar && (
        <div
          style={{
            position: 'absolute',
            left: shootingStar.x,
            top: shootingStar.y,
            width: shootingStar.len,
            height: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            transform: 'rotate(150deg)',
            opacity: shootingStar.opacity,
            filter: 'drop-shadow(0 0 6px #ffffff)',
          }}
        />
      )}

      {/* ----------------- RISING SUN & VOLUMETRIC GOD RAYS ----------------- */}
      {(sunriseFactor > 0.05 || isWidePhase) && (
        <div
          style={{
            position: 'absolute',
            top: interpolate(sunriseFactor, [0, 1], [650, 420]),
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: Math.max(sunriseFactor, wideTransitionProgress),
            pointerEvents: 'none',
          }}
        >
          {/* Radiant Sun Disc */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ffffff 0%, #fef08a 40%, #f59e0b 80%, rgba(245, 158, 11, 0) 100%)',
              boxShadow: '0 0 100px #f59e0b, 0 0 180px rgba(254, 240, 138, 0.8)',
            }}
          />
          {/* Rotating Sunbeams */}
          <div
            style={{
              position: 'absolute',
              top: -140,
              left: -140,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(254, 240, 138, 0.25) 0deg, transparent 30deg, rgba(254, 240, 138, 0.25) 60deg, transparent 90deg, rgba(254, 240, 138, 0.25) 120deg, transparent 150deg, rgba(254, 240, 138, 0.25) 180deg, transparent 210deg, rgba(254, 240, 138, 0.25) 240deg, transparent 270deg, rgba(254, 240, 138, 0.25) 300deg, transparent 330deg, rgba(254, 240, 138, 0.25) 360deg)',
              transform: `rotate(${frame * 0.15}deg)`,
              filter: 'blur(10px)',
            }}
          />
        </div>
      )}

      {/* Procedural Flocking Birds */}
      <ProceduralFlockingBirds frame={frame} activeProgress={Math.max(dawnFactor, sunriseFactor)} />

      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND SCENERY: HILLS, GARDEN SHED, DISTANT FENCES        */}
      {/* ------------------------------------------------------------- */}
      {/* Rolling Low-Poly Hills Layer */}
      <svg
        viewBox="0 0 1080 600"
        style={{
          position: 'absolute',
          bottom: 580,
          left: 0,
          width: '100%',
          height: 600,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 0 450 Q 280 320 540 410 T 1080 360 L 1080 600 L 0 600 Z"
          fill={isNightPhase ? '#064e3b' : '#15803d'}
          opacity="0.8"
        />
        <path
          d="M 0 480 Q 380 380 720 460 T 1080 430 L 1080 600 L 0 600 Z"
          fill={isNightPhase ? '#065f46' : '#22c55e'}
          opacity="0.9"
        />
      </svg>

      {/* Whimsical Wooden Garden Shed (Top Right Background) */}
      <div
        style={{
          position: 'absolute',
          bottom: 920,
          right: 90,
          width: 140,
          height: 120,
          transform: 'scale(0.95)',
          opacity: 0.92,
        }}
      >
        {/* Sloping Pitched Roof */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '75px solid transparent',
            borderRight: '75px solid transparent',
            borderBottom: '45px solid #78350f',
            position: 'absolute',
            top: 0,
            left: -5,
          }}
        />
        {/* Shed Wooden Wall */}
        <div
          style={{
            position: 'absolute',
            top: 45,
            width: 130,
            height: 75,
            backgroundColor: '#92400e',
            border: '3px solid #713f12',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 8px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Small Cozy Window with Warm Light */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: isNightPhase ? '#fef08a' : '#bae6fd',
              boxShadow: isNightPhase ? '0 0 16px #facc15' : 'none',
              border: '2px solid #451a03',
            }}
          />
        </div>
      </div>

      {/* Picket Wooden Fence */}
      <div
        style={{
          position: 'absolute',
          bottom: 820,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'space-between',
          opacity: 0.85,
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 48 + (i % 3) * 6,
              borderRadius: '6px 6px 0 0',
              background: 'linear-gradient(180deg, #fef3c7 0%, #d97706 100%)',
              border: '1px solid #92400e',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MIDGROUND: VEGETABLE GARDEN BEDS, PLANTS & BLOSSOMS           */}
      {/* ------------------------------------------------------------- */}
      {/* Layered Garden Soil Bed */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 840,
          background: 'linear-gradient(180deg, #451a03 0%, #291b0c 35%, #1c1107 100%)',
          borderTop: '16px solid #15803d',
          boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Dirt Footpath */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 380,
            background: 'radial-gradient(ellipse at 50% 100%, #78350f 0%, #451a03 70%)',
            borderTop: '4px dashed #92400e',
          }}
        />

        {/* Scattered Garden Flowers & Vegetables in Soil */}
        <div style={{ position: 'absolute', top: 20, left: 30, right: 30, display: 'flex', justifyContent: 'space-around' }}>
          {['🌻', '🥕', '🎃', '🥬', '🍅', '🌽', '🍆', '🫑', '🌻'].map((plant, i) => (
            <div
              key={i}
              style={{
                fontSize: 28,
                transform: `rotate(${Math.sin((frame + i * 20) * 0.08) * 8}deg)`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              }}
            >
              {plant}
            </div>
          ))}
        </div>
      </div>

      {/* Procedural Fireflies (Night) & Butterflies (Dawn/Day) */}
      <ProceduralFireflies frame={frame} opacity={nightFactor} />
      <ProceduralButterflies frame={frame} activeProgress={Math.max(dawnFactor, sunriseFactor)} />

      {/* ------------------------------------------------------------- */}
      {/* STAGE A: WALKING PASS SHOWCASE (Frames 0–1080)                 */}
      {/* ------------------------------------------------------------- */}
      {!isWidePhase && (
        <>
          {/* Main Hero Garden Sign Passing In Front */}
          <div
            style={{
              position: 'absolute',
              top: 720,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
            }}
          >
            <WoodenSign sign={activeSign} frame={frame} fps={fps} />
          </div>

          {/* Previous and Upcoming Secondary Signs in Parallax */}
          {activeSignIndex > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 820,
                left: 70,
                transform: 'scale(0.72)',
                opacity: 0.65,
                zIndex: 20,
              }}
            >
              <WoodenSign sign={GARDEN_SIGNS[activeSignIndex - 1]} frame={frame} fps={fps} />
            </div>
          )}

          {activeSignIndex < GARDEN_SIGNS.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 800,
                right: 70,
                transform: 'scale(0.75)',
                opacity: 0.7,
                zIndex: 20,
              }}
            >
              <WoodenSign sign={GARDEN_SIGNS[activeSignIndex + 1]} frame={frame} fps={fps} />
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE B: CLIMAX WIDE VIEW OF ALL 15 SIGNS (Frames 1080–1440)  */}
      {/* ------------------------------------------------------------- */}
      {isWidePhase && (
        <div
          style={{
            position: 'absolute',
            top: 480,
            left: 35,
            right: 35,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            zIndex: 35,
            transform: `scale(${interpolate(wideTransitionProgress, [0, 1], [0.85, 1])})`,
            opacity: Math.min(1, wideTransitionProgress * 1.5),
          }}
        >
          {/* Master Garden Headline */}
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '6px 20px',
                borderRadius: 30,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>🌻</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#92400e', letterSpacing: '0.08em' }}>
                15 OPEN-SOURCE TOOLS HARVESTED
              </span>
            </div>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 900,
                margin: 0,
                color: '#ffffff',
                textShadow: '0 4px 15px rgba(0,0,0,0.6)',
                letterSpacing: '-0.02em',
              }}
            >
              The Open AI Video Garden
            </h1>
          </div>

          {/* 3 Tiered Rows of 5 Signs Each (Total 15 Signs) */}
          {[0, 1, 2].map((rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              {GARDEN_SIGNS.filter((s) => s.row === rowIdx).map((sign) => (
                <WoodenSign
                  key={sign.id}
                  sign={sign}
                  frame={frame}
                  fps={fps}
                  isWideGrid={true}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CUTE ORANGE CHARACTER WITH STRAW HAT (PERSISTENT HERO)        */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          left: characterX - 85,
          top: characterY,
          zIndex: 50,
          transition: 'left 0.1s linear',
        }}
      >
        <CuteOrangeCharacter
          frame={frame}
          scale={isWidePhase ? 1.25 : 1.1}
          facing={isWidePhase ? 'front' : 'right'}
          isFloating={isDawnPhase || (frame % 200 > 140)}
          isCelebrating={isWidePhase}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION BANNER (Wide Climax)                      */}
      {/* ------------------------------------------------------------- */}
      {isWidePhase && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 50,
            right: 50,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 60,
            transform: `scale(${interpolate(wideTransitionProgress, [0, 1], [0.8, 1])})`,
            opacity: Math.min(1, wideTransitionProgress * 2),
          }}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '16px 36px',
              borderRadius: 40,
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '2px solid #facc15',
            }}
          >
            <span style={{ fontSize: 22 }}>🌾</span>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.02em', color: '#fef08a' }}>
              grow your AI motion stack · star the repos
            </span>
          </div>
        </div>
      )}

      {/* Subtle Cinematic Vignette / Atmospheric Polish */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
