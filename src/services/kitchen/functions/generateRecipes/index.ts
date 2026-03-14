const SQS_ORDERS_PROCESS_ARN = {
  'Fn::Join': ['', [
    'arn:aws:sqs:${aws:region}:${aws:accountId}:',
    'restaurant-orders-${sls:stage}-orders-process.fifo',
  ]],
};

const lambda = {
  handler: 'functions/generateRecipes/handler.generateRecipes',
  description: 'Generate recipes',
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