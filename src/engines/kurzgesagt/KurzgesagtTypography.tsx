// src/engines/kurzgesagt/KurzgesagtTypography.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CaptionPillProps } from './types';

// Ease-out-quint curve: 1 - (1 - t)^5
function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 5);
}

/**
 * Kurzgesagt Caption Pill
 * Text rises 1.3x its own height through an overflow clip on an ease-out-quint curve.
 * Sits in a rounded pill of rgb(6,20,40) at 62%.
 */
export const KurzgesagtCaptionPill: React.FC<CaptionPillProps> = ({
  text,
  color = '#f8fafc',
  letterSpacing = 4,
  entranceProgress = 1.0,
  style = {},
}) => {
  const eased = easeOutQuint(entranceProgress);
  const translateY = (1.0 - eased) * 130; // 1.3x height rise through clip

  return (
    <div
      style={{
        display: 'inline-block',
        background: 'rgba(6, 20, 40, 0.62)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '30px',
        padding: '12px 28px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}%)`,
          fontFamily: '"Fredoka", -apple-system, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          letterSpacing: `${letterSpacing}px`,
          textTransform: 'uppercase',
          color,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}
      >
        {text.replace(/\./g, '')} {/* Rule: NO FULL STOPS in on-screen text */}
      </div>
    </div>
  );
};

/**
 * 8:20 Countdown Clock Widget
 * Slams from 1.7x to 1x on a damped spring and turns gold at 0:00
 */
export interface CountdownClockProps {
  secondsRemaining: number; // 500 (8:20) down to 0
  startFrame?: number;
  label?: string;
}

export const KurzgesagtCountdownClock: React.FC<CountdownClockProps> = ({
  secondsRemaining,
  startFrame = 0,
  label = 'LAST LIGHT',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring (slams from 1.7x to 1x)
  const springProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const scale = interpolate(springProgress, [0, 1], [1.7, 1.0]);
  const isZero = secondsRemaining <= 0;
  const clockColor = isZero ? '#ffd98a' : '#8fd8e6';

  const mins = Math.floor(Math.max(0, secondsRemaining) / 60);
  const secs = Math.floor(Math.max(0, secondsRemaining) % 60);
  const timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
        background: 'rgba(6, 20, 40, 0.78)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${clockColor}`,
        borderRadius: '20px',
        padding: '14px 28px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${isZero ? 'rgba(255, 217, 138, 0.4)' : 'rgba(143, 216, 230, 0.25)'}`,
      }}
    >
      <span
        style={{
          fontFamily: '"Fredoka", -apple-system, sans-serif',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '3px',
          color: clockColor,
          marginBottom: '2px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"SF Pro Display", monospace',
          fontWeight: 900,
          fontSize: '44px',
          letterSpacing: '-0.02em',
          color: isZero ? '#ffd98a' : '#ffffff',
        }}
      >
        {timeString}
      </span>
    </div>
  );
};

/**
 * "YOU" Pin Drop & Marker
 */
export interface YouPinProps {
  x?: number;
  y?: number;
  isPlayButton?: boolean;
  label?: string;
  sublabel?: string;
}

export const KurzgesagtYouPin: React.FC<YouPinProps> = ({
  x = 0,
  y = 0,
  isPlayButton = false,
  label = 'YOU',
  sublabel,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))',
      }}
    >
      {/* Pin Body / Balloon */}
      <div
        style={{
          background: isPlayButton ? '#22d3ee' : '#ffd98a',
          borderRadius: isPlayButton ? '14px' : '50% 50% 50% 8%',
          transform: isPlayButton ? 'none' : 'rotate(-45deg)',
          width: '56px',
          height: '56px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid #0f172a',
          position: 'relative',
        }}
      >
        {isPlayButton ? (
          // Play triangle icon
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: '16px solid #0f172a',
              marginLeft: '4px',
            }}
          />
        ) : (
          <span
            style={{
              transform: 'rotate(45deg)',
              fontFamily: '"Fredoka", sans-serif',
              fontWeight: 800,
              fontSize: '15px',
              color: '#0f172a',
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Sublabel Pill if provided */}
      {sublabel && (
        <div
          style={{
            marginTop: '8px',
            background: 'rgba(6, 20, 40, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '6px 14px',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: '"Fredoka", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#ffd98a',
            }}
          >
            {sublabel}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Vertical Dynamic Thermometer (+15°C to -70°C)
 */
export interface ThermometerProps {
  temperatureC: number;
}

export const KurzgesagtThermometer: React.FC<ThermometerProps> = ({ temperatureC }) => {
  // Map +15 to -70°C to fill height (inputRange must be strictly increasing)
  const heightPercent = interpolate(temperatureC, [-70, 15], [15, 80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(6, 20, 40, 0.78)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '16px 22px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Mercury Tube */}
      <div
        style={{
          width: '18px',
          height: '140px',
          background: '#1e293b',
          borderRadius: '12px',
          border: '2px solid #0f172a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: '100%',
            height: `${heightPercent}%`,
            background: temperatureC < 0 ? '#38bdf8' : '#ef4444',
            borderRadius: '0 0 10px 10px',
            boxShadow: `0 0 12px ${temperatureC < 0 ? '#38bdf8' : '#ef4444'}`,
            transition: 'none',
          }}
        />
      </div>

      {/* Temperature Display */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: '"SF Pro Display", monospace',
            fontSize: '36px',
            fontWeight: 900,
            color: temperatureC < 0 ? '#38bdf8' : '#ffd98a',
          }}
        >
          {Math.round(temperatureC)}°C
        </span>
        <span
          style={{
            fontFamily: '"Fredoka", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#94a3b8',
          }}
        >
          GLOBAL TEMP
        </span>
      </div>
    </div>
  );
};
