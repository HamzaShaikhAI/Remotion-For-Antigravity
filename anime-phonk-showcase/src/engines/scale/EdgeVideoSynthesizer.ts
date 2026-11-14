/**
 * Edge Video Generation (Cloudflare Workers / Fastly VCL)
 *
 * Compiles personalized video streams directly at the edge network layer
 * without hitting centralized origin render servers.
 */

export interface EdgeManifest {
  manifestVersion: string;
  edgeRegion: string;
  compositionId: string;
  cachedFragments: string[];
}

export class EdgeVideoSynthesizer {
  public static createEdgeManifest(compositionId: string, region: string, fragments: string[]): EdgeManifest {
    return {
      manifestVersion: '4.0.0-edge',
      edgeRegion: region,
      compositionId,
      cachedFragments: fragments,
    };
  }
}
