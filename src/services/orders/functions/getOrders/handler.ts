import { ControllerBase } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { ApiGatewayController } from './controllers/api/ApiGatewayController';

// Register controllers by event type
const controllers = {
  api: new ApiGatewayController(),
};

const controller = new ControllerBase(controllers);
export const getOrders = (event: unknown) => controller.execute(event);
