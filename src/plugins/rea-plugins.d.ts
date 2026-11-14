import React from 'react';

declare module '../plugins/rea-particles' {
  export const NeonEmbers: React.FC<{ count?: number; interactive?: boolean }>;
}

declare module '../plugins/rea-transitions' {
  export const GlitchTransition: React.FC<{ children: React.ReactNode; intensity?: number }>;
}

declare module '../plugins/rea-typography' {
  export const KineticSplitText: React.FC<{
    text: string;
    delayPerLetter?: number;
    style?: React.CSSProperties;
  }>;
}

declare module '../plugins/rea-mockups' {
  export const BrowserMockup: React.FC<{
    title?: string;
    url?: string;
    children: React.ReactNode;
  }>;
}

declare module '../plugins/rea-captions' {
  export interface CaptionWord {
    word: string;
    startInFrames: number;
    endInFrames: number;
  }
  export const AnimatedCaptions: React.FC<{
    words: CaptionWord[];
    activeColor?: string;
    inactiveColor?: string;
    fontSize?: number;
  }>;
}

declare module '../plugins/rea-impact-freeze' {
  export const ImpactFreezeFrame: React.FC<{
    children: React.ReactNode;
    triggerFrame: number;
    durationInFrames?: number;
    shakeIntensity?: number;
    mangaContrast?: boolean;
    flashColor?: string;
    audioSrc?: string;
  }>;
}

declare module '../plugins/rea-chad-overlay' {
  export const ChadEmojiOverlay: React.FC<{
    triggerFrame: number;
    durationInFrames?: number;
    variant?: 'chad' | 'skull' | 'fire' | 'sigma';
    caption?: string;
    bassReactive?: boolean;
    audioSrc?: string;
    accentColor?: string;
  }>;
}

declare module '../plugins/rea-gameplay' {
  export interface BackgroundGameplayProps {
    mode?: 'split' | 'underlay' | 'pip';
    videoSrc?: string;
    opacity?: number;
    blur?: number;
    accentColor?: string;
    gameType?: 'cyber-runner' | 'retro-highway' | 'neon-grid';
    splitRatio?: number;
    speedMultiplier?: number;
  }
  export const BackgroundGameplay: React.FC<BackgroundGameplayProps>;
  export const ProceduralGameplayRunner: React.FC<{
    accentColor?: string;
    speedMultiplier?: number;
  }>;
}
