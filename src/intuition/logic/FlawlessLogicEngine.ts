/**
 * FlawlessLogicEngine - Spatial Continuity & Kinetic Conservation
 *
 * Enforces the fundamental laws of cinematic choreography and spatial geometry:
 * 1. 180-Degree Gaze Rule: Opposing characters must maintain complementary eyelines.
 * 2. Momentum Conservation: Horizontal velocities must align or resolve through neutral frames.
 */

export interface FrameMetadata {
  frame: number;
  momentum_x?: number;
  momentum_y?: number;
  momentum_dir: 'pan_left' | 'pan_right' | 'static';
  eyeline: 'looking_left' | 'looking_right' | 'looking_forward' | 'unknown';
}

export interface ClipMeta {
  clip_id: string;
  frames: FrameMetadata[];
}

export interface CutValidationResult {
  isValid: boolean;
  reason?: string;
  recommendedBridge?: {
    type: 'static_wide' | 'whip_pan_dissolve' | 'breathing_room' | 'reaction_cut';
    description: string;
    durationFrames: number;
  };
}

/**
 * Validates a cinematic cut between Clip A and Clip B according to
 * 180-degree eyeline geometry and physical momentum conservation.
 */
export function validateCut(clipA: ClipMeta, clipB: ClipMeta): CutValidationResult {
  if (!clipA || !clipA.frames || clipA.frames.length === 0) {
    return { isValid: true };
  }
  if (!clipB || !clipB.frames || clipB.frames.length === 0) {
    return { isValid: true };
  }

  // Sample the exit state of Clip A (last 5 frames)
  const exitFrames = clipA.frames.slice(-5);
  const exitFrame = exitFrames[0] || clipA.frames[clipA.frames.length - 1];
  const exitEyeline = exitFrame ? exitFrame.eyeline : 'unknown';
  const exitMomentum = exitFrame ? exitFrame.momentum_dir : 'static';

  // Sample the entry state of Clip B (first 5 frames)
  const entryFrames = clipB.frames.slice(0, 5);
  const entryFrame = entryFrames[0] || clipB.frames[0];
  const entryEyeline = entryFrame ? entryFrame.eyeline : 'unknown';
  const entryMomentum = entryFrame ? entryFrame.momentum_dir : 'static';

  // RULE 1: The 180-Degree Gaze Rule
  // If Character A is looking right in the first shot, the next shot (if showing the opponent)
  // must show them looking left. Cutting from looking_right to looking_right implies they are facing the same way.
  if (exitEyeline === 'looking_right' && entryEyeline === 'looking_right') {
    return {
      isValid: false,
      reason: '180_DEGREE_VIOLATION: Both subjects looking right.',
      recommendedBridge: {
        type: 'static_wide',
        description: 'Insert 18-frame neutral establishing wide shot or reverse reaction shot.',
        durationFrames: 18,
      },
    };
  }

  if (exitEyeline === 'looking_left' && entryEyeline === 'looking_left') {
    return {
      isValid: false,
      reason: '180_DEGREE_VIOLATION: Both subjects looking left.',
      recommendedBridge: {
        type: 'static_wide',
        description: 'Insert 18-frame neutral wide shot to re-anchor the 180-degree axis.',
        durationFrames: 18,
      },
    };
  }

  // RULE 2: Momentum Conservation
  // If the camera or subject is violently panning right, cutting to a hard left pan creates kinetic whiplash.
  if (exitMomentum === 'pan_right' && entryMomentum === 'pan_left') {
    return {
      isValid: false,
      reason: 'MOMENTUM_CRASH: Reversing horizontal velocity.',
      recommendedBridge: {
        type: 'whip_pan_dissolve',
        description: 'Insert 6-frame motion-blur kinetic whip pan to absorb vector reversal.',
        durationFrames: 6,
      },
    };
  }

  if (exitMomentum === 'pan_left' && entryMomentum === 'pan_right') {
    return {
      isValid: false,
      reason: 'MOMENTUM_CRASH: Reversing horizontal velocity.',
      recommendedBridge: {
        type: 'whip_pan_dissolve',
        description: 'Insert 6-frame motion-blur kinetic whip pan to absorb vector reversal.',
        durationFrames: 6,
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates an entire multi-clip sequence and returns all flagged transitions.
 */
export function validateSequence(clips: ClipMeta[]): {
  isValid: boolean;
  rejections: Array<{ index: number; clipA: string; clipB: string; reason: string }>;
  approvedCount: number;
} {
  const rejections: Array<{ index: number; clipA: string; clipB: string; reason: string }> = [];

  for (let i = 0; i < clips.length - 1; i++) {
    const result = validateCut(clips[i], clips[i + 1]);
    if (!result.isValid) {
      rejections.push({
        index: i,
        clipA: clips[i].clip_id,
        clipB: clips[i + 1].clip_id,
        reason: result.reason || 'Unknown spatial violation',
      });
    }
  }

  return {
    isValid: rejections.length === 0,
    rejections,
    approvedCount: Math.max(0, clips.length - 1 - rejections.length),
  };
}

/**
 * Node.js helper to safely load a clip metadata file from disk.
 */
export function loadClipMeta(metaPath: string): ClipMeta {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const raw = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      throw new Error(`Failed to load clip metadata from ${metaPath}: ${(e as Error).message}`);
    }
  }
  throw new Error('loadClipMeta can only be executed in a Node.js runtime.');
}
