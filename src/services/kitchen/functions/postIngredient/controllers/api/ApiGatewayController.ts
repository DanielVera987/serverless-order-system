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
    try {
      const body: IngredientRequest = JSON.parse(event.body || '{}');
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
}
