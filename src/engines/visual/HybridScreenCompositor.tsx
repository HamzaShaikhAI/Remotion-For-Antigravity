import React from 'react';
import {
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export interface ScreenCallout {
  id: string;
  startFrame: number;
  durationFrames: number;
  targetPoint: { x: number; y: number };
  badgePosition: { x: number; y: number };
  title: string;
  description?: string;
  tag?: string;
  variant?: 'glass' | 'cyber' | 'hardware' | 'warning' | 'success';
  pulseReticle?: boolean;
  leaderLine?: boolean;
  scale?: number;
}

export interface CameraKeyframe {
  frame: number;
  scale: number;
  focalPoint: { x: number; y: number };
  durationFrames?: number;
}

export interface SplitScreenConfig {
  enabled: boolean;
  secondaryVideoSrc?: string;
  dividerPosition?: number;
  direction?: 'horizontal' | 'vertical';
  labelA?: string;
  labelB?: string;
  dividerColor?: string;
}

export interface HybridScreenCompositorProps {
  videoSrc: string;
  playbackRate?: number;
  startFrom?: number;
  endAt?: number;
  volume?: number;
  muted?: boolean;
  cameraKeyframes?: CameraKeyframe[];
  callouts?: ScreenCallout[];
  splitScreen?: SplitScreenConfig;
  ambientBackdrop?: boolean;
  glassMockupFrame?: boolean;
  mockupTitle?: string;
  hudOverlay?: {
    enabled?: boolean;
    fpsTelemetry?: number;
    gpuModel?: string;
    vramUsage?: string;
    latencyMs?: number;
    modeBadge?: string;
  };
  width?: number;
  height?: number;
}

const VARIANT_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  glass: {
    border: 'rgba(59, 130, 246, 0.45)',
    bg: 'rgba(15, 23, 42, 0.88)',
    text: '#93C5FD',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  cyber: {
    border: 'rgba(0, 245, 255, 0.55)',
    bg: 'rgba(8, 14, 26, 0.92)',
    text: '#22D3EE',
    glow: 'rgba(0, 245, 255, 0.45)',
  },
  hardware: {
    border: 'rgba(245, 158, 11, 0.55)',
    bg: 'rgba(20, 16, 10, 0.92)',
    text: '#FCD34D',
    glow: 'rgba(245, 158, 11, 0.45)',
  },
  warning: {
    border: 'rgba(239, 68, 68, 0.55)',
    bg: 'rgba(28, 10, 12, 0.92)',
    text: '#FCA5A5',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
  success: {
    border: 'rgba(16, 185, 129, 0.55)',
    bg: 'rgba(6, 26, 18, 0.92)',
    text: '#6EE7B7',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
};

/**
 * HybridScreenCompositor
 * Bridges real-world screen recordings (OBS, terminal captures, live localhost dashboards,
 * GPU gaming benchmarks) directly into Remotion via <OffthreadVideo>.
 * Enriches raw video with dynamic spring-camera pan-and-scan, interactive callouts with
 * radar reticles & Bezier leader lines, and real-time telemetry HUDs.
 */
export const HybridScreenCompositor: React.FC<HybridScreenCompositorProps> = ({
  videoSrc,
  playbackRate = 1.0,
  startFrom = 0,
  endAt,
  volume = 0.5,
  muted = false,
  cameraKeyframes = [],
  callouts = [],
  splitScreen,
  ambientBackdrop = true,
  glassMockupFrame = true,
  mockupTitle = 'OBS Screen Capture // Production Telemetry',
  hudOverlay = { enabled: true, fpsTelemetry: 60.0, modeBadge: 'HYBRID COMPOSITOR' },
  width = 1080,
  height = 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute camera pan-and-scan coordinates deterministically across keyframes
  let currentScale = 1.0;
  let currentFocalX = width / 2;
  let currentFocalY = height / 2;

  if (cameraKeyframes.length > 0) {
    let activeIdx = 0;
    for (let i = 0; i < cameraKeyframes.length; i++) {
      if (frame >= cameraKeyframes[i].frame) {
        activeIdx = i;
      }
    }

    const currentKey = cameraKeyframes[activeIdx];
    const nextKey = cameraKeyframes[activeIdx + 1];

    if (!nextKey) {
      currentScale = currentKey.scale;
      currentFocalX = currentKey.focalPoint.x;
      currentFocalY = currentKey.focalPoint.y;
    } else {
      const transDuration = currentKey.durationFrames || 45;
      const progress = spring({
        frame: frame - nextKey.frame,
        fps,
        config: { damping: 18, stiffness: 80 },
      });

      const clamped = Math.max(0, Math.min(1, progress));
      currentScale = interpolate(clamped, [0, 1], [currentKey.scale, nextKey.scale]);
      currentFocalX = interpolate(clamped, [0, 1], [currentKey.focalPoint.x, nextKey.focalPoint.x]);
      currentFocalY = interpolate(clamped, [0, 1], [currentKey.focalPoint.y, nextKey.focalPoint.y]);
    }
  }

  // Calculate pan translation relative to center
  const originX = width / 2;
  const originY = height / 2;
  const translateX = (originX - currentFocalX) * (currentScale - 1);
  const translateY = (originY - currentFocalY) * (currentScale - 1);

  // Device mockup dimensions (fills 9:16 vertical viewport comfortably)
  const mockupWidth = 980;
  const mockupHeight = 1520;
  const mockupLeft = (width - mockupWidth) / 2;
  const mockupTop = 160;

  // Split screen divider position
  const dividerRatio = splitScreen?.dividerPosition ?? 0.5;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#05070D',
      }}
    >
      {/* 1. Ambient Blurred Backdrop: Eliminates black bars on vertical screens */}
      {ambientBackdrop && (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            overflow: 'hidden',
            filter: 'blur(50px) brightness(0.45) saturate(1.4)',
            opacity: 0.65,
            transform: 'scale(1.15)',
            pointerEvents: 'none',
          }}
        >
          <OffthreadVideo
            src={staticFile(videoSrc)}
            playbackRate={playbackRate}
            startFrom={startFrom}
            endAt={endAt}
            volume={0}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* 2. Main Video Presentation Layer with Spring Camera Zoom */}
      <div
        style={{
          position: 'absolute',
          left: glassMockupFrame ? mockupLeft : 0,
          top: glassMockupFrame ? mockupTop : 0,
          width: glassMockupFrame ? mockupWidth : width,
          height: glassMockupFrame ? mockupHeight : height,
          borderRadius: glassMockupFrame ? 28 : 0,
          overflow: 'hidden',
          backgroundColor: '#0A0F1D',
          border: glassMockupFrame ? '1px solid rgba(255, 255, 255, 0.16)' : 'none',
          boxShadow: glassMockupFrame
            ? '0 30px 80px -20px rgba(0, 0, 0, 0.85), 0 0 40px rgba(59, 130, 246, 0.15)'
            : 'none',
        }}
      >
        {/* Device Frame Top Bar (macOS / Studio Aesthetic) */}
        {glassMockupFrame && (
          <div
            style={{
              height: 48,
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              zIndex: 30,
              position: 'relative',
            }}
          >
            {/* Window Traffic Lights */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

            {/* Window Title */}
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13,
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ color: '#38BDF8' }}>●</span> {mockupTitle}
            </div>

            {/* Live Indicator Chip */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34D399',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              REC OFFTHREAD
            </div>
          </div>
        )}

        {/* Video Canvas Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: glassMockupFrame ? mockupHeight - 48 : height,
            overflow: 'hidden',
          }}
        >
          {/* Main Video Layer */}
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`,
              transformOrigin: `${currentFocalX}px ${currentFocalY}px`,
              transition: 'transform 0.05s ease-out',
            }}
          >
            {splitScreen?.enabled && splitScreen.secondaryVideoSrc ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Secondary Video (Left / Top) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `polygon(0 0, ${dividerRatio * 100}% 0, ${dividerRatio * 100}% 100%, 0 100%)`,
                  }}
                >
                  <OffthreadVideo
                    src={staticFile(splitScreen.secondaryVideoSrc)}
                    playbackRate={playbackRate}
                    startFrom={startFrom}
                    endAt={endAt}
                    volume={0}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {splitScreen.labelA && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 24,
                        left: 24,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '6px 14px',
                        borderRadius: 8,
                        color: '#F8FAFC',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {splitScreen.labelA}
                    </div>
                  )}
                </div>

                {/* Primary Video (Right / Bottom) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `polygon(${dividerRatio * 100}% 0, 100% 0, 100% 100%, ${dividerRatio * 100}% 100%)`,
                  }}
                >
                  <OffthreadVideo
                    src={staticFile(videoSrc)}
                    playbackRate={playbackRate}
                    startFrom={startFrom}
                    endAt={endAt}
                    volume={muted ? 0 : volume}
                    muted={muted}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {splitScreen.labelB && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '6px 14px',
                        borderRadius: 8,
                        color: '#FFFFFF',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {splitScreen.labelB}
                    </div>
                  )}
                </div>

                {/* Split Divider Neon Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${dividerRatio * 100}%`,
                    width: 3,
                    backgroundColor: splitScreen.dividerColor || '#38BDF8',
                    boxShadow: '0 0 16px #38BDF8',
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
            ) : (
              <OffthreadVideo
                src={staticFile(videoSrc)}
                playbackRate={playbackRate}
                startFrom={startFrom}
                endAt={endAt}
                volume={muted ? 0 : volume}
                muted={muted}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>

          {/* Vignette Rim Filter */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.6) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Real-time Telemetry HUD Overlay */}
          {hudOverlay.enabled && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                display: 'flex',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                zIndex: 40,
              }}
            >
              {/* Left HUD: Pipeline Mode */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#38BDF8',
                    boxShadow: '0 0 10px #38BDF8',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#F8FAFC',
                    letterSpacing: '0.05em',
                  }}
                >
                  {hudOverlay.modeBadge || 'REA COMPOSITOR'}
                </span>
                {hudOverlay.gpuModel && (
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      color: '#94A3B8',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                      paddingLeft: 8,
                    }}
                  >
                    {hudOverlay.gpuModel}
                  </span>
                )}
              </div>

              {/* Right HUD: Metrics Readout */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#34D399',
                }}
              >
                <div>
                  FPS: <span style={{ color: '#FFFFFF' }}>{(hudOverlay.fpsTelemetry || 60.0).toFixed(1)}</span>
                </div>
                {hudOverlay.latencyMs !== undefined && (
                  <div style={{ color: '#94A3B8' }}>
                    PING: <span style={{ color: '#38BDF8' }}>{hudOverlay.latencyMs}ms</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Spring-Physics Callout Overlays */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {callouts.map((callout) => {
          if (frame < callout.startFrame || frame > callout.startFrame + callout.durationFrames) {
            return null;
          }

          const localFrame = frame - callout.startFrame;
          const enterProgress = spring({
            frame: localFrame,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          // Exit fade
          const exitStart = callout.durationFrames - 15;
          const exitProgress = localFrame >= exitStart ? (localFrame - exitStart) / 15 : 0;
          const opacity = Math.max(0, Math.min(1, enterProgress)) * (1 - exitProgress);

          const variant = callout.variant || 'glass';
          const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.glass;

          // Reticle coordinates
          const tx = callout.targetPoint.x;
          const ty = callout.targetPoint.y;
          const bx = callout.badgePosition.x;
          const by = callout.badgePosition.y;

          // Animated Leader Line Path
          const dx = bx - tx;
          const dy = by - ty;
          const midX = tx + dx * 0.5;
          const pathD = `M ${tx} ${ty} Q ${midX} ${ty} ${bx} ${by}`;

          const lineLength = Math.sqrt(dx * dx + dy * dy) * 1.2;
          const strokeDashoffset = interpolate(enterProgress, [0, 1], [lineLength, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <g key={callout.id} opacity={opacity}>
              {/* Leader Line */}
              {callout.leaderLine !== false && (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={colors.glow}
                    strokeWidth={5}
                    strokeDasharray={lineLength}
                    strokeDashoffset={strokeDashoffset}
                    opacity={0.4}
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={2}
                    strokeDasharray={lineLength}
                    strokeDashoffset={strokeDashoffset}
                  />
                </>
              )}

              {/* Target Reticle (Pulsing Radar / Brackets) */}
              {callout.pulseReticle !== false && (
                <g transform={`translate(${tx}, ${ty})`}>
                  {/* Central Focal Dot */}
                  <circle r={4} fill={colors.text} />
                  {/* Pulse Wave */}
                  <circle
                    r={18 + (localFrame % 30) * 0.8}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={1.5}
                    opacity={Math.max(0, 1 - (localFrame % 30) / 30)}
                  />
                  {/* Outer Targeting Brackets */}
                  <path
                    d="M -14 -8 L -14 -14 L -8 -14 M 8 -14 L 14 -14 L 14 -8 M 14 8 L 14 14 L 8 14 M -8 14 L -14 14 L -14 8"
                    fill="none"
                    stroke={colors.text}
                    strokeWidth={2}
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* 4. HTML Callout Glassmorphic Badges */}
      {callouts.map((callout) => {
        if (frame < callout.startFrame || frame > callout.startFrame + callout.durationFrames) {
          return null;
        }

        const localFrame = frame - callout.startFrame;
        const enterProgress = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const exitStart = callout.durationFrames - 15;
        const exitProgress = localFrame >= exitStart ? (localFrame - exitStart) / 15 : 0;
        const opacity = Math.max(0, Math.min(1, enterProgress)) * (1 - exitProgress);
        const scale = interpolate(enterProgress, [0, 1], [0.85, 1.0]) * (callout.scale || 1.0);

        const variant = callout.variant || 'glass';
        const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.glass;

        return (
          <div
            key={`badge_${callout.id}`}
            style={{
              position: 'absolute',
              left: callout.badgePosition.x,
              top: callout.badgePosition.y,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              opacity,
              zIndex: 60,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                backgroundColor: colors.bg,
                backdropFilter: 'blur(20px)',
                border: `1.5px solid ${colors.border}`,
                borderRadius: 16,
                padding: '16px 22px',
                boxShadow: `0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px ${colors.glow}`,
                maxWidth: 380,
              }}
            >
              {/* Badge Tag Header */}
              {callout.tag && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 10px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${colors.border}`,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.text,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                    letterSpacing: '0.06em',
                  }}
                >
                  <span style={{ fontSize: 9 }}>▶</span> {callout.tag}
                </div>
              )}

              {/* Title */}
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  marginBottom: callout.description ? 6 : 0,
                }}
              >
                {callout.title}
              </div>

              {/* Description */}
              {callout.description && (
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    color: '#94A3B8',
                    lineHeight: 1.45,
                  }}
                >
                  {callout.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
