import Config from "../config/Config";

const SNSRecipeCreated = {
    Type: 'AWS::SNS::Topic',
    Properties: {
        TopicName: Config.SNS_RECIPE_CREATED_TOPIC,
        FifoTopic: true,
        ContentBasedDeduplication: true,
        Subscription: [
            {
                Protocol: 'sqs',
                Endpoint: { 'Fn::GetAtt': ['SQSRecipeProcess', 'Arn'] },
            },
        ],
    },
};

export default SNSRecipeCreated;