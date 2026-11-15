import React from 'react';

/**
 * safeText.ts
 * Zero-Overflow Typography & Box Clamping Architecture
 * Guarantees text NEVER breaches container borders or overflows bounding boxes.
 */

export interface SafeTypographyConfig {
  baseFontSize: number;
  minFontSize?: number;
  maxWidth?: number | string;
  maxLines?: number;
  padding?: number;
  lineHeight?: number;
  ellipsis?: boolean;
}

/**
 * Computes a responsive, auto-scaled font size so long copy fits strictly inside its container.
 */
export function computeSafeFontSize(
  text: string,
  containerWidthPx: number,
  baseSize: number,
  minSize: number = Math.round(baseSize * 0.65),
  approxCharWidthFactor: number = 0.58
): number {
  if (!text || containerWidthPx <= 0) return baseSize;
  const estimatedWidth = text.length * baseSize * approxCharWidthFactor;
  if (estimatedWidth <= containerWidthPx) {
    return baseSize;
  }
  const scaled = Math.floor(baseSize * (containerWidthPx / estimatedWidth));
  return Math.max(minSize, scaled);
}

/**
 * Universal zero-overflow style rules for container boxes
 */
export function safeBoxContainerStyle(
  paddingPx: number = 16,
  borderRadiusPx: number = 12
): React.CSSProperties {
  return {
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    padding: paddingPx,
    borderRadius: borderRadiusPx,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
  };
}

/**
 * Universal text clamping and wrap style
 */
export function safeTextStyle(
  fontSize: number,
  maxLines?: number,
  ellipsis: boolean = true
): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize,
    margin: 0,
    boxSizing: 'border-box',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
  };

  if (maxLines && maxLines > 1) {
    return {
      ...base,
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: ellipsis ? 'ellipsis' : 'clip',
    };
  }

  if (maxLines === 1) {
    return {
      ...base,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: ellipsis ? 'ellipsis' : 'clip',
    };
  }

  return base;
}
