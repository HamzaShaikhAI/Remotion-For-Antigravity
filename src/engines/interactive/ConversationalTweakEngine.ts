import fs from 'fs';
import path from 'path';

export interface TweakResult {
  filePath: string;
  success: boolean;
  changes: string[];
  originalContent: string;
  updatedContent: string;
}

export class ConversationalTweakEngine {
  /**
   * Applies colloquial design tweaks directly to a Remotion component file.
   */
  public static applyTweak(filePath: string, instruction: string, dryRun = false): TweakResult {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Component file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    const changes: string[] = [];
    const lower = instruction.toLowerCase();

    // 1. Font weight adjustments (e.g., "make font bolder", "lighter font")
    if (lower.includes('bolder') || lower.includes('bold font') || lower.includes('heavy font')) {
      if (updated.includes('fontWeight: 400') || updated.includes('fontWeight: 500') || updated.includes('fontWeight: 600') || updated.includes('fontWeight: 700')) {
        updated = updated.replace(/fontWeight:\s*['"]?(400|500|600|700)['"]?/g, 'fontWeight: 900');
        changes.push('Updated typography fontWeight to 900 (ultra-bold)');
      }
    } else if (lower.includes('lighter font') || lower.includes('thinner font')) {
      updated = updated.replace(/fontWeight:\s*['"]?(800|900|bold)['"]?/g, 'fontWeight: 400');
      changes.push('Reduced typography fontWeight to 400 (regular)');
    }

    // 2. Spring timing shifts (e.g., "shift entrance spring by 5 frames", "delay spring by 10 frames")
    const shiftMatch = lower.match(/(?:shift|delay)\s+(?:entrance|spring|animation)\s+by\s+(\d+)\s+frames?/);
    if (shiftMatch) {
      const shiftAmount = parseInt(shiftMatch[1], 10);
      updated = updated.replace(/frame:\s*frame/g, `frame: frame - ${shiftAmount}`);
      changes.push(`Shifted animation entrance timing by ${shiftAmount} frames`);
    }

    // 3. Background color / theme changes (e.g., "dark charcoal", "pitch black", "emerald", "indigo")
    if (lower.includes('dark charcoal') || lower.includes('charcoal theme')) {
      updated = updated.replace(/backgroundColor:\s*['"][^'"]+['"]/g, "backgroundColor: '#121214'");
      changes.push("Changed background theme to dark charcoal ('#121214')");
    } else if (lower.includes('pitch black') || lower.includes('pure black')) {
      updated = updated.replace(/backgroundColor:\s*['"][^'"]+['"]/g, "backgroundColor: '#000000'");
      changes.push("Changed background theme to pure black ('#000000')");
    } else if (lower.includes('emerald') || lower.includes('cyberpunk green')) {
      updated = updated.replace(/#38bdf8/g, '#10b981').replace(/#3b82f6/g, '#059669');
      changes.push('Shifted color palette accents to Emerald Cyberpunk');
    }

    // 4. Spring damping & stiffness physics (e.g., "snappier springs", "bouncy springs", "stiffer")
    if (lower.includes('snappier') || lower.includes('stiffer')) {
      updated = updated.replace(/stiffness:\s*\d+/g, 'stiffness: 180').replace(/damping:\s*\d+/g, 'damping: 18');
      changes.push('Updated spring physics config: stiffness: 180, damping: 18 (snappy response)');
    } else if (lower.includes('bounc') || lower.includes('elastic')) {
      updated = updated.replace(/stiffness:\s*\d+/g, 'stiffness: 100').replace(/damping:\s*\d+/g, 'damping: 8');
      changes.push('Updated spring physics config: stiffness: 100, damping: 8 (high elasticity bounce)');
    }

    if (!dryRun && changes.length > 0) {
      fs.writeFileSync(filePath, updated, 'utf8');
    }

    return {
      filePath,
      success: changes.length > 0,
      changes,
      originalContent: content,
      updatedContent: updated,
    };
  }
}
