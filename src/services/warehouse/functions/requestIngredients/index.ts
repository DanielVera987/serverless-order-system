const lambda = {
  handler: 'functions/requestIngredients/handler.requestIngredients',
  description: 'Request missing ingredients from the farmers market when there is a stock shortage',
  environment: {
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
    SNS_INGREDIENTS_NEEDED_ARN: { Ref: 'SNSIngredientsNeeded' },
  },
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['SQSInventoryShortage', 'Arn'] },
        batchSize: 10,
      },
    },
  ],
};

export default lambda;
