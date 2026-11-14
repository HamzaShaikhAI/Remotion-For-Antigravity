import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface MasteringOptions {
  targetLufs?: number; // Default -14.0 LUFS (YouTube Shorts / TikTok broadcast spec)
  truePeak?: number; // Default -1.0 dBFS
  loudnessRange?: number; // Default 7.0 LU
  ffmpegPath?: string;
}

/**
 * EBU R128 True Peak Audio Mastering Engine
 * Normalizes multi-track compositions to broadcast and social standards (-14 LUFS),
 * preventing YouTube or TikTok from dynamically limiting and ruining sub-bass 808 drops.
 */
export function masterAudioToBroadcast(
  inputPath: string,
  outputPath: string,
  options: MasteringOptions = {}
): void {
  const {
    targetLufs = -14.0,
    truePeak = -1.0,
    loudnessRange = 7.0,
    ffmpegPath = 'ffmpeg',
  } = options;

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found for mastering: ${inputPath}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  console.log(`🎚️ [Pro-Tier Visual/Audio Engine] Mastering audio to EBU R128 standard...`);
  console.log(`   Target: ${targetLufs} LUFS | True Peak: ${truePeak} dBFS | LRA: ${loudnessRange} LU`);

  const cmd = `"${ffmpegPath}" -nostdin -i "${inputPath}" -af "loudnorm=I=${targetLufs}:TP=${truePeak}:LRA=${loudnessRange}" -y "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`   ✔ Mastered audio written cleanly to: ${outputPath}`);
  } catch (err: any) {
    throw new Error(`EBU R128 mastering failed: ${err.message}`);
  }
}
