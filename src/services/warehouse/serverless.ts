import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';
import { resources } from './resources';

const serverless = {
  service: 'restaurant-warehouse',
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
    },
    {
      Effect: 'Allow',
      Action: [
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
      ],
      Resource: '*',
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:PutItem',
        'dynamodb:Scan',
      ],
      Resource: '*',
    },
    {
      Effect: 'Allow',
      Action: 'sns:Publish',
      Resource: '*',
    },
  ],
};

module.exports = createService(
  serverless.service,
  serverless.functions,
  {
    resources: serverless.resources,
    iamStatements: serverless.iamStatements,
  },
);
