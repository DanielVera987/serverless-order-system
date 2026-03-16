import { DynamoDBAdapter } from '../../../shared/domain/database/DynamoDBAdapter';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Order from '../../domain/entity/Order';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository';

@Injectable()
export default class OrderRepository implements OrderRepositoryDomain {
    private readonly tableName = process.env.ORDERS_TABLE ?? 'orders';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async update(order: Order): Promise<Order> {
        try {
            const orderData = {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                recipeId: order.recipeId,
                recipeName: order.recipeName,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            };

            return await this.dynamoDBAdapter.update(this.tableName, orderData);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error updating order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error updating order`);
        }
    }
}
