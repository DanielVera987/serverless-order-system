import Config from "../../config/Config";
import { corsConfig } from '../../../serverless.base';

const lambda = {
  handler: 'functions/getOrders/handler.getOrders',
  description: 'Get all orders',
  environment: {
    ORDERS_TABLE: Config.TABLE_ORDERS_DYNAMODB,
  },
  events: [
    { 
      http: { 
        path: '/orders', 
        method: 'get', 
        cors: corsConfig,
      } 
    }
  ],
}

export default lambda;