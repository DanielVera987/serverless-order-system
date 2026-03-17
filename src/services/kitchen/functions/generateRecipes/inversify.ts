import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import GenerateRecipieUseCase from '../../../../context/kitchen/application/create/GenerateRecipieUseCase';
import { SQSMessageRequest } from '../../../../context/kitchen/domain/ports/SQSRequest';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import OrderRepository from '../../../../context/kitchen/infrastructure/repository/OrderRepository';
import OrderRepositoryDomain from '../../../../context/kitchen/domain/repository/OrderRepository';
import TypesShared from '../../../../context/shared/SharedTypes';
import { NotificationPublisher } from '../../../../context/shared/domain/notification/NotificationPublisher';
import { SNSNotificationPublisher } from '../../../../context/shared/infrastructure/notification/SNSNotificationPublisher';
import RecipeRepository from '../../../../context/kitchen/infrastructure/repository/RecipeRepository';
import RecipeRepositoryDomain from '../../../../context/kitchen/domain/repository/RecipeRepository';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);
// Use Cases
container.bind<UseCase<SQSMessageRequest, unknown>>(types.GenerateRecipieUseCase).to(GenerateRecipieUseCase);
// Repositories
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<RecipeRepositoryDomain>(types.RecipeRepository).to(RecipeRepository);
// Shared
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);
// Notification
container.bind<NotificationPublisher>(TypesShared.NotificationPublisher).to(SNSNotificationPublisher);

export default container;