/**
 * REA Phonetic Lexicon & SSML Dictionary Engine
 * (src/engines/audio/PhoneticLexiconEngine.ts)
 * 
 * Ensures flawless pronunciation for critical developer brands, open-source repositories,
 * technical domains, and hardware terms every time TTS or speech synthesis is triggered.
 */

export interface LexiconEntry {
  spoken: string;
  ssmlSub: string;
  ipa?: string;
  notes?: string;
}

export const MANDATORY_PHONETIC_DICTIONARY: Record<string, LexiconEntry> = {
  'hamzashaikhai.com': {
    spoken: 'Hamza Shaikh A I dot com',
    ssmlSub: '<sub alias="Hamza Shaikh A I dot com">hamzashaikhai.com</sub>',
    notes: 'Personal engineer portfolio and open-source hub',
  },
  'hamzashaikh': {
    spoken: 'Hamza Shaikh',
    ssmlSub: '<sub alias="Hamza Shaikh">hamzashaikh</sub>',
  },
  'Remotion-For-Antigravity': {
    spoken: 'Remotion For Anti gravity',
    ssmlSub: '<sub alias="Remotion For Anti gravity">Remotion-For-Antigravity</sub>',
    notes: 'Flagship REA framework repository title',
  },
  'remotion-for-antigravity': {
    spoken: 'Remotion For Anti gravity',
    ssmlSub: '<sub alias="Remotion For Anti gravity">remotion-for-antigravity</sub>',
  },
  'KeplerBridge': {
    spoken: 'Kepler Bridge',
    ssmlSub: '<sub alias="Kepler Bridge">KeplerBridge</sub>',
    notes: 'NVIDIA GT 740 D3D12 open-source driver bridge',
  },
  'keplerbridge': {
    spoken: 'Kepler Bridge',
    ssmlSub: '<sub alias="Kepler Bridge">keplerbridge</sub>',
  },
  'GK107': {
    spoken: 'G K one zero seven',
    ssmlSub: '<sub alias="G K one zero seven">GK107</sub>',
    notes: 'NVIDIA Kepler silicon die architecture',
  },
  'PCIe': {
    spoken: 'P C I express',
    ssmlSub: '<sub alias="P C I express">PCIe</sub>',
  },
  'GDDR5': {
    spoken: 'G D D R five',
    ssmlSub: '<sub alias="G D D R five">GDDR5</sub>',
  },
  'D3D12': {
    spoken: 'Direct 3 D twelve',
    ssmlSub: '<sub alias="Direct 3 D twelve">D3D12</sub>',
  },
  'd3d12.dll': {
    spoken: 'Direct 3 D twelve dot D L L',
    ssmlSub: '<sub alias="Direct 3 D twelve dot D L L">d3d12.dll</sub>',
  },
  'DXIL': {
    spoken: 'D X I L',
    ssmlSub: '<sub alias="D X I L">DXIL</sub>',
    notes: 'DirectX Intermediate Language (Shader Model 6)',
  },
  'DXBC': {
    spoken: 'D X B C',
    ssmlSub: '<sub alias="D X B C">DXBC</sub>',
    notes: 'DirectX Bytecode (Shader Model 5)',
  },
  'TSMC': {
    spoken: 'T S M C',
    ssmlSub: '<sub alias="T S M C">TSMC</sub>',
  },
  'CUDA': {
    spoken: 'Coo dah',
    ssmlSub: '<sub alias="Coo dah">CUDA</sub>',
  },
  'EBU R128': {
    spoken: 'E B U R one twenty eight',
    ssmlSub: '<sub alias="E B U R one twenty eight">EBU R128</sub>',
    notes: 'Broadcast audio loudness standard (-16 LUFS)',
  },
  'LUFS': {
    spoken: 'loofs',
    ssmlSub: '<sub alias="loofs">LUFS</sub>',
  },
  'AST': {
    spoken: 'A S T',
    ssmlSub: '<sub alias="A S T">AST</sub>',
    notes: 'Abstract Syntax Tree',
  },
  'AgentForge': {
    spoken: 'Agent Forge',
    ssmlSub: '<sub alias="Agent Forge">AgentForge</sub>',
  },
  'OffthreadVideo': {
    spoken: 'Off thread Video',
    ssmlSub: '<sub alias="Off thread Video">OffthreadVideo</sub>',
    notes: 'Remotion high-performance off-thread video layer',
  },
  'FFmpeg': {
    spoken: 'F F m peg',
    ssmlSub: '<sub alias="F F m peg">FFmpeg</sub>',
  },
  'OBS': {
    spoken: 'O B S',
    ssmlSub: '<sub alias="O B S">OBS</sub>',
  },
};

export class PhoneticLexiconEngine {
  private static dictionary: Map<string, LexiconEntry> = new Map(
    Object.entries(MANDATORY_PHONETIC_DICTIONARY)
  );

  /**
   * Registers or overrides a phonetic lexicon entry
   */
  public static addEntry(term: string, spoken: string, ipa?: string, notes?: string): void {
    this.dictionary.set(term, {
      spoken,
      ssmlSub: `<sub alias="${spoken}">${term}</sub>`,
      ipa,
      notes,
    });
  }

  /**
   * Retrieves the full active dictionary
   */
  public static getDictionary(): Record<string, LexiconEntry> {
    return Object.fromEntries(this.dictionary.entries());
  }

  /**
   * Translates plain script text into both:
   * 1. SSML markup with exact <sub alias="..."> substitutions
   * 2. Pure phonetic text for TTS engines lacking SSML parser support
   */
  public static applyPhoneticLexicon(scriptText: string): {
    ssml: string;
    plainTextSpoken: string;
    replacementsCount: number;
    matchedTerms: string[];
  } {
    let ssmlResult = scriptText;
    let spokenResult = scriptText;
    let replacementsCount = 0;
    const matchedTerms: string[] = [];

    // Sort terms by length descending to match composite terms before substrings
    const sortedTerms = Array.from(this.dictionary.keys()).sort((a, b) => b.length - a.length);

    for (const term of sortedTerms) {
      const entry = this.dictionary.get(term)!;
      // Escape term for regex
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

      if (regex.test(ssmlResult)) {
        matchedTerms.push(term);
        replacementsCount++;
        ssmlResult = ssmlResult.replace(regex, entry.ssmlSub);
        spokenResult = spokenResult.replace(regex, entry.spoken);
      }
    }

    // Wrap in standard <speak> envelope for SSML engines
    const fullSSML = `<speak>\n  <p>\n    <s>${ssmlResult}</s>\n  </p>\n</speak>`;

    return {
      ssml: fullSSML,
      plainTextSpoken: spokenResult,
      replacementsCount,
      matchedTerms,
    };
  }

  /**
   * Audits script text to ensure all technical terms have verified pronunciation rules
   */
  public static validatePronunciationCoverage(text: string): {
    clean: boolean;
    missingPronunciations: string[];
  } {
    const commonTechnicalPatterns = [
      /[a-zA-Z0-9-]+\.(com|org|io|dev|ai|net)/gi,
      /[A-Z]{3,}/g, // All-caps acronyms
      /(\b[a-z]+[A-Z][a-zA-Z0-9]*\b)/g, // CamelCase terms
    ];

    const missing = new Set<string>();
    for (const regex of commonTechnicalPatterns) {
      const matches = text.match(regex) || [];
      for (const m of matches) {
        if (!this.dictionary.has(m) && !this.dictionary.has(m.toLowerCase())) {
          missing.add(m);
        }
      }
    }

    return {
      clean: missing.size === 0,
      missingPronunciations: Array.from(missing),
    };
  }
}
