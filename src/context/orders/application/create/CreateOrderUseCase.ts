import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Injectable } from '../../../../context/shared/infrastructure/di';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, any[]> {
  private orders: any[] = [];

  async execute(request: Request): Promise<any[]> {
    console.log('🚀 CreateOrderUseCase execute request', request);

    // TODO: create orders in database
    for (let i = 0; i < request.numberOrders; i++) {
      this.orders.push({
        id: i + 1,
        status: 'pending',
      });
    }

    // TODO: send orders to sns topic

    return Promise.resolve(this.orders);
  }
}