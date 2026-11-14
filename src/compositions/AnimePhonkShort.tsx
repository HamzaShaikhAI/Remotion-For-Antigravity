import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { ImpactFreezeFrame } from '../plugins/rea-impact-freeze';
import { ChadEmojiOverlay } from '../plugins/rea-chad-overlay';
import { NeonEmbers } from '../plugins/rea-particles';
import { GlitchTransition } from '../plugins/rea-transitions';
import { KineticSplitText } from '../plugins/rea-typography';

// 1. Zod Schema for live sidebar tweaking in Remotion Studio
export const animePhonkShortSchema = z.object({
  audioFile: z.string(),
  dropFrame: z.number().min(60).max(500).step(1),
  freezeDuration: z.number().min(15).max(120).step(1),
  variant: z.enum(['chad', 'skull', 'fire', 'sigma']),
  hookTitle: z.string().min(1).max(30),
  dropCaption: z.string().min(1).max(30),
  accentColor: zColor(),
  useExternalClips: z.boolean(),
});

export type AnimePhonkShortProps = z.infer<typeof animePhonkShortSchema>;

// Helper: Rapid forward-momentum shot wrapper (Phase A buildup & post-drop cuts)
const VelocityShot: React.FC<{
  children: React.ReactNode;
  startScale?: number;
  endScale?: number;
  tiltAngle?: number;
}> = ({ children, startScale = 1.0, endScale = 1.18, tiltAngle = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });
  const rotate = interpolate(frame, [0, durationInFrames], [-tiltAngle, tiltAngle], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Helper: Procedural Anime Energy Aura & Eye-Glint Scene (works out-of-the-box without external MP4s)
const ProceduralAnimeFrame: React.FC<{
  sceneIndex: number;
  accentColor: string;
  label: string;
}> = ({ sceneIndex, accentColor, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slashSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 220 },
  });
  const slashWidth = interpolate(slashSpring, [0, 1], [0, 1100]);
  const auraPulse = 1 + Math.sin(frame * 0.25 + sceneIndex) * 0.08;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #111827 0%, #050814 75%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Dramatic Anime Diagonal Katana / Energy Slash */}
      <div
        style={{
          position: 'absolute',
          width: slashWidth,
          height: 14,
          backgroundColor: '#ffffff',
          boxShadow: `0 0 35px ${accentColor}, 0 0 70px ${accentColor}`,
          transform: `rotate(${sceneIndex % 2 === 0 ? -24 : 24}deg)`,
        }}
      />

      {/* Glowing Awakening Silhouette / Eye-Glint Core */}
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: '50%',
          border: `4px solid ${accentColor}`,
          boxShadow: `0 0 60px ${accentColor}66, inset 0 0 45px ${accentColor}55`,
          transform: `scale(${auraPulse})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Sharp Anime Eye-Flare Star */}
        <div
          style={{
            width: 260,
            height: 8,
            backgroundColor: '#ffffff',
            boxShadow: `0 0 25px ${accentColor}, 0 0 50px #ffffff`,
          }}
        />
      </div>

      {/* Scene Telemetry Tag */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          padding: '6px 18px',
          border: `2px solid ${accentColor}`,
          color: accentColor,
          fontFamily: 'monospace',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 4,
          backgroundColor: 'rgba(5, 8, 20, 0.8)',
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

export const AnimePhonkShort: React.FC<AnimePhonkShortProps> = ({
  audioFile = 'audio/active-phonk.wav',
  dropFrame = 205, // Default 3.42s @ 60fps from `rea pick-track`
  freezeDuration = 48, // 0.80s manga impact freeze
  variant = 'chad',
  hookTitle = 'LIMIT BREAKER',
  dropCaption = 'COLDEST MOMENT',
  accentColor = '#00f5ff',
  useExternalClips = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const resolvedAudio = staticFile(audioFile);

  // Split buildup (0 -> dropFrame) into 4 rapid cuts (~0.85s each @ 60fps)
  const cut1 = Math.floor(dropFrame * 0.28);
  const cut2 = Math.floor(dropFrame * 0.26);
  const cut3 = Math.floor(dropFrame * 0.24);
  const cut4 = Math.max(1, dropFrame - (cut1 + cut2 + cut3));

  // Post-drop aftermath duration
  const postDropDuration = Math.max(60, durationInFrames - dropFrame);

  // Phase C: Seamless Loop Velocity Zoom-In during the final 12 frames
  const loopStart = durationInFrames - 12;
  const loopZoom =
    frame >= loopStart
      ? interpolate(frame, [loopStart, durationInFrames], [1.0, 1.55], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1.0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050814', overflow: 'hidden' }}>
      {/* Master Phonk Audio Track */}
      <Audio src={resolvedAudio} volume={1.0} />

      {/* Optional Riser SFX leading directly into the beat drop */}
      {dropFrame >= 90 && (
        <Sequence from={dropFrame - 90} durationInFrames={90}>
          <Audio src={staticFile('sfx/riser.wav')} volume={0.35} />
        </Sequence>
      )}

      {/* Seamless Loop Transform Container */}
      <AbsoluteFill style={{ transform: `scale(${loopZoom})` }}>
        {/* Beat-Drop Freeze Frame + Manga Halftone + Bass Camera Shake */}
        <ImpactFreezeFrame
          triggerFrame={dropFrame}
          durationInFrames={freezeDuration}
          shakeIntensity={22}
          mangaContrast={true}
          flashColor="#ffffff"
          audioSrc={resolvedAudio}
        >
          <Series>
            {/* PHASE A: Rapid 4-Cut Buildup */}
            <Series.Sequence durationInFrames={cut1}>
              <VelocityShot startScale={1.0} endScale={1.16} tiltAngle={1.5}>
                {useExternalClips ? (
                  <OffthreadVideo
                    src={staticFile('clips/clip1.mp4')}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProceduralAnimeFrame
                    sceneIndex={1}
                    accentColor={accentColor}
                    label="PHASE 01 // AWAKENING"
                  />
                )}
              </VelocityShot>
            </Series.Sequence>

            <Series.Sequence durationInFrames={cut2}>
              <VelocityShot startScale={1.04} endScale={1.22} tiltAngle={-2.0}>
                {useExternalClips ? (
                  <OffthreadVideo
                    src={staticFile('clips/clip2.mp4')}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProceduralAnimeFrame
                    sceneIndex={2}
                    accentColor="#a855f7"
                    label="PHASE 02 // OVERDRIVE"
                  />
                )}
              </VelocityShot>
            </Series.Sequence>

            <Series.Sequence durationInFrames={cut3}>
              <VelocityShot startScale={1.02} endScale={1.2} tiltAngle={2.2}>
                {useExternalClips ? (
                  <OffthreadVideo
                    src={staticFile('clips/clip3.mp4')}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProceduralAnimeFrame
                    sceneIndex={3}
                    accentColor="#ec4899"
                    label="PHASE 03 // CRITICAL"
                  />
                )}
              </VelocityShot>
            </Series.Sequence>

            <Series.Sequence durationInFrames={cut4}>
              <VelocityShot startScale={1.08} endScale={1.32} tiltAngle={-1.5}>
                {useExternalClips ? (
                  <OffthreadVideo
                    src={staticFile('clips/clip4.mp4')}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProceduralAnimeFrame
                    sceneIndex={4}
                    accentColor={accentColor}
                    label="IMPACT IMMINENT"
                  />
                )}
              </VelocityShot>
            </Series.Sequence>

            {/* PHASE B: Post-Drop High-Energy Action */}
            <Series.Sequence durationInFrames={postDropDuration}>
              <GlitchTransition intensity={1.6}>
                <VelocityShot startScale={1.05} endScale={1.25} tiltAngle={1.2}>
                  {useExternalClips ? (
                    <OffthreadVideo
                      src={staticFile('clips/clip5.mp4')}
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ProceduralAnimeFrame
                      sceneIndex={5}
                      accentColor={accentColor}
                      label="UNLEASHED // 100%"
                    />
                  )}
                </VelocityShot>
              </GlitchTransition>
            </Series.Sequence>
          </Series>

          {/* Ambient Neon Embers Depth Layer */}
          <NeonEmbers count={65} interactive={false} />
        </ImpactFreezeFrame>

        {/* Hook Title Kinetic Typography (Frames 6 -> 85) */}
        <Sequence from={6} durationInFrames={80}>
          <AbsoluteFill
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 280,
              pointerEvents: 'none',
            }}
          >
            <KineticSplitText
              text={hookTitle}
              delayPerLetter={2}
              style={{
                fontSize: 78,
                fontFamily: 'Impact, Anton, Poppins, sans-serif',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: 4,
                textShadow: `0 0 28px ${accentColor}, 4px 4px 0px #000000`,
              }}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Phase B: Bass-Reactive GigaChad / Sigma Reaction Badge */}
        <ChadEmojiOverlay
          triggerFrame={dropFrame}
          durationInFrames={95}
          variant={variant}
          caption={dropCaption}
          bassReactive={true}
          audioSrc={resolvedAudio}
          accentColor={accentColor}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
