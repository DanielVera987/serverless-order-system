const SQS_RECIPE_PROCESS_ARN = {
  'Fn::Join': ['', [
    'arn:aws:sqs:${aws:region}:${aws:accountId}:',
    'restaurant-kitchen-${sls:stage}-recipe-process.fifo',
  ]],
};

const lambda = {
  handler: 'functions/checkInventory/handler.checkInventory',
  description: 'Check ingredient inventory for recipe assignments',
  environment: {
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
    SNS_INVENTORY_READY_ARN: { Ref: 'SNSInventoryReady' },
    SNS_INVENTORY_SHORTAGE_ARN: { Ref: 'SNSInventoryShortage' },
  },
  events: [
    {
      sqs: {
        arn: SQS_RECIPE_PROCESS_ARN,
        batchSize: 10,
      },
    },
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['SQSRestockQueue', 'Arn'] },
        batchSize: 10,
      },
    },
  ],
};

export default lambda;
