import Config from '../config/Config';

const SNSOrderReady = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_ORDER_READY_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSOrderDelivery', 'Arn'] },
            },
        ],
    },
};

export default SNSOrderReady;
