import { Injectable, Inject } from '../../../shared/infrastructure/di/index';
import OrderRepository from '../../domain/repository/OrderRepository';
import { UseCase } from '../../../shared/domain/UseCase';
import { PaginatedResult } from '../../../shared/domain/database/PaginatedResult';
import Order from '../../domain/entity/Order';
import types from '../../../orders/Types';
import GetOrdersRequest from '../../domain/ports/GetOrdersRequest';
import Logger from '../../../shared/domain/logger/Logger';
import { QueryError } from '../../../shared/domain/errors/DomainError';

@Injectable()
export default class GetOrdersUseCase implements UseCase<GetOrdersRequest, PaginatedResult<Order>> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepository
  ) {}

  async execute(params: GetOrdersRequest): Promise<PaginatedResult<Order>> {
    try {
      Logger.init(`GetOrdersUseCase Fetching orders`);

      const [result, total] = await Promise.all([
        this.orderRepository.getAll(params),
        this.orderRepository.count(params),
      ]);

      Logger.log(`GetOrdersUseCase Successfully fetched ${result.items.length} of ${total} orders`);

      return { ...result, total };
    } catch (error) {
      Logger.error('GetOrdersUseCase: Error fetching orders', error);
      throw new QueryError('Failed to fetch orders', error);
    }
  }
}