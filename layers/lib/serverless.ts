module.exports = {
  service: 'restaurant-layer-lib',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    stage: '${opt:stage, "dev"}',
  },
  layers: {
    Deps: {
      path: '.',
      name: 'restaurant-${sls:stage}-deps',
      description: 'Shared npm dependencies for all restaurant Lambda functions',
      compatibleRuntimes: ['nodejs20.x'],
      retain: false,
    },
  },
  resources: {
    Resources: {
      DepsLayerArnParam: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Name: '/restaurant/layer/${sls:stage}/deps-arn',
          Type: 'String',
          Value: { Ref: 'DepsLambdaLayer' },
          Description: 'ARN of the restaurant shared dependencies Lambda Layer',
        },
      },
    },
  },
};
