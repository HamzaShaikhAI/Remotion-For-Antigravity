'use strict';

/**
 * Mandatory Phonetic Lexicon & Pronunciation Dictionary for REA TTS Synthesis.
 * Transforms spoken TTS scripts so Edge TTS & Gemini TTS never garble domains,
 * brand handles, or low-level hardware acronyms while keeping on-screen captions unchanged.
 */

const PHONETIC_RULES = [
  // Domains & Handles (longest/most specific first)
  [/https?:\/\/(www\.)?hamzashaikhai\.com\/?/gi, 'hamza shaikh A I dot com'],
  [/https?:\/\/(www\.)?hamzashaikhai\.github\.io\/?/gi, 'hamza shaikh A I dot github dot I O'],
  [/\bhamzashaikhai\.com\b/gi, 'hamza shaikh A I dot com'],
  [/\bhamzashaikhai\.github\.io\b/gi, 'hamza shaikh A I dot github dot I O'],
  [/@?HamzaShaikhAI\b/gi, 'Hamza Shaikh A I'],
  [/\bHamza\s+Shaikh\b/gi, 'Hahm-za Shaykh'],

  // Flagship Repo & Product Names
  [/\bRemotion[-_\s]+For[-_\s]+Antigravity\b/gi, 'Ree-motion for Anti-gravity'],
  [/\bRemotion\b/gi, 'Ree-motion'],
  [/\bKeplerBridge\b/gi, 'Kepler Bridge'],
  [/\bAgentForge\b/gi, 'Agent Forge'],
  [/\bNotion[-_\s]+Block[-_\s]+Engine\b/gi, 'Notion Block Engine'],
  [/\bMeanArtDirectorQa\b|\bMeanArtDirector\b/g, 'Mean Art Director Q A'],

  // GPU / Graphics / AI Infrastructure Acronyms
  [/\bGTX\s+780\s+Ti\b/gi, 'G T X seven eighty T I'],
  [/\bGTX\s+750\s+Ti\b/gi, 'G T X seven fifty T I'],
  [/\bGTX\s+([0-9]{3,4})\b/gi, 'G T X $1'],
  [/\bGT\s+740\b/gi, 'G T seven forty'],
  [/\bGK107\b/gi, 'G K one oh seven'],
  [/\bGK104\b/gi, 'G K one oh four'],
  [/\bDXIL\b/g, 'D X I L'],
  [/\bDXBC\b/g, 'D X B C'],
  [/\bDXGI\b/g, 'D X G I'],
  [/\bD3D12\b/g, 'Direct 3 D 12'],
  [/\bD3D11\b/g, 'Direct 3 D 11'],
  [/\bDirect3D\b/gi, 'Direct 3 D'],
  [/\bEBU\s*R128\b/gi, 'E B U R one twenty eight'],
  [/\bLUFS\b/gi, 'luffs'],
  [/\bDPAPI\b/g, 'D P A P I'],
  [/\bPKCE\b/g, 'pixie'],
  [/\bOAuth\b/gi, 'O Auth'],
  [/\bMCP\b/g, 'M C P'],
  [/\bVRAM\b/g, 'V RAM'],
  [/\bHRESULT\b/g, 'H Result'],
  [/\bd3d12\.dll\b/gi, 'd 3 d 12 dot d l l'],
  [/\bkepler_bridge\.ini\b/gi, 'kepler bridge dot I N I'],
  [/github\.com\/HamzaShaikhAI\/([A-Za-z0-9._-]+)/gi, 'github dot com slash Hamza Shaikh A I slash $1'],
];

/**
 * Applies spoken phonetic substitutions while preserving the caller's visual caption text.
 * @param {string} rawText
 * @param {Record<string, string>} [customOverrides]
 * @returns {{ spokenText: string, visualText: string, replacementsApplied: Array<{from: string, to: string}> }}
 */
function applyPhoneticLexicon(rawText, customOverrides = {}) {
  if (!rawText || typeof rawText !== 'string') {
    return { spokenText: '', visualText: rawText || '', replacementsApplied: [] };
  }

  let spoken = rawText;
  const replacementsApplied = [];

  for (const [pattern, replacement] of PHONETIC_RULES) {
    const before = spoken;
    spoken = spoken.replace(pattern, replacement);
    if (spoken !== before) {
      replacementsApplied.push({ from: pattern.source, to: replacement });
    }
  }

  for (const [key, val] of Object.entries(customOverrides)) {
    if (!key) continue;
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`\\b${escaped}\\b`, 'gi');
    const before = spoken;
    spoken = spoken.replace(rx, val);
    if (spoken !== before) {
      replacementsApplied.push({ from: key, to: val });
    }
  }

  // Collapse excess whitespace introduced by replacements
  spoken = spoken.replace(/[ \t]{2,}/g, ' ').trim();

  return {
    spokenText: spoken,
    visualText: rawText,
    replacementsApplied,
  };
}

module.exports = {
  PHONETIC_RULES,
  applyPhoneticLexicon,
};
