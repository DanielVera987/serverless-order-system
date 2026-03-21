import 'reflect-metadata';
import types from '../../../../context/kitchen/Types';
import container from './inversify';
import { ApiGatewayHandler, ControllerBase } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { GetRecipesSchema } from './controllers/api/schema';
import middy from '@middy/core';
import { validationMiddleware } from '../../../../context/shared/infrastructure/middlewares/validationMiddleware';

const controllers: Controllers = {
  api: container.get<ApiGatewayHandler>(types.ApiGatewayController),
};

const controller = new ControllerBase(controllers as Controllers);
export const getRecipes = middy()
  .use(validationMiddleware(GetRecipesSchema))
  .handler((event) => controller.execute(event));
