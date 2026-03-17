import Config from '../../config/Config';
import { corsConfig } from '../../../serverless.base';

const lambda = {
  handler: 'functions/postIngredient/handler.postIngredient',
  description: 'Create a ingredient',
  environment: {
    INGREDIENTS_TABLE: Config.TABLE_INGREDIENTS_DYNAMODB,
  },
  events: [
    { 
      http: { 
        path: '/ingredient', 
        method: 'post', 
        cors: corsConfig,
      } 
    }
  ],
}

export default lambda;