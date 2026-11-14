import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BoundingBoxTrackPoint {
  frame: number;
  x: number; // 0.0 - 1.0 (normalized center X)
  y: number; // 0.0 - 1.0 (normalized center Y)
  width?: number; // normalized box width
  height?: number; // normalized box height
  label?: string; // e.g. 'face', 'weapon', 'subject'
}

export interface DynamicCroppedStageProps {
  children: React.ReactNode;
  trackingPoints?: BoundingBoxTrackPoint[];
  defaultFocusX?: number; // 0.5 default
  defaultFocusY?: number; // 0.5 default
  zoomScale?: number; // default 1.25 for 9:16 framing
  smoothDamping?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Subject-Aware Dynamic Cropping Engine (YOLOv8 / MediaPipe Tracking Coordinate Driver)
 * Automatically centers camera focal point around tracked subject bounding boxes,
 * preventing widescreen 16:9 battle cuts from clipping characters in 9:16 vertical output.
 */
export const SubjectAwareDynamicCrop: React.FC<DynamicCroppedStageProps> = ({
  children,
  trackingPoints = [],
  defaultFocusX = 0.5,
  defaultFocusY = 0.5,
  zoomScale = 1.25,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Calculate smooth focal point across tracked frames
  let targetX = defaultFocusX;
  let targetY = defaultFocusY;

  if (trackingPoints.length > 0) {
    const frames = trackingPoints.map((p) => p.frame);
    const xs = trackingPoints.map((p) => p.x);
    const ys = trackingPoints.map((p) => p.y);

    if (trackingPoints.length === 1) {
      targetX = trackingPoints[0].x;
      targetY = trackingPoints[0].y;
    } else {
      targetX = interpolate(frame, frames, xs, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      targetY = interpolate(frame, frames, ys, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }

  // Pan offset in pixels relative to viewport center
  const panX = (0.5 - targetX) * (width * (zoomScale - 1));
  const panY = (0.5 - targetY) * (height * (zoomScale - 1));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0) scale(${zoomScale.toFixed(3)})`,
          transformOrigin: `${(targetX * 100).toFixed(1)}% ${(targetY * 100).toFixed(1)}%`,
          transition: 'transform 0.05s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
