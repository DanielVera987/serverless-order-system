import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';

const serverless = {
  service: 'restaurant-kitchen',
  functions: functions as unknown as AWS['functions'],
  iamStatements: [
    {
      Effect: 'Allow',
      Action: [
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
      ],
      Resource: '*',
    },
  ],
};

module.exports = createService(
  serverless.service, 
  serverless.functions, 
  {
    iamStatements: serverless.iamStatements,
  },
);
