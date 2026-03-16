const lambda = {
  handler: 'functions/recommendRecipe/handler.recommendRecipe',
  description: 'Recommend a recipe based on the ingredients available',
  events: [
    { 
      http: { 
        path: '/recommend-recipe', 
        method: 'get', 
        cors: true 
      } 
    }
  ],
}

export default lambda;