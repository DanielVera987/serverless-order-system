import type { AWS } from '@serverless/typescript';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export const baseConfig: DeepPartial<AWS> = {
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
    // TODO: enhance this
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:PutItem',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:GetItem',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:UpdateItem',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:DeleteItem',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:Scan',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:BatchWriteItem',
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: 'sns:Publish',
            Resource: '*',
          }
        ],
      },
    },
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
