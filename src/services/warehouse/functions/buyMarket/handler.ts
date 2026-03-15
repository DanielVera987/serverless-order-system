import 'reflect-metadata';
import Types from './Types';
import container from './inversify';
import { ControllerBase, SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { Controllers } from '../../../../context/shared/infrastructure/controller/ControllerBase';

const controllers: Controllers = {
  sqs: container.get<SqsHandler>(Types.SQSController),
};

const controller = new ControllerBase(controllers as Controllers);
export const buyMarket = (event: unknown) => controller.execute(event);
