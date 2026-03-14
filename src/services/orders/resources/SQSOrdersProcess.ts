import Config from "../config/Config";

const SQSOrdersProcess = {
    Type: 'AWS::SQS::Queue',
    Properties: {
        QueueName: Config.SQS_ORDERS_PROCESS_QUEUE,
        FifoQueue: true,
        VisibilityTimeout: 30,
    }
};

export default SQSOrdersProcess;