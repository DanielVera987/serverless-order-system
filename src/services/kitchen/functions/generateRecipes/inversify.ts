import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import GenerateRecipieUseCase from '../../../../context/kitchen/application/query/GenerateRecipieUseCase';
import { SQSMessageRequest } from '../../../../context/kitchen/domain/ports/SQSRequest';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import OrderRepository from '../../../../context/kitchen/infrastructure/repository/OrderRepository';
import TypesShared from '../../../../context/shared/SharedTypes';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);
container.bind<OrderRepository>(types.OrderRepository).to(OrderRepository);
container.bind<UseCase<SQSMessageRequest, unknown>>(types.GenerateRecipieUseCase).to(GenerateRecipieUseCase);

export default container;