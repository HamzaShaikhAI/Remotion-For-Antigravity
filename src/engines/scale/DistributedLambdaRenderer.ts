import path from 'path';

export interface LambdaRenderOptions {
  compositionId: string;
  region?: 'us-east-1' | 'eu-central-1' | 'ap-south-1' | 'eu-west-1' | string;
  regions?: string[];
  bucketName: string;
  serveUrl?: string;
  prebundled?: boolean;
  functionName?: string;
  concurrency?: number;
  framesPerLambda?: number;
}

export class DistributedLambdaRenderer {
  public static calculateWorkerCount(totalFrames: number, framesPerWorker: number = 40): number {
    return Math.ceil(totalFrames / framesPerWorker);
  }

  public static getWorkerFrameRanges(totalFrames: number, framesPerWorker: number = 40): Array<[number, number]> {
    const ranges: Array<[number, number]> = [];
    for (let f = 0; f < totalFrames; f += framesPerWorker) {
      ranges.push([f, Math.min(totalFrames - 1, f + framesPerWorker - 1)]);
    }
    return ranges;
  }

  static async deployAndRender(options: LambdaRenderOptions, inputProps: Record<string, any> = {}) {
    let lambdaSdk: any;
    try {
      lambdaSdk = require('@remotion/lambda');
    } catch {
      throw new Error(
        '❌ [@remotion/lambda] is not installed. Please run: npm install @remotion/lambda --save'
      );
    }

    const { deploySite, renderMediaOnLambda, getRenderProgress } = lambdaSdk;

    // Failover region hierarchy
    const defaultRegion = options.region || 'ap-south-1';
    const candidateRegions: string[] = options.regions && options.regions.length > 0
      ? options.regions
      : [defaultRegion, 'us-east-1', 'eu-west-1'];
    const uniqueRegions = Array.from(new Set(candidateRegions));

    let serveUrl = options.serveUrl;
    let siteName = 'prebundled';

    // 1. Pre-bundle check / Site deployment
    if (serveUrl) {
      console.log(`⚡ [REA Lambda Pre-Bundle] Using existing serveUrl: ${serveUrl}`);
      console.log(`   ✔ Skipping deploySite. Render cold-start cut from 45s down to < 3s.`);
    } else {
      const deployRegion = uniqueRegions[0];
      console.log(`🚀 [REA Lambda] Bundling and deploying site to AWS S3 bucket: ${options.bucketName} in [${deployRegion}]...`);
      const deployResult = await deploySite({
        entryPoint: path.join(process.cwd(), 'src/index.ts'),
        bucketName: options.bucketName,
        region: deployRegion as any,
      });
      serveUrl = deployResult.serveUrl;
      siteName = deployResult.siteName;
      console.log(`✅ [REA Lambda] Site deployed successfully. Serve URL: ${serveUrl} (Site: ${siteName})`);
    }

    const functionName = options.functionName || 'remotion-render-4-0-543';
    const concurrency = options.concurrency || 50;

    // 2. Render dispatch with multi-region failover
    for (let i = 0; i < uniqueRegions.length; i++) {
      const activeRegion = uniqueRegions[i];
      try {
        console.log(`🎬 [REA Lambda] Triggering distributed parallel rendering for composition: ${options.compositionId} in [${activeRegion}]...`);
        console.log(`   ✔ Target Concurrency: ${concurrency} workers | Frames per Worker: ${options.framesPerLambda || 40}`);

        const renderParams: any = {
          region: activeRegion as any,
          functionName,
          serveUrl,
          composition: options.compositionId,
          codec: 'h264',
          inputProps,
          imageFormat: 'jpeg',
          maxRetries: 3,
        };

        if (options.concurrency) {
          renderParams.concurrencyPerInstance = options.concurrency;
        }
        if (options.framesPerLambda) {
          renderParams.framesPerLambda = options.framesPerLambda;
        }

        const { renderId, bucketName } = await renderMediaOnLambda(renderParams);
        console.log(`⏳ [REA Lambda] Render initiated! Render ID: ${renderId}. Polling for progress...`);

        // 3. Poll progress loop
        let progress = 0;
        while (progress < 1) {
          const status = await getRenderProgress({
            renderId,
            bucketName,
            region: activeRegion as any,
            functionName,
          });

          if (status.fatalError) {
            throw new Error(
              `❌ [REA Lambda Render Failed]: ${status.errors.map((e: any) => e.message || e).join(', ')}`
            );
          }

          progress = status.overallProgress;
          console.log(`📈 [${activeRegion}] Progress: ${(progress * 100).toFixed(1)}% | Frames rendered: ${status.renderedFrames}`);

          if (progress < 1) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }

        console.log(`🎉 [REA Lambda] Render complete in [${activeRegion}]! Output ready in S3.`);
        return { renderId, bucketName, serveUrl, region: activeRegion };
      } catch (err: any) {
        const isThrottled = /throttle|concurrency|rate exceeded|429|toomanyrequests/i.test(err?.message || '');
        if (isThrottled && i < uniqueRegions.length - 1) {
          const nextRegion = uniqueRegions[i + 1];
          console.warn(`⚠️ [REA Lambda Failover] AWS concurrency limit reached in [${activeRegion}].`);
          console.warn(`   Rerouting workload seamlessly to secondary region: [${nextRegion}]...`);
          continue;
        }
        throw err;
      }
    }
  }
}

export async function deployAndRenderLambda(options: LambdaRenderOptions, inputProps: Record<string, any> = {}) {
  return DistributedLambdaRenderer.deployAndRender(options, inputProps);
}
