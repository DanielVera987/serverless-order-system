import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import GenerateRecipieUseCase from '../../../../context/kitchen/application/query/GenerateRecipieUseCase';
import { SQSMessageRequest } from '../../../../context/kitchen/domain/ports/SQSRequest';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);
container.bind<UseCase<SQSMessageRequest, unknown>>(types.GenerateRecipieUseCase).to(GenerateRecipieUseCase);

export default container;