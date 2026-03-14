import 'reflect-metadata';
import types from './types';
import container from './inversify';
import { ControllerBase, SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers } from '../../../../context/shared/infrastructure/controller/ControllerBase';

// Register controllers by event type
const controllers: Controllers = {
  sqs: container.get<SqsHandler>(types.SQSController),
};

const controller = new ControllerBase(controllers as Controllers);
export const generateRecipes = (event: unknown) => controller.execute(event);
