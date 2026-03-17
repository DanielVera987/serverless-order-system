import Config from '../../config/Config';
import { corsConfig } from '../../../serverless.base';

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
        cors: corsConfig,
      } 
    }
  ],
}

export default lambda;