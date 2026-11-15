// src/engines/audio/AdvancedAudioEngine.ts
import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const SFXLibrary = {
  whoosh: 'sfx/whoosh-transition.wav',
  impact: 'sfx/heavy-impact.wav',
  click: 'sfx/ui-click.wav',
  riser: 'sfx/cinematic-riser.wav',
  glitch: 'sfx/digital-glitch.wav',
  cashFlutter: 'sfx/cash-flutter.wav',
  policeSiren: 'sfx/police-siren.wav',
  counterTick: 'sfx/counter-tick.wav',
  dyePackBeep: 'sfx/dye-pack-beep.wav',
  dilemmaDrone: 'sfx/dilemma-drone.wav',
} as const;

export type SFXType = keyof typeof SFXLibrary;

export interface SfxTrigger {
  frame: number;
  type: SFXType;
  volume?: number;
}

export interface SynchronizedAudioProps {
  soundtrackSrc: string;
  voiceoverActive: boolean;
  sfxTriggers?: SfxTrigger[];
}

export const AdvancedAudioEngine: React.FC<SynchronizedAudioProps> = ({
  soundtrackSrc,
  voiceoverActive,
  sfxTriggers = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Automatic sidechain ducking: Smoothly lower music volume when voiceover is speaking
  const musicVolume = interpolate(
    voiceoverActive ? 1 : 0,
    [0, 1],
    [0.75, 0.25], // Dips from 75% to 25% (-12 dB) during voiceover
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return React.createElement(
    React.Fragment,
    null,
    // Background Soundtrack with Dynamic Ducking
    React.createElement(Audio, {
      src: staticFile(soundtrackSrc),
      volume: musicVolume,
    }),
    // Triggered Keyframe Sound Effects
    ...sfxTriggers.map((trigger, idx) => {
      const progress = spring({
        frame: frame - trigger.frame,
        fps,
        config: { damping: 14, stiffness: 200 },
      });

      const shouldPlay = progress > 0.02 && progress < 0.12;
      if (!shouldPlay) return null;

      const sfxAsset = SFXLibrary[trigger.type] || SFXLibrary.impact;
      return React.createElement(Audio, {
        key: `sfx_${idx}_${trigger.frame}`,
        src: staticFile(sfxAsset),
        volume: trigger.volume !== undefined ? trigger.volume : 0.85,
      });
    })
  );
};
