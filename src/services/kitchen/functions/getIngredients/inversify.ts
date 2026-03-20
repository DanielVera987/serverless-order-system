import 'reflect-metadata';
import { Container } from 'inversify';
import types from '../../../../context/kitchen/Types';
import GetIngredientsUseCase from '../../../../context/kitchen/application/query/GetIngredientUseCase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import IngredientRepository from '../../../../context/kitchen/infrastructure/repository/IngredientRepository';
import IngredientRepositoryDomain from '../../../../context/kitchen/domain/repository/IngredientRepository';
import TypesShared from '../../../../context/shared/SharedTypes';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import Ingredient from '../../../../context/kitchen/domain/entity/Ingredient';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<unknown, Ingredient[]>>(types.GetIngredientsUseCase).to(GetIngredientsUseCase);
container.bind<IngredientRepositoryDomain>(types.IngredientRepository).to(IngredientRepository);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);

export default container;