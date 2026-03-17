import Config from "../config/Config";

const SNSOrdersCreated = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_ORDERS_CREATED_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSOrdersProcess', 'Arn'] }
            },
        ],
    },
};

export default SNSOrdersCreated;