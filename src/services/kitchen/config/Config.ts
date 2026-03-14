/**
 * Info: Se realiza la configuración de las variables de entorno para evitar tener un .env sin embargo es lo ideal. Por temas practicos se realiza de esta manera.
 */

export default Object.freeze({
    TABLE_INGREDIENTS_DYNAMODB: '${self:service}-${self:provider.stage}-ingredients',
});