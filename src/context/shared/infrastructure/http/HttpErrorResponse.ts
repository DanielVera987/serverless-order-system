import type { APIGatewayProxyResult } from 'aws-lambda';
import DomainError from '../../domain/errors/DomainError';

export default function HttpErrorResponse(error: unknown): APIGatewayProxyResult {
  if (error instanceof DomainError) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Internal server error' }),
  };
}
