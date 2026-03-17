import Config from '../../config/Config';

const lambda = {
  handler: 'functions/getRecipes/handler.getRecipes',
  description: 'Get recipes',
  environment: {
    TABLE_RECIPES_DYNAMODB: Config.TABLE_RECIPES_DYNAMODB,
  },
  events: [
    { 
      http: {
        path: '/recipes',
        method: 'get',
        cors: true,
      },
    }
  ],
}

export default lambda;