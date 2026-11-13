import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from 'remotion';

export interface Chapter {
  startFrame: number;
  endFrame: number;
  chapterNumber: string;
  chapterTitle: string;
  subtitleEn: string;
  subtitleHi: string;
}

const CHAPTERS: Chapter[] = [
  // Act I: frames 0 to 384 (0s - 16s)
  {
    startFrame: 0,
    endFrame: 96,
    chapterNumber: 'ACT I',
    chapterTitle: 'THE COAL & THE COPPER',
    subtitleEn: 'Soot Island. Under Boss Aggron, Pokémon miners toil in the suffocating dust.',
    subtitleHi: 'सूट द्वीप: बॉस एग्रोन के कठोर नियंत्रण में मजदूर पोकेमोन दिन-रात पसीना बहाते हैं।',
  },
  {
    startFrame: 96,
    endFrame: 288,
    chapterNumber: 'ACT I',
    chapterTitle: 'THE COAL & THE COPPER',
    subtitleEn: 'Breaking iron ore for hours, only to receive a few worthless copper coins.',
    subtitleHi: 'घंटों की कड़ी मेहनत के बदले बॉस एग्रोन केवल कुछ तांबे के सिक्के फेंकता है।',
  },
  {
    startFrame: 288,
    endFrame: 384,
    chapterNumber: 'ACT I',
    chapterTitle: 'DESPAIR',
    subtitleEn: '"Is this all our sweat and blood is worth?"',
    subtitleHi: '"क्या हमारे पसीने और मेहनत की कीमत सिर्फ इतनी है?"',
  },

  // Act II: frames 384 to 768 (16s - 32s)
  {
    startFrame: 384,
    endFrame: 576,
    chapterNumber: 'ACT II',
    chapterTitle: 'THE PRICE OF LIFE',
    subtitleEn: 'Returning home exhausted, Lucario finds young Riolu burning with fever.',
    subtitleHi: 'घर लौटने पर ल्यूकारियो देखता है कि छोटा रियोलू तेज बुखार से तड़प रहा है।',
  },
  {
    startFrame: 576,
    endFrame: 768,
    chapterNumber: 'ACT II',
    chapterTitle: 'THE PRICE OF LIFE',
    subtitleEn: 'Life-saving medicine costs 5,000 Silver Coins. The mine pays in copper.',
    subtitleHi: 'दवा के लिए 5,000 चांदी के सिक्के चाहिए, जबकि खदान केवल तांबे देती है।',
  },

  // Act III: frames 768 to 1200 (32s - 50s)
  {
    startFrame: 768,
    endFrame: 960,
    chapterNumber: 'ACT III',
    chapterTitle: 'AURA AWAKENING',
    subtitleEn: 'Igniting his inner aura, Lucario refuses to bow to fate.',
    subtitleHi: 'अपनी आभा ऊर्जा को जगाते हुए, ल्यूकारियो ने अपनी नियति बदलने की कसम खाई।',
  },
  {
    startFrame: 960,
    endFrame: 1200,
    chapterNumber: 'ACT III',
    chapterTitle: 'THE GHOST SHIP',
    subtitleEn: 'At the abandoned sea yard, they discover a colossal rusted cargo freighter.',
    subtitleHi: 'तटीय यार्ड में उन्हें एक विशाल लावारिस मालवाहक जहाज मिलता है।',
  },

  // Act IV: frames 1200 to 1536 (50s - 64s)
  {
    startFrame: 1200,
    endFrame: 1392,
    chapterNumber: 'ACT IV',
    chapterTitle: 'TITAN OF STEEL',
    subtitleEn: 'Enter Melmetal: The mythical master of heavy metallurgical engineering.',
    subtitleHi: 'मेलमेटल का आगमन: भारी धातुकर्म और समुद्री इंजीनियरिंग का पौराणिक उस्ताद।',
  },
  {
    startFrame: 1392,
    endFrame: 1536,
    chapterNumber: 'ACT IV',
    chapterTitle: 'THE ALLIANCE',
    subtitleEn: 'An unbreakable pact is forged: Equal partners in Poké Vypar Shipping.',
    subtitleHi: 'एक अटूट साझेदारी तय हुई: पोके व्यापार शिपिंग में बराबर की हिस्सेदारी।',
  },

  // Act V: frames 1536 to 1896 (64s - 79s)
  {
    startFrame: 1536,
    endFrame: 1728,
    chapterNumber: 'ACT V',
    chapterTitle: 'REBIRTH OF THE TITAN',
    subtitleEn: 'Aura-welding the iron hull and rebuilding the titanic steam turbines.',
    subtitleHi: 'आभा वेल्डिंग से लोहे के ढाँचे की मरम्मत और विशाल इंजनों का पुनर्निर्माण।',
  },
  {
    startFrame: 1728,
    endFrame: 1896,
    chapterNumber: 'ACT V',
    chapterTitle: 'POKÉ VYPAR RISES',
    subtitleEn: 'The great engine roars back to life. The voyage of independence begins!',
    subtitleHi: 'विशाल इंजन दहाड़ उठा। स्वतंत्रता और समृद्धि की पहली समुद्री यात्रा शुरू!',
  },
];

