import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable } from '../../../../../../context/shared/infrastructure/di';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return { statusCode: 200, body: JSON.stringify({ message: 'handler orders getOrders' }) };
  }
}
