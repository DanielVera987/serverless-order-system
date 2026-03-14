import Ingredient from '../entity/Ingredient';

export default interface IngredientRepository {
  getAll(): Promise<Ingredient[]>;
  update(ingredient: Ingredient): Promise<Ingredient>;
}