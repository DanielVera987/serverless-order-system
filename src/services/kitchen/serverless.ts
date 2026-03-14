import type { AWS } from '@serverless/typescript';
import { createService } from '../serverless.base';
import { functions } from './index';

module.exports = createService(
  'restaurant-kitchen',
  functions as unknown as AWS['functions'],
);
