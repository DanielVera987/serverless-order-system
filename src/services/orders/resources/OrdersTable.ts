const OrdersTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:service}-${self:provider.stage}-orders',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
  },
};

export default OrdersTable;
