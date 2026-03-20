import 'reflect-metadata';
import types from '../../../../context/kitchen/Types';
import container from './inversify';
import { ControllerBase } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers, ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';

// Register controllers by event type
const controllers: Controllers = {
  api: container.get<ApiGatewayHandler>(types.ApiGatewayController),
};

const controller = new ControllerBase(controllers as Controllers);
export const postIngredient = (event: unknown) => controller.execute(event);
