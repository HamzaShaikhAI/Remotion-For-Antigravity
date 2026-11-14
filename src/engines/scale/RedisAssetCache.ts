import crypto from 'crypto';

/**
 * Content-Addressable Redis Asset Caching
 *
 * Hashes React component trees and prop state into SHA-256 keys.
 * Unchanged video acts (e.g. intro logos, sponsors, unchanged combat slices)
 * are served directly from cache without re-rendering Chromium pixels.
 */

export class RedisAssetCache {
  public static computeChunkHash(props: Record<string, any>, componentCodeSnippet: string): string {
    const serialized = JSON.stringify({ props, componentCodeSnippet });
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  public static isChunkCached(cacheMap: Map<string, string>, chunkHash: string): boolean {
    return cacheMap.has(chunkHash);
  }
}
