const SQS_ORDERS_PROCESS_ARN = {
  'Fn::Join': ['', [
    'arn:aws:sqs:${aws:region}:${aws:accountId}:',
    'restaurant-orders-${sls:stage}-orders-process.fifo',
  ]],
};

const lambda = {
  handler: 'functions/generateRecipes/handler.generateRecipes',
  description: 'Generate recipes',
  environment: {
    ORDERS_TABLE: 'restaurant-orders-${sls:stage}-orders',
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
  },
  events: [
    { 
      sqs: {
        arn: SQS_ORDERS_PROCESS_ARN,
        batchSize: 1,
      },
    }
  ],
}

export default lambda;