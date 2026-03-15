import Config from '../config/Config';

const SNSIngredientsPurchased = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_INGREDIENTS_PURCHASED_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSRestockQueue', 'Arn'] },
            },
        ],
    },
};

export default SNSIngredientsPurchased;
