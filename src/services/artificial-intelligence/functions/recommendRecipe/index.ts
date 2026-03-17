import Config from '../../config/Config';

const lambda = {
  handler: 'functions/recommendRecipe/handler.recommendRecipe',
  description: 'Recommend a recipe based on the ingredients available',
  environment: {
    TABLE_RECIPES_DYNAMODB: Config.TABLE_RECIPES_DYNAMODB,
  },
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