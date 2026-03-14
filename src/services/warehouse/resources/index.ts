import SNSOrderReady from './SNSOrderReady';
import { SQSOrderDelivery, SQSOrderDeliveryPolicy } from './SQSOrderDelivery';

export const resources = {
  Resources: {
    SNSOrderReady,
    SQSOrderDelivery,
    SQSOrderDeliveryPolicy,
  },
};
