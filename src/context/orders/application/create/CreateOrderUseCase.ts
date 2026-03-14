import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Inject, Injectable } from '../../../../context/shared/infrastructure/di';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository'
import types from '../../../../services/orders/functions/postOrders/types'
import { v4 as uuidv4 } from 'uuid';
import Order from '../../domain/entity/Order';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, any[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepositoryDomain
  ) {}

  async execute(request: Request): Promise<any[]> {
    console.log('🚀 CreateOrderUseCase execute request', request);

    try {
      const orders: Order[] = [];
      for (let i = 0; i < request.numberOrders; i++) {
        let data = {
          id: uuidv4(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        console.log('📊 CreateOrderUseCase data', data);

        await this.orderRepository.create(data);

        orders.push(data);
      }

      // TODO: send orders to sns topic

      return Promise.resolve(orders); 
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error creating orders`, error);
      throw new Error(`❌ ${this.constructor.name}: Error creating orders`);
    }
  }
}