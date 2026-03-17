const SQS_ORDERS_PROCESS_ARN = {
  'Fn::Join': ['', [
    'arn:aws:sqs:${aws:region}:${aws:accountId}:',
    'restaurant-orders-${sls:stage}-orders-process.fifo',
  ]],
};

const lambda = {
  handler: 'functions/generateRecipes/handler.generateRecipes',
  description: 'Generate recipes',
  timeout: 120,
  memorySize: 512,
  environment: {
    ORDERS_TABLE: 'restaurant-orders-${sls:stage}-orders',
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
    SNS_RECIPE_CREATED_ARN: { Ref: 'SNSRecipeCreated' },
    SQS_RECIPE_PROCESS_QUEUE: { Ref: 'SQSRecipeProcess' },
  },
  events: [
    { 
      sqs: {
        arn: SQS_ORDERS_PROCESS_ARN,
        batchSize: 10,
      },
    }
  ],
}

export default lambda;