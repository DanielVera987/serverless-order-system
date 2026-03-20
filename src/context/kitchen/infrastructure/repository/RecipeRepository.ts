import { Inject, Injectable } from "../../../shared/infrastructure/di";
import TypesShared from "../../../shared/SharedTypes";
import { DatabaseAdapter } from "../../../shared/domain/database/DatabaseAdapter";
import RecipeRepositoryDomain from "../../domain/repository/RecipeRepository";
import Recipe from "../../domain/entity/Recipe";

@Injectable()
export default class RecipeRepository implements RecipeRepositoryDomain {
    private readonly tableName = process.env.TABLE_RECIPES_DYNAMODB ?? 'recipes';

    constructor(
        @Inject(TypesShared.DatabaseAdapter) private readonly databaseAdapter: DatabaseAdapter
    ) {}

    async getAll(): Promise<Recipe[]> {
        console.log(`🔍 ${this.constructor.name}: Getting all recipes from ${this.tableName}`);

        try {
            return await this.databaseAdapter.findAll<Recipe>(this.tableName, { consistentRead: true });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting all recipes`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting all recipes`);
        }
    }
}
