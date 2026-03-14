import Config from "../../config/Config";

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
        cors: true 
      } 
    }
  ],
}

export default lambda;