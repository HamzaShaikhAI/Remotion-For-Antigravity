import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  MOTION_LAB_CARDS,
  MotionLabBackground,
  MotionLabBrowserCard,
  MotionLabBentoGrid,
  MotionLabNav,
  MotionLabCategory,
} from '../engines/motionlab';

export const MotionLabShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Timeline Act Boundaries (30 seconds @ 60 FPS = 1800 frames)
  // Act 1: Video       (frames 0 - 380)
  // Act 2: Motion      (frames 380 - 760)
  // Act 3: 3D          (frames 760 - 1140)
  // Act 4: Finish      (frames 1140 - 1460)
  // Climax: Bento Grid (frames 1460 - 1800)

  const isBentoAct = frame >= 1460;

  // Determine current active act & category
  let currentCategory: MotionLabCategory = 'video';
  let actNumber = '01 / 04';
  let actTitle = 'Video';
  let activeCardIndex = 0; // 01 HyperFrames
  let nextCardIndex = 1;   // 02 Remotion
  let actLocalFrame = frame;

  if (frame < 380) {
    currentCategory = 'video';
    actNumber = '01 / 04';
    actTitle = 'Video';
    activeCardIndex = 0; // 01 HyperFrames
    nextCardIndex = 1;   // 02 Remotion
    actLocalFrame = frame;
  } else if (frame < 760) {
    currentCategory = 'motion';
    actNumber = '02 / 04';
    actTitle = 'Motion';
    activeCardIndex = 4; // 05 GSAP Skills
    nextCardIndex = 6;   // 07 video-shotcraft
    actLocalFrame = frame - 380;
  } else if (frame < 1140) {
    currentCategory = '3d';
    actNumber = '03 / 04';
    actTitle = '3D';
    activeCardIndex = 8; // 09 Three.js
    nextCardIndex = 10;  // 11 Blender MCP
    actLocalFrame = frame - 760;
  } else {
    currentCategory = 'finish';
    actNumber = '04 / 04';
    actTitle = 'Finish';
    activeCardIndex = 12; // 13 ComfyUI
    nextCardIndex = 14;   // 15 FFmpeg
    actLocalFrame = frame - 1140;
  }

  // Global Progress for background sky interpolation (0..1)
  const globalProgress = interpolate(frame, [0, 1500], [0, 1.0], {
    extrapolateRight: 'clamp',
  });

  // Dynamic installed skills counter
  const installedCount = Math.min(
    16,
    Math.floor(interpolate(frame, [0, 1500], [1, 16], { extrapolateRight: 'clamp' }))
  );

  // Act Transition Swipe Physics
  // Swipes into view during first 30 frames of each act
  const swipeEntrance = spring({
    frame: actLocalFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.9 },
  });

  // Carousel card offset for active and peeking cards
  // swipeEntrance goes from 0 to 1
  const activeCardOffset = interpolate(swipeEntrance, [0, 1], [0.65, 0.0]);
  const nextCardOffset = interpolate(swipeEntrance, [0, 1], [1.5, 0.95]);

  // Zoom-out transition when morphing into Bento Grid at frame 1460
  const bentoTransition = spring({
    frame: frame - 1460,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const carouselExitOpacity = interpolate(bentoTransition, [0, 0.3], [1.0, 0.0], {
    extrapolateRight: 'clamp',
  });
  const carouselExitScale = interpolate(bentoTransition, [0, 1], [1.0, 0.75]);

  const activeCard = MOTION_LAB_CARDS[activeCardIndex];
  const nextCard = MOTION_LAB_CARDS[nextCardIndex];

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        backgroundColor: '#0c0f18',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* 1. Atmospheric Morphing Pastel Sky & Bubbles */}
      <MotionLabBackground progress={globalProgress} frame={frame} isFinishAct={frame >= 1140} />

      {/* 2. Top Header & Navigation Dock */}
      <MotionLabNav
        currentCategory={currentCategory}
        actNumber={actNumber}
        actTitle={actTitle}
        installedCount={installedCount}
        frame={frame}
        hideDock={isBentoAct}
      />

      {/* 3. 3D Glassmorphic Browser Card Carousel (Acts 1-4) */}
      {!isBentoAct && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            perspective: 1400,
            transformStyle: 'preserve-3d',
            opacity: carouselExitOpacity,
            transform: `scale(${carouselExitScale})`,
            pointerEvents: 'none',
          }}
        >
          {/* Peeking Next Card on the Right */}
          {nextCard && (
            <MotionLabBrowserCard
              card={nextCard}
              frame={frame}
              carouselProgress={nextCardOffset}
            />
          )}

          {/* Featured Active Card Centered */}
          {activeCard && (
            <MotionLabBrowserCard
              card={activeCard}
              frame={frame}
              carouselProgress={activeCardOffset}
            />
          )}
        </div>
      )}

      {/* 4. Climax Resolution: 4x4 Bento Glass Grid (Frame 1460+) */}
      {isBentoAct && (
        <MotionLabBentoGrid frame={frame} gridEntranceFrame={1460} />
      )}
    </AbsoluteFill>
  );
};
