import Config from '../config/Config';

const SNSInventoryReady = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_INVENTORY_READY_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSInventoryReady', 'Arn'] },
            },
        ],
    },
};

export default SNSInventoryReady;
