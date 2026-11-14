export interface CuriosityGapHook {
  title: string;
  lowerThirdCaption: string;
  debateAngle: string;
  ctrScore: number; // 0 - 100
}

/**
 * The "Curiosity Gap" Text Engine
 * Bans generic captions ('Cool Edit') and synthesizes polarizing, debate-starting hooks
 * optimized for high comment velocity and algorithmic engagement loops.
 */
export function generateCuriosityGapHooks(
  characterA: string = 'Zenitsu',
  characterB: string = 'Killua',
  climaxTimestampSec: number = 24
): CuriosityGapHook[] {
  return [
    {
      title: `${characterB}'s Godspeed was undefeated... until 0:${climaxTimestampSec} 💀`,
      lowerThirdCaption: 'WAIT FOR THE REACTION',
      debateAngle: 'Pits Hunter x Hunter scaling directly against Demon Slayer breathing forms.',
      ctrScore: 94,
    },
    {
      title: `Who actually had more AURA in this clash? (Don't lie)`,
      lowerThirdCaption: 'COMMENT WHO WON',
      debateAngle: 'Forces immediate comment debate, spiking algorithmic engagement.',
      ctrScore: 91,
    },
    {
      title: `Bro thought he was safe after the first dodge... ⚡`,
      lowerThirdCaption: 'LOOK AT HIS EYES',
      debateAngle: 'Curiosity gap: forces viewer to rewatch frame-by-frame for hidden details.',
      ctrScore: 88,
    },
    {
      title: `When two 100% speed monsters clash in 4K 60fps 🗿`,
      lowerThirdCaption: 'CLEANEST ANIME EDIT',
      debateAngle: 'Visual authority claim triggering verification replays.',
      ctrScore: 86,
    },
  ];
}
