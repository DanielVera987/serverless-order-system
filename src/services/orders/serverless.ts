import { createService } from '../serverless.base';

module.exports = createService('restaurant-orders', {
  getOrders: {
    handler: 'handler.getOrders',
    events: [
      { 
        http: { 
          path: '/orders', 
          method: 'get', 
          cors: true 
        } 
      }
    ],
  },
});
