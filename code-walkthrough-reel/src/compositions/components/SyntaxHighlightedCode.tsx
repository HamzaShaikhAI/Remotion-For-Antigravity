import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export interface CodeToken {
  text: string;
  color: string;
  bold?: boolean;
  glow?: boolean;
}

export interface CodeLine {
  lineNumber: number;
  tokens: CodeToken[];
}

export const CODE_DATA: CodeLine[] = [
  {
    lineNumber: 1,
    tokens: [
      { text: 'from ', color: '#FF7B72', bold: true },
      { text: 'fastapi ', color: '#E6EDF3' },
      { text: 'import ', color: '#FF7B72', bold: true },
      { text: 'FastAPI', color: '#79C0FF', bold: true },
    ],
  },
  {
    lineNumber: 2,
    tokens: [
      { text: 'import ', color: '#FF7B72', bold: true },
      { text: 'asyncio', color: '#79C0FF' },
    ],
  },
  {
    lineNumber: 3,
    tokens: [
      { text: 'app ', color: '#E6EDF3' },
      { text: '= ', color: '#FF7B72' },
      { text: 'FastAPI', color: '#79C0FF', bold: true },
      { text: '()', color: '#E6EDF3' },
    ],
  },
  {
    lineNumber: 4,
    tokens: [
      { text: '@app', color: '#D2A8FF', bold: true },
      { text: '.get(', color: '#79C0FF' },
      { text: '"/task/{task_id}"', color: '#A5D6FF' },
      { text: ')', color: '#79C0FF' },
    ],
  },
  {
    lineNumber: 5,
    tokens: [
      { text: 'async ', color: '#FF7B72', bold: true, glow: true },
      { text: 'def ', color: '#FF7B72', bold: true },
      { text: 'handle_task', color: '#79C0FF', bold: true },
      { text: '(', color: '#E6EDF3' },
      { text: 'task_id', color: '#FFA657' },
      { text: ': ', color: '#FF7B72' },
      { text: 'str', color: '#7EE787' },
      { text: '):', color: '#E6EDF3' },
    ],
  },
  {
    lineNumber: 6,
    tokens: [
      { text: '    result ', color: '#E6EDF3' },
      { text: '= ', color: '#FF7B72' },
      { text: 'await ', color: '#FF7B72', bold: true, glow: true },
      { text: 'asyncio', color: '#79C0FF' },
      { text: '.sleep(', color: '#E6EDF3' },
      { text: '1.2', color: '#79C0FF' },
      { text: ')', color: '#E6EDF3' },
    ],
  },
  {
    lineNumber: 7,
    tokens: [
      { text: '    data ', color: '#E6EDF3' },
      { text: '= ', color: '#FF7B72' },
      { text: 'await ', color: '#FF7B72', bold: true, glow: true },
      { text: 'fetch_analytics', color: '#79C0FF', bold: true },
      { text: '(', color: '#E6EDF3' },
      { text: 'task_id', color: '#FFA657' },
      { text: ')', color: '#E6EDF3' },
    ],
  },
  {
    lineNumber: 8,
    tokens: [
      { text: '    return ', color: '#FF7B72', bold: true },
      { text: '{"status": "ok", "data": data}', color: '#A5D6FF' },
    ],
  },
];

