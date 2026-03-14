import { Container } from 'inversify';
import types from './types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { CreateOrderUseCase } from '../../../../context/orders/application/create/CreateOrderUseCase';
import OrderRepositoryDomain from '../../../../context/orders/domain/repository/OrderRepository';
import OrderRepository from '../../../../context/orders/infrastructure/repository/OrderRepository';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';
import Order from '../../../../context/orders/domain/entity/Order';
const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<Request, Order[]>>(types.CreateOrderUseCase).to(CreateOrderUseCase);
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);

export default container;