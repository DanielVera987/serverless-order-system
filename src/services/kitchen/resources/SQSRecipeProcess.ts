import Config from "../config/Config";

export const SQSRecipeProcessDLQ = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_RECIPE_PROCESS_DLQ,
        FifoQueue: true,
        MessageRetentionPeriod: 432000,
    },
};

export const SQSRecipeProcess = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_RECIPE_PROCESS_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 30,
        RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSRecipeProcessDLQ', 'Arn'] },
            maxReceiveCount: 6,
        },
    },
};

export const SQSRecipeProcessPolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSRecipeProcess' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSRecipeProcess', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSRecipeCreated' },
                        },
                    },
                },
            ],
        },
    },
};