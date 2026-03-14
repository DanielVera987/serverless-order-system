import Config from '../config/Config';

const IngredientsTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: Config.TABLE_INGREDIENTS_DYNAMODB,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'name', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'name', KeyType: 'HASH' },
    ],
  },
};

export default IngredientsTable;
