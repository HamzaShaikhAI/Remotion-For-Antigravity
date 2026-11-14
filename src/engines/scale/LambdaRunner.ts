export interface LambdaRenderConfig {
  region: string;
  functionName: string;
  bucketName: string;
  concurrencyLimit: number;
}

/**
 * Serverless Concurrency Engine (@remotion/lambda Harness)
 * Dispatches mass render batches across thousands of parallel AWS Lambda cloud workers,
 * compiling a month's worth of multi-channel video content in seconds.
 */
export function getLambdaDeploymentConfig(): LambdaRenderConfig {
  return {
    region: process.env.REMOTION_AWS_REGION || 'us-east-1',
    functionName: process.env.REMOTION_LAMBDA_NAME || 'rea-remotion-render-worker',
    bucketName: process.env.REMOTION_S3_BUCKET || 'rea-remotion-render-cache',
    concurrencyLimit: parseInt(process.env.REMOTION_LAMBDA_CONCURRENCY || '200', 10),
  };
}
