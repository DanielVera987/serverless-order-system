import Config from '../config/Config';

const SNSIngredientsNeeded = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_INGREDIENTS_NEEDED_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSBuyMarket', 'Arn'] },
            },
        ],
    },
};

export default SNSIngredientsNeeded;
