import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getOrders(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return { statusCode: 200, body: JSON.stringify({ message: 'handler orders updated' }) };
}
