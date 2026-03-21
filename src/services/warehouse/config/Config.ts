/**
 * Info: Se realiza la configuración de las variables de entorno para evitar tener un .env sin embargo es lo ideal. Por temas practicos se realiza de esta manera.
 */

export default Object.freeze({
    SNS_ORDER_READY_TOPIC: '${self:service}-${self:provider.stage}-order-ready.fifo',
    SQS_ORDER_DELIVERY_QUEUE: '${self:service}-${self:provider.stage}-order-delivery.fifo',
    SNS_INGREDIENTS_NEEDED_TOPIC: '${self:service}-${self:provider.stage}-ingredients-needed.fifo',
    SQS_BUY_MARKET_QUEUE: '${self:service}-${self:provider.stage}-buy-market.fifo',
    SNS_INGREDIENTS_PURCHASED_TOPIC: '${self:service}-${self:provider.stage}-ingredients-purchased.fifo',
    SQS_RESTOCK_QUEUE: '${self:service}-${self:provider.stage}-restock.fifo',
    SNS_INVENTORY_READY_TOPIC: '${self:service}-${self:provider.stage}-inventory-ready.fifo',
    SQS_INVENTORY_READY_QUEUE: '${self:service}-${self:provider.stage}-inventory-ready.fifo',
    SNS_INVENTORY_SHORTAGE_TOPIC: '${self:service}-${self:provider.stage}-inventory-shortage.fifo',
    SQS_INVENTORY_SHORTAGE_QUEUE: '${self:service}-${self:provider.stage}-inventory-shortage.fifo',
    SQS_ORDER_DELIVERY_DLQ: '${self:service}-${self:provider.stage}-order-delivery-dlq.fifo',
    SQS_BUY_MARKET_DLQ: '${self:service}-${self:provider.stage}-buy-market-dlq.fifo',
    SQS_RESTOCK_DLQ: '${self:service}-${self:provider.stage}-restock-dlq.fifo',
    SQS_INVENTORY_READY_DLQ: '${self:service}-${self:provider.stage}-inventory-ready-dlq.fifo',
    SQS_INVENTORY_SHORTAGE_DLQ: '${self:service}-${self:provider.stage}-inventory-shortage-dlq.fifo',
    TABLE_PURCHASE_HISTORY: '${self:service}-${self:provider.stage}-purchase-history',
    DLQ_ALARM_EMAIL: process.env.DLQ_ALARM_EMAIL ?? '',
});
