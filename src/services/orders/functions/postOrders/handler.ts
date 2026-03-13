import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function postOrders(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return { statusCode: 200, body: JSON.stringify({ data: JSON.parse(event.body || '{}') }) };
}
