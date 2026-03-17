import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export function withCors(_event: APIGatewayProxyEvent, response: APIGatewayProxyResult): APIGatewayProxyResult {
  return {
    ...response,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
    },
  };
}
