import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';
import { resources } from './resources/index';

const serverless = {
  service: 'restaurant-artificial-intelligence',
  functions: functions as unknown as AWS['functions'],
  resources: resources as AWS['resources'],
  iamStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:BatchWriteItem',
      ],
      Resource: '*',
    }
  ],
};

module.exports = createService(
  serverless.service,
  serverless.functions,
  {
    resources: serverless.resources,
    iamStatements: serverless.iamStatements,
    environment: {
      GROQ_API_URL: process.env.GROQ_API_URL ?? '',
      GROQ_API_KEY: process.env.GROQ_API_KEY ?? '',
      GROQ_MODEL: process.env.GROQ_MODEL ?? '',
      RESTAURANT_AI_API_URL: process.env.RESTAURANT_AI_API_URL ?? '',
    },
  },
);
