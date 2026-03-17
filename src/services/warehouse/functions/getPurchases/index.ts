import Config from "../../config/Config";
import { corsConfig } from '../../../serverless.base';

const lambda = {
    handler: 'functions/getPurchases/handler.getPurchases',
    description: 'Get purchases',
    environment: {
      TABLE_PURCHASE_HISTORY: Config.TABLE_PURCHASE_HISTORY,
    },
    events: [
        {
            http: {
                path: '/purchases',
                method: 'get',
                cors: corsConfig,
            },
        },
    ],
  };
  
  export default lambda;
  