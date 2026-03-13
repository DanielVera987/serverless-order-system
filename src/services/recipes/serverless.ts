import { createService } from '../serverless.base';

module.exports = createService('restaurant-recipes', {
  getRecipes: {
    handler: 'handler.getRecipes',
    events: [
      { 
        http: { 
          path: '/recipes', 
          method: 'get', 
          cors: true 
        } 
      }
    ],
  },
});
