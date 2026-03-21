import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Injectable, Inject } from '../../../../../../context/shared/infrastructure/di';
import { IngredientRequest } from '../../../../../../context/kitchen/domain/ports/IngredientRequest';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import types from '../../../../../../context/kitchen/Types';
import Ingredient from '../../../../../../context/kitchen/domain/entity/Ingredient';
import Logger from '../../../../../../context/shared/domain/logger/Logger';
import HttpErrorResponse from '../../../../../../context/shared/infrastructure/http/HttpErrorResponse';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  public constructor(
    @Inject(types.CreateIngredientUseCase) private readonly createIngredientUseCase: UseCase<IngredientRequest, Ingredient>,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body: IngredientRequest = JSON.parse(event.body || '{}');

    const validationError = this.validateBody(body);
    if (validationError) {
      return { statusCode: 400, body: JSON.stringify({ error: validationError }) };
    }

    try {
      const response = await this.createIngredientUseCase.execute(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'Ingredient created successfully',
          data: response,
        }),
      };
    } catch (error) {
      Logger.error(`${this.constructor.name}: Error creating ingredient`, error);
      return HttpErrorResponse(error);
    }
  }

  private validateBody(body: IngredientRequest): string | null {
    if (!body.name) return 'name is required';
    if (typeof body.name !== 'string') return 'name must be a string';
    if (typeof body.quantity !== 'number') return 'quantity must be a number';
    if (body.quantity < 0) return 'quantity must be greater than 0';
    return null;
  }
}
