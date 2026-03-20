import types from '../../../../../../context/orders/Types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import Order from '../../../../../../context/orders/domain/entity/Order';
import { PaginatedResult } from '../../../../../../context/shared/domain/database/PaginatedResult';
import GetOrdersRequest from '../../../../../../context/orders/domain/ports/GetOrdersRequest';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  constructor(
    @Inject(types.GetOrdersUseCase) private readonly getOrdersUseCase: UseCase<GetOrdersRequest, PaginatedResult<Order>>
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      let { status, limit, nextToken } = event.queryStringParameters ?? {};

      if (!limit) {
        limit = '100';
      }

      const request: GetOrdersRequest = {
        status,
        limit: Number(limit),
        nextToken,
      };

      const result = await this.getOrdersUseCase.execute(request);

      if (!result.items.length && !request.nextToken) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'No orders found', data: [] }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Orders retrieved successfully',
          data: result.items,
          pagination: {
            total: result.total,
            nextToken: result.nextToken,
            limit: request.limit ?? 100,
          },
        }),
      };
    } catch (error) {
      console.error(`❌ Error in ${this.constructor.name}:`, error);

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', data: [] }),
      };
    }
  }
}
