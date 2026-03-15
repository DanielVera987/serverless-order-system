import types from '../../types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import Order from '../../../../../../context/orders/domain/entity/Order';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  constructor(
    @Inject(types.GetOrdersUseCase) private readonly getOrdersUseCase: UseCase<any, Order[]>
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const orders = await this.getOrdersUseCase.execute({});

      if (!orders) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'No orders found', data: {} }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Orders retrieved successfully',
          data: orders,
        }),
      };
    } catch (error) {
      console.error(`❌ Error in ${this.constructor.name}:`, error);

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', data: {} }),
      };
    }
  }
}
