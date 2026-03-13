import type { AWS } from '@serverless/typescript';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export const baseConfig: DeepPartial<AWS> = {
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
  },
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
  ],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node20',
      platform: 'node',
    },
  },
};

export function createService(
  serviceName: string,
  functions: AWS['functions'],
  resources?: DeepPartial<AWS['resources']>,
): AWS {
  return {
    ...baseConfig,
    service: serviceName,
    functions,
    ...(resources && { resources }),
  } as AWS;
}
