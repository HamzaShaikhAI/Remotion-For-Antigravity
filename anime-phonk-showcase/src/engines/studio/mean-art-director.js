const fs = require('fs');

let GoogleGenAI;
let Type;
try {
  const genai = require('@google/genai');
  GoogleGenAI = genai.GoogleGenAI;
  Type = genai.Type;
} catch (e) {
  // Graceful fallback if @google/genai is absent
}

const artDirectorPrompt = `
You are a ruthless, award-winning Hollywood Art Director and Anime AMV Editor. 
Review the provided timeline JSON schema and the extracted keyframes from the vertical 9:16 video.

Analyze the following:
1. TYPOGRAPHY & SAFE ZONES: Is the text legible? Does it have enough contrast? Is it cropped by the TikTok/Shorts UI safe zones (bottom 20%, right 15%)?
2. VISUAL HIERARCHY: Do emojis, particle effects, or text obscure the main character's eyes or the focal point of the action?
3. PACING: Does the timeline linger too long on static shots? 

Be brutal. If it looks like amateur VFX vomit, fail it.

Output JSON only. If the grade is C, D, or F, provide the exact JSON property keys and the new values required to fix the composition.
`;

const critiqueSchema = Type
  ? {
      type: Type.OBJECT,
      properties: {
        grade: { type: Type.STRING, description: 'A, B, C, D, or F' },
        critique: { type: Type.STRING, description: 'Your brutal, honest review of the composition.' },
        passed: { type: Type.BOOLEAN, description: 'True if A or B. False if C, D, or F.' },
        fixes: {
          type: Type.ARRAY,
          description: 'List of prop overrides to fix the video. Empty if passed.',
          items: {
            type: Type.OBJECT,
            properties: {
              propName: { type: Type.STRING, description: 'The exact key in the props JSON.' },
              newValue: {
                type: Type.STRING,
                description: 'The corrected value (e.g., smaller font size, different color, shifted Y position).',
              },
            },
          },
        },
      },
      required: ['grade', 'critique', 'passed', 'fixes'],
    }
  : null;

function runHeuristicArtDirectorQA(props) {
  const fixes = [];
  const issues = [];

  // 1. Safe zone & subtitle drop shadow check
  if (!props.captionShadow || props.captionShadow === 'none') {
    issues.push('Subtitles lack a high-opacity drop shadow, risking illegibility against bright lightning VFX.');
    fixes.push({ propName: 'captionShadow', newValue: 'rgba(0, 0, 0, 0.95)' });
  }

  // 2. Right-side UI overlap check (TikTok/Shorts UI safe zone)
  if (!props.captionMarginRight || parseInt(String(props.captionMarginRight), 10) < 15) {
    issues.push('Captions encroach upon the 15% right-hand TikTok/Shorts interactive icon boundary.');
    fixes.push({ propName: 'captionMarginRight', newValue: '15%' });
  }

  // 3. Contrast check on accent color
  if (props.accentColor && (props.accentColor.toLowerCase() === '#ffff00' || props.accentColor.toLowerCase() === '#ffffff')) {
    issues.push('Accent color washes out high-key lightning clashing frames. Recommend high-contrast cyan/electric gold.');
    fixes.push({ propName: 'accentColor', newValue: '#00f5ff' });
  }

  // 4. Hook Title typography scale
  if (props.hookTitle && props.hookTitle.length > 18 && (!props.hookFontSize || parseInt(String(props.hookFontSize), 10) > 48)) {
    issues.push('Hook typography is oversized for multi-word title, causing safe-zone clipping on mobile screens.');
    fixes.push({ propName: 'hookFontSize', newValue: '38px' });
  }

  if (fixes.length === 0) {
    return {
      grade: 'A',
      critique: 'Contrast is stark. Focal points are preserved. Safe zones are protected. Cut approved for GPU render.',
      passed: true,
      fixes: [],
    };
  }

  return {
    grade: 'C',
    critique: `Amateur layout flaws detected: ${issues.join(' ')} Fix typography and safe-zone margins before wasting GPU render cycles.`,
    passed: false,
    fixes,
  };
}

async function runArtDirectorQA(propsJsonPath, framePaths) {
  let props = {};
  if (fs.existsSync(propsJsonPath)) {
    try {
      props = JSON.parse(fs.readFileSync(propsJsonPath, 'utf8'));
    } catch {
      props = {};
    }
  }

  // If live GEMINI_API_KEY is available and @google/genai is loaded, use Gemini 2.5 Pro multimodal API
  if (GoogleGenAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const validFramePaths = framePaths.filter((p) => fs.existsSync(p));
      const imageParts = validFramePaths.map((p) => ({
        inlineData: {
          data: Buffer.from(fs.readFileSync(p)).toString('base64'),
          mimeType: 'image/jpeg',
        },
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          artDirectorPrompt,
          `Current Composition Props:\n${JSON.stringify(props, null, 2)}`,
          ...imageParts,
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: critiqueSchema,
          temperature: 0.2,
        },
      });

      const rawText = typeof response.text === 'function' ? response.text() : response.text;
      if (rawText) {
        return JSON.parse(rawText);
      }
    } catch (err) {
      console.warn(`[ArtDirector] Live Gemini Vision API error (${err.message}). Falling back to heuristic critique...`);
    }
  }

  // Fallback to heuristic QA evaluation
  return runHeuristicArtDirectorQA(props);
}

module.exports = {
  runArtDirectorQA,
  runHeuristicArtDirectorQA,
};
