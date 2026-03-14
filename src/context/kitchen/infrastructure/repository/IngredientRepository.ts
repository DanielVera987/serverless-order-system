import { DynamoDBAdapter } from '../../../shared/domain/database/DynamoDBAdapter';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Ingredient from '../../domain/entity/Ingredient';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';

@Injectable()
export default class IngredientRepository implements IngredientRepositoryDomain {
    private readonly tableName = process.env.INGREDIENTS_TABLE ?? 'ingredients';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async create(ingredient: Ingredient): Promise<Ingredient> {
        try {
            const item = {
                id: ingredient.id!,
                name: ingredient.name,
                quantity: ingredient.quantity,
                createdAt: ingredient.createdAt!,
            };

            return await this.dynamoDBAdapter.update(this.tableName, item);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating ingredient`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating ingredient`);
        }
    }

    async createBulk(ingredients: Ingredient[]): Promise<Ingredient[]> {
        try {
            const items = ingredients.map(ingredient => ({
                id: ingredient.id!,
                name: ingredient.name,
                quantity: ingredient.quantity,
                createdAt: ingredient.createdAt!,
            }));

            return await this.dynamoDBAdapter.createBulk(this.tableName, items);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating ingredients in bulk`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating ingredients in bulk`);
        }
    }

    async get(id: string): Promise<Ingredient | null> {
        try {
            const item = await this.dynamoDBAdapter.get(this.tableName, { id });
            return item as Ingredient;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting ingredient`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting ingredient`);
        }
    }

    async update(ingredient: Ingredient): Promise<Ingredient> {
        try {
            const item = {
                id: ingredient.id!,
                name: ingredient.name,
                quantity: ingredient.quantity,
                createdAt: ingredient.createdAt!,
                updatedAt: ingredient.updatedAt!,
            };

            return await this.dynamoDBAdapter.update(this.tableName, item);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error updating ingredient`, error);
            throw new Error(`❌ ${this.constructor.name}: Error updating ingredient`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.dynamoDBAdapter.delete(this.tableName, { id });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error deleting ingredient`, error);
            throw new Error(`❌ ${this.constructor.name}: Error deleting ingredient`);
        }
    }
}
