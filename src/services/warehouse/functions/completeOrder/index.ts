const lambda = {
  handler: 'functions/completeOrder/handler.completeOrder',
  description: 'Update orders to delivered status',
  environment: {
    ORDERS_TABLE: 'restaurant-orders-${sls:stage}-orders',
  },
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['SQSOrderDelivery', 'Arn'] },
        batchSize: 1,
      },
    },
  ],
};

export default lambda;
