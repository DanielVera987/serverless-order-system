import Config from '../../config/Config';
import { corsConfig } from '../../../serverless.base';

const lambda = {
  handler: 'functions/getIngredients/handler.getIngredients',
  description: 'Get ingredients',
  environment: {
    INGREDIENTS_TABLE: Config.TABLE_INGREDIENTS_DYNAMODB,
  },
  events: [
    { 
      http: {
        path: '/ingredients',
        method: 'get',
        cors: corsConfig,
      },
    }
  ],
}

export default lambda;