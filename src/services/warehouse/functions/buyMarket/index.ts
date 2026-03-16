const lambda = {
  handler: 'functions/buyMarket/handler.buyMarket',
  description: 'Buy ingredients from the farmers market',
  environment: {
    FARMERS_MARKET_BASE_URL: 'https://recruitment.alegra.com/api/farmers-market/buy',
    INGREDIENTS_TABLE: 'restaurant-kitchen-${sls:stage}-ingredients',
    SNS_INGREDIENTS_PURCHASED_ARN: { Ref: 'SNSIngredientsPurchased' },
    TABLE_PURCHASE_HISTORY: 'restaurant-warehouse-${sls:stage}-purchase-history',
  },
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['SQSBuyMarket', 'Arn'] },
        batchSize: 1,
      },
    },
  ],
};

export default lambda;
  