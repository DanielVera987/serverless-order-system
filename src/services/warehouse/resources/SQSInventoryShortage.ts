import Config from '../config/Config';

export const SQSInventoryShortageDLQ = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_INVENTORY_SHORTAGE_DLQ,
        FifoQueue: true,
        MessageRetentionPeriod: 432000,
    },
};

export const SQSInventoryShortage = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_INVENTORY_SHORTAGE_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 60,
        RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSInventoryShortageDLQ', 'Arn'] },
            maxReceiveCount: 6,
        },
    },
};

export const SQSInventoryShortagePolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSInventoryShortage' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSInventoryShortage', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSInventoryShortage' },
                        },
                    },
                },
            ],
        },
    },
};
