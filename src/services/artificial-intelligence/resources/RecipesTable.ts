import Config from "../config/Config";

export default {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
        TableName: Config.TABLE_RECIPES_DYNAMODB,
        AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
        ],
        KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    }
}