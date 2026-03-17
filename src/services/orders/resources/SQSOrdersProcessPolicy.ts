const SQSOrdersProcessPolicy = {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
        Queues: [{ Ref: 'SQSOrdersProcess' }],
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'sns.amazonaws.com' },
                    Action: 'sqs:SendMessage',
                    Resource: { 'Fn::GetAtt': ['SQSOrdersProcess', 'Arn'] },
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': { Ref: 'SNSOrdersCreated' },
                        },
                    },
                },
            ],
        },
    },
};

export default SQSOrdersProcessPolicy;