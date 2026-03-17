import buyMarket from './functions/buyMarket/index';
import checkInventory from './functions/checkInventory/index';
import completeOrder from './functions/completeOrder/index';
import getPurchases from './functions/getPurchases/index';
import deductStock from './functions/deductStock/index';
import requestIngredients from './functions/requestIngredients/index';

export const functions = {
  checkInventory,
  deductStock,
  requestIngredients,
  completeOrder,
  buyMarket,
  getPurchases,
};
