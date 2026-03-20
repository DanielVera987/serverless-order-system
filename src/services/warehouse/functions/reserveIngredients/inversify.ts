import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { ReserveIngredientsUseCase } from '../../../../context/warehouse/application/command/ReserveIngredientsUseCase';
import { InventoryReadyRequest } from '../../../../context/warehouse/domain/ports/InventoryCheckRequest';
import IngredientRepository from '../../../../context/warehouse/infrastructure/repository/IngredientRepository';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import { NotificationPublisher } from '../../../../context/shared/domain/notification/NotificationPublisher';
import { SNSNotificationPublisher } from '../../../../context/shared/infrastructure/notification/SNSNotificationPublisher';
import IngredientRepositoryDomain from '../../../../context/warehouse/domain/repository/IngredientRepository';
import TypesShared from '../../../../context/shared/SharedTypes';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);
container.bind<NotificationPublisher>(TypesShared.NotificationPublisher).to(SNSNotificationPublisher);
container.bind<IngredientRepositoryDomain>(types.IngredientRepository).to(IngredientRepository);
container.bind<UseCase<InventoryReadyRequest, void>>(types.ReserveIngredientsUseCase).to(ReserveIngredientsUseCase);

export default container;
