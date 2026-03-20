import type { MiddlewareObj } from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';

type ValidationSource = 'query' | 'body' | 'path';

function extractData(event: APIGatewayProxyEvent, source: ValidationSource): unknown {
  switch (source) {
    case 'query': return event.queryStringParameters ?? {};
    case 'body':  return event.body ? JSON.parse(event.body) : {};
    case 'path':  return event.pathParameters ?? {};
  }
}

export function validationMiddleware(
  schema: z.ZodSchema,
  source: ValidationSource = 'query',
): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  return {
    before: async (request) => {
      const data = extractData(request.event, source);
      const result = schema.safeParse(data);

      if (!result.success) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Validation error',
            errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
          }),
        };
      }
    },
  };
}
