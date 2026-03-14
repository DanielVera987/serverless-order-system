import Recipe from "../entity/Recipe";

export default interface RecipeRepository {
  create(recipe: Recipe): Promise<Recipe>;
  createBulk(recipes: Recipe[]): Promise<Recipe[]>;
  get(id: string): Promise<Recipe | null>;
  update(recipe: Recipe): Promise<Recipe>;
  delete(id: string): Promise<void>;
}