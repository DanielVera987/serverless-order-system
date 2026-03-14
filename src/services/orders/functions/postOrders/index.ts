import Config from '../../config/Config';

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
        cors: true 
      } 
    }
  ],
}

export default lambda;