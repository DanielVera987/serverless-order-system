import Config from '../config/Config';

export const SQSBuyMarket = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_BUY_MARKET_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 60,
    },
};

export const SQSBuyMarketPolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSBuyMarket' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSBuyMarket', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSIngredientsNeeded' },
                        },
                    },
                },
            ],
        },
    },
};
