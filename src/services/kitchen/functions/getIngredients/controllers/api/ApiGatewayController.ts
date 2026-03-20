import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Inject, Injectable } from '../../../../../../context/shared/infrastructure/di';
import types from '../../../../../../context/kitchen/Types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import Ingredient from '../../../../../../context/kitchen/domain/entity/Ingredient';
import Logger from '../../../../../../context/shared/domain/logger/Logger';
import HttpErrorResponse from '../../../../../../context/shared/infrastructure/http/httpErrorResponse';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  public constructor(
    @Inject(types.GetIngredientsUseCase) private readonly getIngredientsUseCase: UseCase<unknown, Ingredient[]>,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const response = await this.getIngredientsUseCase.execute(event);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'Ingredients fetched successfully',
          data: response,
        }),
      };
    } catch (error) {
      Logger.error(`${this.constructor.name}: Error getting ingredients`, error);
      return HttpErrorResponse(error);
    }
  }
}
