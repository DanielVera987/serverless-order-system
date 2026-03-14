import Config from '../../config/Config';

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
        cors: true 
      } 
    }
  ],
}

export default lambda;