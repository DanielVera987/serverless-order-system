import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Inject, Injectable } from '../../../../../../context/shared/infrastructure/di';
import types from '../../../../../../context/kitchen/Types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import Recipe from '../../../../../../context/kitchen/domain/entity/Recipe';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Logger from '../../../../../../context/shared/domain/logger/Logger';
import HttpErrorResponse from '../../../../../../context/shared/infrastructure/http/HttpErrorResponse';

@Injectable()
export default class ApiGatewayController implements ApiGatewayHandler {
  constructor(
    @Inject(types.GetRecipesUseCase) private readonly getRecipesUseCase: UseCase<unknown, Recipe[]>
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const response = await this.getRecipesUseCase.execute({});
      return { statusCode: 200, body: JSON.stringify({ data: response }) };
    } catch (error) {
      Logger.error(`${this.constructor.name}: Error getting recipes`, error);
      return HttpErrorResponse(error);
    }
  }
}
