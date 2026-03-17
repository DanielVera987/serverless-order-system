import Ingredient from '../entity/Ingredient';

export default interface IngredientRepository {
  getAll(): Promise<Ingredient[]>;
  update(ingredient: Ingredient): Promise<Ingredient>;
  updateStockAtomic(id: string, quantityToDeduct: number): Promise<boolean>;
}