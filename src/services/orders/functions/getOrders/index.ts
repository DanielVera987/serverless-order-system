const lambda = {
  handler: 'functions/getOrders/handler.getOrders',
  description: 'Get all orders',
  environment: {
    ORDERS_TABLE: '${self:service}-${self:provider.stage}-orders',
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