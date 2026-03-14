const lambda = {
  handler: 'functions/postOrders/handler.postOrders',
  description: 'Create a number of orders',
  environment: {
    ORDERS_TABLE: '${self:service}-${self:provider.stage}-orders',
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