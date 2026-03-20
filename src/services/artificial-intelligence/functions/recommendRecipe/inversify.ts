import { Container } from 'inversify';
import types from '../../../../context/artificial-intelligence/Types';
import ApiGatewayController from '../recommendRecipe/controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import IngredientsRepository from '../../../../context/artificial-intelligence/infrastructure/repository/IngredientsRepository';
import IngredientsRepositoryDomain from '../../../../context/artificial-intelligence/domain/repository/IngredientsRepository';
import AI from '../../../../context/shared/domain/artificial-intelligence/ai';
import GroqAI from '../../../../context/shared/infrastructure/artificial-intelligence/GroqAI';
import TypesShared from '../../../../context/shared/SharedTypes';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import RecommendRecipeUseCase from '../../../../context/artificial-intelligence/application/query/RecommendRecipeUseCase';
import Http from '../../../../context/shared/domain/http/Http';
import HttpAxios from '../../../../context/shared/infrastructure/http/HttpAxios';
import RecipeRepository from '../../../../context/artificial-intelligence/infrastructure/repository/RecipeRepository';
import RecipeRepositoryDomain from '../../../../context/artificial-intelligence/domain/repository/RecipeRepository';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';


const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<AI>(TypesShared.AI).to(GroqAI);
container.bind<Http>(TypesShared.Http).to(HttpAxios);
container.bind<UseCase<string, string>>(types.RecommendRecipeUseCase).to(RecommendRecipeUseCase);
container.bind<IngredientsRepositoryDomain>(types.IngredientsRepository).to(IngredientsRepository);
container.bind<RecipeRepositoryDomain>(types.RecipeRepository).to(RecipeRepository);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);

export default container;