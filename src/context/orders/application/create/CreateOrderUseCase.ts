import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { Injectable } from '../../../../context/shared/infrastructure/di';

@Injectable()
export class CreateOrderUseCase implements UseCase<Request, void> {
  async execute(request: Request): Promise<void> {
    console.log('🚀 CreateOrderUseCase execute request', request);
    return Promise.resolve();
  }
}