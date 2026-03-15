import Config from '../config/Config';

export const SNSDLQAlarm = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: '${self:service}-${self:provider.stage}-dlq-alarm',
        Subscription: [
            {
                Protocol: 'email',
                Endpoint: 'danielveraangulo703@gmail.com',
            },
        ],
    },
};

export const OrderDeliveryDLQAlarm = {
    Type: 'AWS::CloudWatch::Alarm',
    Properties: {
        AlarmName: '${self:service}-${self:provider.stage}-order-delivery-dlq-alarm',
        AlarmDescription: 'Messages in order-delivery DLQ',
        Namespace: 'AWS/SQS',
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Dimensions: [
            {
                Name: 'QueueName',
                Value: Config.SQS_ORDER_DELIVERY_DLQ,
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

export const BuyMarketDLQAlarm = {
    Type: 'AWS::CloudWatch::Alarm',
    Properties: {
        AlarmName: '${self:service}-${self:provider.stage}-buy-market-dlq-alarm',
        AlarmDescription: 'Messages in buy-market DLQ',
        Namespace: 'AWS/SQS',
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Dimensions: [
            {
                Name: 'QueueName',
                Value: Config.SQS_BUY_MARKET_DLQ,
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

export const RestockDLQAlarm = {
    Type: 'AWS::CloudWatch::Alarm',
    Properties: {
        AlarmName: '${self:service}-${self:provider.stage}-restock-dlq-alarm',
        AlarmDescription: 'Messages in restock DLQ',
        Namespace: 'AWS/SQS',
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Dimensions: [
            {
                Name: 'QueueName',
                Value: Config.SQS_RESTOCK_DLQ,
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
