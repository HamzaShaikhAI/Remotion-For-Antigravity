/**
 * FlawlessLogicEngine (CommonJS for REA CLI Runtime)
 * Spatial Continuity & Momentum Conservation Engine
 */

const fs = require('fs');
const path = require('path');

function validateCut(clipA, clipB) {
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
  if (exitEyeline === 'looking_right' && entryEyeline === 'looking_right') {
    return {
      isValid: false,
      reason: '180_DEGREE_VIOLATION: Both subjects looking right.',
      recommendedBridge: {
        type: 'static_wide',
        description: 'Insert neutral establishing wide shot or reverse reaction shot.',
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
        description: 'Insert neutral wide shot to re-anchor the 180-degree axis.',
        durationFrames: 18,
      },
    };
  }

  // RULE 2: Momentum Conservation
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

function loadClipMeta(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Clip metadata file not found: ${resolved}`);
  }
  const content = fs.readFileSync(resolved, 'utf8');
  return JSON.parse(content);
}

function validateSequence(clips) {
  const rejections = [];
  for (let i = 0; i < clips.length - 1; i++) {
    const res = validateCut(clips[i], clips[i + 1]);
    if (!res.isValid) {
      rejections.push({
        index: i,
        clipA: clips[i].clip_id,
        clipB: clips[i + 1].clip_id,
        reason: res.reason,
        recommendedBridge: res.recommendedBridge,
      });
    }
  }

  return {
    isValid: rejections.length === 0,
    rejections,
    approvedCount: Math.max(0, clips.length - 1 - rejections.length),
  };
}

module.exports = {
  validateCut,
  loadClipMeta,
  validateSequence,
};
