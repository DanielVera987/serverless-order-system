import SNSOrderReady from './SNSOrderReady';
import SNSIngredientsNeeded from './SNSIngredientsNeeded';
import SNSIngredientsPurchased from './SNSIngredientsPurchased';
import { SQSOrderDelivery, SQSOrderDeliveryPolicy } from './SQSOrderDelivery';
import { SQSBuyMarket, SQSBuyMarketPolicy } from './SQSBuyMarket';
import { SQSRestockQueue, SQSRestockQueuePolicy } from './SQSRestockQueue';

export const resources = {
  Resources: {
    SNSOrderReady,
    SNSIngredientsNeeded,
    SNSIngredientsPurchased,
    SQSOrderDelivery,
    SQSOrderDeliveryPolicy,
    SQSBuyMarket,
    SQSBuyMarketPolicy,
    SQSRestockQueue,
    SQSRestockQueuePolicy,
  },
};
