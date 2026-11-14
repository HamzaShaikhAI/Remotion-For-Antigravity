import path from 'path';

export interface LambdaRenderOptions {
  compositionId: string;
  region: 'us-east-1' | 'eu-central-1' | 'ap-south-1' | string;
  bucketName: string;
  serveUrl?: string;
  functionName?: string;
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
    console.log(`🚀 [REA Lambda] Bundling and deploying site to AWS S3 bucket: ${options.bucketName}...`);

    let lambdaSdk: any;
    try {
      lambdaSdk = require('@remotion/lambda');
    } catch {
      throw new Error(
        '❌ [@remotion/lambda] is not installed. Please run: npm install @remotion/lambda --save'
      );
    }

    const { deploySite, renderMediaOnLambda, getRenderProgress } = lambdaSdk;

    // 1. Deploy bundle to AWS Lambda / S3
    const { serveUrl, siteName } = await deploySite({
      entryPoint: path.join(process.cwd(), 'src/index.ts'),
      bucketName: options.bucketName,
      region: options.region as any,
    });

    console.log(`✅ [REA Lambda] Site deployed successfully. Serve URL: ${serveUrl} (Site: ${siteName})`);
    console.log(`🎬 [REA Lambda] Triggering distributed parallel rendering for composition: ${options.compositionId}...`);

    // 2. Trigger serverless multi-worker render
    const functionName = options.functionName || 'remotion-render-4-0-543';
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: options.region as any,
      functionName,
      serveUrl,
      composition: options.compositionId,
      codec: 'h264',
      inputProps,
      imageFormat: 'jpeg',
      maxRetries: 3,
    });

    console.log(`⏳ [REA Lambda] Render initiated! Render ID: ${renderId}. Polling for progress...`);

    // 3. Poll progress loop
    let progress = 0;
    while (progress < 1) {
      const status = await getRenderProgress({
        renderId,
        bucketName,
        region: options.region as any,
        functionName,
      });

      if (status.fatalError) {
        throw new Error(
          `❌ [REA Lambda Render Failed]: ${status.errors.map((e: any) => e.message || e).join(', ')}`
        );
      }

      progress = status.overallProgress;
      console.log(`📈 Progress: ${(progress * 100).toFixed(1)}% | Frames rendered: ${status.renderedFrames}`);

      if (progress < 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    console.log(`🎉 [REA Lambda] Render complete! Output downloaded from S3.`);
    return { renderId, bucketName, serveUrl };
  }
}
