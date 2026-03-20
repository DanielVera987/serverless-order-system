import 'reflect-metadata';
import types from '../../../../context/warehouse/Types';
import container from './inversify';
import { ApiGatewayHandler, ControllerBase } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import middy from '@middy/core';
import { validationMiddleware } from '../../../../context/shared/infrastructure/middlewares/validationMiddleware';
import { schema } from './controllers/api/schema';

const controllers: Controllers = {
  api: container.get<ApiGatewayHandler>(types.ApiGatewayController),
};

const controller = new ControllerBase(controllers as Controllers);
export const getPurchases = middy()
  .use(validationMiddleware(schema))
  .handler((event) => controller.execute(event));
