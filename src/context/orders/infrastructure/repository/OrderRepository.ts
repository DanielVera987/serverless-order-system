import OrderRepositoryDomain from '../../domain/repository/OrderRepository';
import { DynamoDBAdapter } from "../../../shared/domain/database/DynamoDBAdapter"
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Order from '../../domain/entity/Order';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class OrderRepository implements OrderRepositoryDomain {
    private readonly tableName = 'orders';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async create(order: Order): Promise<void> {
        try {
            const orderData = {
                id: uuidv4(),
                status: order.status,
                createdAt: order.createdAt,
            };

            await this.dynamoDBAdapter.update(this.tableName, orderData);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating order`);
        }
    }

    async get(id: string): Promise<Order | null> {
        try {
            const order = await this.dynamoDBAdapter.get<Order>(this.tableName, { id });
            return order ?? null;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting order`);
        }
    }

    async update(order: Order): Promise<void> {
        try {
            const orderData = {
                id: order.id,
                status: order.status,
                createdAt: order.createdAt,
            };

            await this.dynamoDBAdapter.update(this.tableName, orderData);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error updating order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error updating order`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.dynamoDBAdapter.delete(this.tableName, { id });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error deleting order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error deleting order`);
        }
    }
}

export default OrderRepository;