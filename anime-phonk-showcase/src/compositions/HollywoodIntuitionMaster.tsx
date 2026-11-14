import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BreathingRoomInhale,
  SaliencyFocalStage,
  ContrastAdaptiveTypography,
  ShutterMotionBlur,
} from '../intuition';
import { ChadEmojiOverlay } from '../plugins/rea-chad-overlay';
import { SubjectAwareDynamicCrop } from '../engines';
import { VFXBudgetProvider, useVFXBudget } from '../context/VFXBudgetContext';
import { JCutTransition } from '../components/SeamlessTransition';

/**
 * Hollywood Intuition Inner Content (Consumes VFXBudgetContext)
 */
const HollywoodIntuitionContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { canAfford } = useVFXBudget();

  // Drop timestamp: Frame 720 (12.0s)
  const dropFrame = 720;
  const isPostDrop = frame >= dropFrame;

  // Background luminance simulation (bright flash during drop frames 720-740)
  const isDropFlash = frame >= dropFrame && frame <= dropFrame + 18;
  const bgLuminance = isDropFlash ? 0.95 : 0.22;

  // Camera shake velocity (only during drop climax, zero during inhale)
  const shakeVelocity = isPostDrop && !isDropFlash ? Math.sin(frame * 0.8) * 14 : 0;

  // Aesthetic Restraint: Check if timeline can afford heavy VFX overlay (cost: 35)
  const canAffordAuraOverlay = isPostDrop && canAfford(35, frame);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020205' }}>
      {/* Pillar II: Timeline Elasticity & The Breathing Room Inhale */}
      <BreathingRoomInhale dropFrame={dropFrame} inhaleDurationFrames={72}>
        {/* Pillar I: Subject-Aware Dynamic Framing */}
        <SubjectAwareDynamicCrop
          trackingPoints={[
            { frame: 0, x: 0.35, y: 0.45 },
            { frame: 360, x: 0.50, y: 0.45 },
            { frame: dropFrame, x: 0.65, y: 0.42 },
          ]}
          zoomScale={1.15}
        >
          {/* Pillar III: Saliency Mapping & Focal Point Preservation */}
          <SaliencyFocalStage
            focalRegion={{ x: 0.5, y: 0.42, radius: 0.25, weight: 1.0 }}
            overlays={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {/* Pillar IV: Curiosity Gap Polarizing Hook */}
                <ShutterMotionBlur cameraVelocityX={shakeVelocity}>
                  <ContrastAdaptiveTypography
                    backgroundLuminance={bgLuminance}
                    textColor="#FFE600"
                    fontSize={52}
                  >
                    KILLUA'S GODSPEED WAS UNDEFEATED...
                  </ContrastAdaptiveTypography>
                </ShutterMotionBlur>

                <div
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '32px',
                    color: '#FFFFFF',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    textShadow: '0 4px 14px rgba(0,0,0,0.9)',
                  }}
                >
                  UNTIL 0:12 💀
                </div>

                {/* Pillar III: Aesthetic Restraint via VFXBudgetContext */}
                {canAffordAuraOverlay && (
                  <div style={{ marginTop: '20px' }}>
                    <ChadEmojiOverlay
                      triggerFrame={dropFrame}
                      durationInFrames={120}
                      variant="chad"
                      caption="+1,000,000 AURA"
                      accentColor="#FFE600"
                    />
                  </div>
                )}
              </div>
            }
          >
            {/* Ambient Background + Hero Video Layer */}
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* Blurred Ambient Stage */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10%',
                  width: '120%',
                  height: '120%',
                  filter: 'blur(36px) brightness(0.4)',
                  transform: 'scale(1.1)',
                }}
              >
                <Video
                  src={staticFile('clips/scene_01_standoff.mp4')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* 16:9 Hero Stage with J-Cut Seamless Transition */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '607px', // 1080 * 9/16
                    boxShadow: '0 0 50px rgba(0,0,0,0.9)',
                    borderTop: '2px solid rgba(255,230,0,0.3)',
                    borderBottom: '2px solid rgba(255,230,0,0.3)',
                    overflow: 'hidden',
                  }}
                >
                  <Sequence from={0} durationInFrames={dropFrame}>
                    <Video
                      src={staticFile('clips/scene_01_standoff.mp4')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Sequence>

                  <Sequence from={dropFrame} durationInFrames={1080}>
                    <Video
                      src={staticFile('clips/scene_06_killua_godspeed.mp4')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Sequence>
                </div>
              </div>
            </div>
          </SaliencyFocalStage>
        </SubjectAwareDynamicCrop>
      </BreathingRoomInhale>

      {/* Audio Track with Inhale Fade */}
      <Sequence from={0} durationInFrames={1800}>
        <Audio src={staticFile('audio/active-phonk.mp3')} volume={0.85} />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Hollywood Intuition Master Composition wrapped in VFXBudgetProvider
 */
export const HollywoodIntuitionMaster: React.FC = () => {
  return (
    <VFXBudgetProvider initialBudget={100} regenRate={0.5}>
      <HollywoodIntuitionContent />
    </VFXBudgetProvider>
  );
};
