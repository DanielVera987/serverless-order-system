import { ApiGatewayHandler } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';
import { Inject, Injectable } from '../../../../../../context/shared/infrastructure/di';
import types from '../../../../../../context/artificial-intelligence/Types';
import { UseCase } from '../../../../../../context/shared/domain/UseCase';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

@Injectable()
export default class ApiGatewayController implements ApiGatewayHandler {
    constructor(
        @Inject(types.RecommendRecipeUseCase) private readonly recommendRecipeUseCase: UseCase<string, string>
    ) {}

    async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const request: string = JSON.parse(event.body || '{}');
            const response = await this.recommendRecipeUseCase.execute(request);

            return { statusCode: 200, body: JSON.stringify({ message: 'Recipe recommended successfully', data: response }) };
        } catch (error) {
            console.error(`❌ ApiGatewayController: Error recommending recipe`, error);
            return { statusCode: 500, body: JSON.stringify({ message: 'Error recommending recipe' }) };
        }
    }
}