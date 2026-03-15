import { Container } from 'inversify';
import types from './types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import OrderRepository from '../../../../context/orders/infrastructure/repository/OrderRepository';
import OrderRepositoryDomain from '../../../../context/orders/domain/repository/OrderRepository';
import GetOrdersUseCase from '../../../../context/orders/application/query/GetOrdersUseCase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import Order from '../../../../context/orders/domain/entity/Order';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<UseCase<any, Order[]>>(types.GetOrdersUseCase).to(GetOrdersUseCase);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);

export default container;