import { Container } from 'inversify';
import types from '../../../../context/orders/Types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import OrderRepository from '../../../../context/orders/infrastructure/repository/OrderRepository';
import OrderRepositoryDomain from '../../../../context/orders/domain/repository/OrderRepository';
import GetOrdersUseCase from '../../../../context/orders/application/query/GetOrdersUseCase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import Order from '../../../../context/orders/domain/entity/Order';
import { DatabaseAdapter } from '../../../../context/shared/domain/database/DatabaseAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import GetOrdersRequest from '../../../../context/orders/domain/ports/GetOrdersRequest';
import { PaginatedResult } from '../../../../context/shared/domain/database/PaginatedResult';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<UseCase<GetOrdersRequest, PaginatedResult<Order>>>(types.GetOrdersUseCase).to(GetOrdersUseCase);
container.bind<DatabaseAdapter>(TypesShared.DatabaseAdapter).to(DynamoDBAdapter);

export default container;