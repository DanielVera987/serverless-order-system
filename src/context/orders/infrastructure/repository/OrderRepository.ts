import OrderRepositoryDomain from '../../domain/repository/OrderRepository';
import { DynamoDBAdapter } from "../../../shared/domain/database/DynamoDBAdapter"
import { PaginatedResult } from '../../../shared/domain/database/PaginatedResult';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Order from '../../domain/entity/Order';
import GetOrdersRequest from '../../domain/ports/GetOrdersRequest';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class OrderRepository implements OrderRepositoryDomain {
    private readonly tableName = process.env.ORDERS_TABLE ?? 'orders';
    private static readonly GSI_NAME = 'orderNumber-index';
    private static readonly ENTITY_TYPE = 'ORDER';
    private static readonly DEFAULT_LIMIT = 100;
    private static readonly MAX_LIMIT = 500;

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async create(order: Order): Promise<Order> {
        try {
            const orderData = {
                id: uuidv4(),
                entityType: OrderRepository.ENTITY_TYPE,
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
        console.log(`🔍 ${this.constructor.name}: Creating orders in bulk from ${this.tableName}`);

        try {
            const items = orders.map(order => ({
                id: order.id,
                entityType: OrderRepository.ENTITY_TYPE,
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
            }));

            const createdOrders = await this.dynamoDBAdapter.createBulk(this.tableName, items);

            console.log(`✅ ${this.constructor.name}: Created ${createdOrders.length} orders in bulk`);

            return createdOrders;
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating orders in bulk`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating orders in bulk`);
        }
    }

    async getAll(params?: GetOrdersRequest): Promise<PaginatedResult<Order>> {
        try {
            const limit = Math.min(params?.limit ?? OrderRepository.DEFAULT_LIMIT, OrderRepository.MAX_LIMIT);
            const filter = this.buildFilterExpression(params);

            return await this.dynamoDBAdapter.queryPage<Order>(this.tableName, {
                indexName: OrderRepository.GSI_NAME,
                limit,
                nextToken: params?.nextToken ?? undefined,
                keyConditionExpression: 'entityType = :entityType',
                scanIndexForward: false,
                ...filter,
            });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error fetching all orders`, error);
            throw new Error(`❌ ${this.constructor.name}: Error fetching all orders`);
        }
    }

    async count(params?: GetOrdersRequest): Promise<number> {
        try {
            const filter = this.buildFilterExpression(params);

            return await this.dynamoDBAdapter.count(this.tableName, {
                indexName: OrderRepository.GSI_NAME,
                keyConditionExpression: 'entityType = :entityType',
                ...filter,
            });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error counting orders`, error);
            throw new Error(`❌ ${this.constructor.name}: Error counting orders`);
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
                entityType: OrderRepository.ENTITY_TYPE,
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

    private buildFilterExpression(params?: GetOrdersRequest): {
        expressionAttributeValues: Record<string, unknown>;
        expressionAttributeNames?: Record<string, string>;
        filterExpression?: string;
    } {
        const expressionAttributeValues: Record<string, unknown> = {
            ':entityType': OrderRepository.ENTITY_TYPE,
        };

        if (!params?.status) {
            return { expressionAttributeValues };
        }

        const statuses = String(params.status)
            .split(',')
            .map((s: string) => s.trim().toLowerCase());

        const placeholders: string[] = [];
        statuses.forEach((status, index) => {
            const key = `:status${index}`;
            expressionAttributeValues[key] = status;
            placeholders.push(key);
        });

        return {
            expressionAttributeValues,
            expressionAttributeNames: { '#status': 'status' },
            filterExpression: `#status IN (${placeholders.join(', ')})`,
        };
    }
}

export default OrderRepository;