export const SyntaxHighlightedCode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute total characters across all lines
  const totalCharacters = React.useMemo(() => {
    return CODE_DATA.reduce((sum, line) => {
      const lineChars = line.tokens.reduce((acc, t) => acc + t.text.length, 0);
      return sum + lineChars;
    }, 0);
  }, []);

  // Progressive typing between frame 12 and frame 80
  const typingStart = 12;
  const typingEnd = 80;
  const charsRevealed = Math.floor(
    interpolate(frame, [typingStart, typingEnd], [0, totalCharacters], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Blinking cursor state: blinks every 14 frames
  const isCursorBlinkOn = Math.floor(frame / 14) % 2 === 0;

  // Zoom / Dim transition from frame 90
  const zoomSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.8 },
  });

  // Dimming opacity for lines 1-3 and 8
  const dimOpacity = interpolate(zoomSpring, [0, 1], [1.0, 0.3]);

  // Glow intensity for highlighted lines 4-7
  const highlightGlow = interpolate(zoomSpring, [0, 1], [0, 1]);

  // Track character offset as we render lines
  let runningCharCount = 0;
  let cursorPlaced = false;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
        fontSize: 27,
        lineHeight: '44px',
        padding: '24px 32px',
        userSelect: 'none',
      }}
    >
      {/* Background glow highlight container for lines 4 to 7 */}
      {highlightGlow > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 24 + 3 * 44, // Lines 4 to 7 start after 3 lines
            height: 4 * 44, // 4 lines
            borderRadius: 10,
            background: `linear-gradient(90deg, rgba(56, 189, 248, ${0.16 * highlightGlow}) 0%, rgba(56, 189, 248, ${0.05 * highlightGlow}) 100%)`,
            borderLeft: `4px solid rgba(56, 189, 248, ${highlightGlow})`,
            boxShadow: `0 0 35px rgba(56, 189, 248, ${0.2 * highlightGlow})`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {CODE_DATA.map((line) => {
        const isTargetHighlight = line.lineNumber >= 4 && line.lineNumber <= 7;
        const lineOpacity = isTargetHighlight ? 1.0 : dimOpacity;

        // Render tokens for this line based on revealed character count
        const renderedTokens: React.ReactNode[] = [];
        let lineHasCursor = false;

        line.tokens.forEach((token, tIdx) => {
          const tokenLen = token.text.length;
          const tokenStart = runningCharCount;
          const tokenEnd = runningCharCount + tokenLen;

          if (charsRevealed >= tokenEnd) {
            // Token fully revealed
            renderedTokens.push(
              <span
                key={tIdx}
                style={{
                  color: token.color,
                  fontWeight: token.bold ? 700 : 400,
                  textShadow:
                    token.glow && isTargetHighlight && highlightGlow > 0.1
                      ? `0 0 ${12 * highlightGlow}px ${token.color}`
                      : 'none',
                }}
              >
                {token.text}
              </span>
            );
          } else if (charsRevealed > tokenStart && charsRevealed < tokenEnd) {
            // Token partially revealed
            const partialText = token.text.slice(0, charsRevealed - tokenStart);
            renderedTokens.push(
              <span
                key={tIdx}
                style={{
                  color: token.color,
                  fontWeight: token.bold ? 700 : 400,
                }}
              >
                {partialText}
              </span>
            );
            lineHasCursor = true;
            cursorPlaced = true;
          }

          runningCharCount += tokenLen;
        });

        // Place cursor at the end of the last revealed line if typing is done or at the exact boundary
        if (!cursorPlaced && !lineHasCursor && runningCharCount >= charsRevealed && charsRevealed > 0) {
          lineHasCursor = true;
          cursorPlaced = true;
        }

        return (
          <div
            key={line.lineNumber}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              opacity: lineOpacity,
              whiteSpace: 'pre',
              height: 44,
            }}
          >
            {/* Line Number */}
            <span
              style={{
                width: 44,
                color: isTargetHighlight && highlightGlow > 0.2 ? '#38BDF8' : '#475569',
                fontWeight: isTargetHighlight && highlightGlow > 0.2 ? 700 : 400,
                marginRight: 24,
                textAlign: 'right',
                userSelect: 'none',
              }}
            >
              {line.lineNumber}
            </span>

            {/* Tokens */}
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              {renderedTokens}

              {/* Cursor indicator */}
              {lineHasCursor && (frame < 90 || isCursorBlinkOn) && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 28,
                    marginLeft: 2,
                    backgroundColor: isCursorBlinkOn ? '#38BDF8' : 'transparent',
                    boxShadow: isCursorBlinkOn ? '0 0 10px #38BDF8' : 'none',
                    borderRadius: 2,
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
