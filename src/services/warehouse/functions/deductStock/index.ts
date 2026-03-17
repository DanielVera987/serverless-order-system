const lambda = {
  handler: 'functions/deductStock/handler.deductStock',
  description: 'Atomically deduct stock for inventory-ready assignments',
  environment: {
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
    SNS_ORDER_READY_ARN: { Ref: 'SNSOrderReady' },
    SNS_INVENTORY_SHORTAGE_ARN: { Ref: 'SNSInventoryShortage' },
  },
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['SQSInventoryReady', 'Arn'] },
        batchSize: 10,
      },
    },
  ],
};

export default lambda;
