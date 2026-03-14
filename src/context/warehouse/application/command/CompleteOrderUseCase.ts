import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import OrderRepository from '../../infrastructure/repository/OrderRepository';
import { CompleteOrderRequest } from '../../domain/ports/CompleteOrderRequest';

const TYPES = {
  OrderRepository: Symbol.for('OrderRepository'),
};

@Injectable()
export class CompleteOrderUseCase implements UseCase<CompleteOrderRequest, void> {
  constructor(
    @Inject(TYPES.OrderRepository) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(request: CompleteOrderRequest): Promise<void> {
    console.log(`🏁 CompleteOrderUseCase: completing ${request.assignments.length} orders`);

    for (const assignment of request.assignments) {
      const order = await this.orderRepository.get(assignment.orderId);

      if (!order) {
        console.error(`❌ Order ${assignment.orderId} not found`);
        continue;
      }

      await this.orderRepository.update({
        ...order,
        status: 'delivered',
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Order ${assignment.orderId} → delivered`);
    }
  }
}
