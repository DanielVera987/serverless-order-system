import Config from '../config/Config';

export const SQSOrderDeliveryDLQ = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_ORDER_DELIVERY_DLQ,
        FifoQueue: true,
        MessageRetentionPeriod: 432000,
    },
};

export const SQSOrderDelivery = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_ORDER_DELIVERY_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 30,
        RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSOrderDeliveryDLQ', 'Arn'] },
            maxReceiveCount: 6,
        },
    },
};

export const SQSOrderDeliveryPolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSOrderDelivery' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSOrderDelivery', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSOrderReady' },
                        },
                    },
                },
            ],
        },
    },
};
