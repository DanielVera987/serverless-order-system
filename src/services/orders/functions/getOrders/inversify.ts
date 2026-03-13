import { Container } from 'inversify';
import types from './types';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';
import { ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);

export default container;