import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';
import { resources } from './resources';

module.exports = createService(
  'restaurant-orders',
  functions as unknown as AWS['functions'],
  resources as AWS['resources'],
);
