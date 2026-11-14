import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

// Register composition root
registerRoot(RemotionRoot);

// REA Plugin Exports
export { NeonEmbers } from './plugins/rea-particles';
export { GlitchTransition } from './plugins/rea-transitions';
export { KineticSplitText } from './plugins/rea-typography';
export { ImpactFreezeFrame } from './plugins/rea-impact-freeze';
export { ChadEmojiOverlay } from './plugins/rea-chad-overlay';
