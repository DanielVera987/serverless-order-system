import Config from "../config/Config";

export const SQSOrdersProcessDLQ = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_ORDERS_PROCESS_DLQ,
        FifoQueue: true,
        MessageRetentionPeriod: 432000,
    },
};


const SQSOrdersProcess = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_ORDERS_PROCESS_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 180,
        RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSOrdersProcessDLQ', 'Arn'] },
            maxReceiveCount: 6,
        },
    },
};

export default SQSOrdersProcess;