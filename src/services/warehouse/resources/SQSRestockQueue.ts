import Config from '../config/Config';

export const SQSRestockQueue = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_RESTOCK_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 30,
    },
};

export const SQSRestockQueuePolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSRestockQueue' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSRestockQueue', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSIngredientsPurchased' },
                        },
                    },
                },
            ],
        },
    },
};
