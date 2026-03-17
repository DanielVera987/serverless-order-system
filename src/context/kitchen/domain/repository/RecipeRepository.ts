import Recipe from "../entity/Recipe";

export default interface RecipeRepository {
  getAll(): Promise<Recipe[]>;
}