export const PokeVyparMovie: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Active Chapter detection
  const currentChapter = CHAPTERS.find(
    (c) => frame >= c.startFrame && frame < c.endFrame
  ) || CHAPTERS[CHAPTERS.length - 1];

  // Intro Title Card (Frames 0 to 80)
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const introOpacity = interpolate(frame, [0, 15, 65, 80], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro Title Card (Frames 1780 to 1896)
  const outroOpacity = interpolate(frame, [1780, 1810, 1896], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#000000',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 1. Underlying 79-Second Master Video */}
      <Video
        src={staticFile('clips/pokevypar_master_story.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* 2. Cinematic 2.35:1 Letterbox Black Bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: '#000000',
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: '#000000',
          zIndex: 10,
        }}
      />

      {/* 3. Subtle Vignette & Contrast Grade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 65%, rgba(0, 0, 0, 0.45) 100%)',
          pointerEvents: 'none',
          zIndex: 11,
        }}
      />

      {/* 4. Top-Left Chapter & Series Marker */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 8,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              boxShadow: '0 0 8px #F59E0B',
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 800,
              color: '#F59E0B',
              letterSpacing: '0.08em',
            }}
          >
            {currentChapter.chapterNumber}
          </span>
          <span style={{ color: '#64748B', fontSize: 12 }}>|</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#F1F5F9',
              letterSpacing: '0.04em',
            }}
          >
            {currentChapter.chapterTitle}
          </span>
        </div>
      </div>

      {/* 5. Top-Right Series Watermark */}
      <div
        style={{
          position: 'absolute',
          top: 62,
          right: 40,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          fontWeight: 800,
          color: 'rgba(255, 255, 255, 0.75)',
          letterSpacing: '0.12em',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 20,
        }}
      >
        POKÉ VYPAR • S1:E1
      </div>

      {/* 6. Bilingual Cinematic Subtitles (Centered above bottom letterbox) */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 25,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: 10,
            padding: '10px 24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
            maxWidth: 1000,
          }}
        >
          {/* English Subtitle */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 650,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              marginBottom: 4,
            }}
          >
            {currentChapter.subtitleEn}
          </div>
          {/* Hindi Subtitle */}
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: '#FACC15',
              letterSpacing: '0.01em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
            }}
          >
            {currentChapter.subtitleHi}
          </div>
        </div>
      </div>

      {/* 7. Dramatic Opening Card (Frames 0 to 80) */}
      {introOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(4, 6, 12, ${0.9 * introOpacity})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: introOpacity,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 700,
              color: '#38BDF8',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Antigravity Studios Presents
          </div>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              textShadow: '0 0 30px rgba(56, 189, 248, 0.6)',
              margin: 0,
            }}
          >
            POKÉ VYPAR
          </h1>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#FACC15',
              marginTop: 4,
              letterSpacing: '0.04em',
            }}
          >
            पोके व्यापार
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: '#94A3B8',
              marginTop: 18,
              letterSpacing: '0.08em',
            }}
          >
            Episode 1: The Soot Island Chronicles
          </div>
        </div>
      )}

      {/* 8. Dramatic Closing Card (Frames 1780 to 1896) */}
      {outroOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(4, 6, 12, ${0.85 * outroOpacity})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: outroOpacity,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.1em',
              margin: 0,
              textShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
            }}
          >
            TO BE CONTINUED
          </h2>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#FACC15',
              marginTop: 12,
            }}
          >
            पोके व्यापार • एपिसोड 2 जल्द ही
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 600,
              color: '#94A3B8',
              marginTop: 24,
              letterSpacing: '0.08em',
            }}
          >
            Mastered & Rendered via Google Antigravity REA Engine
          </div>
        </div>
      )}
    </div>
  );
};
