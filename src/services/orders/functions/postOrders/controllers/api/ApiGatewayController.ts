import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { Request } from '../../../../../../context/orders/domain/ports/Request';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import types from '../../../../../../context/orders/Types';
import Order from '../../../../../../context/orders/domain/entity/Order';
import Logger from '../../../../../../context/shared/domain/logger/Logger';
import HttpErrorResponse from '../../../../../../context/shared/infrastructure/http/HttpErrorResponse';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  public constructor(
    @Inject(types.CreateOrderUseCase) private readonly createOrderUseCase: UseCase<Request, Order[]>,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body: Request = JSON.parse(event.body || '{}');
      const response = await this.createOrderUseCase.execute(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'Orders created successfully',
          data: response,
        }),
      };
    } catch (error) {
      Logger.error(`${this.constructor.name}: Error creating orders`, error);
      return HttpErrorResponse(error);
    }
  }
}
