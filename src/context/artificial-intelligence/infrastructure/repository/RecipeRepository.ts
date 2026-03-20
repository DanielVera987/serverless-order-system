import { Inject, Injectable } from "../../../shared/infrastructure/di";
import TypesShared from "../../../shared/SharedTypes";
import { DatabaseAdapter } from "../../../shared/domain/database/DatabaseAdapter";
import RecipeRepositoryDomain from "../../domain/repository/RecipeRepository";
import Recipe from "../../../kitchen/domain/entity/Recipe";

@Injectable()
export default class RecipeRepository implements RecipeRepositoryDomain {
    private readonly tableName = process.env.TABLE_RECIPES_DYNAMODB ?? 'recipes';

    constructor(
        @Inject(TypesShared.DatabaseAdapter) private readonly databaseAdapter: DatabaseAdapter
    ) {}

    async createBulk(recipes: Recipe[]): Promise<Recipe[]> {
        try {
            const items = recipes.map(recipe => ({
                id: recipe.id,
                name: recipe.name,
                ingredients: recipe.ingredients,
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt,
            }));

            return await this.databaseAdapter.insertBatch(this.tableName, items);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating bulk recipes`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating bulk recipes`);
        }
    }

    async update(recipe: Recipe): Promise<Recipe> {
        try {
            return await this.databaseAdapter.save(this.tableName, {
                id: recipe.id,
                name: recipe.name,
                ingredients: recipe.ingredients,
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt,
            }) as unknown as Recipe;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error updating recipe`, error);
            throw new Error(`❌ ${this.constructor.name}: Error updating recipe`);
        }
    }
}
