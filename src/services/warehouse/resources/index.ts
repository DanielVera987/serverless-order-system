import SNSOrderReady from './SNSOrderReady';
import SNSIngredientsNeeded from './SNSIngredientsNeeded';
import SNSIngredientsPurchased from './SNSIngredientsPurchased';
import { SQSOrderDelivery, SQSOrderDeliveryDLQ, SQSOrderDeliveryPolicy } from './SQSOrderDelivery';
import { SQSBuyMarket, SQSBuyMarketDLQ, SQSBuyMarketPolicy } from './SQSBuyMarket';
import { SQSRestockQueue, SQSRestockQueueDLQ, SQSRestockQueuePolicy } from './SQSRestockQueue';
import { SNSDLQAlarm, OrderDeliveryDLQAlarm, BuyMarketDLQAlarm, RestockDLQAlarm } from './DLQAlarm';

export const resources = {
  Resources: {
    SNSOrderReady,
    SNSIngredientsNeeded,
    SNSIngredientsPurchased,
    SQSOrderDeliveryDLQ,
    SQSOrderDelivery,
    SQSOrderDeliveryPolicy,
    SQSBuyMarketDLQ,
    SQSBuyMarket,
    SQSBuyMarketPolicy,
    SQSRestockQueueDLQ,
    SQSRestockQueue,
    SQSRestockQueuePolicy,
    SNSDLQAlarm,
    OrderDeliveryDLQAlarm,
    BuyMarketDLQAlarm,
    RestockDLQAlarm,
  },
};
