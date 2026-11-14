import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ChunkCacheEntry {
  hash: string;
  chunkPath: string;
  timestamp: string;
  sizeBytes: number;
}

/**
 * Asset Caching & Hash Mapping Engine (Content-Addressable Chunk Cache)
 * Hashes composition props and React render trees using SHA-256 to reuse pre-rendered
 * video chunks, skipping redundant Chromium render cycles across multi-video campaigns.
 */
export class AssetCacheHasher {
  private cacheDir: string;
  private manifestPath: string;
  private cache: Record<string, ChunkCacheEntry> = {};

  constructor(cacheDir: string = path.join(process.cwd(), '.rea-cache')) {
    this.cacheDir = cacheDir;
    this.manifestPath = path.join(cacheDir, 'cache-manifest.json');
    fs.mkdirSync(this.cacheDir, { recursive: true });
    this.loadManifest();
  }

  private loadManifest(): void {
    if (fs.existsSync(this.manifestPath)) {
      try {
        this.cache = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
      } catch {
        this.cache = {};
      }
    }
  }

  private saveManifest(): void {
    fs.writeFileSync(this.manifestPath, JSON.stringify(this.cache, null, 2), 'utf8');
  }

  public computeHash(compositionId: string, props: Record<string, any>): string {
    const serialized = JSON.stringify({ compositionId, props }, Object.keys(props).sort());
    return crypto.createHash('sha256').update(serialized).digest('hex').slice(0, 16);
  }

  public getCachedChunk(hash: string): string | null {
    const entry = this.cache[hash];
    if (entry && fs.existsSync(entry.chunkPath)) {
      return entry.chunkPath;
    }
    return null;
  }

  public registerChunk(hash: string, chunkFile: string): void {
    if (!fs.existsSync(chunkFile)) return;
    const stats = fs.statSync(chunkFile);
    this.cache[hash] = {
      hash,
      chunkPath: path.resolve(chunkFile),
      timestamp: new Date().toISOString(),
      sizeBytes: stats.size,
    };
    this.saveManifest();
  }
}
