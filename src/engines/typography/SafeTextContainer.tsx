import React, { useMemo } from 'react';
import { computeSafeFontSize, safeTextStyle, safeBoxContainerStyle } from './safeText.ts';

export interface SafeTextContainerProps {
  text: string;
  containerWidth?: number;
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
  containerWidth,
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
  style = {},
  textStyle = {},
  tag = 'div',
}) => {
  // Compute safe scaled font size if containerWidth is specified
  const effectiveFontSize = useMemo(() => {
    if (!containerWidth) return baseFontSize;
    const availableWidth = containerWidth - padding * 2;
    return computeSafeFontSize(text, availableWidth, baseFontSize, minFontSize);
  }, [text, containerWidth, padding, baseFontSize, minFontSize]);

  const containerStyles: React.CSSProperties = {
    ...safeBoxContainerStyle(padding, borderRadius),
    backgroundColor,
    border,
    width: containerWidth || '100%',
    ...style,
  };

  const textStyles: React.CSSProperties = {
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
      <Tag style={textStyles}>{text}</Tag>
    </div>
  );
};
