import Recipe from "../../../../../src/context/kitchen/domain/entity/Recipe";
import RecipeRepository from "../../../../../src/context/kitchen/domain/repository/RecipeRepository";

export default class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Recipe[];
  private forcedError: Error | null = null;

  constructor(initialRecipes: Recipe[] = []) {
    this.recipes = [...initialRecipes];
  }

  simulateFailure(error = new Error('DB connection error')): this {
    this.forcedError = error;
    return this;
  }

  async getAll(): Promise<Recipe[]> {
    if (this.forcedError) throw this.forcedError;
    return this.recipes;
  }
}