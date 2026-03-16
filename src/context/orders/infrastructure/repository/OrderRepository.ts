import OrderRepositoryDomain from '../../domain/repository/OrderRepository';
import { DynamoDBAdapter } from "../../../shared/domain/database/DynamoDBAdapter"
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Order from '../../domain/entity/Order';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class OrderRepository implements OrderRepositoryDomain {
    private readonly tableName = process.env.ORDERS_TABLE ?? 'orders';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async create(order: Order): Promise<Order> {
        try {
            const orderData = {
                id: uuidv4(),
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
            };

            return await this.dynamoDBAdapter.update(this.tableName, orderData);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating order`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating order`);
        }
    }

    async createBulk(orders: Order[]): Promise<Order[]> {
        try {
            const items = orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
            }));

            return await this.dynamoDBAdapter.createBulk(this.tableName, items);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating orders in bulk`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating orders in bulk`);
        }
    }

   async getAll(filters?: Record<string, any>): Promise<Order[]> {
        try {
            const counterFilter = 'id <> :counterKey';
            const counterValue = { ':counterKey': 'ORDER_COUNTER' };

            if (filters?.status) {
                const statuses = String(filters.status)
                    .split(',')
                    .map((s: string) => s.trim().toLowerCase());

                const expressionAttributeValues: Record<string, string> = {};
                const placeholders: string[] = [];

                statuses.forEach((status, index) => {
                    const key = `:status${index}`;
                    expressionAttributeValues[key] = status;
                    placeholders.push(key);
                });

                return await this.dynamoDBAdapter.scan<Order>(this.tableName, {
                    filterExpression: `#status IN (${placeholders.join(', ')}) AND ${counterFilter}`,
                    expressionAttributeNames: {
                        '#status': 'status',
                    },
                    expressionAttributeValues: { ...expressionAttributeValues, ...counterValue },
                });
            }

            return await this.dynamoDBAdapter.scan<Order>(this.tableName, {
                filterExpression: counterFilter,
                expressionAttributeValues: counterValue,
            });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error fetching all orders`, error);
            throw new Error(`❌ ${this.constructor.name}: Error fetching all orders`);
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

    async update(order: Order): Promise<Order> {
        try {
            const orderData = {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
            };

            return await this.dynamoDBAdapter.update(this.tableName, orderData);
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

    async getNextOrderNumber(count: number): Promise<number> {
        try {
            const lastNumber = await this.dynamoDBAdapter.atomicIncrement(
                this.tableName,
                { id: 'ORDER_COUNTER' },
                'counter',
                count,
            );
            return lastNumber;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting next order number`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting next order number`);
        }
    }
}

export default OrderRepository;