import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';

export class ApiGatewayController implements ApiHandler {
  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return { statusCode: 200, body: JSON.stringify({ message: 'handler orders getOrders' }) };
  }
}
