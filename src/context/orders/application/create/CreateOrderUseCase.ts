import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Inject, Injectable } from '../../../../context/shared/infrastructure/di';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository'
import types from '../../../../services/orders/functions/postOrders/types'
import { v4 as uuidv4 } from 'uuid';
import Order from '../../domain/entity/Order';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, Order[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepositoryDomain
  ) {}

  async execute(request: Request): Promise<Order[]> {
    console.log('🚀 CreateOrderUseCase execute request', request);

    try {
      let ordersData: Order[] = [];
      for (let i = 0; i < request.numberOrders; i++) {
        ordersData.push({
          id: uuidv4(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }

      await this.orderRepository.createBulk(ordersData);

      console.log('📊 CreateOrderUseCase orders', ordersData);

      // TODO: send orders to sns topic

      return ordersData; 
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error creating orders`, error);
      throw new Error(`❌ ${this.constructor.name}: Error creating orders`);
    }
  }
}