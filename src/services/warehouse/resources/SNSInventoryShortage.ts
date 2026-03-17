import Config from '../config/Config';

const SNSInventoryShortage = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_INVENTORY_SHORTAGE_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSInventoryShortage', 'Arn'] },
            },
        ],
    },
};

export default SNSInventoryShortage;
