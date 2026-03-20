import { Container } from 'inversify';
import types from '../../../../context/orders/Types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { CreateOrderUseCase } from '../../../../context/orders/application/create/CreateOrderUseCase';
import OrderRepositoryDomain from '../../../../context/orders/domain/repository/OrderRepository';
import OrderRepository from '../../../../context/orders/infrastructure/repository/OrderRepository';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import { NotificationPublisher } from '../../../../context/shared/domain/notification/NotificationPublisher';
import { SNSNotificationPublisher } from '../../../../context/shared/infrastructure/notification/SNSNotificationPublisher';
import TypesShared from '../../../../context/shared/SharedTypes';
import Order from '../../../../context/orders/domain/entity/Order';
const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<Request, Order[]>>(types.CreateOrderUseCase).to(CreateOrderUseCase);
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);
container.bind<NotificationPublisher>(TypesShared.NotificationPublisher).to(SNSNotificationPublisher);

export default container;