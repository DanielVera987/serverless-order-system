/**
 * Info: Se realiza la configuración de las variables de entorno para evitar tener un .env sin embargo es lo ideal. Por temas practicos se realiza de esta manera.
 */

export default Object.freeze({
    SNS_ORDER_READY_TOPIC: '${self:service}-${self:provider.stage}-order-ready.fifo',
    SQS_ORDER_DELIVERY_QUEUE: '${self:service}-${self:provider.stage}-order-delivery.fifo',
});
