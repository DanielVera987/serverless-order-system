import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Inject, Injectable } from '../../../../context/shared/infrastructure/di';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository'
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import types from '../../../../services/orders/functions/postOrders/types'
import TypesShared from '../../../shared/SharedTypes';
import { v4 as uuidv4 } from 'uuid';
import Order from '../../domain/entity/Order';
import Env from '../../../../services/orders/config/Environment';
import { OrderStatus } from '../../../shared/domain/enums/OrderEnums';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, Order[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepositoryDomain,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: Request): Promise<Order[]> {
    console.log('🚀 CreateOrderUseCase execute request', request);

    try {
      const lastNumber = await this.orderRepository.getNextOrderNumber(request.numberOrders);
      const startNumber = lastNumber - request.numberOrders + 1;

      let ordersData: Order[] = [];
      for (let i = 0; i < request.numberOrders; i++) {
        ordersData.push({
          id: uuidv4(),
          orderNumber: startNumber + i,
          status: OrderStatus.PENDING,
          createdAt: new Date().toISOString(),
        });
      }

      await this.orderRepository.createBulk(ordersData);

      console.log('📊 CreateOrderUseCase orders', ordersData);

      await this.notificationPublisher.publish(
        Env.SNS_ORDERS_CREATED_ARN, 
        'orders-created-group-' + Date.now(),
        ordersData
      );

      console.log('📢 SNS: Orders published to topic', Env.SNS_ORDERS_CREATED_ARN);

      const sortedOrders = [...ordersData].sort((a: Order, b: Order) => b.orderNumber - a.orderNumber);

      return sortedOrders; 
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error creating orders`, error);
      throw new Error(`❌ ${this.constructor.name}: Error creating orders`);
    }
  }
}