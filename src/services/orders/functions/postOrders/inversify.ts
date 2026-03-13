import { Container } from 'inversify';
import types from './types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { Request } from '../../../../context/orders/domain/ports/Request';
import { CreateOrderUseCase } from '../../../../context/orders/application/create/CreateOrderUseCase';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<Request, void>>(types.CreateOrderUseCase).to(CreateOrderUseCase);

export default container;