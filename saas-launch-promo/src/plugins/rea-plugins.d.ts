import React from 'react';

declare module '../plugins/rea-typography' {
  export const KineticSplitText: React.FC<{
    text: string;
    delayPerLetter?: number;
    style?: React.CSSProperties;
  }>;
  export const Typewriter: React.FC<{
    text: string;
    speed?: number;
    color?: string;
  }>;
}

declare module '../plugins/rea-transitions' {
  export const GlitchTransition: React.FC<{ children: React.ReactNode; intensity?: number }>;
  export const FadeTransition: React.FC<{ children: React.ReactNode; durationInFrames?: number }>;
}

declare module '../plugins/rea-mockups' {
  export const BrowserMockup: React.FC<{
    title?: string;
    url?: string;
    children: React.ReactNode;
  }>;
}
