import { Injectable, Inject } from '../../../shared/infrastructure/di/index';
import OrderRepository from '../../domain/repository/OrderRepository';
import { UseCase } from '../../../shared/domain/UseCase';
import { PaginatedResult } from '../../../shared/domain/database/PaginatedResult';
import Order from '../../domain/entity/Order';
import types from '../../../../services/orders/functions/postOrders/types';
import GetOrdersRequest from '../../domain/ports/GetOrdersRequest';

@Injectable()
export default class GetOrdersUseCase implements UseCase<GetOrdersRequest, PaginatedResult<Order>> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepository
  ) {}

  async execute(params: GetOrdersRequest): Promise<PaginatedResult<Order>> {
    try {
      console.log(`🚀 ${this.constructor.name} Fetching orders`);

      const [result, total] = await Promise.all([
        this.orderRepository.getAll(params),
        this.orderRepository.count(params),
      ]);

      console.log(`✅ ${this.constructor.name} Successfully fetched ${result.items.length} of ${total} orders`);

      return { ...result, total };
    } catch (error) {
      console.error('❌ Error fetching orders', error);
      throw new Error('Failed to fetch orders');
    }
  }
}