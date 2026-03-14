import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);

export default container;