import IngredientsTable from './IngredientsTable';
import SNSRecipeCreated from './SNSRecipeCreated';
import { SQSRecipeProcess, SQSRecipeProcessPolicy } from './SQSRecipeProcess';

export const resources = {
  Resources: {
    IngredientsTable,
    SNSRecipeCreated,
    SQSRecipeProcess,
    SQSRecipeProcessPolicy,
  },
};
