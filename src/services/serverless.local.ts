const IS_LOCAL = process.env.IS_LOCAL === 'true';
const ACCOUNT = '000000000000';
const REGION = 'us-east-1';
const ENDPOINT = 'http://localhost:4566';

const SNS = (service: string, name: string) =>
  `arn:aws:sns:${REGION}:${ACCOUNT}:${service}-local-${name}.fifo`;
const SQS = (service: string, name: string) =>
  `${ENDPOINT}/${ACCOUNT}/${service}-local-${name}.fifo`;

export const localResourceMap: Record<string, string> = IS_LOCAL ? {
  SNSOrdersCreated:         SNS('restaurant-orders',    'orders-created'),
  SNSRecipeCreated:         SNS('restaurant-kitchen',   'recipe-created'),
  SNSIngredientsPurchased:  SNS('restaurant-warehouse', 'ingredients-purchased'),
  SNSInventoryReady:        SNS('restaurant-warehouse', 'inventory-ready'),
  SNSInventoryShortage:     SNS('restaurant-warehouse', 'inventory-shortage'),
  SNSIngredientsNeeded:     SNS('restaurant-warehouse', 'ingredients-needed'),
  SNSOrderReady:            SNS('restaurant-warehouse', 'order-ready'),
  SQSRecipeProcess:         SQS('restaurant-kitchen',   'recipe-process'),
} : {};
