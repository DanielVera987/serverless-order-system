import { Container } from 'inversify';
import types from './types';
import GetRecipesUseCase from '../../../../context/kitchen/application/query/GetRecipesUseCase';
import RecipeRepository from '../../../../context/kitchen/infrastructure/repository/RecipeRepository';
import RecipeRepositoryDomain from '../../../../context/kitchen/domain/repository/RecipeRepository';
import Recipe from '../../../../context/kitchen/domain/entity/Recipe';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import ApiGatewayController from './controllers/api/ApiGatewayController';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';

const container = new Container();

container.bind<UseCase<unknown, Recipe[]>>(types.GetRecipesUseCase).to(GetRecipesUseCase);
container.bind<RecipeRepositoryDomain>(types.RecipeRepository).to(RecipeRepository);
container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);

export default container;