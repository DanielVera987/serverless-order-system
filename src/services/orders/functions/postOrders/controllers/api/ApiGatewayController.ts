import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { Request } from '../../../../../../context/orders/domain/ports/Request';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import types from '../../types';
import Order from '../../../../../../context/orders/domain/entity/Order';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  public constructor(
    @Inject(types.CreateOrderUseCase) private readonly createOrderUseCase: UseCase<Request, Order[]>,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body: Request = JSON.parse(event.body || '{}');

    const error = this.validateBody(body);
    if (error) {
      return { statusCode: 400, body: JSON.stringify({ error }) };
    }

    // TODO: How handler to error?
    const response = await this.createOrderUseCase.execute(body);

    return { statusCode: 200, body: JSON.stringify({ 
      status: 'success',
      message: 'Orders created successfully', 
      data: response
    }) };
  }

  private validateBody(body: Request): string | null {
    if (!body.numberOrders) {
      return 'numberOrders is required';
    }

    if (typeof body.numberOrders !== 'number') {
      return 'numberOrders must be a number';
    }

    if (body.numberOrders < 1 || body.numberOrders > 1000) {
      return 'numberOrders must be between 1 and 1000';
    }

    return null;
  }
}
