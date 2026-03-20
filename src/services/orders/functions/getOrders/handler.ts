import 'reflect-metadata';
import middy from '@middy/core';
import types from '../../../../context/orders/Types';
import container from './inversify';
import { ControllerBase, Controllers, ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { validationMiddleware } from '../../../../context/shared/infrastructure/middlewares/validationMiddleware';
import { schema } from './controllers/api/schema';

const controllers: Controllers = {
  api: container.get<ApiGatewayHandler>(types.ApiGatewayController),
};

const controller = new ControllerBase(controllers);

export const getOrders = middy()
  .use(validationMiddleware(schema))
  .handler((event) => controller.execute(event));
