# Universal Multi-Format Responsive Layout Rules

This rule instructs Antigravity agents on authoring video compositions that fluidly adapt across 16:9 Landscape, 9:16 Vertical, 1:1 Square, and 4:5 Portrait without clipping or layout thrashing.

---

## 1. Universal Aspect Ratio Detection
Always derive layout orientation dynamically via `useVideoConfig()`:

```tsx
import { useVideoConfig } from 'remotion';

const { width, height } = useVideoConfig();
const isVertical = height > width;
const isSquare = Math.abs(width - height) < 100;
const isLandscape = width > height;
```

Or wrap compositions in `UniversalResponsiveContainer`:
```tsx
import { UniversalResponsiveContainer, useResponsive } from '../engines/multiformat';

export const MyResponsiveScene = () => {
  return (
    <UniversalResponsiveContainer>
      <SceneContent />
    </UniversalResponsiveContainer>
  );
};
```

---

## 2. Platform Safe Zones
Different platforms impose harsh UI overlays that obscure video margins:
- **9:16 Vertical (TikTok, YouTube Shorts, Instagram Reels):**
  - Right Margin: Leave 100px clear for Like / Comment / Share buttons.
  - Bottom Margin: Leave 280px clear for account handles, descriptions, and audio tickers.
  - Top Margin: Leave 120px clear for search bars and live tags.
- **16:9 Landscape (YouTube, Broadcast TV):**
  - Bottom Margin: Leave 80px clear for scrubber bars and timestamps.

---

## 3. Responsive Flex Flow & Typography Scaling
- Switch from `flexDirection: 'row'` on landscape to `flexDirection: 'column'` on vertical.
- Multiply baseline font sizes by `fontScale` provided by `useResponsive()`.
- Constrain headline widths to `maxWidth: '85%'` to prevent horizontal text truncation.
