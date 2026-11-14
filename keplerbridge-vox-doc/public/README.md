# Static Assets Directory
Place all images, audio, video files, and fonts here.
Reference them in your compositions with:
```tsx
import { staticFile, Img, Audio } from 'remotion';
<Img src={staticFile('logo.png')} />
<Audio src={staticFile('sfx/whoosh.wav')} />
```
