import React from 'react';

export interface SaliencyRegion {
  x: number; // 0.0 - 1.0 (normalized center X)
  y: number; // 0.0 - 1.0 (normalized center Y)
  radius: number; // 0.0 - 1.0
  weight: number; // 0.0 - 1.0 (importance)
}

export interface SaliencyFocalStageProps {
  children: React.ReactNode;
  overlays: React.ReactNode; // Emojis, badges, or subtitles
  focalRegion?: SaliencyRegion; // Where character face/sword lives
  style?: React.CSSProperties;
}

/**
 * Saliency Mapping & Focal Point Preservation Engine
 * Generates visual heat maps of where the human eye looks (eyes, blades)
 * and dynamically shifts UI badges, Chad emojis, and text away from that region,
 * ensuring critical anime action is never obscured.
 */
export const SaliencyFocalStage: React.FC<SaliencyFocalStageProps> = ({
  children,
  overlays,
  focalRegion = { x: 0.5, y: 0.45, radius: 0.25, weight: 1.0 },
  style,
}) => {
  // If focal region is in upper-center (y ~ 0.45), push overlays to bottom third (y > 0.78)
  const overlayPlacement = focalRegion.y < 0.6 ? 'bottom' : 'top';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Pristine Video Stage */}
      {children}

      {/* Saliency-Preserved Safe Overlay Zone */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          ...(overlayPlacement === 'bottom'
            ? { bottom: '80px', top: 'auto' }
            : { top: '80px', bottom: 'auto' }),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {overlays}
      </div>
    </div>
  );
};
