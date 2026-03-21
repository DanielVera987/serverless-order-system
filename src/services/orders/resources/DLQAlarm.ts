import Config from '../config/Config';

export const SNSDLQAlarm = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: '${self:service}-${self:provider.stage}-dlq-alarm',
        Subscription: [
            {
                Protocol: 'email',
                Endpoint: Config.DLQ_ALARM_EMAIL ?? '',
            },
        ],
    },
};

export const OrdersProcessDLQAlarm = {
    Type: 'AWS::CloudWatch::Alarm',
    Properties: {
        AlarmName: '${self:service}-${self:provider.stage}-orders-process-dlq-alarm',
        AlarmDescription: 'Messages in orders-process DLQ',
        Namespace: 'AWS/SQS',
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Dimensions: [
            {
                Name: 'QueueName',
                Value: Config.SQS_ORDERS_PROCESS_DLQ,
            },
        ],
        Statistic: 'Sum',
        Period: 60,
        EvaluationPeriods: 1,
        Threshold: 1,
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        AlarmActions: [{ Ref: 'SNSDLQAlarm' }],
    },
};
