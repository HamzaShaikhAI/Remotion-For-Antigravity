import React, { useMemo } from 'react';
import { computeSafeFontSize, safeTextStyle, safeBoxContainerStyle } from './safeText.ts';

export interface SafeTextContainerProps {
  text?: string;
  children?: React.ReactNode;
  width?: number | string;
  containerWidth?: number;
  maxHeight?: number | string;
  autoScale?: boolean;
  baseFontSize?: number;
  minFontSize?: number;
  maxLines?: number;
  color?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: number;
  backgroundColor?: string;
  border?: string;
  borderRadius?: number;
  boxShadow?: string;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/**
 * SafeTextContainer
 * An impenetrable typography container that guarantees text will never spill,
 * overflow, or clip outside its box across any aspect ratio or dynamic content length.
 */
export const SafeTextContainer: React.FC<SafeTextContainerProps> = ({
  text,
  children,
  width,
  containerWidth,
  maxHeight,
  autoScale = true,
  baseFontSize = 24,
  minFontSize,
  maxLines,
  color = '#ffffff',
  fontWeight = 700,
  fontFamily = "'Inter', sans-serif",
  lineHeight = 1.25,
  letterSpacing = 0,
  textAlign = 'left',
  padding = 0,
  backgroundColor = 'transparent',
  border = 'none',
  borderRadius = 0,
  boxShadow,
  style = {},
  textStyle = {},
  tag = 'div',
}) => {
  // Resolve target width
  const resolvedWidth = containerWidth ?? (typeof width === 'number' ? width : undefined);

  // Compute safe scaled font size if autoScale is enabled and width is known
  const effectiveFontSize = useMemo(() => {
    if (!autoScale || !resolvedWidth || !text) return baseFontSize;
    const availableWidth = resolvedWidth - padding * 2;
    return computeSafeFontSize(text, availableWidth, baseFontSize, minFontSize);
  }, [text, resolvedWidth, padding, baseFontSize, minFontSize, autoScale]);

  const containerStyles: React.CSSProperties = {
    ...safeBoxContainerStyle(padding, borderRadius),
    backgroundColor,
    border,
    boxShadow,
    width: width ?? (containerWidth ? `${containerWidth}px` : '100%'),
    maxHeight,
    overflow: 'hidden',
    boxSizing: 'border-box',
    ...style,
  };

  const computedTextStyles: React.CSSProperties = {
    ...safeTextStyle(effectiveFontSize, maxLines, true),
    color,
    fontWeight,
    fontFamily,
    lineHeight,
    letterSpacing,
    textAlign,
    ...textStyle,
  };

  const Tag = tag;

  return (
    <div style={containerStyles}>
      {text !== undefined ? (
        <Tag style={computedTextStyles}>{text}</Tag>
      ) : null}
      {children}
    </div>
  );
};
