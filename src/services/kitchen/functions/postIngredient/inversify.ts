import { Container } from 'inversify';
import types from './types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { IngredientRequest } from '../../../../context/kitchen/domain/ports/IngredientRequest';
import { CreateIngredientUseCase } from '../../../../context/kitchen/application/create/CreateIngredientUseCase';
import IngredientRepository from '../../../../context/kitchen/infrastructure/repository/IngredientRepository';
import IngredientRepositoryDomain from '../../../../context/kitchen/domain/repository/IngredientRepository';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';
import Ingredient from '../../../../context/kitchen/domain/entity/Ingredient';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<IngredientRequest, Ingredient>>(types.CreateIngredientUseCase).to(CreateIngredientUseCase);
container.bind<IngredientRepositoryDomain>(types.IngredientRepository).to(IngredientRepository);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);

export default container;