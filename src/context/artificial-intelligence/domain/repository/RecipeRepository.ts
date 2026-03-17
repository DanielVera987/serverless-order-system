import Recipe from "../../../kitchen/domain/entity/Recipe";

export default interface RecipeRepository {
    createBulk(recipes: Recipe[]): Promise<Recipe[]>;
    update(recipe: Recipe): Promise<Recipe>;
}