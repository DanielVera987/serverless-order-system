import Config from '../config/Config';

export const SQSInventoryReadyDLQ = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_INVENTORY_READY_DLQ,
        FifoQueue: true,
        MessageRetentionPeriod: 432000,
    },
};

export const SQSInventoryReady = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_INVENTORY_READY_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 60,
        RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSInventoryReadyDLQ', 'Arn'] },
            maxReceiveCount: 6,
        },
    },
};

export const SQSInventoryReadyPolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSInventoryReady' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSInventoryReady', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSInventoryReady' },
                        },
                    },
                },
            ],
        },
    },
};
