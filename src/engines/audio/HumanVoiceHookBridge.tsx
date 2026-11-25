// src/engines/audio/HumanVoiceHookBridge.tsx
import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';

export interface HumanVoiceHookBridgeProps {
  /** Path to authentic 15-20s opening engineer voice recording */
  hookAudioSrc?: string;
  /** Duration of opening voice hook in frames (e.g. 1200 frames @ 60fps = 20.0s) */
  hookDurationFrames?: number;
  /** Path to authentic closing engineer CTA voice recording (e.g. last 10-15s) */
  ctaAudioSrc?: string;
  /** Start frame for the closing CTA voiceover */
  ctaStartFrame?: number;
  /** Fallback or intermediate synthesized narration audio file */
  syntheticNarrationSrc?: string;
  /** Background soundtrack file to sidechain-duck */
  soundtrackSrc?: string;
  /** Base music volume when voice is silent (default 0.42) */
  baseMusicVolume?: number;
  /** Ducked music volume when voice is active (default 0.16) */
  duckedMusicVolume?: number;
}

/**
 * HumanVoiceHookBridge
 * 
 * Blends authentic human engineer voice recordings for the opening 15-20s hook
 * and closing CTA with synthetic technical narration and beat-ducked soundtrack audio.
 */
export const HumanVoiceHookBridge: React.FC<HumanVoiceHookBridgeProps> = ({
  hookAudioSrc,
  hookDurationFrames = 1200,
  ctaAudioSrc,
  ctaStartFrame,
  syntheticNarrationSrc,
  soundtrackSrc,
  baseMusicVolume = 0.42,
  duckedMusicVolume = 0.16,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const finalCtaStart = ctaStartFrame ?? Math.max(0, durationInFrames - Math.round(fps * 10)); // Default last 10s

  const isHookActive = hookAudioSrc && frame < hookDurationFrames;
  const isCtaActive = ctaAudioSrc && frame >= finalCtaStart;
  const isVoiceActive = isHookActive || isCtaActive || Boolean(syntheticNarrationSrc);

  // Dynamic sidechain ducking curve for background music
  const musicVolume = interpolate(
    isVoiceActive ? 1 : 0,
    [0, 1],
    [baseMusicVolume, duckedMusicVolume],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      {/* 1. Background Music with Sidechain Ducking */}
      {soundtrackSrc && (
        <Audio
          src={soundtrackSrc.startsWith('http') || soundtrackSrc.startsWith('/') ? soundtrackSrc : staticFile(soundtrackSrc)}
          volume={musicVolume}
        />
      )}

      {/* 2. Opening 15-20s Authentic Engineer Voice Hook */}
      {hookAudioSrc && (
        <Sequence from={0} durationInFrames={hookDurationFrames}>
          <Audio
            src={hookAudioSrc.startsWith('http') || hookAudioSrc.startsWith('/') ? hookAudioSrc : staticFile(hookAudioSrc)}
            volume={(f) => {
              // Smooth 15-frame fade in and 20-frame fade out into synthetic section
              const fadeIn = interpolate(f, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const fadeOut = interpolate(f, [hookDurationFrames - 20, hookDurationFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return fadeIn * fadeOut * 0.98;
            }}
          />
        </Sequence>
      )}

      {/* 3. Middle Section: Synthesized Narration (Frames hookDurationFrames to finalCtaStart) */}
      {syntheticNarrationSrc && (
        <Sequence
          from={hookAudioSrc ? hookDurationFrames : 0}
          durationInFrames={hookAudioSrc ? Math.max(1, finalCtaStart - hookDurationFrames) : finalCtaStart}
        >
          <Audio
            src={syntheticNarrationSrc.startsWith('http') || syntheticNarrationSrc.startsWith('/') ? syntheticNarrationSrc : staticFile(syntheticNarrationSrc)}
            volume={0.94}
          />
        </Sequence>
      )}

      {/* 4. Final CTA: Authentic Engineer Voice CTA */}
      {ctaAudioSrc && (
        <Sequence from={finalCtaStart} durationInFrames={durationInFrames - finalCtaStart}>
          <Audio
            src={ctaAudioSrc.startsWith('http') || ctaAudioSrc.startsWith('/') ? ctaAudioSrc : staticFile(ctaAudioSrc)}
            volume={(f) => {
              const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return fadeIn * 1.0;
            }}
          />
        </Sequence>
      )}
    </>
  );
};
