import Config from '../config/Config';

const OrdersTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: Config.TABLE_ORDERS_DYNAMODB,
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
