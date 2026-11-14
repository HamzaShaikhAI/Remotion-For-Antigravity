import React, { useMemo } from 'react';
import {
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

// =====================================================================
// USE CASE 3: THE FINALE - "ONE CONVERSATION"
// A 65-Second Short Film Made Entirely In Code
// Framerate: 30 FPS | Duration: 1950 frames (65.0s) | 1920x1080 (16:9)
// =====================================================================

export const OneConversationFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------------
  // TIMELINE BEATS:
  // Act I:   The 2:07 AM Spark              (0–330   | 0:00–0:11)
  // Act II:  The Writers' Room & Screenplay (330–660 | 0:11–0:22)
  // Act III: Concept Art & 3D Stage         (660–1050| 0:22–0:35)
  // Act IV:  The Edit Suite & Sound Stage   (1050–1440| 0:35–0:48)
  // Act V:   The Great Pull-Back & Climax   (1440–1800| 0:48–1:00)
  // Act VI:  Outro & Lockup (2:08 AM)       (1800–1950| 1:00–1:05)
  // -------------------------------------------------------------------

  // Smooth cinematic transitions
  const cursorBlink = (frame % 20 < 10) ? 1 : 0;

  // Act I Typed text calculation
  const typedText = useMemo(() => {
    const fullText = "I have an idea. I don't have a team.";
    if (frame < 30) return "";
    const charCount = Math.min(fullText.length, Math.floor((frame - 30) * 0.45));
    return fullText.slice(0, charCount);
  }, [frame]);

  // Claude Response Text Calculation
  const claudeResponse = useMemo(() => {
    const fullResp = "Let's build your studio. Starting with the world.";
    if (frame < 180) return "";
    const charCount = Math.min(fullResp.length, Math.floor((frame - 180) * 0.5));
    return fullResp.slice(0, charCount);
  }, [frame]);

  // Pulse & Flash waves
  const act1Pulse = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const act3StageSpring = spring({
    frame: Math.max(0, frame - 660),
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const act4TimelineSpring = spring({
    frame: Math.max(0, frame - 1050),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const act5PullbackSpring = spring({
    frame: Math.max(0, frame - 1440),
    fps,
    config: { damping: 15, stiffness: 70 },
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#05070d',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* AUDIO ENGINE: SCORE, VOICEOVER & DIEGETIC SFX                  */}
      {/* ------------------------------------------------------------- */}
      {/* Cinematic Master Ambient Score Bed */}
      <Audio src={staticFile('audio/one_conversation_score.wav')} volume={0.7} />

      {/* Voiceover 01: The Hook (Frame 45–120 / ~2.3s) */}
      <Sequence from={45} durationInFrames={100}>
        <Audio src={staticFile('audio/voice_hook.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 02: Let's Build Your Studio (Frame 190–290 / ~2.8s) */}
      <Sequence from={190} durationInFrames={110}>
        <Audio src={staticFile('audio/voice_02_build.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 03: The Writers' Room (Frame 360–570 / ~6.5s) */}
      <Sequence from={360} durationInFrames={220}>
        <Audio src={staticFile('audio/voice_03_writers.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 04: The Production Stage (Frame 690–945 / ~8.0s) */}
      <Sequence from={690} durationInFrames={260}>
        <Audio src={staticFile('audio/voice_04_production.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 05: What Used To Take Months (Frame 1080–1220 / ~4.2s) */}
      <Sequence from={1080} durationInFrames={150}>
        <Audio src={staticFile('audio/voice_05_power.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 06: You Don't Need A Hundred People (Frame 1460–1580 / ~3.5s) */}
      <Sequence from={1460} durationInFrames={130}>
        <Audio src={staticFile('audio/voice_06_climax.wav')} volume={1.0} />
      </Sequence>

      {/* Voiceover 07: You Only Need One Conversation (Frame 1660–1760 / ~2.0s) */}
      <Sequence from={1660} durationInFrames={90}>
        <Audio src={staticFile('audio/voice_07_outro.wav')} volume={1.0} />
      </Sequence>

      {/* Sound Design: Mechanical Keyboard Typing Clicks */}
      {frame >= 30 && frame <= 110 && frame % 4 === 0 && (
        <Sequence from={frame} durationInFrames={6}>
          <Audio src={staticFile('sfx/typewriter_tap.wav')} volume={0.35} />
        </Sequence>
      )}

      {/* Sound Design: Claude Response Typing */}
      {frame >= 180 && frame <= 270 && frame % 5 === 0 && (
        <Sequence from={frame} durationInFrames={6}>
          <Audio src={staticFile('sfx/typewriter_tap.wav')} volume={0.25} />
        </Sequence>
      )}

      {/* Sound Design: Whoosh & Riser Transition SFX */}
      <Sequence from={145} durationInFrames={40}>
        <Audio src={staticFile('sfx/whoosh_sfx.wav')} volume={0.8} />
      </Sequence>
      <Sequence from={320} durationInFrames={50}>
        <Audio src={staticFile('sfx/fpv_whoosh.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={650} durationInFrames={60}>
        <Audio src={staticFile('sfx/whoosh_sfx.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={1040} durationInFrames={60}>
        <Audio src={staticFile('sfx/riser_sfx.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={1430} durationInFrames={60}>
        <Audio src={staticFile('sfx/fpv_impact.wav')} volume={0.85} />
      </Sequence>

      {/* ------------------------------------------------------------- */}
      {/* CINEMATIC LETTERBOX BARS (2.39:1 CinemaScope Frame)           */}
      {/* ------------------------------------------------------------- */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, backgroundColor: '#000000', zIndex: 100 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#000000', zIndex: 100 }} />

      {/* Top Bar Metadata HUD */}
      <div
        style={{
          position: 'absolute',
          top: 85,
          left: 90,
          right: 90,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 80,
          opacity: 0.85,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#94a3b8', fontFamily: 'monospace' }}>
            REC [60.00 FPS] · 4K MASTER
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
            {frame < 1800 ? 'TIME: 02:07:44 AM' : 'TIME: 02:08:44 AM'}
          </span>
          <span style={{ fontSize: 12, backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: 4, fontWeight: 800 }}>
            CLAUDE OPUS 5.5
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACT I: THE 2:07 AM SPARK (Frames 0–330)                        */}
      {/* ------------------------------------------------------------- */}
      {frame < 360 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: interpolate(frame, [300, 350], [1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Subtle Ambient Night Studio Background Glow */}
          <div
            style={{
              position: 'absolute',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(234, 88, 12, ${act1Pulse * 0.2}) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          {/* Minimalist Creator Chat UI Card */}
          <div
            style={{
              width: 820,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: '36px 44px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {/* User Input Prompt Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Solo Creator · 2:07 AM
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#ffffff', minHeight: 38, display: 'flex', alignItems: 'center' }}>
                <span>{typedText}</span>
                {frame < 150 && (
                  <span style={{ opacity: cursorBlink, color: '#38bdf8', marginLeft: 4, fontWeight: 300 }}>|</span>
                )}
              </div>
            </div>

            {/* Glowing Divider on Enter Key Hit */}
            {frame >= 150 && (
              <div
                style={{
                  height: 1,
                  backgroundColor: 'rgba(234, 88, 12, 0.5)',
                  boxShadow: '0 0 12px rgba(234, 88, 12, 0.8)',
                  width: `${Math.min(100, (frame - 150) * 8)}%`,
                }}
              />
            )}

            {/* Claude Response Output */}
            {frame >= 170 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  opacity: interpolate(frame, [170, 190], [0, 1]),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ea580c', boxShadow: '0 0 8px #ea580c' }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fb923c', letterSpacing: '0.06em' }}>
                    CLAUDE OPUS 5.5
                  </span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#fed7aa', minHeight: 36 }}>
                  {claudeResponse}
                  {frame < 300 && (
                    <span style={{ opacity: cursorBlink, color: '#fb923c', marginLeft: 4 }}>|</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACT II: THE WRITERS' ROOM (Frames 330–660)                     */}
      {/* ------------------------------------------------------------- */}
      {frame >= 320 && frame < 680 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [320, 360, 630, 670], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* Dimensional Screenplay Workspace */}
          <div
            style={{
              width: 1400,
              height: 680,
              display: 'flex',
              gap: 32,
              transform: `perspective(1200px) rotateX(${Math.sin(frame * 0.02) * 3}deg) rotateY(${-Math.cos(frame * 0.02) * 4}deg)`,
            }}
          >
            {/* Screenplay Document Sheet */}
            <div
              style={{
                flex: 1.4,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                padding: '36px 44px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#38bdf8', fontWeight: 700 }}>
                  DRAFT_01_SCENE_01.FDX
                </span>
                <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 800 }}>✓ BEAT LOCK SYNCHRONIZED</span>
              </div>

              <div style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: 18, color: '#f8fafc', lineHeight: 1.6 }}>
                <p style={{ color: '#94a3b8', margin: '4px 0' }}>INT. CYBERNETIC CITADEL - NIGHT (02:07 AM)</p>
                <p style={{ color: '#cbd5e1', margin: '8px 0' }}>
                  A torrential neon rain lashes against obsidian skyscraper spires.
                  On the steel parapet stands KAI (20s), eyes ablaze with golden neural fire.
                </p>
                <p style={{ color: '#f59e0b', margin: '8px 0', fontWeight: 700, textAlign: 'center' }}>KAI</p>
                <p style={{ color: '#e2e8f0', margin: '0 60px', textAlign: 'center', fontStyle: 'italic' }}>
                  "They said we needed an army. They forgot we have the spark."
                </p>
              </div>

              {/* Streaming Generation Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8' }}>
                  AGENT_WRITER: Drafting Act II Subplot · 1,420 words/sec
                </span>
              </div>
            </div>

            {/* Narrative Telemetry & Storyboard Cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Tension Curve Card */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>NARRATIVE TENSION DYNAMICS</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#f43f5e', fontFamily: 'monospace' }}>
                  TENSION: 94.2% [PEAK CLIMAX]
                </div>
                {/* Simulated SVG Emotion Wave */}
                <svg width="100%" height="60" viewBox="0 0 300 60">
                  <path
                    d="M 0 50 Q 75 10 150 35 T 300 15"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Character Voice Rig */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #38bdf8 0%, #1e40af 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>Character Identity: KAI</div>
                  <div style={{ fontSize: 12, color: '#38bdf8', fontFamily: 'monospace' }}>NEURAL TTS: AndrewNeural (Defiant, Bold)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACT III: CONCEPT ART & 3D VIRTUAL STAGE (Frames 660–1050)      */}
      {/* ------------------------------------------------------------- */}
      {frame >= 650 && frame < 1070 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [650, 690, 1010, 1060], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* 3D Virtual Production Viewport */}
          <div
            style={{
              width: 1460,
              height: 700,
              backgroundColor: '#030712',
              borderRadius: 20,
              border: '2px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 0 60px rgba(56, 189, 248, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Viewport Top HUD */}
            <div
              style={{
                padding: '16px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              }}
            >
              <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#f59e0b', fontWeight: 800 }}>
                CAMERA_01: ANAMORPHIC 35mm · f/1.4 · ISO 800
              </span>
              <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700 }}>
                UNREAL / REMOTION RAY-TRACING ENGINE: ACTIVE
              </span>
            </div>

            {/* Stylized Cyberpunk 3D City Visualization */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'radial-gradient(ellipse at 50% 60%, #1e1b4b 0%, #030712 100%)',
              }}
            >
              {/* Perspective Neon Grid Floor */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -100,
                  width: '180%',
                  height: 400,
                  transform: 'perspective(500px) rotateX(75deg)',
                  backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Distant Cyberpunk Skyscrapers */}
              <div style={{ position: 'absolute', bottom: 120, display: 'flex', gap: 24, alignItems: 'flex-end', opacity: 0.8 }}>
                {[180, 260, 320, 240, 380, 210, 290].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: h,
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Window Lights */}
                    <div style={{ position: 'absolute', inset: 4, backgroundImage: 'radial-gradient(#fde047 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  </div>
                ))}
              </div>

              {/* Hero Silhouette on Parapet */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 120,
                  width: 80,
                  height: 140,
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0f172a 100%)',
                  clipPath: 'polygon(50% 0%, 75% 20%, 65% 100%, 35% 100%, 25% 20%)',
                  boxShadow: '0 0 35px #38bdf8',
                  transform: `scale(${1 + Math.sin(frame * 0.1) * 0.02})`,
                }}
              />

              {/* Volumetric Anamorphic Lens Flare */}
              <div
                style={{
                  position: 'absolute',
                  width: '120%',
                  height: 4,
                  backgroundColor: 'rgba(56, 189, 248, 0.8)',
                  boxShadow: '0 0 40px #38bdf8, 0 0 80px #818cf8',
                  transform: `translateY(${Math.sin(frame * 0.05) * 15}px)`,
                }}
              />

              {/* 3D Camera Frustum Targeting Reticle */}
              <div
                style={{
                  position: 'absolute',
                  width: 320,
                  height: 200,
                  border: '1px dashed #f59e0b',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: 12, height: 12, border: '2px solid #ef4444', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACT IV: THE EDIT SUITE & SOUND STAGE (Frames 1050–1440)       */}
      {/* ------------------------------------------------------------- */}
      {frame >= 1040 && frame < 1460 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 100px',
            opacity: interpolate(frame, [1040, 1080, 1400, 1450], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* High-Tech NLE Timeline Interface */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 20,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: 30,
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>TIMELINE MASTER: CONVERSATION_CLIMAX.PROJ</span>
                <span style={{ fontSize: 11, backgroundColor: '#10b981', color: '#042f2e', padding: '3px 8px', borderRadius: 4, fontWeight: 900 }}>
                  REALTIME 60FPS
                </span>
              </div>
              <span style={{ fontSize: 14, fontFamily: 'monospace', color: '#38bdf8', fontWeight: 800 }}>
                16 TRACKS CONVERGED
              </span>
            </div>

            {/* Video Tracks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* V1: 4K Master Video Plates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 42, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 8, padding: '0 16px' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 35 }}>V1</span>
                <div style={{ flex: 1, height: 26, backgroundColor: '#0284c7', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 12px', color: '#ffffff', fontSize: 12, fontWeight: 700 }}>
                  Scene01_WideShot_4K.mov [Rec.709 LUT Applied]
                </div>
              </div>

              {/* V2: 3D VFX Particle Overlay */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 42, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 8, padding: '0 16px' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 35 }}>V2</span>
                <div style={{ flex: 1, height: 26, backgroundColor: '#8b5cf6', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 12px', color: '#ffffff', fontSize: 12, fontWeight: 700 }}>
                  RayTraced_AnamorphicFlares.exr [Composite: Add]
                </div>
              </div>

              {/* A1: Orchestral Score Bed */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 42, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 8, padding: '0 16px' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 35 }}>A1</span>
                <div style={{ flex: 1, height: 26, backgroundColor: '#f59e0b', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 12px', color: '#451a03', fontSize: 12, fontWeight: 900 }}>
                  Orchestral_Strings_Crescendo.wav [-14 LUFS Broadcast]
                </div>
              </div>

              {/* A2: Dialogue Master (AndrewNeural) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 42, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 8, padding: '0 16px' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 35 }}>A2</span>
                <div style={{ flex: 1, height: 26, backgroundColor: '#ec4899', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 12px', color: '#ffffff', fontSize: 12, fontWeight: 700 }}>
                  NeuralVoice_Master.wav [De-essed & Balanced]
                </div>
              </div>
            </div>

            {/* Moving Playhead Red Line */}
            <div
              style={{
                position: 'relative',
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: `${((frame - 1050) / 390) * 100}%`,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 10px #ef4444',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACT V: THE GREAT PULL-BACK & CLIMAX (Frames 1440–1800)         */}
      {/* ------------------------------------------------------------- */}
      {frame >= 1430 && frame < 1820 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: interpolate(frame, [1430, 1470, 1770, 1810], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* Volumetric Radial Light Burst */}
          <div
            style={{
              position: 'absolute',
              width: 900,
              height: 900,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 88, 12, 0.25) 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: `scale(${1 + Math.sin(frame * 0.1) * 0.05})`,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 24,
              zIndex: 30,
              transform: `scale(${interpolate(act5PullbackSpring, [0, 1], [0.85, 1])})`,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                border: '1px solid rgba(234, 88, 12, 0.4)',
                padding: '8px 24px',
                borderRadius: 30,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#fb923c',
              }}
            >
              AN ENTIRE FILM STUDIO IN ONE THREAD
            </div>

            <h1
              style={{
                fontSize: 58,
                fontWeight: 900,
                margin: 0,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                maxWidth: 1200,
              }}
            >
              You don't need a hundred people to tell a story.
            </h1>

            <p
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                color: '#38bdf8',
                letterSpacing: '-0.01em',
              }}
            >
              You only need one conversation.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACT VI: THE OUTRO & LOCKUP (Frames 1800–1950)                  */}
      {/* ------------------------------------------------------------- */}
      {frame >= 1790 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#030712',
            opacity: interpolate(frame, [1790, 1830], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
            }}
          >
            {/* Clock Badge */}
            <div
              style={{
                fontSize: 14,
                fontFamily: 'monospace',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '6px 18px',
                borderRadius: 20,
                color: '#38bdf8',
                fontWeight: 800,
              }}
            >
              02:08 AM · EXACTLY 60 SECONDS LATER
            </div>

            {/* Master Title */}
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                margin: 0,
                color: '#ffffff',
                textShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
              }}
            >
              ONE CONVERSATION.
            </h1>

            {/* Subtitle Credits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em' }}>
                Written, Scored, Directed & Rendered in Code.
              </div>
              <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#fb923c', fontWeight: 800 }}>
                Powered by Claude Opus 5.5 & REA Engine.
              </div>
            </div>

            {/* Completion Pill */}
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                padding: '10px 24px',
                borderRadius: 30,
                color: '#34d399',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              <span>✓</span>
              <span>FILM RENDER COMPLETE: 4K MASTER PRODUCED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
