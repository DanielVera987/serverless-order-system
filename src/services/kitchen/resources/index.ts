import IngredientsTable from './IngredientsTable';
import SNSRecipeCreated from './SNSRecipeCreated';
import { SQSRecipeProcess, SQSRecipeProcessDLQ, SQSRecipeProcessPolicy } from './SQSRecipeProcess';
import { SNSDLQAlarm, RecipeProcessDLQAlarm } from './DLQAlarm';

export const resources = {
  Resources: {
    IngredientsTable,
    SNSRecipeCreated,
    SQSRecipeProcessDLQ,
    SQSRecipeProcess,
    SQSRecipeProcessPolicy,
    SNSDLQAlarm,
    RecipeProcessDLQAlarm,
  },
};
