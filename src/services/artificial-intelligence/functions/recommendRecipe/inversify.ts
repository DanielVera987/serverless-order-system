import { Container } from 'inversify';
import types from './types';
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

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<AI>(TypesShared.AI).to(GroqAI);
container.bind<Http>(TypesShared.Http).to(HttpAxios);
container.bind<UseCase<string, string>>(types.RecommendRecipeUseCase).to(RecommendRecipeUseCase);
container.bind<IngredientsRepositoryDomain>(types.IngredientsRepository).to(IngredientsRepository);

export default container;