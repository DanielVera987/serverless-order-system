import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Inject, Injectable } from '../../../../context/shared/infrastructure/di';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository'
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import types from '../../../orders/Types'
import TypesShared from '../../../shared/SharedTypes';
import { v4 as uuidv4 } from 'uuid';
import Order from '../../domain/entity/Order';
import Env from '../../../../services/orders/config/Environment';
import { OrderStatus } from '../../../shared/domain/enums/OrderEnums';
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, Order[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepositoryDomain,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: Request): Promise<Order[]> {
    Logger.init(`CreateOrderUseCase execute request: ${request}`);

    try {
      const lastNumber = await this.orderRepository.getNextOrderNumber(request.numberOrders);
      const startNumber = lastNumber - request.numberOrders + 1;
  
      const ordersData = this.createOrdersData(request.numberOrders, startNumber);
  
      await this.orderRepository.createBulk(ordersData);
      Logger.log(`CreateOrderUseCase orders: ${ordersData}`);
  
      const chunks = this.chunkOrdersForSNS(ordersData);
  
      await this.publishChunks(chunks);
  
      return this.sortOrdersDesc(ordersData);
  
    } catch (error) {
      Logger.error(`CreateOrderUseCase: Error creating orders: ${error}`);
      throw new Error(`❌ ${this.constructor.name}: Error creating orders`);
    }
  }

  private createOrdersData(count: number, startNumber: number): Order[] {
    const orders: Order[] = [];
  
    for (let i = 0; i < count; i++) {
      orders.push({
        id: uuidv4(),
        orderNumber: startNumber + i,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
      });
    }
  
    return orders;
  }

  private chunkOrdersForSNS(orders: Order[]): Order[][] {
    const SNS_MAX_BYTES = 256 * 1024;
    const SAFETY_MARGIN = 5 * 1024;
    const MAX_CHUNK_BYTES = SNS_MAX_BYTES - SAFETY_MARGIN;
  
    const chunks: Order[][] = [];
    let currentChunk: Order[] = [];
    let currentSize = 0;
  
    for (const order of orders) {
      const orderString = JSON.stringify(order);
      const orderBytes = Buffer.byteLength(orderString, 'utf8');
  
      if (currentSize + orderBytes > MAX_CHUNK_BYTES) {
        chunks.push(currentChunk);
        currentChunk = [order];
        currentSize = orderBytes;
      } else {
        currentChunk.push(order);
        currentSize += orderBytes;
      }
    }
  
    if (currentChunk.length) {
      chunks.push(currentChunk);
    }
  
    Logger.log(`CreateOrderUseCase Total SNS chunks: ${chunks.length}`);
  
    return chunks;
  }

  private async publishChunks(chunks: Order[][]): Promise<void> {
    const batchId = Date.now();
  
    await Promise.all(
      chunks.map((chunk, index) =>
        this.notificationPublisher.publish(
          Env.SNS_ORDERS_CREATED_ARN,
          `orders-created-group-${batchId}-${index}`,
          chunk
        )
      )
    );
  
    Logger.notify(`CreateOrderUseCase SNS: Published ${chunks.length} chunks`);
  }

  private sortOrdersDesc(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => b.orderNumber - a.orderNumber);
  }
}