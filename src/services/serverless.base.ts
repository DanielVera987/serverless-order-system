import path from 'path';
import dotenv from 'dotenv';
import type { AWS } from '@serverless/typescript';
import allowedOrigins from '../context/shared/infrastructure/cors/allowedOrigins';

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

export const corsConfig = {
  origin: '*',
  headers: [
    'Content-Type',
    'Authorization',
    'X-Api-Key',
    'X-Amz-Date',
    'X-Amz-Security-Token',
  ],
  allowCredentials: false,
};

const LAYER_ARN = '${ssm:/restaurant/layer/${sls:stage}/deps-arn}';

const EXTERNAL_PACKAGES = [
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/client-sns',
  '@aws-sdk/client-sqs',
  '@aws-sdk/lib-dynamodb',
  'axios',
  'inversify',
  'openai',
  'reflect-metadata',
  'uuid',
  'zod',
];

export const baseConfig: DeepPartial<AWS> = {
  frameworkVersion: '3',
  useDotenv: true,
  package: {
    individually: true,
    patterns: [
      "!**/node_modules/**", "!node_modules/"
    ]
  },
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
    tags: {
      environment: '${opt:stage, "dev"}',
      project_name: "${env:PROJECT_NAME, 'restaurant'}",
      department: "${env:DEPARTMENT, 'department_it'}",
      cost_center: "${env:COST_CENTER, 'cost_center'}",
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node20',
      platform: 'node',
      external: EXTERNAL_PACKAGES,
      exclude: EXTERNAL_PACKAGES,
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

  const functionsWithLayer = Object.fromEntries(
    Object.entries(functions ?? {}).map(([name, fn]) => [
      name,
      { ...fn, layers: [LAYER_ARN] },
    ]),
  ) as AWS['functions'];

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
    functions: functionsWithLayer,
    ...(options?.resources && { resources: options.resources }),
  } as AWS;
}
