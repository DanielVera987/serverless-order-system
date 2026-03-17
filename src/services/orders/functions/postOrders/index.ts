import Config from '../../config/Config';
import { corsConfig } from '../../../serverless.base';

const lambda = {
  handler: 'functions/postOrders/handler.postOrders',
  description: 'Create a number of orders',
  environment: {
    ORDERS_TABLE: Config.TABLE_ORDERS_DYNAMODB,
    SNS_ORDERS_CREATED_ARN: { Ref: 'SNSOrdersCreated' },
  },
  events: [
    { 
      http: { 
        path: '/orders', 
        method: 'post', 
        cors: corsConfig,
      } 
    }
  ],
}

export default lambda;