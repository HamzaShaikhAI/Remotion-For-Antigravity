/**
 * Voiceover Emotion Prompting (ElevenLabs V3 / Gemini 3.8 Flash Emotion Tagging)
 *
 * Injects granular acoustic emotion tags ([whispering], [screaming with rage],
 * [cold breath], [mocking laugh]) into monologue text to achieve theatrical depth.
 */

export interface EmotionCue {
  tag: '[whisper]' | '[rage_scream]' | '[cold_smirk]' | '[gasp]' | '[echo_thought]';
  text: string;
  targetPitchShiftSemiTones?: number;
  reverbDecaySec?: number;
}

export class VoiceoverEmotionPrompter {
  public static compileEmotionPrompt(cues: EmotionCue[]): string {
    return cues.map((c) => `${c.tag} ${c.text}`).join(' ');
  }

  public static parseEmotionScript(rawScript: string): EmotionCue[] {
    const regex = /\[(\w+)\]\s*([^\[]+)/g;
    const cues: EmotionCue[] = [];
    let match;
    while ((match = regex.exec(rawScript)) !== null) {
      cues.push({
        tag: `[${match[1]}]` as any,
        text: match[2].trim(),
      });
    }
    return cues;
  }
}
