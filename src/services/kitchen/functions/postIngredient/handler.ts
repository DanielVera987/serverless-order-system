import 'reflect-metadata';
import types from '../../../../context/kitchen/Types';
import container from './inversify';
import { ControllerBase } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers, ApiGatewayHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { PostIngredientSchema } from './controllers/api/schema';
import middy from '@middy/core';
import { validationMiddleware } from '../../../../context/shared/infrastructure/middlewares/validationMiddleware';

const controllers: Controllers = {
  api: container.get<ApiGatewayHandler>(types.ApiGatewayController),
};

const controller = new ControllerBase(controllers as Controllers);
export const postIngredient = middy()
  .use(validationMiddleware(PostIngredientSchema, 'body'))
  .handler((event) => controller.execute(event));
