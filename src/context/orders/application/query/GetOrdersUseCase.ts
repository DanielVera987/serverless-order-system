import { Injectable, Inject } from '../../../shared/infrastructure/di/index';
import OrderRepository from '../../domain/repository/OrderRepository';
import { UseCase } from '../../../shared/domain/UseCase';
import Order from '../../domain/entity/Order';
import types from '../../../../services/orders/functions/postOrders/types';
import GetOrdersRequest from '../../domain/ports/GetOrdersRequest';

@Injectable()
export default class GetOrdersUseCase implements UseCase<GetOrdersRequest, Order[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepository
  ) {}

  async execute(params: GetOrdersRequest): Promise<Order[]> {
    try {
      console.log(`🚀 ${this.constructor.name} Fetching all orders`);
      
      const orders = await this.orderRepository.getAll(params);

      console.log(`✅ ${this.constructor.name} Successfully fetched orders:`, orders);
      
      return orders;
    } catch (error) {
      console.error('❌ Error fetching orders', error);
      throw new Error('Failed to fetch orders');
    }
  }
}