import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';

module.exports = createService('restaurant-orders',
  functions as unknown as AWS['functions']
);
