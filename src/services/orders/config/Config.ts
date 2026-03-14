/**
 * Info: Se realiza la configuración de las variables de entorno para evitar tener un .env sin embargo es lo ideal. Por temas practicos se realiza de esta manera.
 */

export default Object.freeze({
    LAMBDA_ORDERS_CREATED: '${self:service}-${self:provider.stage}-orders-created',
    LAMBDA_ORDERS_GET: '${self:service}-${self:provider.stage}-orders-get',
    TABLE_ORDERS_DYNAMODB: '${self:service}-${self:provider.stage}-orders',
    SNS_ORDERS_CREATED_TOPIC: '${self:service}-${self:provider.stage}-orders-created',
});