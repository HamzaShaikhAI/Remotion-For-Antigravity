# Remotion Image and Asset Rules (`staticFile`)

This guide specifies how the Antigravity agent and REA engine must handle media assets (images, SVGs, audio, video files, fonts) during development and rendering.

---

## 1. The Golden Rule: Always Use `staticFile()`

Remotion runs in headless Chromium instances during server-side compilation (`rea render`). Standard relative imports or web root paths will break because the execution origin differs between Remotion Studio and headless rendering.

### ❌ Incorrect
```tsx
// Will fail during headless render
<img src="../public/logo.png" />
<img src="/logo.png" />
const bg = require('./assets/background.jpg');
```

### ✅ Correct
```tsx
import { staticFile, Img } from 'remotion';

export const LogoBanner: React.FC = () => {
  return (
    <Img
      src={staticFile('logo.png')}
      alt="Project Logo"
      style={{ width: 300, height: 'auto' }}
    />
  );
};
```

---

## 2. Directory Convention

All static assets must reside directly in or under the `public/` directory at the project root:

```text
my-video-project/
├── public/
│   ├── images/
│   │   ├── hero.png
│   │   └── avatar.webp
│   ├── audio/
│   │   └── background-track.mp3
│   ├── fonts/
│   │   └── Inter-Bold.woff2
│   └── favicon.ico
```

Referencing nested assets:
```tsx
import { staticFile, Img, Audio } from 'remotion';

<Img src={staticFile('images/hero.png')} />
<Audio src={staticFile('audio/background-track.mp3')} volume={0.8} />
```

---

## 3. `<Img />` vs Standard `<img>`

Always import and use Remotion's built-in `<Img />` component instead of native HTML `<img>`.
- `<Img />` automatically pauses the rendering pipeline until the image has completely loaded and decoded into GPU memory.
- This prevents blank frames, flashing assets, or partially rendered images during fast rendering passes.

```tsx
import { Img, staticFile } from 'remotion';

export const BackgroundLayer = () => (
  <Img
    src={staticFile('images/hero.png')}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
);
```

---

## 4. Asynchronous Asset Pre-loading (`delayRender`)

For remote URLs or heavy assets (such as custom fonts or vector assets loaded via SVG parsers), use `delayRender()` and `continueRender()` to guarantee the render engine waits for completion:

```tsx
import { useEffect, useState } from 'react';
import { delayRender, continueRender, staticFile } from 'remotion';

export const RemoteImageGallery = ({ imageUrl }: { imageUrl: string }) => {
  const [handle] = useState(() => delayRender('Loading remote asset'));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      console.error(`Failed to load ${imageUrl}`);
      continueRender(handle); // Avoid stalling the render indefinitely
    };
  }, [imageUrl, handle]);

  if (!loaded) return null;

  return <img src={imageUrl} alt="Loaded asset" />;
};
```

---

## 5. Pre-Render Asset Verification

Before initiating `rea render`, verify that:
1. Every file referenced via `staticFile('...')` exists in the `public/` directory.
2. File paths are case-sensitive matching the filesystem (important on Linux and CI).
3. The Antigravity `hooks/pre-render.json` gate validates asset presence before spawning Chromium workers.
