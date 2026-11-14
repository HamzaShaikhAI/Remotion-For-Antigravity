export interface PlatformPacingFork {
  platform: 'tiktok' | 'youtube_shorts' | 'instagram_reels';
  durationFrames: number;
  durationSec: number;
  pacingStyle: 'hyper_kinetic' | 'narrative_arc' | 'aesthetic_polish';
  hookCutSpeed: number; // sec per clip
  vfxBudget: number;
  targetLufs: number;
}

/**
 * Multi-Platform Pacing Fork Compiler
 * Adapts a single composition into three tailored platform deliverables:
 * - TikTok (15s hyper-speed pace for quick-swipe audiences)
 * - YouTube Shorts (30s narrative arc with breathing room and climax payoff)
 * - Instagram Reels (20s aesthetic polish with cinematic color harmony)
 */
export function getPlatformForks(fps: number = 60): PlatformPacingFork[] {
  return [
    {
      platform: 'tiktok',
      durationFrames: 15 * fps,
      durationSec: 15.0,
      pacingStyle: 'hyper_kinetic',
      hookCutSpeed: 0.4,
      vfxBudget: 120,
      targetLufs: -14.0,
    },
    {
      platform: 'youtube_shorts',
      durationFrames: 30 * fps,
      durationSec: 30.0,
      pacingStyle: 'narrative_arc',
      hookCutSpeed: 0.8,
      vfxBudget: 90,
      targetLufs: -14.0,
    },
    {
      platform: 'instagram_reels',
      durationFrames: 20 * fps,
      durationSec: 20.0,
      pacingStyle: 'aesthetic_polish',
      hookCutSpeed: 0.6,
      vfxBudget: 80,
      targetLufs: -14.0,
    },
  ];
}
