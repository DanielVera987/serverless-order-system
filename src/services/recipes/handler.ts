import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getRecipes(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return { statusCode: 200, body: JSON.stringify({ message: 'handler recipes updated' }) };
}
