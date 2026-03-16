import path from 'path';
import dotenv from 'dotenv';
import type { AWS } from '@serverless/typescript';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

type IamStatement = {
  Effect: string;
  Action: string | string[];
  Resource: string | Record<string, unknown>;
};

const baseStatements: IamStatement[] = [
  {
    Effect: 'Allow',
    Action: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
    ],
    Resource: '*',
  },
];

export const baseConfig: DeepPartial<AWS> = {
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
  },
  package: {
    individually: true,
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
  options?: {
    resources?: DeepPartial<AWS['resources']>;
    iamStatements?: IamStatement[];
    environment?: Record<string, string>;
  },
): AWS {
  const statements = [...baseStatements, ...(options?.iamStatements ?? [])];

  return {
    ...baseConfig,
    service: serviceName,
    provider: {
      ...baseConfig.provider,
      iam: {
        role: {
          statements,
        },
      },
      ...(options?.environment && { environment: options.environment }),
    },
    functions,
    ...(options?.resources && { resources: options.resources }),
  } as AWS;
}
