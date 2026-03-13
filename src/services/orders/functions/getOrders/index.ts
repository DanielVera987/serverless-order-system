const lambda = {
  handler: 'functions/getOrders/handler.getOrders',
  description: 'Get all orders',
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