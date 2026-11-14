import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';

export interface CloudMusicResult {
  success: boolean;
  path: string;
  title?: string;
  engine?: string;
  bpm?: number;
  transients?: number[];
  error?: string;
}

export class AiMusicGenerator {
  /**
   * Fetches or generates a background soundtrack via lightweight cloud APIs or zero-key public track libraries.
   * Eliminates local hardware load and integrates with serverless pipelines.
   */
  static async fetchCloudSoundtrack(
    prompt: string,
    durationSec: number = 30,
    outPath: string = 'public/audio/soundtrack.mp3'
  ): Promise<CloudMusicResult> {
    console.log(`☁️ [REA Cloud Music Engine] Querying cloud audio provider for prompt: "${prompt}"...`);
    console.log(`   Target Duration: ${durationSec}s | Destination: ${outPath}`);

    const resolvedPath = path.resolve(process.cwd(), outPath);
    fs.ensureDirSync(path.dirname(resolvedPath));

    const cloudApiUrl = process.env.CLOUD_MUSIC_API_URL || 'https://api.freetouse.com/v3/tracks';

    try {
      // Connect to lightweight cloud audio API with a 6-second timeout
      const response = await axios.get(cloudApiUrl, {
        params: { search: prompt, limit: 1 },
        timeout: 6000,
      });

      const track = response.data?.[0];
      if (track && track.audio_url) {
        console.log(`📥 Downloading track: "${track.title}" from cloud catalog...`);
        const audioStream = await axios({
          url: track.audio_url,
          method: 'GET',
          responseType: 'stream',
          timeout: 15000,
        });

        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(resolvedPath);
          audioStream.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Generate companion metadata
        const bpm = track.bpm || 128;
        const metadata = {
          title: track.title,
          prompt,
          durationSec,
          bpm,
          engine: 'cloud-api',
          sourceUrl: track.audio_url,
          generatedAt: new Date().toISOString(),
        };
        fs.writeFileSync(`${resolvedPath}.meta.json`, JSON.stringify(metadata, null, 2));

        console.log(`✅ Soundtrack successfully saved to: ${resolvedPath}`);
        return { success: true, path: resolvedPath, title: track.title, engine: 'cloud-api' };
      } else {
        throw new Error('No matching cloud track found for the given prompt.');
      }
    } catch (error: any) {
      console.warn(`⚠️ Cloud music fetch failed: ${error.message}. Activating resilient fallback...`);

      // Resilient Fallback: Select an authentic studio track from local library instead of writing corrupt 0-byte file
      const studioTrack = path.resolve(process.cwd(), 'public/audio/active-phonk.mp3');
      const backupTrack = path.resolve(process.cwd(), 'public/music/phonk/dastras-aggressive-phonk-140bpm.wav');

      if (fs.existsSync(studioTrack)) {
        console.log(`🎵 [Fallback] Sourcing authentic studio phonk audio from: ${path.basename(studioTrack)}`);
        fs.copyFileSync(studioTrack, resolvedPath);
      } else if (fs.existsSync(backupTrack)) {
        console.log(`🎵 [Fallback] Sourcing authentic track from: ${path.basename(backupTrack)}`);
        fs.copyFileSync(backupTrack, resolvedPath);
      } else {
        // Generate valid, clean PCM silence/ambient bed (never an unparseable 0-byte file)
        console.log(`🎹 [Fallback] Synthesizing valid PCM ambient bed buffer...`);
        const sampleRate = 44100;
        const numSamples = Math.floor(sampleRate * Math.min(durationSec, 5));
        const buffer = Buffer.alloc(44 + numSamples * 2);
        buffer.write('RIFF', 0);
        buffer.writeUInt32LE(36 + numSamples * 2, 4);
        buffer.write('WAVE', 8);
        buffer.write('fmt ', 12);
        buffer.writeUInt32LE(16, 16);
        buffer.writeUInt16LE(1, 20); // PCM
        buffer.writeUInt16LE(1, 22); // mono
        buffer.writeUInt32LE(sampleRate, 24);
        buffer.writeUInt32LE(sampleRate * 2, 28);
        buffer.writeUInt16LE(2, 32);
        buffer.writeUInt16LE(16, 34);
        buffer.write('data', 36);
        buffer.writeUInt32LE(numSamples * 2, 40);
        fs.writeFileSync(resolvedPath, buffer);
      }

      const fallbackMeta = {
        title: 'Studio Fallback Soundtrack',
        prompt,
        durationSec,
        bpm: 140,
        engine: 'studio-asset-fallback',
        generatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(`${resolvedPath}.meta.json`, JSON.stringify(fallbackMeta, null, 2));

      return {
        success: false,
        path: resolvedPath,
        title: 'Studio Fallback Soundtrack',
        engine: 'studio-asset-fallback',
        error: error.message,
      };
    }
  }

  /**
   * Backwards-compatible soundtrack generation handler.
   */
  static async generateSoundtrack(
    prompt: string,
    durationSec: number = 30,
    bpm: number = 128,
    outPath: string = 'public/audio/custom_soundtrack.mp3'
  ) {
    return this.fetchCloudSoundtrack(prompt, durationSec, outPath);
  }
}
