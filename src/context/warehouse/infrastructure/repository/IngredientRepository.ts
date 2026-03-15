import { DynamoDBAdapter } from '../../../shared/domain/database/DynamoDBAdapter';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import Ingredient from '../../domain/entity/Ingredient';

@Injectable()
export default class IngredientRepository implements IngredientRepositoryDomain {
    private readonly tableName = process.env.INGREDIENTS_TABLE ?? 'ingredients';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async getAll(): Promise<Ingredient[]> {
        try {
            return await this.dynamoDBAdapter.scan<Ingredient>(this.tableName, true);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting all ingredients`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting all ingredients`);
        }
    }

    async update(ingredient: Ingredient): Promise<Ingredient> {
        try {
            const item = {
                id: ingredient.id,
                name: ingredient.name,
                quantity: ingredient.quantity,
                createdAt: ingredient.createdAt,
                updatedAt: ingredient.updatedAt,
            };

            return await this.dynamoDBAdapter.update(this.tableName, item);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error updating ingredient`, error);
            throw new Error(`❌ ${this.constructor.name}: Error updating ingredient`);
        }
    }
}
