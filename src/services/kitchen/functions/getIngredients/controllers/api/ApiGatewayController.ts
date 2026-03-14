import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Inject, Injectable } from '../../../../../../context/shared/infrastructure/di';
import types from '../../Types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import Ingredient from '../../../../../../context/kitchen/domain/entity/Ingredient';

@Injectable()
export class ApiGatewayController implements ApiGatewayHandler {
  public constructor(
    @Inject(types.GetIngredientsUseCase) private readonly getIngredientsUseCase: UseCase<unknown, Ingredient[]>,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const response = await this.getIngredientsUseCase.execute(event);

      return { statusCode: 200, body: JSON.stringify({ 
        status: 'success',
        message: 'Ingredients fetched successfully', 
        data: response
      }) };
    } catch (error) {
      console.error(`❌ ApiGatewayController: Error getting ingredients`, error);
      return { statusCode: 500, body: JSON.stringify({ 
        status: 'error',
        message: 'Error getting ingredients',
      }) };
    }
  }
}