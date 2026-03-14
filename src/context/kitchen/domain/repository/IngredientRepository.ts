import Ingredient from "../entity/Ingredient";

export default interface IngredientRepository {
  create(ingredient: Ingredient): Promise<Ingredient>;
  createBulk(ingredients: Ingredient[]): Promise<Ingredient[]>;
  get(id: string): Promise<Ingredient | null>;
  getAll(): Promise<Ingredient[]>;
  update(ingredient: Ingredient): Promise<Ingredient>;
  delete(id: string): Promise<void>;
}