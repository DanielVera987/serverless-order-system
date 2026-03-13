import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable } from '../../../../../../context/shared/infrastructure/di';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body || '{}');

    const error = this.validateBody(body);
    if (error) {
      return { statusCode: 400, body: JSON.stringify({ error }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'handler orders postOrders', data: body }) };
  }

  private validateBody(body: { numberOrders: number }): string | null {
    if (!body.numberOrders) {
      return 'numberOrders is required';
    }

    if (typeof body.numberOrders !== 'number') {
      return 'numberOrders must be a number';
    }

    if (body.numberOrders < 1 || body.numberOrders > 100) {
      return 'numberOrders must be between 1 and 100';
    }

    return null;
  }
}
