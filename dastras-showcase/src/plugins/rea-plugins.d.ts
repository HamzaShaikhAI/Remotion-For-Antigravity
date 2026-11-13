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
