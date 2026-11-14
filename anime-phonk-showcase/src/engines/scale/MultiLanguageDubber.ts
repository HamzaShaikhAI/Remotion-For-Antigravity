/**
 * Multi-Language Auto-Dubbing Pipeline
 *
 * Dispatches localized voiceover tracks for global content distribution
 * across Spanish, Japanese, German, French, and Portuguese.
 */

export interface DubLanguageConfig {
  langCode: string;
  langName: string;
  geminiVoice: string;
  edgeVoice: string;
  speechRateMultiplier: number;
}

export const SUPPORTED_DUB_LANGUAGES: Record<string, DubLanguageConfig> = {
  en: {
    langCode: 'en-US',
    langName: 'English',
    geminiVoice: 'Charon',
    edgeVoice: 'en-US-ChristopherNeural',
    speechRateMultiplier: 1.0,
  },
  es: {
    langCode: 'es-ES',
    langName: 'Spanish',
    geminiVoice: 'Alnilam',
    edgeVoice: 'es-ES-AlvaroNeural',
    speechRateMultiplier: 1.08,
  },
  ja: {
    langCode: 'ja-JP',
    langName: 'Japanese',
    geminiVoice: 'Orus',
    edgeVoice: 'ja-JP-KeitaNeural',
    speechRateMultiplier: 0.95,
  },
  de: {
    langCode: 'de-DE',
    langName: 'German',
    geminiVoice: 'Puck',
    edgeVoice: 'de-DE-KillianNeural',
    speechRateMultiplier: 1.05,
  },
  pt: {
    langCode: 'pt-BR',
    langName: 'Portuguese (Brazil)',
    geminiVoice: 'Zephyr',
    edgeVoice: 'pt-BR-AntonioNeural',
    speechRateMultiplier: 1.04,
  },
};

export class MultiLanguageDubber {
  public static getDubbingRoster(targetLangs: string[] = ['es', 'ja', 'pt']): DubLanguageConfig[] {
    return targetLangs.map((code) => SUPPORTED_DUB_LANGUAGES[code] || SUPPORTED_DUB_LANGUAGES.en);
  }
}
