import Config from '../../config/Config';
import { corsConfig } from '../../../serverless.base';

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
        cors: corsConfig,
      },
    }
  ],
}

export default lambda;