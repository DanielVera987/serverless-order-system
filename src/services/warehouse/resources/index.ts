import SNSOrderReady from './SNSOrderReady';
import SNSIngredientsNeeded from './SNSIngredientsNeeded';
import SNSIngredientsPurchased from './SNSIngredientsPurchased';
import SNSInventoryReady from './SNSInventoryReady';
import SNSInventoryShortage from './SNSInventoryShortage';
import { SQSOrderDelivery, SQSOrderDeliveryDLQ, SQSOrderDeliveryPolicy } from './SQSOrderDelivery';
import { SQSBuyMarket, SQSBuyMarketDLQ, SQSBuyMarketPolicy } from './SQSBuyMarket';
import { SQSRestockQueue, SQSRestockQueueDLQ, SQSRestockQueuePolicy } from './SQSRestockQueue';
import { SQSInventoryReady, SQSInventoryReadyDLQ, SQSInventoryReadyPolicy } from './SQSInventoryReady';
import { SQSInventoryShortage, SQSInventoryShortageDLQ, SQSInventoryShortagePolicy } from './SQSInventoryShortage';
import { SNSDLQAlarm, OrderDeliveryDLQAlarm, BuyMarketDLQAlarm, RestockDLQAlarm, InventoryReadyDLQAlarm, InventoryShortageDLQAlarm } from './DLQAlarm';
import TablePurchaseHistory from './TablePurchaseHistory';

export const resources = {
  Resources: {
    TablePurchaseHistory,
    SNSOrderReady,
    SNSIngredientsNeeded,
    SNSIngredientsPurchased,
    SNSInventoryReady,
    SNSInventoryShortage,
    SQSOrderDeliveryDLQ,
    SQSOrderDelivery,
    SQSOrderDeliveryPolicy,
    SQSBuyMarketDLQ,
    SQSBuyMarket,
    SQSBuyMarketPolicy,
    SQSRestockQueueDLQ,
    SQSRestockQueue,
    SQSRestockQueuePolicy,
    SQSInventoryReadyDLQ,
    SQSInventoryReady,
    SQSInventoryReadyPolicy,
    SQSInventoryShortageDLQ,
    SQSInventoryShortage,
    SQSInventoryShortagePolicy,
    SNSDLQAlarm,
    OrderDeliveryDLQAlarm,
    BuyMarketDLQAlarm,
    RestockDLQAlarm,
    InventoryReadyDLQAlarm,
    InventoryShortageDLQAlarm,
  },
};
