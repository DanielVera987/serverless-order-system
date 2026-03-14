import { Container } from 'inversify';
import types from './types';
import { SQSController } from './controllers/sqs/SQSController';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { CompleteOrderUseCase } from '../../../../context/warehouse/application/command/CompleteOrderUseCase';
import { CompleteOrderRequest } from '../../../../context/warehouse/domain/ports/CompleteOrderRequest';
import OrderRepository from '../../../../context/warehouse/infrastructure/repository/OrderRepository';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import TypesShared from '../../../../context/shared/SharedTypes';
import OrderRepositoryDomain from '../../../../context/warehouse/domain/repository/OrderRepository';

const container = new Container();

container.bind<SqsHandler>(types.SQSController).to(SQSController);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);
container.bind<OrderRepositoryDomain>(types.OrderRepository).to(OrderRepository);
container.bind<UseCase<CompleteOrderRequest, void>>(types.CompleteOrderUseCase).to(CompleteOrderUseCase);

export default container;
