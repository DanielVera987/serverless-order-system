import OrderRepositoryDomain from '../../domain/repository/OrderRepository';
import { DatabaseAdapter } from '../../../shared/domain/database/DatabaseAdapter';
import { PaginatedResult } from '../../../shared/domain/database/PaginatedResult';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import TypesShared from '../../../shared/SharedTypes';
import Order from '../../domain/entity/Order';
import GetOrdersRequest from '../../domain/ports/GetOrdersRequest';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
class OrderRepository implements OrderRepositoryDomain {
    private readonly tableName = process.env.ORDERS_TABLE ?? 'orders';
    private static readonly GSI_NAME = 'orderNumber-index';
    private static readonly ENTITY_TYPE = 'ORDER';
    private static readonly DEFAULT_LIMIT = 100;
    private static readonly MAX_LIMIT = 500;

    constructor(
        @Inject(TypesShared.DatabaseAdapter) private readonly databaseAdapter: DatabaseAdapter
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

            return await this.databaseAdapter.save(this.tableName, orderData);
        } catch (error) {
            Logger.error(`OrderRepository: Error creating order: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error creating order`);
        }
    }

    async createBulk(orders: Order[]): Promise<Order[]> {
        Logger.trace(`OrderRepository: Creating orders in bulk from ${this.tableName}`);

        try {
            const items = orders.map(order => ({
                id: order.id,
                entityType: OrderRepository.ENTITY_TYPE,
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
            }));

            const createdOrders = await this.databaseAdapter.insertBatch(this.tableName, items);

            Logger.log(`✅ ${this.constructor.name}: Created ${createdOrders.length} orders in bulk`);

            return createdOrders;
        } catch (error) {
            Logger.error(`OrderRepository: Error creating orders in bulk: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error creating orders in bulk`);
        }
    }

    async getAll(params?: GetOrdersRequest): Promise<PaginatedResult<Order>> {
        try {
            const limit = Math.min(params?.limit ?? OrderRepository.DEFAULT_LIMIT, OrderRepository.MAX_LIMIT);
            const statuses = this.parseStatuses(params?.status);

            return await this.databaseAdapter.findPage<Order>(this.tableName, {
                index: {
                    name: OrderRepository.GSI_NAME,
                    partitionKey: 'entityType',
                    partitionValue: OrderRepository.ENTITY_TYPE,
                    sortAscending: false,
                },
                where: statuses.length > 0
                    ? [{ field: 'status', operator: 'in', value: statuses }]
                    : [],
                limit,
                cursor: params?.nextToken ?? null,
            });
        } catch (error) {
            Logger.error(`OrderRepository: Error fetching all orders: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error fetching all orders`);
        }
    }

    async count(params?: GetOrdersRequest): Promise<number> {
        try {
            const statuses = this.parseStatuses(params?.status);

            return await this.databaseAdapter.count(this.tableName, {
                index: {
                    name: OrderRepository.GSI_NAME,
                    partitionKey: 'entityType',
                    partitionValue: OrderRepository.ENTITY_TYPE,
                },
                where: statuses.length > 0
                    ? [{ field: 'status', operator: 'in', value: statuses }]
                    : [],
            });
        } catch (error) {
            Logger.error(`OrderRepository: Error counting orders: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error counting orders`);
        }
    }

    async get(id: string): Promise<Order | null> {
        try {
            return await this.databaseAdapter.findById<Order>(this.tableName, { id });
        } catch (error) {
            Logger.error(`OrderRepository: Error getting order: ${error}`);
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

            return await this.databaseAdapter.save(this.tableName, orderData);
        } catch (error) {
            Logger.error(`OrderRepository: Error updating order: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error updating order`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.databaseAdapter.remove(this.tableName, { id });
        } catch (error) {
            Logger.error(`OrderRepository: Error deleting order: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error deleting order`);
        }
    }

    async getNextOrderNumber(count: number): Promise<number> {
        try {
            return await this.databaseAdapter.atomicIncrement(
                this.tableName,
                { id: 'ORDER_COUNTER' },
                'counter',
                count,
            );
        } catch (error) {
            Logger.error(`OrderRepository: Error getting next order number: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error getting next order number`);
        }
    }

    private parseStatuses(status?: string): string[] {
        if (!status) return [];
        return String(status).split(',').map(s => s.trim().toLowerCase());
    }
}

export default OrderRepository;
