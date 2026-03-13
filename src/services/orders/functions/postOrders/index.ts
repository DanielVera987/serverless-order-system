const lambda = {
  handler: 'functions/postOrders/handler.postOrders',
  description: 'Create a new order',
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