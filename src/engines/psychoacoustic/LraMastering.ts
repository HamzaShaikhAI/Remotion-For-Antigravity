/**
 * Automatic Loudness Range (LRA) Normalization
 *
 * Masters mixed audio stems to precise platform delivery specs:
 * - YouTube Shorts: -14.0 LUFS, -1.0 dBFS True Peak, LRA < 7.0 LU
 * - TikTok: -16.0 LUFS, -1.0 dBFS True Peak, LRA < 8.0 LU
 * - Instagram Reels: -14.0 LUFS
 */

export interface LoudnessProfile {
  targetLufs: number;
  maxTruePeakDbfs: number;
  targetLraLu: number;
  platform: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'broadcast';
}

export class LraMastering {
  public static getPlatformProfile(platform: LoudnessProfile['platform']): LoudnessProfile {
    switch (platform) {
      case 'tiktok':
        return { targetLufs: -16.0, maxTruePeakDbfs: -1.0, targetLraLu: 8.0, platform };
      case 'youtube_shorts':
      case 'instagram_reels':
      default:
        return { targetLufs: -14.0, maxTruePeakDbfs: -1.0, targetLraLu: 6.5, platform };
    }
  }

  public static getLoudnormFilter(profile: LoudnessProfile): string {
    return `loudnorm=I=${profile.targetLufs}:TP=${profile.maxTruePeakDbfs}:LRA=${profile.targetLraLu}:print_format=summary`;
  }
}
