import React from 'react';
import { useVideoConfig } from 'remotion';
import { ASPECT_PRESETS, detectAspectRatio, AspectRatioName } from './AspectPresets';

export interface ResponsiveContextValue {
  aspectRatio: AspectRatioName;
  isVertical: boolean;
  isSquare: boolean;
  isLandscape: boolean;
  fontScale: number;
  width: number;
  height: number;
  safePadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export const ResponsiveContext = React.createContext<ResponsiveContextValue>({
  aspectRatio: '16:9',
  isVertical: false,
  isSquare: false,
  isLandscape: true,
  fontScale: 1.0,
  width: 1920,
  height: 1080,
  safePadding: { top: 60, bottom: 80, left: 80, right: 80 },
});

export const useResponsive = () => React.useContext(ResponsiveContext);

export interface UniversalResponsiveContainerProps {
  children: React.ReactNode;
  showSafeZoneOverlay?: boolean;
}

export const UniversalResponsiveContainer: React.FC<UniversalResponsiveContainerProps> = ({
  children,
  showSafeZoneOverlay = false,
}) => {
  const { width, height } = useVideoConfig();

  const aspect = detectAspectRatio(width, height);
  const preset = ASPECT_PRESETS[aspect];

  const isVertical = aspect === '9:16' || aspect === '4:5';
  const isSquare = aspect === '1:1';
  const isLandscape = aspect === '16:9' || aspect === '21:9';

  const contextValue: ResponsiveContextValue = {
    aspectRatio: aspect,
    isVertical,
    isSquare,
    isLandscape,
    fontScale: preset.recommendedFontScale,
    width,
    height,
    safePadding: preset.safePadding,
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          paddingTop: preset.safePadding.top,
          paddingBottom: preset.safePadding.bottom,
          paddingLeft: preset.safePadding.left,
          paddingRight: preset.safePadding.right,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
        }}
      >
        {children}

        {/* Visual Safe Zone Guide for Dev / QA */}
        {showSafeZoneOverlay && (
          <div
            style={{
              position: 'absolute',
              top: preset.safePadding.top,
              bottom: preset.safePadding.bottom,
              left: preset.safePadding.left,
              right: preset.safePadding.right,
              border: '2px dashed rgba(239, 68, 68, 0.4)',
              pointerEvents: 'none',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 6,
                fontSize: 10,
                color: 'rgba(239, 68, 68, 0.7)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Safe Zone ({aspect})
            </div>
          </div>
        )}
      </div>
    </ResponsiveContext.Provider>
  );
};
